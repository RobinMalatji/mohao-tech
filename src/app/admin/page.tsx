import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { EnquiryFilters } from "@/components/admin/enquiry-filters";
import { getSession } from "@/lib/auth";
import { listEnquiries } from "@/lib/admin/enquiries";
import { getServiceLabel } from "@/lib/content/services";
import { formatDateTime } from "@/lib/format";
import { enquiryStatusLabels, type EnquiryStatusValue } from "@/lib/site";

export const metadata: Metadata = {
  title: "Enquiries",
  robots: { index: false, follow: false },
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; service?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const filters = await searchParams;
  const enquiries = await listEnquiries(filters);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">Enquiries</h1>
        <p className="mt-2 text-sm text-muted">
          Search, filter and review contact submissions.
        </p>
      </div>

      <EnquiryFilters q={filters.q} status={filters.status} service={filters.service} />

      {enquiries.length === 0 ? (
        <div className="rounded-[1.4rem] border border-dashed border-line px-6 py-16 text-center">
          <p className="font-medium">No enquiries match these filters.</p>
          <p className="mt-2 text-sm text-muted">
            New submissions from the contact form will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-[1.4rem] border border-line">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-line bg-surface/60 text-xs uppercase tracking-[0.12em] text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Received</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium"> </th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((enquiry) => (
                <tr key={enquiry.id} className="border-b border-line last:border-0">
                  <td className="whitespace-nowrap px-4 py-4 text-muted">
                    {formatDateTime(enquiry.createdAt)}
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium">{enquiry.name}</p>
                    <p className="text-muted">{enquiry.email}</p>
                  </td>
                  <td className="px-4 py-4">{getServiceLabel(enquiry.service)}</td>
                  <td className="px-4 py-4">
                    {enquiryStatusLabels[enquiry.status as EnquiryStatusValue]}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Link
                      href={`/admin/enquiries/${enquiry.id}`}
                      className="font-medium underline-offset-4 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
