import React, { useState } from 'react';
import {
  BarChart3,
  Wallet,
  TrendingUp,
  Users,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  Home,
  CreditCard,
  FileText,
  MessageCircle,
  MoreVertical,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}

interface Transaction {
  id: string;
  name: string;
  amount: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  category: string;
  avatar: string;
}

const DashboardLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('dashboard');

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    { id: 'payments', label: 'Payments', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'reports', label: 'Reports', icon: <FileText className="w-5 h-5" /> },
    { id: 'messages', label: 'Messages', icon: <MessageCircle className="w-5 h-5" /> },
  ];

  const transactions: Transaction[] = [
    {
      id: '1',
      name: 'Ahmed Hassan',
      amount: '+$450.00',
      date: 'Today, 2:30 PM',
      status: 'completed',
      category: 'Invoice Payment',
      avatar: '🧑',
    },
    {
      id: '2',
      name: 'Fatima Al-Mansouri',
      amount: '+$320.50',
      date: 'Today, 1:45 PM',
      status: 'completed',
      category: 'Service Fee',
      avatar: '👩',
    },
    {
      id: '3',
      name: 'Mohammed Ali',
      amount: '-$780.00',
      date: 'Yesterday, 11:20 AM',
      status: 'pending',
      category: 'Refund',
      avatar: '👨',
    },
    {
      id: '4',
      name: 'Sarah Johnson',
      amount: '+$590.25',
      date: 'Sep 01, 4:15 PM',
      status: 'completed',
      category: 'Monthly Fee',
      avatar: '👩‍🦰',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'failed':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-black text-slate-900">PayTrack</h1>
            </div>

            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-md">
              <div className="w-full relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition hidden sm:block">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition hidden sm:block">
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                AK
              </div>
              <button
                className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <nav
          className={`${
            isMobileMenuOpen ? 'block' : 'hidden'
          } md:block fixed md:relative left-0 top-24 md:top-0 w-64 h-screen md:h-auto bg-white border-r border-slate-200 z-40 md:z-0`}
        >
          <div className="p-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNav(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
                  activeNav === item.id
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">
                Welcome back, Ahmed! 👋
              </h2>
              <p className="text-slate-600">
                Here's what's happening with your payments today
              </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Balance */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <Wallet className="w-8 h-8 opacity-80" />
                  <span className="text-xs font-bold opacity-70">TODAY</span>
                </div>
                <h3 className="text-4xl font-black mb-1">$12,450</h3>
                <p className="text-blue-100 text-sm font-medium">Total Balance</p>
                <div className="mt-4 pt-4 border-t border-blue-500/30 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-semibold">+12% from last month</span>
                </div>
              </div>

              {/* Received */}
              <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <CreditCard className="w-8 h-8 opacity-80" />
                  <span className="text-xs font-bold opacity-70">RECEIVED</span>
                </div>
                <h3 className="text-4xl font-black mb-1">$8,360</h3>
                <p className="text-green-100 text-sm font-medium">This Month</p>
                <div className="mt-4 pt-4 border-t border-green-500/30 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-semibold">24 transactions</span>
                </div>
              </div>

              {/* Sent */}
              <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <Wallet className="w-8 h-8 opacity-80" />
                  <span className="text-xs font-bold opacity-70">SENT</span>
                </div>
                <h3 className="text-4xl font-black mb-1">$3,890</h3>
                <p className="text-orange-100 text-sm font-medium">This Month</p>
                <div className="mt-4 pt-4 border-t border-orange-500/30 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-semibold">18 transactions</span>
                </div>
              </div>

              {/* Pending */}
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <BarChart3 className="w-8 h-8 opacity-80" />
                  <span className="text-xs font-bold opacity-70">PENDING</span>
                </div>
                <h3 className="text-4xl font-black mb-1">$2,190</h3>
                <p className="text-purple-100 text-sm font-medium">Awaiting Confirmation</p>
                <div className="mt-4 pt-4 border-t border-purple-500/30 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-semibold">5 transactions</span>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Recent Transactions</h3>
                    <p className="text-slate-600 text-sm">Your latest payment activity</p>
                  </div>
                  <button className="px-4 py-2 text-blue-600 font-semibold text-sm hover:bg-blue-50 rounded-lg transition">
                    View All
                  </button>
                </div>
              </div>

              <div className="divide-y divide-slate-200">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="p-4 md:p-6 hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-between gap-4">
                      {/* Left Content */}
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-2xl flex-shrink-0">
                          {transaction.avatar}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 text-sm md:text-base">
                            {transaction.name}
                          </h4>
                          <p className="text-slate-500 text-xs md:text-sm">
                            {transaction.category}
                          </p>
                          <p className="text-slate-400 text-xs mt-1">{transaction.date}</p>
                        </div>
                      </div>

                      {/* Right Content */}
                      <div className="flex items-center gap-3 ml-auto">
                        <div className="text-right">
                          <h5 className="font-black text-slate-900 text-sm md:text-base">
                            {transaction.amount}
                          </h5>
                          <span
                            className={`inline-block text-xs font-bold px-3 py-1 rounded-full border ${getStatusColor(
                              transaction.status
                            )}`}
                          >
                            {transaction.status.charAt(0).toUpperCase() +
                              transaction.status.slice(1)}
                          </span>
                        </div>
                        <button className="p-2 text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-all">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
