"use client";

import Link from "next/link";
import { Leaf } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4 flex items-center">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-[#22C278] rounded-[10px] flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-110">
            <Leaf className="w-[18px] h-[18px] text-white" />
          </div>
          <span className="text-[1.25rem] font-bold tracking-tight text-gray-900">
            Eco<span className="text-[#22C278]">Bill</span>
          </span>
        </Link>
      </div>
    </header>
  );
}
