const fs = require('fs');

let content = fs.readFileSync('src/pages/PartyLedger.tsx', 'utf8');

// 1. thead updates
content = content.replace('<th className="px-6 py-3 font-medium">Date</th>', '<th className="px-2 py-2 font-medium">Date & Ref</th>');
content = content.replace('<th className="px-6 py-3 font-medium">Particulars (Bill / Ref)</th>\n', '');
// other headers padding
content = content.replace(/px-6 py-3 font-medium text-right/g, 'px-2 py-2 font-medium text-right');
content = content.replace(/px-6 py-3 font-medium text-center/g, 'px-2 py-2 font-medium text-center');

// 2. cells
content = content.replace(/px-6 py-4/g, 'px-2 py-2');
content = content.replace(/text-sm/g, 'text-xs');

// Now Date cell needs to incorporate the ref
const dateCellStr = `                    <td className="px-2 py-2 text-xs font-medium text-slate-700">
                      {formatDate(entry.date)}
                    </td>
                    <td className="px-2 py-2 text-xs font-medium text-slate-700">
                      <div className="flex items-center gap-2">
                        {isBill ? <ReceiptText className="h-4 w-4 text-indigo-400"/> : <Banknote className="h-4 w-4 text-emerald-400"/>}
                        {entry.ref}
                      </div>
                    </td>`;

const newDateCell = `                    <td className="px-2 py-2 text-xs font-medium text-slate-700">
                      <div className="flex flex-col">
                        <span>{formatDate(entry.date)}</span>
                        <div className="flex items-center gap-1 text-slate-500 mt-0.5">
                          {isBill ? <ReceiptText className="h-3 w-3"/> : <Banknote className="h-3 w-3"/>}
                          <span className="truncate max-w-[80px] sm:max-w-[120px]">{entry.ref}</span>
                        </div>
                      </div>
                    </td>`;

content = content.replace(dateCellStr, newDateCell);

// colSpan fix
content = content.replace('colSpan={6}', 'colSpan={5}');
content = content.replace('colSpan={2}', 'colSpan={1}');

// also, font sizes were reduced to text-xs, let's make sure totals row is text-xs but bold
content = content.replace(/px-2 py-2 font-bold text-slate-700 text-xs text-right/g, 'px-2 py-2 font-bold text-slate-700 text-xs text-right'); // Should naturally match

fs.writeFileSync('src/pages/PartyLedger.tsx', content);
