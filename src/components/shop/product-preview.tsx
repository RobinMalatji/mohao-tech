import type { PreviewBlock, ProductPreview } from "@/lib/shop/preview";

function Blocks({ blocks }: { blocks: PreviewBlock[] }) {
  return (
    <div className="space-y-3 text-sm leading-7">
      {blocks.map((block, index) => {
        if (block.type === "h") {
          return (
            <h4 key={index} className="font-medium tracking-[-0.02em]">
              {block.text}
            </h4>
          );
        }
        if (block.type === "ul") {
          return (
            <ul key={index} className="list-disc space-y-1 pl-5">
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        }
        if (block.type === "quote") {
          return (
            <p key={index} className="border-l-2 border-ember pl-3 text-muted">
              {block.text}
            </p>
          );
        }
        return <p key={index}>{block.text}</p>;
      })}
    </div>
  );
}

export function ProductPreviewPanel({ preview }: { preview: ProductPreview }) {
  return (
    <section className="mt-16 border-t border-line pt-12">
      <h2 className="text-xl font-semibold tracking-[-0.03em]">Look inside</h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">{preview.intro}</p>

      {preview.gallery.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {preview.gallery.map((image) => (
            <figure key={image.src} className="border border-line bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.src} alt={image.title} className="aspect-square w-full object-contain" />
              <figcaption className="border-t border-line px-4 py-3 text-sm">{image.title}</figcaption>
            </figure>
          ))}
        </div>
      ) : null}

      {preview.sheets.length > 0 ? (
        <div className="mt-8 space-y-8">
          {preview.sheets.map((sheet) => (
            <div key={sheet.name}>
              <h3 className="text-sm font-medium tracking-[-0.02em]">{sheet.name}</h3>
              <div className="mt-3 overflow-x-auto border border-line bg-white">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-line bg-surface text-muted">
                    <tr>
                      {sheet.columns.map((column) => (
                        <th key={column} className="px-4 py-3 font-medium">
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sheet.rows.map((row, index) => (
                      <tr key={index} className="border-b border-line last:border-0">
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="px-4 py-3">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {sheet.moreRows > 0 ? (
                <p className="mt-2 text-sm text-muted">{sheet.moreRows} more rows are in the file.</p>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      {preview.sections.length > 0 ? (
        <div className="mt-8 divide-y divide-line border-y border-line">
          {preview.sections.map((section) => (
            <article key={section.title} className="py-5">
              <h3 className="text-base font-medium tracking-[-0.02em]">{section.title}</h3>
              {section.detail ? <p className="mt-2 text-sm text-muted">{section.detail}</p> : null}
              {section.blocks ? (
                <div className="mt-4 max-w-3xl">
                  <Blocks blocks={section.blocks} />
                </div>
              ) : null}
            </article>
          ))}
        </div>
      ) : null}

      <p className="mt-6 text-sm text-muted">{preview.locked}</p>
    </section>
  );
}
