import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  archiveEnquiry,
  deleteEnquiry,
  updateEnquiryStatus,
} from "@/actions/enquiries";
import { Button } from "@/components/ui/button";
import { getEnquiry } from "@/lib/admin/enquiries";
import { getSession } from "@/lib/auth";
import { getServiceLabel } from "@/lib/content/services";
import { formatDateTime } from "@/lib/format";
import { enquiryStatusLabels, enquiryStatuses } from "@/lib/site";

export const metadata: Metadata = {
  title: "Enquiry",
  robots: { index: false, follow: false },
};

export default async function EnquiryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const enquiry = await getEnquiry(id);
  if (!enquiry) notFound();

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin" className="text-sm text-muted hover:text-ink">
          ← All enquiries
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
          {enquiry.name}
        </h1>
        <p className="mt-2 text-sm text-muted">
          Received {formatDateTime(enquiry.createdAt)}
        </p>
      </div>

      <dl className="grid gap-4 rounded-[1.4rem] border border-line p-6 sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-[0.14em] text-muted">Email</dt>
          <dd className="mt-1 break-all">{enquiry.email}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.14em] text-muted">Phone</dt>
          <dd className="mt-1">{enquiry.phone || "Not provided"}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.14em] text-muted">Company</dt>
          <dd className="mt-1">{enquiry.company || "Not provided"}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.14em] text-muted">Service</dt>
          <dd className="mt-1">{getServiceLabel(enquiry.service)}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs uppercase tracking-[0.14em] text-muted">Message</dt>
          <dd className="mt-2 whitespace-pre-wrap leading-7">{enquiry.message}</dd>
        </div>
      </dl>

      <form action={updateEnquiryStatus} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <input type="hidden" name="id" value={enquiry.id} />
        <div className="flex-1 space-y-2">
          <label htmlFor="status" className="text-sm font-medium">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={enquiry.status}
            className="min-h-11 w-full rounded-2xl border border-ink/12 px-3 text-sm"
          >
            {enquiryStatuses.map((status) => (
              <option key={status} value={status}>
                {enquiryStatusLabels[status]}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit">Update status</Button>
      </form>

      <div className="flex flex-col gap-3 sm:flex-row">
        <form action={archiveEnquiry}>
          <input type="hidden" name="id" value={enquiry.id} />
          <Button type="submit" variant="secondary">
            Archive
          </Button>
        </form>
        <form action={deleteEnquiry}>
          <input type="hidden" name="id" value={enquiry.id} />
          <Button type="submit" variant="secondary">
            Delete
          </Button>
        </form>
      </div>
    </div>
  );
}
