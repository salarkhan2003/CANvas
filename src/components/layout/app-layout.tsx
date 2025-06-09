'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
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
import { Settings, UserCircle, ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const showBackButton = pathname !== '/';

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex flex-1">
        <Sidebar collapsible="icon" variant="sidebar" className="border-r border-sidebar-border">
          <SidebarHeader className="p-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 text-sidebar-foreground hover:text-sidebar-primary transition-colors">
                <Logo className="h-8 w-auto text-primary" /> {/* Updated from accent to primary for new theme */}
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
            <Button variant="ghost" className="w-full justify-start gap-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-auto text-muted-foreground hover:text-foreground">
              <Settings className="h-5 w-5" />
              <span className="group-data-[collapsible=icon]:hidden">Settings</span>
            </Button>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="flex flex-col flex-1">
          <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-sm md:px-6">
            <div className="flex items-center gap-2">
              <DesktopSidebarTrigger />
              {showBackButton && (
                <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Go back">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
               {!showBackButton && (
                 <Link href="/" passHref legacyBehavior>
                    <Button variant="ghost" size="icon" aria-label="Go to Dashboard">
                        <Home className="h-5 w-5" />
                    </Button>
                 </Link>
               )}
            </div>
            <UserMenu />
          </header>
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
          <footer className="py-4 px-6 text-center text-xs text-muted-foreground border-t border-border">
            © {new Date().getFullYear()} All rights reserved. Made by Patan Salarkhan. <span className="font-semibold text-primary">CANvas</span> - Advanced Automotive Network Studio.
          </footer>
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
