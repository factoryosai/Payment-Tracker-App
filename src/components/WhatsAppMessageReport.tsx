import React, { useState, useRef } from 'react';
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
  Loader,
  AlertCircle,
  CheckCircle,
  Copy,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [copied, setCopied] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const stats: MessageStats = {
    totalMessages: 2847,
    deliveredMessages: 2654,
    failedMessages: 95,
    pendingMessages: 98,
    averageResponseTime: '2.5 min',
    uniqueContacts: 1247,
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

  // Generate PDF Report
  const handleGeneratePDF = async () => {
    try {
      setIsGeneratingPDF(true);
      setErrorMessage('');

      if (!reportRef.current) {
        throw new Error('Report element not found');
      }

      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pdf = new jsPDF('p', 'mm', 'a4');

      let heightLeft = imgHeight;
      let position = 0;

      const pageHeight = 277;
      const imgData = canvas.toDataURL('image/png');

      while (heightLeft > 0) {
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        if (heightLeft > 0) {
          pdf.addPage();
          position = -pageHeight;
        }
      }

      pdf.save(`WhatsApp-Report-${new Date().toISOString().split('T')[0]}.pdf`);

      setSuccessMessage('✅ PDF downloaded successfully! 📄');
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to generate PDF';
      setErrorMessage(`❌ Error: ${errorMsg}`);
      console.error('PDF Generation Error:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Open WhatsApp Web with phone number and message
  const handleOpenWhatsAppWeb = () => {
    try {
      setErrorMessage('');

      if (!phoneNumber.trim()) {
        setErrorMessage('❌ Please enter a phone number');
        return;
      }

      // Format phone number for WhatsApp
      const cleaned = phoneNumber.replace(/\D/g, '');
      let formattedPhone = cleaned;

      if (cleaned.length === 10) {
        formattedPhone = `1${cleaned}`; // Add US country code
      }

      // Create WhatsApp message with report summary
      const reportSummary = `
📊 *WhatsApp Message Report*

Total Messages: *${stats.totalMessages.toLocaleString()}*
Delivered: *${stats.deliveredMessages.toLocaleString()}*
Success Rate: *${stats.successRate}%*
Failed: *${stats.failedMessages}*
Pending: *${stats.pendingMessages}*

Average Response Time: *${stats.averageResponseTime}*
Unique Contacts: *${stats.uniqueContacts.toLocaleString()}*

Generated: ${new Date().toLocaleString()}

📥 Download PDF for detailed breakdown
      `.trim();

      // Encode message for URL
      const encodedMessage = encodeURIComponent(reportSummary);

      // Open WhatsApp Web
      const whatsappURL = `https://web.whatsapp.com/send/?phone=${formattedPhone}&text=${encodedMessage}`;
      window.open(whatsappURL, '_blank');

      setSuccessMessage('✅ WhatsApp opened! Send the message manually 📱');
      setShowSuccessMessage(true);
      setPhoneNumber('');
      setShowPhoneInput(false);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to open WhatsApp';
      setErrorMessage(`❌ Error: ${errorMsg}`);
      console.error('WhatsApp Open Error:', error);
    }
  };

  // Open WhatsApp Desktop App
  const handleOpenWhatsAppDesktop = () => {
    try {
      setErrorMessage('');

      if (!phoneNumber.trim()) {
        setErrorMessage('❌ Please enter a phone number');
        return;
      }

      // Format phone number
      const cleaned = phoneNumber.replace(/\D/g, '');
      let formattedPhone = cleaned;

      if (cleaned.length === 10) {
        formattedPhone = `1${cleaned}`;
      }

      // Open WhatsApp Desktop
      const whatsappURL = `whatsapp://send?phone=${formattedPhone}`;
      window.location.href = whatsappURL;

      setSuccessMessage('✅ Opening WhatsApp Desktop... 📱');
      setShowSuccessMessage(true);
      setPhoneNumber('');
      setShowPhoneInput(false);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to open WhatsApp';
      setErrorMessage(`❌ Error: ${errorMsg}`);
    }
  };

  // Copy report text to clipboard
  const handleCopyReportText = async () => {
    try {
      const reportSummary = `
📊 WhatsApp Message Report

Total Messages: ${stats.totalMessages.toLocaleString()}
Delivered: ${stats.deliveredMessages.toLocaleString()}
Success Rate: ${stats.successRate}%
Failed: ${stats.failedMessages}
Pending: ${stats.pendingMessages}

Average Response Time: ${stats.averageResponseTime}
Unique Contacts: ${stats.uniqueContacts.toLocaleString()}

Generated: ${new Date().toLocaleString()}

Download PDF for detailed breakdown
      `.trim();

      await navigator.clipboard.writeText(reportSummary);

      setCopied(true);
      setSuccessMessage('✅ Report text copied to clipboard! 📋');
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        setCopied(false);
      }, 2000);
    } catch (error) {
      setErrorMessage('❌ Failed to copy text');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-bounce">
          <CheckCircle className="w-5 h-5" />
          <p className="font-bold">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50">
          <AlertCircle className="w-5 h-5" />
          <p className="font-bold">{errorMessage}</p>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <MessageCircle className="w-10 h-10 text-green-500" />
          <h1 className="text-3xl md:text-4xl font-black text-white">WhatsApp Report</h1>
        </div>
        <p className="text-slate-400 text-sm md:text-base">Payment & Communication Analytics</p>
      </div>

      {/* Phone Input Modal */}
      {showPhoneInput && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-black text-slate-900 mb-4">📱 Send Report via WhatsApp</h3>
            <p className="text-slate-600 text-sm mb-4">Enter the phone number to send the report</p>

            <input
              type="tel"
              placeholder="+1 (234) 567-8900"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-green-500 mb-4 font-medium"
            />

            <p className="text-xs text-slate-500 mb-6">
              Format: +1234567890 or 1234567890 (US numbers automatically formatted)
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleOpenWhatsAppWeb}
                className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-lg hover:from-green-700 hover:to-green-800 transition flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Open WhatsApp Web
              </button>

              <button
                onClick={handleOpenWhatsAppDesktop}
                className="w-full px-4 py-3 bg-gradient-to-r from-green-700 to-green-800 text-white font-bold rounded-lg hover:from-green-800 hover:to-green-900 transition flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Open WhatsApp Desktop
              </button>

              <button
                onClick={() => {
                  setShowPhoneInput(false);
                  setPhoneNumber('');
                  setErrorMessage('');
                }}
                className="w-full px-4 py-3 bg-slate-200 text-slate-900 font-bold rounded-lg hover:bg-slate-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Content - Ref for PDF/Screenshot */}
      <div ref={reportRef} className="bg-white rounded-2xl p-8 mb-8 shadow-2xl">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Messages */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 border border-blue-500/30 shadow-lg text-white">
            <div className="flex items-center justify-between mb-3">
              <Send className="w-6 h-6 text-blue-200" />
              <span className="text-blue-200 text-xs font-bold">TOTAL</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-white mb-1">{stats.totalMessages.toLocaleString()}</h3>
            <p className="text-blue-200 text-sm font-medium">Messages Sent</p>
          </div>

          {/* Delivered Messages */}
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 border border-green-500/30 shadow-lg text-white">
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="w-6 h-6 text-green-200" />
              <span className="text-green-200 text-xs font-bold">SUCCESS</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-white mb-1">{stats.deliveredMessages.toLocaleString()}</h3>
            <p className="text-green-200 text-sm font-medium">Delivered</p>
          </div>

          {/* Success Rate */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-6 border border-purple-500/30 shadow-lg text-white">
            <div className="flex items-center justify-between mb-3">
              <BarChart3 className="w-6 h-6 text-purple-200" />
              <span className="text-purple-200 text-xs font-bold">RATE</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-white mb-1">{stats.successRate}%</h3>
            <p className="text-purple-200 text-sm font-medium">Success Rate</p>
          </div>

          {/* Avg Response Time */}
          <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl p-6 border border-orange-500/30 shadow-lg text-white">
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
          <div className="bg-slate-100 border border-slate-300 rounded-xl p-4">
            <p className="text-slate-600 text-xs font-bold uppercase mb-2">Failed</p>
            <h4 className="text-2xl font-black text-red-600">{stats.failedMessages}</h4>
          </div>

          <div className="bg-slate-100 border border-slate-300 rounded-xl p-4">
            <p className="text-slate-600 text-xs font-bold uppercase mb-2">Pending</p>
            <h4 className="text-2xl font-black text-yellow-600">{stats.pendingMessages}</h4>
          </div>

          <div className="bg-slate-100 border border-slate-300 rounded-xl p-4">
            <p className="text-slate-600 text-xs font-bold uppercase mb-2">Contacts</p>
            <h4 className="text-2xl font-black text-cyan-600">{stats.uniqueContacts.toLocaleString()}</h4>
          </div>
        </div>

        {/* Messages List */}
        <div className="space-y-3">
          <h3 className="text-lg font-black text-slate-900 mb-4">Recent Messages</h3>
          {filteredMessages.slice(0, 5).map((message) => (
            <div
              key={message.id}
              className="bg-slate-100 border border-slate-300 rounded-xl p-4"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 text-sm md:text-base">
                    {message.recipient}
                  </h4>
                  <p className="text-slate-600 text-xs md:text-sm truncate">
                    {message.message}
                  </p>
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                  {message.amount && (
                    <div className="text-right md:text-left">
                      <p className="text-lg md:text-xl font-black text-emerald-600">
                        {message.amount}
                      </p>
                    </div>
                  )}

                  <div className="text-right md:text-left">
                    <p className="text-slate-600 text-xs md:text-sm font-medium">
                      {message.timestamp}
                    </p>
                  </div>

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

        {/* Footer */}
        <div className="mt-8 pt-8 border-t border-slate-300 text-center">
          <p className="text-slate-600 text-xs md:text-sm font-medium">
            Report Generated: {new Date().toLocaleString()}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <button
          onClick={handleGeneratePDF}
          disabled={isGeneratingPDF}
          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-4 rounded-lg font-bold text-sm md:text-base transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isGeneratingPDF ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              📥 Download PDF
            </>
          )}
        </button>

        <button
          onClick={() => setShowPhoneInput(true)}
          className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-4 rounded-lg font-bold text-sm md:text-base transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          <Share2 className="w-5 h-5" />
          📱 Send via WhatsApp
        </button>

        <button
          onClick={handleCopyReportText}
          className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-4 rounded-lg font-bold text-sm md:text-base transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          <Copy className="w-5 h-5" />
          📋 Copy Text
        </button>
      </div>

      {/* Footer Info */}
      <div className="text-center">
        <p className="text-slate-400 text-xs md:text-sm font-medium">
          ✅ Download PDF • 📱 Open WhatsApp Web/Desktop • 📋 Copy & Paste • No slides required
        </p>
      </div>
    </div>
  );
};

export default WhatsAppMessageReport;
