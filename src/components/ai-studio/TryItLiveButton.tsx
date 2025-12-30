"use client";

import React from "react";
import Link from "next/link";
import { Rocket, ArrowRight } from "lucide-react";

interface TryItLiveButtonProps {
  href: string;
  label?: string;
  feature?: string;
  className?: string;
}

export default function TryItLiveButton({ 
  href, 
  label = "Try It Live", 
  feature,
  className = "" 
}: TryItLiveButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all font-semibold text-sm shadow-md hover:shadow-lg ${className}`}
    >
      <Rocket className="w-4 h-4" />
      {label}
      {feature && <span className="text-xs opacity-90">({feature})</span>}
      <ArrowRight className="w-4 h-4" />
    </Link>
  );
}

