import React, { useState } from 'react';
import {
  MessageCircle,
  TrendingUp,
  Clock,
  Users,
  Send,
  BarChart3,
  Download,
  Share2,
  Filter,
} from 'lucide-react';

interface MessageStats {
  totalMessages: number;
  deliveredMessages: number;
  failedMessages: number;
  pendingMessages: number;
  averageResponseTime: string;
  uniqueContacts: number;
  successRate: number;
}

interface MessageData {
  id: string;
  recipient: string;
  message: string;
  timestamp: string;
  status: 'delivered' | 'failed' | 'pending';
  amount?: string;
}

const WhatsAppMessageReport: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'delivered' | 'failed' | 'pending'>('all');

  // Sample data - Replace with actual API data
  const stats: MessageStats = {
    totalMessages: 2,847,
    deliveredMessages: 2,654,
    failedMessages: 95,
    pendingMessages: 98,
    averageResponseTime: '2.5 min',
    uniqueContacts: 1,247,
    successRate: 93.2,
  };

  const messageData: MessageData[] = [
    {
      id: '1',
      recipient: 'Ahmed Hassan',
      message: 'Payment reminder: Invoice #2024-001',
      timestamp: '2024-09-02 14:30',
      status: 'delivered',
      amount: '$450.00',
    },
    {
      id: '2',
      recipient: 'Fatima Al-Mansouri',
      message: 'Payment confirmation received',
      timestamp: '2024-09-02 14:15',
      status: 'delivered',
      amount: '$320.50',
    },
    {
      id: '3',
      recipient: 'Mohammed Ali',
      message: 'Outstanding payment due',
      timestamp: '2024-09-02 13:45',
      status: 'failed',
      amount: '$780.00',
    },
    {
      id: '4',
      recipient: 'Sarah Johnson',
      message: 'Invoice payment received',
      timestamp: '2024-09-02 13:20',
      status: 'delivered',
      amount: '$590.25',
    },
    {
      id: '5',
      recipient: 'Omar Khalid',
      message: 'Payment due reminder',
      timestamp: '2024-09-02 12:50',
      status: 'pending',
      amount: '$215.75',
    },
  ];

  const filteredMessages = messageData.filter((msg) => {
    if (selectedFilter === 'all') return true;
    return msg.status === selectedFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return '✓✓';
      case 'failed':
        return '✗';
      case 'pending':
        return '⏳';
      default:
        return '○';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <MessageCircle className="w-10 h-10 text-green-500" />
          <h1 className="text-3xl md:text-4xl font-black text-white">WhatsApp Report</h1>
        </div>
        <p className="text-slate-400 text-sm md:text-base">Payment & Communication Analytics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Messages */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 border border-blue-500/30 shadow-2xl hover:shadow-blue-500/20 transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <Send className="w-6 h-6 text-blue-200" />
            <span className="text-blue-200 text-xs font-bold">TOTAL</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-black text-white mb-1">{stats.totalMessages.toLocaleString()}</h3>
          <p className="text-blue-200 text-sm font-medium">Messages Sent</p>
        </div>

        {/* Delivered Messages */}
        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 border border-green-500/30 shadow-2xl hover:shadow-green-500/20 transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <TrendingUp className="w-6 h-6 text-green-200" />
            <span className="text-green-200 text-xs font-bold">SUCCESS</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-black text-white mb-1">{stats.deliveredMessages.toLocaleString()}</h3>
          <p className="text-green-200 text-sm font-medium">Delivered</p>
        </div>

        {/* Success Rate */}
        <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-6 border border-purple-500/30 shadow-2xl hover:shadow-purple-500/20 transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <BarChart3 className="w-6 h-6 text-purple-200" />
            <span className="text-purple-200 text-xs font-bold">RATE</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-black text-white mb-1">{stats.successRate}%</h3>
          <p className="text-purple-200 text-sm font-medium">Success Rate</p>
        </div>

        {/* Avg Response Time */}
        <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl p-6 border border-orange-500/30 shadow-2xl hover:shadow-orange-500/20 transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <Clock className="w-6 h-6 text-orange-200" />
            <span className="text-orange-200 text-xs font-bold">TIMING</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-black text-white mb-1">{stats.averageResponseTime}</h3>
          <p className="text-orange-200 text-sm font-medium">Avg Response</p>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {/* Failed Messages */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-red-500/50 transition-colors">
          <p className="text-slate-400 text-xs font-bold uppercase mb-2">Failed</p>
          <h4 className="text-2xl font-black text-red-400">{stats.failedMessages}</h4>
        </div>

        {/* Pending Messages */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-yellow-500/50 transition-colors">
          <p className="text-slate-400 text-xs font-bold uppercase mb-2">Pending</p>
          <h4 className="text-2xl font-black text-yellow-400">{stats.pendingMessages}</h4>
        </div>

        {/* Unique Contacts */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-cyan-500/50 transition-colors">
          <p className="text-slate-400 text-xs font-bold uppercase mb-2">Contacts</p>
          <h4 className="text-2xl font-black text-cyan-400">{stats.uniqueContacts.toLocaleString()}</h4>
        </div>
      </div>

      {/* Messages Section */}
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 shadow-2xl">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-black text-white mb-1">Recent Messages</h2>
            <p className="text-slate-400 text-sm">Real-time payment communication updates</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {(['all', 'delivered', 'failed', 'pending'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${
                selectedFilter === filter
                  ? 'bg-green-600 text-white shadow-lg shadow-green-600/50'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <Filter className="w-4 h-4 inline mr-2" />
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        {/* Messages List */}
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              className="bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-xl p-4 transition-all hover:shadow-lg"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Left Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-white text-sm md:text-base truncate">
                        {message.recipient}
                      </h4>
                      <p className="text-slate-400 text-xs md:text-sm truncate">
                        {message.message}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Content */}
                <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                  {/* Amount */}
                  {message.amount && (
                    <div className="text-right md:text-left">
                      <p className="text-lg md:text-xl font-black text-emerald-400">
                        {message.amount}
                      </p>
                    </div>
                  )}

                  {/* Timestamp */}
                  <div className="text-right md:text-left">
                    <p className="text-slate-400 text-xs md:text-sm font-medium">
                      {message.timestamp}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border font-bold text-sm ${getStatusColor(message.status)} w-fit md:w-auto`}>
                    <span className="text-base">{getStatusIcon(message.status)}</span>
                    <span className="capitalize text-xs md:text-sm">
                      {message.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMessages.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-slate-600 mx-auto mb-4 opacity-50" />
            <p className="text-slate-400 font-semibold">No messages found</p>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="mt-8 text-center">
        <p className="text-slate-500 text-xs md:text-sm font-medium">
          Last updated: Today at 2:45 PM • Data refreshes every 5 minutes
        </p>
      </div>
    </div>
  );
};

export default WhatsAppMessageReport;