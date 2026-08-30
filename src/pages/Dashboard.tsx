import { useEffect, useState } from 'react';
import { dbService } from '../lib/db';
import { Bill, Party, Payment } from '../types';
import { formatCurrency } from '../lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { Users, Receipt, IndianRupee, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, isThisMonth, isToday } from 'date-fns';

export function Dashboard() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [parties, setParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [b, p, pt] = await Promise.all([
          dbService.getBills(),
          dbService.getPayments(),
          dbService.getParties()
        ]);
        setBills(b);
        setPayments(p);
        setParties(pt);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <div className="flex h-full items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  }

  const totalSales = bills.reduce((sum, b) => sum + b.bill_amount, 0);
  const totalReceived = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalOutstanding = bills.reduce((sum, b) => sum + b.outstanding_amount, 0);
  const overdueAmount = bills.filter(b => b.status === 'OVERDUE').reduce((sum, b) => sum + b.outstanding_amount, 0);
  
  const todayCollection = payments.filter(p => isToday(new Date(p.payment_date))).reduce((sum, p) => sum + p.amount, 0);
  const monthSales = bills.filter(b => isThisMonth(new Date(b.bill_date))).reduce((sum, b) => sum + b.bill_amount, 0);
  const monthCollection = payments.filter(p => isThisMonth(new Date(p.payment_date))).reduce((sum, p) => sum + p.amount, 0);

  // Chart data: Monthly Sales vs Collection
  const monthlyDataMap = new Map<string, { name: string, sales: number, collection: number }>();
  
  bills.forEach(b => {
    const month = format(new Date(b.bill_date), 'MMM yyyy');
    if (!monthlyDataMap.has(month)) monthlyDataMap.set(month, { name: month, sales: 0, collection: 0 });
    monthlyDataMap.get(month)!.sales += b.bill_amount;
  });

  payments.forEach(p => {
    const month = format(new Date(p.payment_date), 'MMM yyyy');
    if (!monthlyDataMap.has(month)) monthlyDataMap.set(month, { name: month, sales: 0, collection: 0 });
    monthlyDataMap.get(month)!.collection += p.amount;
  });

  const chartData = Array.from(monthlyDataMap.values()).slice(-6); // last 6 months ideally, for now just what's there

  const stats = [
    { name: 'Total Outstanding', value: formatCurrency(totalOutstanding), icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-100' },
    { name: 'Total Received', value: formatCurrency(totalReceived), icon: IndianRupee, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { name: 'Total Sales', value: formatCurrency(totalSales), icon: Receipt, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { name: 'Overdue Amount', value: formatCurrency(overdueAmount), icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
            <dt>
              <div className={`absolute rounded-xl p-3 ${item.bg}`}>
                <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-slate-500">{item.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-1 sm:pb-2">
              <p className="text-2xl font-semibold text-slate-900">{item.value}</p>
            </dd>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-slate-100 p-6">
          <p className="text-sm font-medium text-slate-500 truncate">Today's Collection</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{formatCurrency(todayCollection)}</p>
        </div>
        <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-slate-100 p-6">
          <p className="text-sm font-medium text-slate-500 truncate">This Month's Sales</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{formatCurrency(monthSales)}</p>
        </div>
        <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-slate-100 p-6">
          <p className="text-sm font-medium text-slate-500 truncate">This Month's Collection</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{formatCurrency(monthCollection)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-medium text-slate-900 mb-6">Sales vs Collection</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B'}} tickFormatter={(val) => `₹${val/1000}k`} />
                <RechartsTooltip cursor={{fill: '#F8FAFC'}} formatter={(value: number) => formatCurrency(value)} />
                <Legend iconType="circle" />
                <Bar dataKey="sales" name="Sales" fill="#818CF8" radius={[4, 4, 0, 0]} barSize={32} />
                <Bar dataKey="collection" name="Collection" fill="#34D399" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-slate-900">Recent Bills</h3>
            <Link to="/bills" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">View all</Link>
          </div>
          <div className="flow-root">
            <ul className="-my-5 divide-y divide-slate-100">
              {bills.slice(0, 5).map((bill) => (
                <li key={bill.id} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {parties.find(p => p.id === bill.party_id)?.party_name || 'Unknown'}
                      </p>
                      <p className="text-sm text-slate-500 truncate">
                        {bill.bill_number} • {format(new Date(bill.bill_date), 'dd MMM yyyy')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">{formatCurrency(bill.bill_amount)}</p>
                      <p className={`text-xs font-medium mt-1 ${
                        bill.status === 'PAID' ? 'text-emerald-600' : 
                        bill.status === 'PARTIALLY PAID' ? 'text-amber-600' : 'text-slate-500'
                      }`}>{bill.status}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
