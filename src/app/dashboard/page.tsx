import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Plus } from "lucide-react";
import dbConnect from "@/lib/db";
import Invoice, { IInvoice } from "@/models/Invoice";
import { DashboardHeader } from "@/components/DashboardHeader";

async function getInvoices(): Promise<IInvoice[]> {
  try {
    await dbConnect();
    const invoices = await Invoice.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(invoices));
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return [];
  }
}

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
    month: "short",
    day: "numeric",
  });
}

function getStatusColor(status: string) {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-800";
    case "sent":
      return "bg-blue-100 text-blue-800";
    case "overdue":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default async function Dashboard() {
  const invoices = await getInvoices();

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Invoices</h1>
          <Link href="/dashboard/invoices/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Invoice
            </Button>
          </Link>
        </div>

        {invoices.length === 0 ? (
          /* Empty State */
          <div className="border-2 border-dashed rounded-lg p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No invoices yet</h2>
            <p className="text-muted-foreground mb-6">
              Create your first invoice to get started.
            </p>
            <Link href="/dashboard/invoices/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Invoice
              </Button>
            </Link>
          </div>
        ) : (
          /* Invoice List */
          <div className="grid gap-4">
            {invoices.map((invoice) => (
              <Card key={invoice._id?.toString()}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {invoice.invoiceNumber}
                      </CardTitle>
                      <CardDescription>{invoice.clientName}</CardDescription>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                        invoice.status
                      )}`}
                    >
                      {invoice.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center text-sm">
                    <div className="text-muted-foreground">
                      <span>Date: {formatDate(invoice.date)}</span>
                      <span className="mx-2">|</span>
                      <span>Due: {formatDate(invoice.dueDate)}</span>
                    </div>
                    <div className="font-semibold text-lg">
                      {formatCurrency(invoice.total)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
