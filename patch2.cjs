const fs = require('fs');

let content = fs.readFileSync('src/pages/Payments.tsx', 'utf8');

// 1. imports
content = content.replace("import { dbService } from '../lib/db';", "import { dbService } from '../lib/db';\nimport { adminDbService } from '../lib/db-admin';");
content = content.replace("import { Plus, Search } from 'lucide-react';", "import { Plus, Search, Trash2, Edit } from 'lucide-react';");

// 2. state
content = content.replace("const [isAddModalOpen, setIsAddModalOpen] = useState(false);", "const [isAddModalOpen, setIsAddModalOpen] = useState(false);\n  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);");

// 3. methods
const methodsToAdd = `
  async function handleEditPayment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingPayment) return;
    const formData = new FormData(e.currentTarget);
    const dateStr = formData.get('payment_date') as string;
    
    await dbService.updatePaymentDetails(editingPayment.id, {
      payment_date: new Date(dateStr).getTime(),
      payment_mode: formData.get('payment_mode') as string,
      notes: formData.get('notes') as string,
    });
    setEditingPayment(null);
    loadData();
  }

  async function handleDeletePayment(id: string) {
    if (!window.confirm("Are you sure you want to delete this payment? It will reverse bill allocations and adjust the party's advance balance.")) return;
    await adminDbService.deletePayment(id);
    loadData();
  }
`;
content = content.replace("if (loading)", methodsToAdd + "\n  if (loading)");

// 4. columns
content = content.replace(`<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Mode</th>`, `<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Mode</th>\n                {profile?.role === 'admin' && <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>}`);

// 5. rows
const actionsCell = `
                    {profile?.role === 'admin' && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => setEditingPayment(payment)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDeletePayment(payment.id)} className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    )}
                  </tr>`;
content = content.replace("</td>\n                  </tr>", "</td>\n" + actionsCell);

// 6. Colspan for empty
content = content.replace("colSpan={4}", "colSpan={profile?.role === 'admin' ? 5 : 4}");

// 7. Modal
const editModal = `
      {editingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-semibold text-slate-900">Edit Payment</h3>
              <button onClick={() => setEditingPayment(null)} className="text-slate-400 hover:text-slate-500">
                &times;
              </button>
            </div>
            <form onSubmit={handleEditPayment} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Payment Date *</label>
                <input required name="payment_date" defaultValue={new Date(editingPayment.payment_date).toISOString().split('T')[0]} type="date" className="mt-1 block w-full rounded-lg border-slate-300 py-2 px-3 text-sm border focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Payment Mode *</label>
                <select required name="payment_mode" defaultValue={editingPayment.payment_mode} className="mt-1 block w-full rounded-lg border-slate-300 py-2 px-3 text-sm border focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white">
                  <option value="bank_transfer">Bank Transfer (NEFT/RTGS/IMPS)</option>
                  <option value="upi">UPI</option>
                  <option value="cheque">Cheque</option>
                  <option value="cash">Cash</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Notes</label>
                <textarea name="notes" defaultValue={editingPayment.notes} rows={2} className="mt-1 block w-full rounded-lg border-slate-300 py-2 px-3 text-sm border focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"></textarea>
              </div>
              <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                Note: Amount and party cannot be edited after creation. To change these, delete the payment and recreate it.
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={() => setEditingPayment(null)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
`;
content = content.replace("    </div>\n  );\n}", editModal + "  );\n}");

fs.writeFileSync('src/pages/Payments.tsx', content);
