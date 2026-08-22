"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { EnquiryStatus } from "@prisma/client";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { enquiryIdSchema, enquiryStatusSchema } from "@/lib/validation/auth";

async function assertAdmin() {
  const session = await requireAdmin();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}

export async function updateEnquiryStatus(formData: FormData) {
  await assertAdmin();

  const idResult = enquiryIdSchema.safeParse(formData.get("id"));
  const statusResult = enquiryStatusSchema.safeParse(formData.get("status"));

  if (!idResult.success || !statusResult.success) {
    throw new Error("Invalid enquiry update.");
  }

  await prisma.contactSubmission.update({
    where: { id: idResult.data },
    data: { status: statusResult.data as EnquiryStatus },
  });

  revalidatePath("/admin");
  revalidatePath(`/admin/enquiries/${idResult.data}`);
}

export async function archiveEnquiry(formData: FormData) {
  await assertAdmin();
  const idResult = enquiryIdSchema.safeParse(formData.get("id"));
  if (!idResult.success) {
    throw new Error("Invalid enquiry.");
  }

  await prisma.contactSubmission.update({
    where: { id: idResult.data },
    data: { status: EnquiryStatus.ARCHIVED },
  });

  revalidatePath("/admin");
  revalidatePath(`/admin/enquiries/${idResult.data}`);
}

export async function deleteEnquiry(formData: FormData) {
  await assertAdmin();
  const idResult = enquiryIdSchema.safeParse(formData.get("id"));
  if (!idResult.success) {
    throw new Error("Invalid enquiry.");
  }

  await prisma.contactSubmission.delete({
    where: { id: idResult.data },
  });

  revalidatePath("/admin");
  redirect("/admin");
}
