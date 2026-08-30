const fs = require('fs');

let content = fs.readFileSync('src/lib/db.ts', 'utf8');

// Find the index of the last legitimate method which was getAllocations
const splitIdx = content.indexOf('async getAllocations() {');
let cleanContent = content.substring(0, splitIdx);

cleanContent += `  async getAllocations() {
    const q = query(collection(db, 'allocations'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as PaymentAllocation));
  },

  async updateBillDetails(id: string, data: Partial<Bill>) {
    const ref = doc(db, 'bills', id);
    // Only allow updating safe fields without breaking allocations
    await updateDoc(ref, {
      ...(data.bill_number && { bill_number: data.bill_number }),
      ...(data.bill_date && { bill_date: data.bill_date }),
      ...(data.notes !== undefined && { notes: data.notes })
    });
  },

  async updatePaymentDetails(id: string, data: Partial<Payment>) {
    const ref = doc(db, 'payments', id);
    await updateDoc(ref, {
      ...(data.payment_date && { payment_date: data.payment_date }),
      ...(data.payment_mode && { payment_mode: data.payment_mode }),
      ...(data.notes !== undefined && { notes: data.notes })
    });
  }
};
`;

fs.writeFileSync('src/lib/db.ts', cleanContent);
