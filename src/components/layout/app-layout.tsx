'use client';

import * as React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons/logo';
import { sidebarNavItems } from './sidebar-nav-items';
import { SidebarNav } from './sidebar-nav';
import { Settings, UserCircle } from 'lucide-react';
import Link from 'next/link';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex flex-1">
        <Sidebar collapsible="icon" variant="sidebar" className="border-r border-sidebar-border">
          <SidebarHeader className="p-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 text-sidebar-foreground hover:text-sidebar-primary transition-colors">
                <Logo className="h-8 w-auto text-accent" />
              </Link>
              <div className="block group-data-[collapsible=icon]:hidden md:hidden">
                 <MobileSidebarTrigger />
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="flex-1 p-2">
            <SidebarNav items={sidebarNavItems} />
          </SidebarContent>
          <SidebarFooter className="p-4 border-t border-sidebar-border">
            {/* Example Footer Item */}
            <Button variant="ghost" className="w-full justify-start gap-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-auto">
              <Settings className="h-5 w-5" />
              <span className="group-data-[collapsible=icon]:hidden">Settings</span>
            </Button>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="flex flex-col flex-1">
          <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
            <div className="flex items-center">
              <DesktopSidebarTrigger />
              {/* Breadcrumbs or page title can go here */}
            </div>
            <UserMenu />
          </header>
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}


function DesktopSidebarTrigger() {
  const { isMobile } = useSidebar();
  if (isMobile) return null;
  return <SidebarTrigger className="mr-2" />;
}

function MobileSidebarTrigger() {
  const { isMobile } = useSidebar();
  if (!isMobile) return null;
  return <SidebarTrigger />;
}

function UserMenu() {
  // Placeholder for user menu/avatar
  return (
    <Button variant="ghost" size="icon" className="rounded-full">
      <UserCircle className="h-6 w-6" />
      <span className="sr-only">User menu</span>
    </Button>
  );
}