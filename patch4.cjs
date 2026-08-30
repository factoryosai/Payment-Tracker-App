const fs = require('fs');

let content = fs.readFileSync('src/pages/PartyLedger.tsx', 'utf8');

// Shorten headers for mobile
content = content.replace('<th className="px-2 py-2 font-medium">Date & Ref</th>', '<th className="px-2 py-2 font-medium">Date/Ref</th>');
content = content.replace('<th className="px-2 py-2 font-medium text-right">Bill Amount</th>', '<th className="px-2 py-2 font-medium text-right">Bill(₹)</th>');
content = content.replace('<th className="px-2 py-2 font-medium text-right">Received Amount</th>', '<th className="px-2 py-2 font-medium text-right">Recvd(₹)</th>');
content = content.replace('<th className="px-2 py-2 font-medium text-right">Pending Amount</th>', '<th className="px-2 py-2 font-medium text-right">Balance(₹)</th>');
content = content.replace('<th className="px-2 py-2 font-medium text-center">Due Days</th>', '<th className="px-2 py-2 font-medium text-center">Due</th>');

// Also shorten the table footer
content = content.replace('<td colSpan={1} className="px-2 py-2 font-bold text-slate-700 text-right text-xs">Totals</td>', '<td colSpan={1} className="px-2 py-2 font-bold text-slate-700 text-left text-xs">Total</td>');


fs.writeFileSync('src/pages/PartyLedger.tsx', content);
