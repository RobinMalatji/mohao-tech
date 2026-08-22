import { Button } from "@/components/ui/button";
import { services } from "@/lib/content/services";
import { enquiryStatusLabels, enquiryStatuses } from "@/lib/site";

export function EnquiryFilters({
  q = "",
  status = "",
  service = "",
}: {
  q?: string;
  status?: string;
  service?: string;
}) {
  return (
    <form method="get" className="grid gap-3 rounded-[1.4rem] border border-line p-4 sm:grid-cols-[1fr_10rem_14rem_auto]">
      <label className="sr-only" htmlFor="search">
        Search enquiries
      </label>
      <input
        id="search"
        name="q"
        defaultValue={q}
        placeholder="Search name, email, company or message"
        className="min-h-11 rounded-2xl border border-ink/12 px-4 text-sm"
      />
      <select
        name="status"
        defaultValue={status}
        className="min-h-11 rounded-2xl border border-ink/12 px-3 text-sm"
        aria-label="Filter by status"
      >
        <option value="">All statuses</option>
        {enquiryStatuses.map((item) => (
          <option key={item} value={item}>
            {enquiryStatusLabels[item]}
          </option>
        ))}
      </select>
      <select
        name="service"
        defaultValue={service}
        className="min-h-11 rounded-2xl border border-ink/12 px-3 text-sm"
        aria-label="Filter by service"
      >
        <option value="">All services</option>
        {services.map((item) => (
          <option key={item.slug} value={item.slug}>
            {item.title}
          </option>
        ))}
      </select>
      <Button type="submit" className="w-full sm:w-auto">
        Apply
      </Button>
    </form>
  );
}
