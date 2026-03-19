"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { isAdminUser } from "@/lib/queries";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/admin/login");
        return;
      }
      const admin = await isAdminUser(user.uid);
      if (!admin) {
        router.replace("/admin/login?error=unauthorized");
        return;
      }
      setVerified(true);
    });
    return () => unsub();
  }, [router]);

  if (!verified) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-purple-600" />
      </div>
    );
  }

  return <>{children}</>;
}
