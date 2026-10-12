export type CellInput = string | number | boolean | null;
export type WorkbookInput = Record<string, CellInput[][]>;

export class FormulaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FormulaError";
  }
}

type Address = { sheet: string; col: number; row: number };

type Token =
  | { kind: "num"; value: number }
  | { kind: "str"; value: string }
  | { kind: "name"; value: string }
  | { kind: "ref"; address: Address; explicitSheet: boolean }
  | { kind: "op"; value: string }
  | { kind: "colon" }
  | { kind: "comma" }
  | { kind: "lparen" }
  | { kind: "rparen" };

type Expr =
  | { type: "num"; value: number }
  | { type: "str"; value: string }
  | { type: "bool"; value: boolean }
  | { type: "neg"; value: Expr }
  | { type: "concat"; left: Expr; right: Expr }
  | { type: "binary"; op: string; left: Expr; right: Expr }
  | { type: "compare"; op: string; left: Expr; right: Expr }
  | { type: "call"; name: string; args: Expr[] }
  | { type: "ref"; address: Address }
  | { type: "range"; start: Address; end: Address };

const FUNCTIONS = new Set(["SUM", "SUMIF", "COUNTIF", "ROUND", "IF", "MAX", "MIN", "ABS", "PMT", "FV", "NPER", "AND", "OR"]);

function columnIndex(label: string) {
  let index = 0;
  for (const char of label.toUpperCase()) index = index * 26 + (char.charCodeAt(0) - 64);
  return index - 1;
}

function columnLabel(index: number) {
  let value = index + 1;
  let label = "";
  while (value > 0) {
    const remainder = (value - 1) % 26;
    label = String.fromCharCode(65 + remainder) + label;
    value = Math.floor((value - 1) / 26);
  }
  return label;
}

function excelRound(value: number, digits: number) {
  const factor = 10 ** digits;
  const shifted = value * factor;
  const sign = shifted < 0 ? -1 : 1;
  return (sign * Math.round(Math.abs(shifted))) / factor;
}

function pmt(rate: number, periods: number, present: number, future = 0, type = 0) {
  if (periods === 0) throw new FormulaError("PMT periods cannot be zero.");
  if (rate === 0) return -(present + future) / periods;
  const growth = (1 + rate) ** periods;
  let payment = (rate * (present * growth + future)) / (growth - 1);
  if (type === 1) payment /= 1 + rate;
  return -payment;
}

function fv(rate: number, periods: number, payment: number, present = 0, type = 0) {
  if (rate === 0) return -(present + payment * periods);
  const growth = (1 + rate) ** periods;
  return -(present * growth + payment * (1 + rate * type) * ((growth - 1) / rate));
}

function nper(rate: number, payment: number, present: number, future = 0, type = 0) {
  if (rate === 0) {
    if (payment === 0) throw new FormulaError("NPER payment cannot be zero.");
    return -(present + future) / payment;
  }
  const adjusted = payment * (1 + rate * type);
  const numerator = adjusted - future * rate;
  const denominator = present * rate + adjusted;
  if (numerator === 0 || denominator === 0 || numerator / denominator <= 0) {
    throw new FormulaError("NPER could not be calculated from these inputs.");
  }
  return Math.log(numerator / denominator) / Math.log(1 + rate);
}

function tokenize(formula: string, sheet: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;
  const source = formula;

  while (index < source.length) {
    const char = source[index];
    if (char === " " || char === "\n" || char === "\t") {
      index += 1;
      continue;
    }
    if (char === "(") {
      tokens.push({ kind: "lparen" });
      index += 1;
      continue;
    }
    if (char === ")") {
      tokens.push({ kind: "rparen" });
      index += 1;
      continue;
    }
    if (char === ",") {
      tokens.push({ kind: "comma" });
      index += 1;
      continue;
    }
    if (char === ":") {
      tokens.push({ kind: "colon" });
      index += 1;
      continue;
    }
    if (char === '"') {
      let value = "";
      index += 1;
      while (index < source.length && source[index] !== '"') {
        value += source[index];
        index += 1;
      }
      if (source[index] !== '"') throw new FormulaError("Unclosed string.");
      index += 1;
      tokens.push({ kind: "str", value });
      continue;
    }
    const operator = source.slice(index).match(/^(<>|>=|<=|=|>|<|\+|-|\*|\/|&)/);
    if (operator) {
      tokens.push({ kind: "op", value: operator[0] });
      index += operator[0].length;
      continue;
    }
    const percent = source.slice(index).match(/^\d+(\.\d+)?%/);
    if (percent) {
      tokens.push({ kind: "num", value: Number(percent[0].slice(0, -1)) / 100 });
      index += percent[0].length;
      continue;
    }
    const number = source.slice(index).match(/^\d+(\.\d+)?/);
    if (number) {
      tokens.push({ kind: "num", value: Number(number[0]) });
      index += number[0].length;
      continue;
    }
    const reference = source.slice(index).match(/^(?:([A-Za-z_][A-Za-z0-9_]*)!)?(\$?[A-Z]{1,3})(\$?\d+)/);
    if (reference && !/^[A-Za-z]/.test(source.slice(index + reference[0].length)) ) {
      tokens.push({
        kind: "ref",
        explicitSheet: Boolean(reference[1]),
        address: {
          sheet: reference[1] ?? sheet,
          col: columnIndex(reference[2].replace("$", "")),
          row: Number(reference[3].replace("$", "")) - 1,
        },
      });
      index += reference[0].length;
      continue;
    }
    const name = source.slice(index).match(/^[A-Za-z_][A-Za-z0-9_]*/);
    if (name) {
      tokens.push({ kind: "name", value: name[0].toUpperCase() });
      index += name[0].length;
      continue;
    }
    throw new FormulaError(`Unexpected character "${char}".`);
  }

  return tokens;
}

