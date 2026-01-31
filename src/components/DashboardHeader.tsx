"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export function DashboardHeader() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <FileText className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-foreground">ClearBill</span>
        </Link>
        <ThemeSwitcher />
      </div>
    </header>
  );
}
