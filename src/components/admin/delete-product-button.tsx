"use client";

import { deleteCatalogueProduct } from "@/actions/catalogue";

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  return (
    <form action={deleteCatalogueProduct}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="text-sm text-muted underline-offset-4 hover:text-ink hover:underline"
        onClick={(event) => {
          if (!window.confirm(`Delete ${name} from the shop?`)) {
            event.preventDefault();
          }
        }}
      >
        Delete
      </button>
    </form>
  );
}
