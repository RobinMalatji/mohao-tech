import { redirect } from "next/navigation";

export default async function ShopIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const pageNumber = Number(page ?? "1");
  if (Number.isInteger(pageNumber) && pageNumber > 1) {
    redirect(`/?page=${pageNumber}`);
  }
  redirect("/");
}
