
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavItem } from '@/components/layout/sidebar-nav-items';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import * as React from 'react';

interface SidebarNavProps {
  items: NavItem[];
}

export function SidebarNav({ items }: SidebarNavProps) {
  const pathname = usePathname();

  if (!items?.length) {
    return null;
  }

  return (
    <SidebarMenu>
      {items.map((item, index) => {
        const Icon = item.icon;
        const isActive = item.href === '/' ? pathname === item.href : pathname.startsWith(item.href);

        if (item.children && item.children.length > 0) {
          return (
            <SidebarMenuItem key={index}>
               <SidebarMenuButton
                className="justify-between"
                isActive={isActive}
                // onClick={() => item.children && item.children.length > 0 ? setOpenGroups(prev => ({...prev, [item.title]: !prev[item.title]})) : null}
                // asChild={!item.children || item.children.length === 0}
              >
                <div className="flex items-center gap-2">
                  <Icon />
                  <span>{item.title}</span>
                </div>
                <ChevronDown className={cn("h-4 w-4 transition-transform", /* openGroups[item.title] ? "rotate-180" : "" */)} />
              </SidebarMenuButton>
              {/* {openGroups[item.title] && ( */}
                <SidebarMenuSub>
                  {item.children.map((child, childIndex) => {
                    const ChildIcon = child.icon;
                    const isChildActive = pathname === child.href || pathname.startsWith(child.href);
                    return (
                      <SidebarMenuSubItem key={childIndex}>
                        <SidebarMenuSubButton href={child.href} isActive={isChildActive} aria-disabled={child.disabled}>
                          {ChildIcon && <ChildIcon />}
                          <span>{child.title}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    );
                  })}
                </SidebarMenuSub>
              {/* )} */}
            </SidebarMenuItem>
          );
        }

        return (
          <SidebarMenuItem key={index}>
            <Link href={item.href}>
              <SidebarMenuButton isActive={isActive} aria-disabled={item.disabled} tooltip={item.title}>
                <Icon />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
