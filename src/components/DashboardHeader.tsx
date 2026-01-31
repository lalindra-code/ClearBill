"use client";

import Link from "next/link";
import { FileText, Leaf } from "lucide-react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export function DashboardHeader() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">ClearBill</span>
          </Link>
          <span className="hidden sm:inline-flex items-center gap-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">
            <Leaf className="h-3 w-3" />
            Paperless
          </span>
        </div>
        <ThemeSwitcher />
      </div>
    </header>
  );
}
