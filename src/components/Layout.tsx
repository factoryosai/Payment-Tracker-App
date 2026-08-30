import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { LayoutDashboard, Users, Receipt, CreditCard, FileText, LogOut, Menu, X, ChevronLeft, ChevronRight, UserRound } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';

export function Layout() {
  const { profile, logout } = useAuth();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Parties', href: '/parties', icon: Users },
    { name: 'Bills', href: '/bills', icon: Receipt },
    { name: 'Payments', href: '/payments', icon: CreditCard },
    { name: 'Reports', href: '/reports', icon: FileText },
  ];

  const mobileNav = navigation.slice(0, 4); // First 4 items for bottom bar

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop/Tablet Sidebar */}
      <div className={cn(
        "hidden md:flex flex-col bg-white shadow-xl transition-all duration-300 z-20",
        sidebarCollapsed ? "w-20" : "w-64"
      )}>
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-100">
          {!sidebarCollapsed && <span className="text-lg font-bold text-slate-900 ml-2 whitespace-nowrap overflow-hidden">Payment & Sales</span>}
          <button 
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors ml-auto flex-shrink-0" 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  title={sidebarCollapsed ? item.name : undefined}
                  className={cn(
                    "flex items-center py-3 font-medium rounded-xl transition-colors",
                    sidebarCollapsed ? "justify-center px-0" : "px-4",
                    isActive 
                      ? "bg-indigo-50 text-indigo-700" 
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-indigo-700" : "text-slate-400", !sidebarCollapsed && "mr-3")} />
                  {!sidebarCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
                </Link>
              )
            })}
          </nav>
        </div>
        
        <div className="border-t border-slate-100 p-4">
          <div className={cn("flex items-center mb-4 overflow-hidden", sidebarCollapsed && "justify-center")}>
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold flex-shrink-0">
              {profile?.name?.charAt(0) || 'U'}
            </div>
            {!sidebarCollapsed && (
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-slate-900 truncate">{profile?.name}</p>
                <p className="text-xs text-slate-500 capitalize truncate">{profile?.role}</p>
              </div>
            )}
          </div>
          <button
            onClick={logout}
            title={sidebarCollapsed ? "Sign Out" : undefined}
            className={cn(
              "flex items-center py-2.5 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors w-full",
              sidebarCollapsed ? "justify-center px-0" : "px-4"
            )}
          >
            <LogOut className={cn("h-5 w-5 flex-shrink-0", !sidebarCollapsed && "mr-3")} />
            {!sidebarCollapsed && <span className="whitespace-nowrap">Sign Out</span>}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pb-24 md:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)]">
        <nav className="flex justify-around items-center h-16 px-1">
          {mobileNav.map((item) => {
            const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors relative",
                  isActive ? "text-indigo-600" : "text-slate-500 hover:text-slate-900"
                )}
              >
                {isActive && (
                  <span className="absolute top-0 w-8 h-1 bg-indigo-600 rounded-b-full"></span>
                )}
                <item.icon className={cn("h-5 w-5", isActive && "text-indigo-600")} />
                <span className="text-[10px] font-medium leading-none">{item.name}</span>
              </Link>
            );
          })}
          
          {/* Mobile More Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors relative",
              mobileMenuOpen ? "text-indigo-600" : "text-slate-500 hover:text-slate-900"
            )}
          >
            {mobileMenuOpen && (
              <span className="absolute top-0 w-8 h-1 bg-indigo-600 rounded-b-full"></span>
            )}
            <Menu className={cn("h-5 w-5", mobileMenuOpen && "text-indigo-600")} />
            <span className="text-[10px] font-medium leading-none">Menu</span>
          </button>
        </nav>
      </div>

      {/* Mobile "More" Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="absolute bottom-16 left-0 right-0 bg-white rounded-t-2xl shadow-xl overflow-hidden animate-in slide-in-from-bottom-8 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                  {profile?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{profile?.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{profile?.role}</p>
                </div>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-400 bg-slate-50 rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-2">
              <Link
                to="/reports"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 rounded-xl hover:bg-slate-50"
              >
                <FileText className="h-5 w-5 text-slate-400" />
                Reports
              </Link>
              
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 mt-1"
              >
                <LogOut className="h-5 w-5 text-red-400" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
