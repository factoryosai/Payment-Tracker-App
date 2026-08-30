const fs = require('fs');
let content = fs.readFileSync('src/lib/db.ts', 'utf8');

const replacement = `  // FIFO Payment Processing
  async addPayment(paymentData: Omit<Payment, 'id' | 'created_at'>) {
    const newPaymentRef = doc(collection(db, 'payments'));
    const paymentId = newPaymentRef.id;
    
    await runTransaction(db, async (transaction) => {
      // 1. Fetch all unpaid bills for this party
      const partyBillsQuery = query(collection(db, 'bills'), where('party_id', '==', paymentData.party_id));
      const partyBillsSnap = await getDocs(partyBillsQuery); 
      
      let bills = partyBillsSnap.docs.map(d => d.data() as Bill)
        .filter(b => b.status !== 'PAID');
      
      // Perform allocation logic
      const { updatedBills, remainingAdvance } = allocatePaymentFIFO(
        paymentData.amount,
        bills,
        paymentData.payment_date
      );

      // --- 1. PERFORM ALL READS ---
      // Read all bills involved
      const currentBillsData: Record<string, Bill> = {};
      for (const updatedBill of updatedBills) {
        const billRef = doc(db, 'bills', updatedBill.id);
        const billSnap = await transaction.get(billRef);
        currentBillsData[updatedBill.id] = billSnap.data() as Bill;
      }

      // Read party if we have remaining advance
      let currentPartyData: Party | null = null;
      const partyRef = doc(db, 'parties', paymentData.party_id);
      if (remainingAdvance > 0) {
        const partySnap = await transaction.get(partyRef);
        currentPartyData = partySnap.data() as Party;
      }

      // --- 2. PERFORM ALL WRITES ---
      for (const updatedBill of updatedBills) {
        const currentBill = currentBillsData[updatedBill.id];
        
        // Safety check if the bill was paid while we were allocating
        if (currentBill && currentBill.status === 'PAID') {
           throw new Error(\`Bill \${updatedBill.bill_number} was modified concurrently.\`);
        }
        
        const { _allocAmount, ...billDataToSave } = updatedBill;
        const billRef = doc(db, 'bills', updatedBill.id);
        
        transaction.update(billRef, {
          paid_amount: billDataToSave.paid_amount,
          outstanding_amount: billDataToSave.outstanding_amount,
          status: billDataToSave.status,
          fully_paid_date: billDataToSave.fully_paid_date
        });

        const allocRef = doc(collection(db, 'allocations'));
        transaction.set(allocRef, {
          id: allocRef.id,
          payment_id: paymentId,
          bill_id: updatedBill.id,
          allocated_amount: _allocAmount,
          allocation_date: paymentData.payment_date
        } as PaymentAllocation);
      }

      // If remaining payment, add to party advance
      if (remainingAdvance > 0 && currentPartyData) {
        transaction.update(partyRef, {
          advance_balance: (currentPartyData.advance_balance || 0) + remainingAdvance
        });
      }

      // Save payment record
      const payment: Payment = {
        ...paymentData,
        id: paymentId,
        created_at: Date.now()
      };
      transaction.set(newPaymentRef, payment);
    });
  },`;

// We need to replace the `addPayment` block in db.ts. 
// A simple way is to use regex or string replace.
content = content.replace(/async addPayment\(paymentData: Omit<Payment, 'id' \| 'created_at'>\) \{[\s\S]*?async getPayments\(\) \{/, replacement + "\n\n  async getPayments() {");

fs.writeFileSync('src/lib/db.ts', content);
