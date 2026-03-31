import { useState } from "react";
import SettingsLayout from "../components/SettingsLayout";

const PRESET_AMOUNTS = [10, 25, 50, 100, 250, 500];

const CREDIT_TIERS = [
  { range: "$0 – $100", rate: "1×", description: "Standard rate" },
  { range: "$100 – $500", rate: "1.05×", description: "5% bonus credits" },
  { range: "$500 – $2,000", rate: "1.10×", description: "10% bonus credits" },
  { range: "$2,000+", rate: "1.15×", description: "15% bonus credits" },
];

const TRANSACTIONS = [
  { date: "Mar 28, 2026", type: "Top-up", amount: "+$50.00", balance: "$127.46", method: "Visa ••4242" },
  { date: "Mar 25, 2026", type: "Usage", amount: "-$12.54", balance: "$77.46", method: "Auto-deduct" },
  { date: "Mar 20, 2026", type: "Top-up", amount: "+$100.00", balance: "$90.00", method: "Visa ••4242" },
  { date: "Mar 14, 2026", type: "Usage", amount: "-$38.22", balance: "$-10.00", method: "Auto-deduct" },
  { date: "Mar 10, 2026", type: "Bonus", amount: "+$5.00", balance: "$28.22", method: "Loyalty reward" },
  { date: "Mar 01, 2026", type: "Top-up", amount: "+$50.00", balance: "$23.22", method: "Visa ••4242" },
];

function getBonusRate(amount: number) {
  if (amount >= 2000) return { rate: "1.15×", bonus: 0.15 };
  if (amount >= 500) return { rate: "1.10×", bonus: 0.10 };
  if (amount >= 100) return { rate: "1.05×", bonus: 0.05 };
  return { rate: "1×", bonus: 0 };
}

