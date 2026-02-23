import { notFound, redirect } from "next/navigation";
import { Types } from "mongoose";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Invoice, { IInvoice } from "@/models/Invoice";
import { SharePageClient } from "@/components/SharePageClient";

async function getInvoice(id: string, userId: string): Promise<IInvoice | null> {
  if (!Types.ObjectId.isValid(id)) return null;
  try {
    await dbConnect();
    const invoice = await Invoice.findOne({ _id: id, userId }).lean();
    if (!invoice) return null;
    return JSON.parse(JSON.stringify(invoice));
  } catch {
    return null;
  }
}

interface SharePageProps {
  params: { id: string };
}

export default async function InvoiceSharePage({ params }: SharePageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/signin");

  const invoice = await getInvoice(params.id, session.user.id);
  if (!invoice) notFound();

  return <SharePageClient invoice={invoice} invoiceId={params.id} />;
}