class Parser {
  private position = 0;

  constructor(private readonly tokens: Token[]) {}

  parse(): Expr {
    const value = this.comparison();
    if (this.position !== this.tokens.length) throw new FormulaError("Unexpected tokens after formula.");
    return value;
  }

  private peek() {
    return this.tokens[this.position];
  }

  private eat() {
    return this.tokens[this.position++];
  }

  private comparison(): Expr {
    let left = this.concat();
    const token = this.peek();
    if (token?.kind === "op" && ["=", "<>", ">", "<", ">=", "<="].includes(token.value)) {
      this.eat();
      left = { type: "compare", op: token.value, left, right: this.concat() };
    }
    return left;
  }

  private concat(): Expr {
    let left = this.additive();
    while (this.peek()?.kind === "op" && (this.peek() as { value: string }).value === "&") {
      this.eat();
      left = { type: "concat", left, right: this.additive() };
    }
    return left;
  }

  private additive(): Expr {
    let left = this.multiplicative();
    while (this.peek()?.kind === "op" && ["+", "-"].includes((this.peek() as { value: string }).value)) {
      const op = (this.eat() as { value: string }).value;
      left = { type: "binary", op, left, right: this.multiplicative() };
    }
    return left;
  }

  private multiplicative(): Expr {
    let left = this.unary();
    while (this.peek()?.kind === "op" && ["*", "/"].includes((this.peek() as { value: string }).value)) {
      const op = (this.eat() as { value: string }).value;
      left = { type: "binary", op, left, right: this.unary() };
    }
    return left;
  }

  private unary(): Expr {
    if (this.peek()?.kind === "op" && (this.peek() as { value: string }).value === "-") {
      this.eat();
      return { type: "neg", value: this.unary() };
    }
    return this.primary();
  }

  private primary(): Expr {
    const token = this.eat();
    if (!token) throw new FormulaError("Formula ended early.");
    if (token.kind === "num") return { type: "num", value: token.value };
    if (token.kind === "str") return { type: "str", value: token.value };
    if (token.kind === "ref") return this.maybeRange(token.address, token.explicitSheet);
    if (token.kind === "lparen") {
      const value = this.comparison();
      if (this.eat()?.kind !== "rparen") throw new FormulaError("Missing closing parenthesis.");
      return value;
    }
    if (token.kind === "name") {
      if (token.value === "TRUE") return { type: "bool", value: true };
      if (token.value === "FALSE") return { type: "bool", value: false };
      if (this.peek()?.kind !== "lparen") throw new FormulaError(`Unknown name ${token.value}.`);
      if (!FUNCTIONS.has(token.value)) throw new FormulaError(`Unsupported function ${token.value}.`);
      this.eat();
      const args: Expr[] = [];
      if (this.peek()?.kind !== "rparen") {
        args.push(this.argument());
        while (this.peek()?.kind === "comma") {
          this.eat();
          args.push(this.argument());
        }
      }
      if (this.eat()?.kind !== "rparen") throw new FormulaError(`Missing closing parenthesis in ${token.value}.`);
      return { type: "call", name: token.value, args };
    }
    throw new FormulaError("Invalid formula expression.");
  }