export default function CreditsPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState("");
  const [useCustom, setUseCustom] = useState(false);

  const activeAmount = useCustom ? (Number(customAmount) || 0) : selectedAmount;
  const { rate, bonus } = getBonusRate(activeAmount);
  const bonusValue = activeAmount * bonus;
  const totalCredits = activeAmount + bonusValue;

  return (
    <SettingsLayout activeTab="credits">
      <div className="flex-1 p-4 sm:p-6 md:p-10 max-w-6xl w-full mx-auto">
        {/* Page Title */}
        <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-headline tracking-tight mb-2">Credits</h2>
            <p className="text-on-surface-variant text-sm">
              Manage your credit balance, add funds, and review transaction history.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 bg-primary text-white font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity flex items-center gap-2 w-fit"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Credits
          </button>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <div className="bg-surface-container-lowest rounded-xl p-5 sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
              Available Balance
            </p>
            <h3 className="text-3xl font-bold font-headline text-primary">$127.46</h3>
            <p className="text-xs text-on-surface-variant mt-2">≈ 4.2M tokens at current rates</p>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-5 sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
              This Month Spent
            </p>
            <h3 className="text-3xl font-bold font-headline">$50.76</h3>
            <div className="mt-3 w-full bg-surface-container rounded-full h-1.5">
              <div className="bg-primary h-1.5 rounded-full" style={{ width: "40%" }} />
            </div>
            <p className="text-xs text-on-surface-variant mt-2">40% of monthly budget ($125)</p>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-5 sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
              Auto-Refill
            </p>
            <div className="flex items-center gap-3 mt-1">
              <div className="w-10 h-5 bg-primary rounded-full relative">
                <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm" />
              </div>
              <span className="text-sm font-medium">Enabled</span>
            </div>
            <p className="text-xs text-on-surface-variant mt-3">
              Refill $50 when balance drops below $10
            </p>
          </div>
        </div>

        {/* Volume Discount Tiers */}
        <div className="bg-surface-container-lowest rounded-xl p-5 sm:p-6 mb-8">
          <h4 className="font-headline font-bold text-lg mb-4">Volume Discounts</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {CREDIT_TIERS.map((tier) => (
              <div
                key={tier.range}
                className={`p-4 rounded-lg text-center ${
                  tier.rate === "1.10×"
                    ? "bg-primary/5 ring-1 ring-primary/30"
                    : "bg-surface-container"
                }`}
              >
                {tier.rate === "1.10×" && (
                  <span className="text-[9px] font-bold uppercase tracking-widest text-primary mb-2 block">
                    Current Tier
                  </span>
                )}
                <p className="text-xl font-bold font-headline text-primary">{tier.rate}</p>
                <p className="text-sm font-medium mt-1">{tier.range}</p>
                <p className="text-xs text-on-surface-variant mt-1">{tier.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction History - Desktop */}
        <div className="hidden md:block bg-surface-container-lowest rounded-xl overflow-hidden">
          <div className="flex justify-between items-center px-5 py-4 border-b border-outline-variant/10">
            <h4 className="font-headline font-bold text-lg">Transaction History</h4>
            <button className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">download</span>
              Export CSV
            </button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                <th className="text-left px-5 py-3.5">Date</th>
                <th className="text-left px-5 py-3.5">Type</th>
                <th className="text-right px-5 py-3.5">Amount</th>
                <th className="text-right px-5 py-3.5">Balance</th>
                <th className="text-right px-5 py-3.5">Method</th>
              </tr>
            </thead>
            <tbody>
              {TRANSACTIONS.map((tx, i) => (
                <tr key={i} className="border-t border-outline-variant/10 hover:bg-surface-container/40 transition-colors">
                  <td className="px-5 py-3.5 text-xs text-on-surface-variant font-medium">{tx.date}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        tx.type === "Top-up"
                          ? "bg-emerald-50 text-emerald-700"
                          : tx.type === "Bonus"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-surface-container text-on-surface-variant"
                      }`}
                    >
                      {tx.type}
                    </span>
                  </td>
                  <td className={`px-5 py-3.5 text-right text-xs font-medium tabular-nums ${tx.amount.startsWith("+") ? "text-emerald-600" : "text-on-surface"}`}>
                    {tx.amount}
                  </td>
                  <td className="px-5 py-3.5 text-right text-xs tabular-nums">{tx.balance}</td>
                  <td className="px-5 py-3.5 text-right text-xs text-on-surface-variant">{tx.method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Transaction History - Mobile */}
        <div className="md:hidden">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-headline font-bold text-lg">Transaction History</h4>
            <button className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">download</span>
              Export
            </button>
          </div>
          <div className="space-y-3">
            {TRANSACTIONS.map((tx, i) => (
              <div key={i} className="bg-surface-container-lowest rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      tx.type === "Top-up"
                        ? "bg-emerald-50 text-emerald-700"
                        : tx.type === "Bonus"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-surface-container text-on-surface-variant"
                    }`}
                  >
                    {tx.type}
                  </span>
                  <span className={`text-sm font-medium tabular-nums ${tx.amount.startsWith("+") ? "text-emerald-600" : "text-on-surface"}`}>
                    {tx.amount}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-on-surface-variant">
                  <span>{tx.date}</span>
                  <span>{tx.method}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Credits Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/10">
              <h3 className="font-headline font-bold text-lg">Add Credits</h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-6">
              {/* Preset Amounts */}
              <div>
                <p className="text-sm font-medium text-on-surface mb-3">Select amount</p>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => { setSelectedAmount(amt); setUseCustom(false); }}
                      className={`py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                        !useCustom && selectedAmount === amt
                          ? "bg-primary text-white"
                          : "bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div>
                <p className="text-sm font-medium text-on-surface mb-2">Or enter custom amount</p>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm font-medium">$</span>
                  <input
                    type="number"
                    min="1"
                    placeholder="0.00"
                    value={customAmount}
                    onFocus={() => setUseCustom(true)}
                    onChange={(e) => { setCustomAmount(e.target.value); setUseCustom(true); }}
                    className="w-full pl-8 pr-4 py-2.5 bg-surface-container-lowest rounded-lg text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all border border-outline-variant/10"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <p className="text-sm font-medium text-on-surface mb-2">Payment method</p>
                <div className="flex items-center gap-3 bg-surface-container rounded-lg px-4 py-3">
                  <span className="material-symbols-outlined text-on-surface-variant text-xl">credit_card</span>
                  <span className="text-sm font-medium">Visa ending in 4242</span>
                  <button className="ml-auto text-xs text-primary font-semibold hover:underline">Change</button>
                </div>
              </div>

              {/* Summary */}
              {activeAmount > 0 && (
                <div className="bg-surface-container/50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Amount</span>
                    <span className="font-medium">${activeAmount.toFixed(2)}</span>
                  </div>
                  {bonus > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-on-surface-variant">Bonus ({rate})</span>
                      <span className="font-medium text-emerald-600">+${bonusValue.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm pt-2 border-t border-outline-variant/10">
                    <span className="font-semibold">Total credits</span>
                    <span className="font-bold text-primary">${totalCredits.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-outline-variant/10 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 bg-surface-container text-on-surface-variant font-semibold rounded-lg text-sm hover:bg-surface-container-high transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={activeAmount <= 0}
                className="flex-1 py-2.5 bg-primary text-white font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Pay ${activeAmount > 0 ? activeAmount.toFixed(2) : "0.00"}
              </button>
            </div>
          </div>
        </div>
      )}
    </SettingsLayout>
  );
}
