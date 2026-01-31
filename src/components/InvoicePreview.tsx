"use client";

import { IInvoice, IInvoiceItem } from "@/models/Invoice";
import { Leaf } from "lucide-react";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-LK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

interface InvoicePreviewProps {
  invoice: IInvoice;
}

export function InvoicePreview({ invoice }: InvoicePreviewProps) {
  return (
    <div
      id="invoice-preview"
      className="max-w-4xl mx-auto bg-white dark:bg-slate-900 p-8 print:p-0 print:bg-white"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-8 pb-8 border-b">
        <div className="flex items-start gap-4">
          {invoice.businessLogo && (
            <img
              src={invoice.businessLogo}
              alt="Company Logo"
              className="h-16 w-16 object-contain"
              style={{ maxWidth: '64px', maxHeight: '64px' }}
              onError={(e) => {
                // Hide image if it fails to load
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          )}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              INVOICE
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {invoice.invoiceNumber}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            <p>
              <span className="font-semibold">Date:</span> {formatDate(invoice.date)}
            </p>
            <p>
              <span className="font-semibold">Due Date:</span>{" "}
              {formatDate(invoice.dueDate)}
            </p>
          </div>
        </div>
      </div>

      {/* Business & Client Details */}
      <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b">
        {/* From Business */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            From
          </h3>
          <div className="text-gray-900 dark:text-white">
            <p className="font-semibold text-lg">{invoice.businessName}</p>
            <p className="text-sm whitespace-pre-wrap">{invoice.businessAddress}</p>
            {invoice.businessPhone && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Phone: {invoice.businessPhone}
              </p>
            )}
            {invoice.businessEmail && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Email: {invoice.businessEmail}
              </p>
            )}
          </div>
        </div>

        {/* To Client */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            Bill To
          </h3>
          <div className="text-gray-900 dark:text-white">
            <p className="font-semibold text-lg">{invoice.clientName}</p>
            <p className="text-sm whitespace-pre-wrap">{invoice.clientAddress}</p>
            {invoice.clientPhone && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Phone: {invoice.clientPhone}
              </p>
            )}
            {invoice.clientEmail && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Email: {invoice.clientEmail}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="mb-8">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-300 dark:border-gray-700">
              <th className="text-left py-2 px-2 font-semibold text-gray-900 dark:text-white">
                Description
              </th>
              <th className="text-right py-2 px-2 font-semibold text-gray-900 dark:text-white">
                Quantity
              </th>
              <th className="text-right py-2 px-2 font-semibold text-gray-900 dark:text-white">
                Unit Price
              </th>
              <th className="text-right py-2 px-2 font-semibold text-gray-900 dark:text-white">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item: IInvoiceItem, index: number) => (
              <tr
                key={index}
                className="border-b border-gray-200 dark:border-gray-700"
              >
                <td className="py-3 px-2 text-gray-900 dark:text-gray-100">
                  {item.description}
                </td>
                <td className="text-right py-3 px-2 text-gray-900 dark:text-gray-100">
                  {item.quantity}
                </td>
                <td className="text-right py-3 px-2 text-gray-900 dark:text-gray-100">
                  {formatCurrency(item.unitPrice)}
                </td>
                <td className="text-right py-3 px-2 font-semibold text-gray-900 dark:text-gray-100">
                  {formatCurrency(item.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-full max-w-xs">
          <div className="flex justify-between py-2 text-gray-900 dark:text-gray-100">
            <span>Subtotal:</span>
            <span>{formatCurrency(invoice.subtotal)}</span>
          </div>
          {invoice.taxRate > 0 && (
            <div className="flex justify-between py-2 text-gray-900 dark:text-gray-100">
              <span>Tax ({invoice.taxRate}%):</span>
              <span>{formatCurrency(invoice.taxAmount)}</span>
            </div>
          )}
          <div className="flex justify-between py-2 border-t-2 border-gray-300 dark:border-gray-700 mt-2 font-bold text-lg text-gray-900 dark:text-white">
            <span>Total:</span>
            <span>{formatCurrency(invoice.total)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="border-t pt-4 mt-8">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            Notes
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {invoice.notes}
          </p>
        </div>
      )}

      {/* Eco-Friendly Footer */}
      <div className="mt-8 pt-4 border-t border-dashed border-green-300 dark:border-green-700">
        <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
          <Leaf className="h-4 w-4" />
          <p className="text-xs">
            This is a paperless invoice. Going digital helps save trees and protect our environment.
          </p>
        </div>
      </div>
    </div>
  );
}
