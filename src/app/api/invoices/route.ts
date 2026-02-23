import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Invoice from "@/models/Invoice";

export async function GET() {
  try {
    await dbConnect();
    const invoices = await Invoice.find({}).sort({ createdAt: -1 });
    return NextResponse.json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const data = await request.json();

    // userId is injected server-side after the spread so the client cannot spoof it
    const invoice = await Invoice.create({ ...data, userId: session.user.id });
    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error("Error creating invoice:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create invoice";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
