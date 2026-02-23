import { notFound, redirect } from "next/navigation";
import { Types } from "mongoose";
import { getServerSession } from "next-auth/next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Invoice, { IInvoice } from "@/models/Invoice";
import { InvoicePreview } from "@/components/InvoicePreview";

async function getInvoice(id: string, userId: string): Promise<IInvoice | null> {
  if (!Types.ObjectId.isValid(id)) return null;
  try {
    await dbConnect();
    // Single query covers both existence and ownership — never leaks invoice existence to wrong user
    const invoice = await Invoice.findOne({ _id: id, userId }).lean();
    if (!invoice) return null;
    return JSON.parse(JSON.stringify(invoice));
  } catch {
    return null;
  }
}

interface PreviewPageProps {
  params: { id: string };
}

export default async function InvoicePreviewPage({ params }: PreviewPageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/signin");

  const invoice = await getInvoice(params.id, session.user.id);
  if (!invoice) notFound();

  const invoiceId = params.id;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="pt-16">
        <div className="max-w-3xl mx-auto px-4 py-10">

          {/* ── Step indicator ── */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {/* Step 1 — done */}
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-[#22C278] flex items-center justify-center">
                <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
              </div>
              <span className="text-sm text-gray-400 font-medium">Create</span>
            </div>
            <div className="w-8 h-px bg-[#22C278]" />
            {/* Step 2 — active */}
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-[#22C278] flex items-center justify-center">
                <span className="text-xs font-bold text-white">2</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">Preview</span>
            </div>
            <div className="w-8 h-px bg-gray-200" />
            {/* Step 3 — upcoming */}
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-xs font-bold text-gray-500">3</span>
              </div>
              <span className="text-sm text-gray-400 font-medium">Share</span>
            </div>
          </div>

          {/* ── Page heading ── */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Review your invoice
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Check everything looks right before sharing or downloading.
            </p>
          </div>

          {/* ── Invoice preview card ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
            <InvoicePreview invoice={invoice} />
          </div>

          {/* ── Navigation buttons ── */}
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>

            <Link
              href={`/invoices/${invoiceId}/share`}
              className="btn-shine flex items-center gap-2 px-6 py-3 rounded-xl bg-[#22C278] hover:bg-[#1db86d] active:bg-[#1aad68] text-white text-sm font-semibold shadow-sm transition-all duration-200"
            >
              Next: Share &amp; Download
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
