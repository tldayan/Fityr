"use client";

import { Suspense } from "react";
import SearchComponent from "@/components/SearchComponent/SearchComponent";

export default function SearchLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <SearchComponent />
      <main>{children}</main>
    </Suspense>
  );
}
