"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAuthStore((s) => s.user);
  const isAdmin = useAuthStore((s) => s.isAdmin());

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {

    if (!isAdmin && pathname !== "/admin/login") {
      router.replace("/admin/login");
    }
  }, [user, pathname, router]);


  if (!isAdmin && pathname !== "/admin/login") {
    return null;
  }

  return <>{children}</>;
}
