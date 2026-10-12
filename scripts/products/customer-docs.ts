import type { ProductMeta } from "./types";
import { renderMarkdown, textFile } from "./render";
import type { Doc } from "./types";

const licenceCopy = {
  personal: [
    "One named person may use and edit these files for personal planning, study, or their own job.",
    "You may not resell the files, post them for public download, or include them in a product, course, or template pack that you sell.",
    "Sample figures, names, and businesses in the files are fictional. Replace them with your own information.",
  ],
  "commercial-single": [
    "One business may use and edit these files internally, including while delivering that business's own service to its clients.",
    "You may not resell the source files or republish them as a template library, course, or downloadable product.",
    "Sample figures, names, and businesses in the files are fictional. Replace them before you share a filled-in copy outside your team.",
  ],
  "developer-project": [
    "You may use and modify this source in one personal or commercial product.",
    "You may not sell or give away the source as a competing starter kit, boilerplate, or template.",
    "Keep the MOHAO licence notice with the source if you redistribute a built product that still contains these files.",
  ],
} as const;

export function licenceDocument(meta: ProductMeta): Doc {
  return {
    title: `${meta.name} licence`,
    kicker: `Version ${meta.version} · ${meta.licence}`,
    blocks: [
      { kind: "p", text: "This is a practical usage licence from MOHAO for the files in this package. It is not a substitute for legal advice." },
      { kind: "h", text: "What you may do" },
      { kind: "ul", items: [...licenceCopy[meta.licence]] },
      { kind: "h", text: "What stays with MOHAO" },
      { kind: "p", text: "MOHAO keeps ownership of the original files. Buying a licence does not transfer copyright. Trademarks, including MOHAO, stay with their owners." },
      { kind: "h", text: "Support and liability" },
      { kind: "p", text: "The files are provided as a working product you can edit. MOHAO is not liable for decisions you make from sample numbers, formulas, prompts, or draft wording. Check figures, formulas, and wording before you rely on them." },
      ...(meta.disclaimer ? [{ kind: "note" as const, text: meta.disclaimer }] : []),
    ],
  };
}

export function usageDocument(meta: ProductMeta): Doc {
  return {
    title: `How to use ${meta.name}`,
    kicker: meta.productType,
    blocks: [
      { kind: "p", text: meta.description },
      { kind: "h", text: "Who it is for" },
      { kind: "p", text: meta.audience },
      { kind: "h", text: "Compatibility" },
      { kind: "ul", items: meta.compatibility },
      { kind: "h", text: "Before you start" },
      { kind: "ol", items: [
        "Read the README and this usage guide.",
        "Open the main deliverable and replace every sample figure or sample sentence with your own.",
        "Keep a copy of the original download before you edit it.",
        "Check the licence before you share the edited file with anyone else.",
      ] },
      { kind: "h", text: "What you should see" },
      { kind: "ul", items: meta.benefits },
    ],
  };
}

export function readmeDocument(meta: ProductMeta, fileList: string[]): Doc {
  return {
    title: meta.name,
    kicker: `${meta.id} · version ${meta.version}`,
    blocks: [
      { kind: "p", text: meta.summary },
      { kind: "p", text: meta.description },
      { kind: "h", text: "Files in this package" },
      { kind: "ul", items: fileList },
      { kind: "h", text: "Product details" },
      { kind: "table", headers: ["Field", "Value"], rows: [
        ["Product code", meta.id],
        ["Version", meta.version],
        ["Category", meta.categoryLabel],
        ["Type", meta.productType],
        ["Licence", meta.licence],
      ] },
      ...(meta.disclaimer ? [{ kind: "note" as const, text: meta.disclaimer }] : []),
    ],
  };
}

export function docBuffer(doc: Doc) {
  return textFile(renderMarkdown(doc));
}

export { licenceCopy };
