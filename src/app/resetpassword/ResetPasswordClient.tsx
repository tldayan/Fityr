import { Suspense } from "react";
import ResetPasswordClient from "./ResetPasswordClient";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";

export default function Page() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ResetPasswordClient />
    </Suspense>
  );
}
