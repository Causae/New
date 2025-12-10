import Link from 'next/link';
import {
  Home,
  PlusCircle,
  Settings,
  Briefcase,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { DashboardHeader } from '@/components/dashboard-header';
import { Logo } from '@/components/logo';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar collapsible="icon" variant="sidebar" side="left">
          <SidebarHeader>
            <div className="flex items-center gap-2 p-2">
              <Logo className="h-8 w-8 text-sidebar-primary" />
              <div className="duration-200 group-data-[collapsible=icon]:-ml-8 group-data-[collapsible=icon]:opacity-0">
                <h2 className="text-lg font-bold tracking-tight text-sidebar-foreground">
                  CAUSAE Legaltech
                </h2>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive
                  tooltip={{ children: 'Dashboard' }}
                >
                  <Link href="/dashboard">
                    <Home />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={{ children: 'My Cases' }}>
                  <Link href="/dashboard">
                    <Briefcase />
                    <span>My Cases</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={{ children: 'New Case' }}>
                  <Link href="/dashboard/cases/new">
                    <PlusCircle />
                    <span>New Case</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={{ children: 'Settings' }}>
                  <Link href="/dashboard/settings">
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <div className="flex items-center gap-3 p-2">
              <Avatar>
                <AvatarImage
                  src="https://picsum.photos/seed/lawyer/40/40"
                  alt="Lawyer"
                />
                <AvatarFallback>AV</AvatarFallback>
              </Avatar>
              <div className="flex flex-col duration-200 group-data-[collapsible=icon]:-ml-8 group-data-[collapsible=icon]:opacity-0">
                <span className="font-semibold text-sidebar-foreground">
                  Alicia Vexin
                </span>
                <span className="text-xs text-sidebar-foreground/70">
                  avocat@causaeleagaltech.fr
                </span>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-1 flex-col">
          <DashboardHeader />
          <SidebarInset>
            <main className="flex-1 p-4 sm:px-6 sm:py-0">{children}</main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}

    