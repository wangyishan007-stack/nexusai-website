import SettingsLayout from "../components/SettingsLayout";

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

export default function CreditsPage() {
  return (
    <SettingsLayout activeTab="credits">
      <div className="flex-1 p-10 max-w-6xl w-full mx-auto">
        {/* Page Title */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold font-headline tracking-tight mb-2">Credits</h2>
            <p className="text-on-surface-variant text-sm">
              Manage your credit balance, add funds, and review transaction history.
            </p>
          </div>
          <button className="px-6 py-2.5 bg-primary text-white font-semibold rounded-lg text-sm shadow-sm hover:opacity-90 transition-opacity flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Credits
          </button>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/15">
            <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-2">
              Available Balance
            </p>
            <h3 className="text-3xl font-bold font-headline text-primary">$127.46</h3>
            <p className="text-xs text-on-surface-variant mt-2">≈ 4.2M tokens at current rates</p>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/15">
            <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-2">
              This Month Spent
            </p>
            <h3 className="text-3xl font-bold font-headline">$50.76</h3>
            <div className="mt-3 w-full bg-surface-container-high rounded-full h-1.5">
              <div className="bg-primary h-1.5 rounded-full" style={{ width: "40%" }} />
            </div>
            <p className="text-xs text-on-surface-variant mt-2">40% of monthly budget ($125)</p>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/15">
            <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-2">
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
        <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/15 mb-8">
          <h4 className="font-headline font-bold text-lg mb-4">Volume Discounts</h4>
          <div className="grid grid-cols-4 gap-4">
            {CREDIT_TIERS.map((tier) => (
              <div
                key={tier.range}
                className={`p-4 rounded-lg border text-center ${
                  tier.rate === "1.10×"
                    ? "border-primary bg-primary-container/5"
                    : "border-outline-variant/15 bg-white"
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

        {/* Transaction History */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/15">
          <div className="flex justify-between items-center p-6 border-b border-outline-variant/10">
            <h4 className="font-headline font-bold text-lg">Transaction History</h4>
            <button className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">download</span>
              Export CSV
            </button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-outline-variant/10 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                <th className="text-left px-6 py-3">Date</th>
                <th className="text-left px-6 py-3">Type</th>
                <th className="text-right px-6 py-3">Amount</th>
                <th className="text-right px-6 py-3">Balance</th>
                <th className="text-right px-6 py-3">Method</th>
              </tr>
            </thead>
            <tbody>
              {TRANSACTIONS.map((tx, i) => (
                <tr key={i} className="border-b border-outline-variant/5 hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-6 py-4 text-on-surface-variant">{tx.date}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold ${
                        tx.type === "Top-up"
                          ? "bg-emerald-50 text-emerald-700"
                          : tx.type === "Bonus"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {tx.type}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-mono font-medium ${tx.amount.startsWith("+") ? "text-emerald-600" : "text-on-surface"}`}>
                    {tx.amount}
                  </td>
                  <td className="px-6 py-4 text-right font-mono">{tx.balance}</td>
                  <td className="px-6 py-4 text-right text-on-surface-variant">{tx.method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SettingsLayout>
  );
}
