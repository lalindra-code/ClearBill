"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Download,
  MessageCircle,
  Link as LinkIcon,
  Check,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { IInvoice } from "@/models/Invoice";
import { InvoicePreview } from "@/components/InvoicePreview";
import { exportInvoicePDF } from "@/utils/exportPDF";

interface SharePageClientProps {
  invoice: IInvoice;
  invoiceId: string;
}

type ActionKey = "download" | "whatsapp" | "copy";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function SharePageClient({ invoice, invoiceId }: SharePageClientProps) {
  const router = useRouter();
  const [loadingAction, setLoadingAction] = useState<ActionKey | null>(null);
  const [completedAction, setCompletedAction] = useState<ActionKey | null>(null);

  const isDisabled = loadingAction !== null || completedAction !== null;

  function scheduleRedirect() {
    setTimeout(() => router.push("/dashboard"), 3000);
  }

  async function handleDownload() {
    setLoadingAction("download");
    try {
      const element = document.getElementById("invoice-preview");
      if (!element) throw new Error("Invoice preview element not found");
      await exportInvoicePDF(invoice.invoiceNumber, element);
      setCompletedAction("download");
      scheduleRedirect();
    } catch (err) {
      console.error("PDF download error:", err);
    } finally {
      setLoadingAction(null);
    }
  }

  function handleWhatsApp() {
    const shareUrl = `${window.location.origin}/invoices/${invoiceId}/share`;
    const message =
      `Invoice ${invoice.invoiceNumber} for ${formatCurrency(invoice.total)} to ${invoice.clientName}.\n` +
      `View here: ${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
    setCompletedAction("whatsapp");
    scheduleRedirect();
  }

  async function handleCopyLink() {
    setLoadingAction("copy");
    try {
      const shareUrl = `${window.location.origin}/invoices/${invoiceId}/share`;
      await navigator.clipboard.writeText(shareUrl);
      setCompletedAction("copy");
      scheduleRedirect();
    } catch (err) {
      console.error("Clipboard error:", err);
    } finally {
      setLoadingAction(null);
    }
  }

  const successMessages: Record<ActionKey, string> = {
    download: "PDF is downloading to your device!",
    whatsapp: "WhatsApp opened with your invoice link.",
    copy: "Link copied to clipboard!",
  };

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
            {/* Step 2 — done */}
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-[#22C278] flex items-center justify-center">
                <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
              </div>
              <span className="text-sm text-gray-400 font-medium">Preview</span>
            </div>
            <div className="w-8 h-px bg-[#22C278]" />
            {/* Step 3 — active */}
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-[#22C278] flex items-center justify-center">
                <span className="text-xs font-bold text-white">3</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">Share</span>
            </div>
          </div>

          {/* ── Page heading ── */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Share &amp; Download
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Invoice{" "}
              <span className="font-medium text-gray-700">
                {invoice.invoiceNumber}
              </span>{" "}
              &middot;{" "}
              <span className="font-medium text-gray-700">
                {invoice.clientName}
              </span>{" "}
              &middot;{" "}
              <span className="font-medium text-gray-700">
                {formatCurrency(invoice.total)}
              </span>
            </p>
          </div>

          {/* ── Success toast ── */}
          {completedAction && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
              <div className="w-5 h-5 rounded-full bg-[#22C278] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
              <div>
                <p className="font-semibold text-sm">
                  {successMessages[completedAction]}
                </p>
                <p className="text-xs text-green-600 mt-0.5">
                  Redirecting to dashboard in 3 seconds…
                </p>
              </div>
            </div>
          )}

          {/* ── Invoice preview (also needed for PDF capture) ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
            <InvoicePreview invoice={invoice} />
          </div>

          {/* ── Action buttons ── */}
          <div className="space-y-3 mb-8">
            {/* Download PDF */}
            <button
              onClick={handleDownload}
              disabled={isDisabled}
              className="btn-shine w-full flex items-center justify-center gap-3 bg-[#22C278] hover:bg-[#1db86d] active:bg-[#1aad68] text-white font-semibold py-4 rounded-xl shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingAction === "download" ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : completedAction === "download" ? (
                <Check className="w-5 h-5" />
              ) : (
                <Download className="w-5 h-5" />
              )}
              {loadingAction === "download"
                ? "Generating PDF…"
                : completedAction === "download"
                ? "Downloaded!"
                : "Download as PDF"}
            </button>

            {/* Send via WhatsApp */}
            <button
              onClick={handleWhatsApp}
              disabled={isDisabled}
              className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20b858] active:bg-[#1da44f] text-white font-semibold py-4 rounded-xl shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {completedAction === "whatsapp" ? (
                <Check className="w-5 h-5" />
              ) : (
                <MessageCircle className="w-5 h-5" />
              )}
              {completedAction === "whatsapp"
                ? "WhatsApp Opened!"
                : "Send via WhatsApp"}
            </button>

            {/* Copy link */}
            <button
              onClick={handleCopyLink}
              disabled={isDisabled}
              className="w-full flex items-center justify-center gap-3 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingAction === "copy" ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : completedAction === "copy" ? (
                <Check className="w-5 h-5 text-[#22C278]" />
              ) : (
                <LinkIcon className="w-5 h-5" />
              )}
              {loadingAction === "copy"
                ? "Copying…"
                : completedAction === "copy"
                ? "Link Copied!"
                : "Copy Shareable Link"}
            </button>
          </div>

          {/* ── Back navigation ── */}
          <Link
            href={`/invoices/${invoiceId}/preview`}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Preview
          </Link>
        </div>
      </div>
    </div>
  );
}
