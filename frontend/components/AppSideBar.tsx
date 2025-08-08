"use client";

import { useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Home, Inbox, LogOut } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/useAuthStore";

type MenuItemConfig = {
  title: string;
  url: string;
  icon: React.FC<any>;
  protected?: boolean;
};

const MENU_ITEMS: MenuItemConfig[] = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "My Events", url: "/user/events", icon: Inbox, protected: true },
];

const FOOTER_ITEMS: MenuItemConfig[] = [
  { title: "Logout", url: "", icon: LogOut, protected: true },
  { title: "Login", url: "/login", icon: Home },
];

export default function AppSidebar() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const isLoggedIn = Boolean(user);

  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch {
      toast.error("Logout failed");
    }
  }, [logout, router]);

  const resolveLink = (item: MenuItemConfig) => {
    if (item.protected && !isLoggedIn) {
      return "/login";
    }
    return item.url;
  };

  const footerToShow = FOOTER_ITEMS.filter((item) =>
    item.protected ? isLoggedIn : !isLoggedIn
  );

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-3xl p-6">
            Event Master
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-5">
            <SidebarMenu>
              {MENU_ITEMS.map((item) => {
                const href = resolveLink(item);
                const isActive =
                  item.url === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.url);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={href} className="flex items-center px-5 py-2">
                        <item.icon className="mr-2" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {footerToShow.map((item) => (
            <SidebarMenuItem key={item.title}>
              {item.title === "Logout" ? (
                <SidebarMenuButton
                  className="px-5 flex items-center"
                  onClick={handleLogout}
                >
                  <item.icon className="mr-2" />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              ) : (
                <SidebarMenuButton asChild className="px-5">
                  <Link href={item.url} className="flex items-center">
                    <item.icon className="mr-2" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
