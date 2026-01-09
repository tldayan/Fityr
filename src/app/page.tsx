// app/page.tsx (SERVER)
import { Suspense } from "react";
import Feed from "@/components/Feed/Feed";
import SearchComponent from "@/components/SearchComponent/SearchComponent";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";

export default function HomePage() {
  return (
    <>
      {/* Client-only OAuth logic */}
{/*       <OAuthHandler /> */}

      <Suspense fallback={<LoadingSpinner />}>
        <SearchComponent />
        <Feed />
      </Suspense>
    </>
  );
}
