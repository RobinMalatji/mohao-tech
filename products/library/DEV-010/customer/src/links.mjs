export function markdownLinks(text) {
  const links = [];
  const pattern = /\[([^\]]+)\]\(([^)\s]+)\)/g;
  let match = pattern.exec(text);
  while (match) {
    links.push({ label: match[1], url: match[2] });
    match = pattern.exec(text);
  }
  return links;
}
