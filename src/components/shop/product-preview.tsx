import type { ProductPreview } from "@/lib/shop/preview";

export function ProductPreviewPanel({
  id,
  preview,
}: {
  id: string;
  preview: ProductPreview;
}) {
  const extra =
    preview.hiddenFiles === 1
      ? "1 other file is not shown."
      : `${preview.hiddenFiles} other files are not shown.`;

  return (
    <section className="mt-16 border-t border-line pt-12">
      <h2 className="text-xl font-semibold tracking-[-0.03em]">Preview</h2>
      <p className="mt-3 max-w-xl text-sm leading-7 text-muted">
        {preview.label}. {preview.hiddenFiles > 0 ? extra : "This is the sample on the page."}
      </p>
      <div className="relative mt-6 max-w-3xl overflow-hidden border border-line bg-white">
        {preview.kind === "image" ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={`/shop/previews/${id}`}
            alt=""
            className="max-h-[28rem] w-full object-contain object-left"
          />
        ) : null}
        {preview.kind === "text" ? (
          <pre className="overflow-x-auto whitespace-pre-wrap px-5 py-5 font-sans text-sm leading-7 text-ink">
            {preview.text}
          </pre>
        ) : null}
        {preview.kind === "table" && preview.columns && preview.rows ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line text-muted">
                <tr>
                  {preview.columns.map((column) => (
                    <th key={column} className="px-4 py-3 font-medium">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.rows.map((row, index) => (
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
        ) : null}
        {preview.clipped ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
        ) : null}
      </div>
      {preview.clipped || preview.hiddenFiles > 0 ? (
        <p className="mt-4 text-sm text-muted">
          The rest of the pack stays in the download.
          {preview.hiddenRows ? ` ${preview.hiddenRows} more rows are not listed.` : ""}
        </p>
      ) : null}
    </section>
  );
}
