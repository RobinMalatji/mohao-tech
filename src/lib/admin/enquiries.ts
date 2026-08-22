import type { EnquiryStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { enquiryStatuses } from "@/lib/site";
import { serviceKeys } from "@/lib/site";

export type EnquiryFilters = {
  q?: string;
  status?: string;
  service?: string;
};

function isStatus(value?: string): value is EnquiryStatus {
  return Boolean(value && enquiryStatuses.includes(value as EnquiryStatus));
}

export async function listEnquiries(filters: EnquiryFilters) {
  const q = filters.q?.trim();

  return prisma.contactSubmission.findMany({
    where: {
      status: isStatus(filters.status) ? filters.status : undefined,
      service:
        filters.service && serviceKeys.includes(filters.service as (typeof serviceKeys)[number])
          ? filters.service
          : undefined,
      OR: q
        ? [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { company: { contains: q, mode: "insensitive" } },
            { message: { contains: q, mode: "insensitive" } },
          ]
        : undefined,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getEnquiry(id: string) {
  return prisma.contactSubmission.findUnique({
    where: { id },
  });
}
