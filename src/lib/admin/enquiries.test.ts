import { EnquiryStatus } from "@prisma/client";
import { afterAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/db";
import { getEnquiry, listEnquiries } from "@/lib/admin/enquiries";

const canReachDatabase = await prisma.$queryRaw`SELECT 1`
  .then(() => true)
  .catch(() => false);

describe.skipIf(!canReachDatabase)("enquiry database flow", () => {
  const ids: string[] = [];

  afterAll(async () => {
    if (ids.length) {
      await prisma.contactSubmission.deleteMany({
        where: { id: { in: ids } },
      });
    }
    await prisma.$disconnect();
  });

  it("creates, reads, updates and archives a submission", async () => {
    const created = await prisma.contactSubmission.create({
      data: {
        name: "Test Enquiry",
        email: "test.enquiry@example.com",
        phone: "+27 00 000 0000",
        company: "Test Co",
        service: "seo",
        message: "This is a database verification enquiry and can be removed.",
      },
    });
    ids.push(created.id);

    const listed = await listEnquiries({ q: "test.enquiry@example.com" });
    expect(listed.some((item) => item.id === created.id)).toBe(true);

    const read = await getEnquiry(created.id);
    expect(read?.email).toBe("test.enquiry@example.com");

    const updated = await prisma.contactSubmission.update({
      where: { id: created.id },
      data: { status: EnquiryStatus.CONTACTED },
    });
    expect(updated.status).toBe(EnquiryStatus.CONTACTED);

    const archived = await prisma.contactSubmission.update({
      where: { id: created.id },
      data: { status: EnquiryStatus.ARCHIVED },
    });
    expect(archived.status).toBe(EnquiryStatus.ARCHIVED);
  });

  it("handles a missing enquiry without throwing", async () => {
    const missing = await getEnquiry("clxxxxxxxxxxxxxxxxxxxxxx");
    expect(missing).toBeNull();
  });
});
