import { Suspense } from "react";
import { AuthPortal } from "@/components/auth/AuthPortal";

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="studio-shell flex min-h-screen w-full items-center justify-center">
          <div className="size-9 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <AuthPortal initialMode="signup" />
    </Suspense>
  );
}
