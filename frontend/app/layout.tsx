"use client";

import "@/styles/globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSideBar";
import { usePathname } from "next/navigation";
import Dialog from "@/components/Dialog";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");


  return (
    <html>
      <body>
        <SidebarProvider>
          {!isAdmin && (
            <>
              <AppSidebar />
              <SidebarTrigger />
            </>
          )}
          <main className="container mx-auto p-8">{children}</main>
          <Toaster duration={0} />
          <Dialog />
        </SidebarProvider>
      </body>
    </html>
  );
}
