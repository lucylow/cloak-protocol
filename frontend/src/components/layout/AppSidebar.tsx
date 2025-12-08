'use client'
import { 
  Home, 
  Zap, 
  BarChart3, 
  Shield, 
  Wallet, 
  Settings,
  FileText,
  ChevronLeft,
  ChevronRight,
  Vote,
  ArrowLeftRight,
  Building2
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

const mainNavItems = [
  { href: '/app', label: 'Dashboard', icon: Home },
  { href: '/app/trade', label: 'Trade', icon: Zap },
  { href: '/app/portfolio', label: 'Portfolio', icon: BarChart3 },
  { href: '/app/privacy', label: 'Privacy Proofs', icon: Shield },
  { href: '/app/governance', label: 'Governance', icon: Vote },
  { href: '/app/demo/dex', label: 'DEX Demo', icon: ArrowLeftRight },
  { href: '/app/demo/rwa', label: 'RWA Market', icon: Building2 },
];

const secondaryNavItems = [
  { href: '/app/wallet', label: 'Wallet', icon: Wallet },
  { href: '/app/docs', label: 'Documentation', icon: FileText },
  { href: '/app/settings', label: 'Settings', icon: Settings },
];

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === 'collapsed';

  return (
    <Sidebar 
      className={cn(
        "border-r border-sidebar-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
      collapsible="icon"
    >
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center group-hover:shadow-glow transition-shadow shrink-0">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <span className="font-bold text-lg text-sidebar-foreground">Cloak</span>
            )}
          </NavLink>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-xs text-muted-foreground uppercase tracking-wider px-3 py-2">
              Main
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.href} 
                      end={item.href === '/app'}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                        "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
                      )}
                      activeClassName="bg-sidebar-accent text-sidebar-foreground shadow-glow"
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!collapsed && <span>{item.label}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          {!collapsed && (
            <SidebarGroupLabel className="text-xs text-muted-foreground uppercase tracking-wider px-3 py-2">
              Settings
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                        "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
                      )}
                      activeClassName="bg-sidebar-accent text-sidebar-foreground"
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!collapsed && <span>{item.label}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        {!collapsed && (
          <div className="text-xs text-muted-foreground text-center">
            Powered by Psy Protocol
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
