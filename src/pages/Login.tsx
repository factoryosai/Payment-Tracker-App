import React from 'react';
import { useAuth } from '../lib/auth';
import { UserCog, User } from 'lucide-react';

export function Login() {
  const { loginAs } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
            Payment & Sales Tracker
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Select a role to enter the application.
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <button
            onClick={() => loginAs('admin')}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <UserCog className="h-5 w-5 text-indigo-300 group-hover:text-indigo-200" />
            </span>
            Login as Admin
          </button>
          
          <button
            onClick={() => loginAs('user')}
            className="group relative w-full flex justify-center py-3 px-4 border border-slate-300 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <User className="h-5 w-5 text-slate-400 group-hover:text-slate-500" />
            </span>
            Login as User
          </button>
        </div>
      </div>
    </div>
  );
}