  private argument(): Expr {
    if (this.peek()?.kind === "ref") {
      const saved = this.position;
      const ref = this.eat() as { kind: "ref"; address: Address; explicitSheet: boolean };
      if (this.peek()?.kind === "colon") return this.maybeRange(ref.address, ref.explicitSheet);
      this.position = saved;
    }
    return this.comparison();
  }

  private maybeRange(start: Address, explicitSheet: boolean): Expr {
    if (this.peek()?.kind === "colon") {
      this.eat();
      const end = this.eat();
      if (end?.kind !== "ref") throw new FormulaError("Range is missing an end cell.");
      const endAddress = end.explicitSheet ? end.address : { ...end.address, sheet: start.sheet };
      return { type: "range", start, end: endAddress };
    }
    void explicitSheet;
    return { type: "ref", address: start };
  }
}

function compare(left: string | number | boolean | null, right: string | number | boolean | null, op: string) {
  if (typeof left === "number" && typeof right === "number") {
    if (op === "=") return left === right;
    if (op === "<>") return left !== right;
    if (op === ">") return left > right;
    if (op === "<") return left < right;
    if (op === ">=") return left >= right;
    return left <= right;
  }
  const a = String(left ?? "");
  const b = String(right ?? "");
  if (op === "=") return a === b;
  if (op === "<>") return a !== b;
  if (op === ">") return a > b;
  if (op === "<") return a < b;
  if (op === ">=") return a >= b;
  return a <= b;
}

function matchesCriteria(value: string | number | boolean | null, criteria: string | number | boolean | null) {
  if (typeof criteria === "string") {
    const comparison = criteria.match(/^(<>|>=|<=|=|>|<)(.*)$/);
    if (comparison) {
      const expected = Number(comparison[2]);
      if (typeof value !== "number" || !Number.isFinite(expected)) return false;
      return compare(value, expected, comparison[1]);
    }
  }
  return value === criteria;
}

class Engine {
  private readonly cache = new Map<string, string | number | boolean | null>();
  private readonly stack = new Set<string>();

  constructor(private readonly sheets: WorkbookInput) {}

  valueAt(address: Address): string | number | boolean | null {
    const key = `${address.sheet}!${columnLabel(address.col)}${address.row + 1}`;
    if (this.cache.has(key)) return this.cache.get(key) ?? null;
    if (this.stack.has(key)) throw new FormulaError(`Circular reference at ${key}.`);
    const raw = this.sheets[address.sheet]?.[address.row]?.[address.col] ?? null;
    if (this.sheets[address.sheet] === undefined) throw new FormulaError(`Missing sheet ${address.sheet}.`);
    if (typeof raw === "string" && raw.startsWith("=")) {
      this.stack.add(key);
      const expression = new Parser(tokenize(raw.slice(1), address.sheet)).parse();
      const value = this.eval(expression);
      this.stack.delete(key);
      this.cache.set(key, value);
      return value;
    }
    this.cache.set(key, raw);
    return raw;
  }

