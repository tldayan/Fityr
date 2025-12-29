// app/(withSearchLayout)/search/SearchResultsWrapper.tsx
"use client";

import React from "react";
import SearchResultsClient from "./SearchResultsClient";

interface Props {
  initialData: any; 
  type: "users" | "posts";
}

export default function SearchResultsWrapper({ initialData, type }: Props) {
  return <SearchResultsClient initialData={initialData} type={type} />;
}
