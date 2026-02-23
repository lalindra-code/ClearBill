import mongoose, { Schema, Document } from "mongoose";

export interface IInvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface IInvoice extends Document {
  userId: mongoose.Types.ObjectId;
  invoiceNumber: string;
  date: Date;
  dueDate: Date;

  // Business details
  businessName: string;
  businessAddress: string;
  businessPhone?: string;
  businessEmail?: string;
  businessLogo?: string; // Base64 encoded logo

  // Client details
  clientName: string;
  clientAddress: string;
  clientPhone?: string;
  clientEmail?: string;

  // Invoice items
  items: IInvoiceItem[];

  // Totals
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;

  // Status
  status: "draft" | "sent" | "paid" | "overdue";

  // Notes
  notes?: string;

  createdAt: Date;
  updatedAt: Date;
}

const InvoiceItemSchema = new Schema<IInvoiceItem>({
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  amount: { type: Number, required: true },
});

const InvoiceSchema = new Schema<IInvoice>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    invoiceNumber: { type: String, required: true, unique: true },
    date: { type: Date, required: true, default: Date.now },
    dueDate: { type: Date, required: true },

    businessName: { type: String, required: true },
    businessAddress: { type: String, required: true },
    businessPhone: { type: String },
    businessEmail: { type: String },
    businessLogo: { type: String },

    clientName: { type: String, required: true },
    clientAddress: { type: String, required: true },
    clientPhone: { type: String },
    clientEmail: { type: String },

    items: [InvoiceItemSchema],

    subtotal: { type: Number, required: true },
    taxRate: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    total: { type: Number, required: true },

    status: {
      type: String,
      enum: ["draft", "sent", "paid", "overdue"],
      default: "draft",
    },

    notes: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Invoice ||
  mongoose.model<IInvoice>("Invoice", InvoiceSchema);