  private number(value: string | number | boolean | null, label: string) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "boolean") return value ? 1 : 0;
    if (value === null || value === "") return 0;
    throw new FormulaError(`${label} expected a number.`);
  }

  private eval(expression: Expr): string | number | boolean | null {
    switch (expression.type) {
      case "num":
      case "str":
      case "bool":
        return expression.value;
      case "neg":
        return -this.number(this.eval(expression.value), "Negation");
      case "concat":
        return `${this.eval(expression.left) ?? ""}${this.eval(expression.right) ?? ""}`;
      case "binary": {
        const left = this.number(this.eval(expression.left), "Left side");
        const right = this.number(this.eval(expression.right), "Right side");
        if (expression.op === "+") return left + right;
        if (expression.op === "-") return left - right;
        if (expression.op === "*") return left * right;
        if (right === 0) throw new FormulaError("Division by zero.");
        return left / right;
      }
      case "compare":
        return compare(this.eval(expression.left), this.eval(expression.right), expression.op);
      case "ref":
        return this.valueAt(expression.address);
      case "range":
        throw new FormulaError("A range cannot be used as a single value.");
      case "call":
        return this.call(expression);
    }
  }

  private cells(range: Extract<Expr, { type: "range" }>) {
    if (range.start.sheet !== range.end.sheet) throw new FormulaError("Cross-sheet ranges are not supported.");
    const cells: Address[] = [];
    for (let row = Math.min(range.start.row, range.end.row); row <= Math.max(range.start.row, range.end.row); row += 1) {
      for (let col = Math.min(range.start.col, range.end.col); col <= Math.max(range.start.col, range.end.col); col += 1) {
        cells.push({ sheet: range.start.sheet, col, row });
      }
    }
    return cells;
  }

  private numericList(expression: Extract<Expr, { type: "call" }>) {
    const numbers: number[] = [];
    for (const item of expression.args) {
      if (item.type === "range") {
        for (const cell of this.cells(item)) {
          const value = this.valueAt(cell);
          if (typeof value === "number") numbers.push(value);
        }
      } else {
        numbers.push(this.number(this.eval(item), expression.name));
      }
    }
    return numbers;
  }

  private sumOf(expression: Expr) {
    if (expression.type === "range") {
      return this.cells(expression).reduce((total, cell) => {
        const value = this.valueAt(cell);
        return typeof value === "number" ? total + value : total;
      }, 0);
    }
    const value = this.eval(expression);
    return typeof value === "number" ? value : 0;
  }

  private call(expression: Extract<Expr, { type: "call" }>): string | number | boolean | null {
    const arg = (index: number) => expression.args[index];
    if (expression.name === "SUM") return expression.args.reduce((total, item) => total + this.sumOf(item), 0);
    if (expression.name === "ROUND") {
      return excelRound(this.number(this.eval(arg(0)), "ROUND"), arg(1) ? this.number(this.eval(arg(1)), "ROUND digits") : 0);
    }
    if (expression.name === "ABS") return Math.abs(this.number(this.eval(arg(0)), "ABS"));
    if (expression.name === "MAX" || expression.name === "MIN") {
      const numbers = this.numericList(expression);
      if (!numbers.length) throw new FormulaError(`${expression.name} has no numbers.`);
      return expression.name === "MAX" ? Math.max(...numbers) : Math.min(...numbers);
    }
    if (expression.name === "IF") {
      const condition = this.eval(arg(0));
      const truthy = typeof condition === "boolean" ? condition : this.number(condition, "IF") !== 0;
      return this.eval(arg(truthy ? 1 : 2));
    }
    if (expression.name === "AND" || expression.name === "OR") {
      const values = expression.args.map((item) => Boolean(this.eval(item)));
      return expression.name === "AND" ? values.every(Boolean) : values.some(Boolean);
    }
    if (expression.name === "PMT") {
      return pmt(
        this.number(this.eval(arg(0)), "PMT rate"),
        this.number(this.eval(arg(1)), "PMT periods"),
        this.number(this.eval(arg(2)), "PMT present"),
        arg(3) ? this.number(this.eval(arg(3)), "PMT future") : 0,
        arg(4) ? this.number(this.eval(arg(4)), "PMT type") : 0,
      );
    }
    if (expression.name === "FV") {
      return fv(
        this.number(this.eval(arg(0)), "FV rate"),
        this.number(this.eval(arg(1)), "FV periods"),
        this.number(this.eval(arg(2)), "FV payment"),
        arg(3) ? this.number(this.eval(arg(3)), "FV present") : 0,
      );
    }
    if (expression.name === "NPER") {
      return nper(
        this.number(this.eval(arg(0)), "NPER rate"),
        this.number(this.eval(arg(1)), "NPER payment"),
        this.number(this.eval(arg(2)), "NPER present"),
        arg(3) ? this.number(this.eval(arg(3)), "NPER future") : 0,
      );
    }
    if (expression.name === "COUNTIF") {
      const range = arg(0);
      const criteria = this.eval(arg(1));
      if (range.type !== "range") throw new FormulaError("COUNTIF range is invalid.");
      return this.cells(range).filter((cell) => matchesCriteria(this.valueAt(cell), criteria)).length;
    }
    if (expression.name === "SUMIF") {
      const range = arg(0);
      const criteria = this.eval(arg(1));
      const sums = arg(2) ?? range;
      if (range.type !== "range" || sums.type !== "range") throw new FormulaError("SUMIF ranges are invalid.");
      const keys = this.cells(range);
      const values = this.cells(sums);
      if (keys.length !== values.length) throw new FormulaError("SUMIF ranges differ in size.");
      return keys.reduce((total, cell, index) => {
        if (!matchesCriteria(this.valueAt(cell), criteria)) return total;
        const amount = this.valueAt(values[index]);
        return typeof amount === "number" ? total + amount : total;
      }, 0);
    }
    throw new FormulaError(`Unsupported function ${expression.name}.`);
  }
}

export function evaluateCell(sheets: WorkbookInput, sheet: string, cell: string) {
  const match = cell.match(/^([A-Z]{1,3})(\d+)$/i);
  if (!match) throw new FormulaError(`Invalid cell ${cell}.`);
  return new Engine(sheets).valueAt({
    sheet,
    col: columnIndex(match[1]),
    row: Number(match[2]) - 1,
  });
}
