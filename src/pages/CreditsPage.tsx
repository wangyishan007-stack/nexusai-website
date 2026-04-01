import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import SettingsLayout from "../components/SettingsLayout";
import { useAuth } from "../hooks/useAuth";

const PRESET_AMOUNTS = [10, 25, 50, 100, 250, 500];

const NETWORKS = [
  { id: "ethereum", label: "Ethereum", icon: "currency_exchange" },
  { id: "base", label: "Base", icon: "hub" },
] as const;

const TOKENS = [
  { id: "USDC", label: "USDC", decimals: 6 },
  { id: "USDT", label: "USDT", decimals: 6 },
  { id: "ETH", label: "ETH", decimals: 18 },
] as const;

const DEPOSIT_ADDRESS = "0x1a2B3c4D5e6F7890AbCdEf1234567890aBcDeF12";

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
  const { t } = useTranslation();
  const { walletAddress } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [autoRefill, setAutoRefill] = useState(true);
  const [txPage, setTxPage] = useState(1);
  const [exportDone, setExportDone] = useState(false);
  const [paymentTab, setPaymentTab] = useState<"card" | "crypto">("card");
  const [selectedNetwork, setSelectedNetwork] = useState<"ethereum" | "base">("ethereum");
  const [selectedToken, setSelectedToken] = useState<"USDC" | "USDT" | "ETH">("USDC");
  const [copied, setCopied] = useState(false);
  const [cryptoSending, setCryptoSending] = useState(false);
  const [cryptoSent, setCryptoSent] = useState(false);

  const handleCopyAddress = useCallback(() => {
    navigator.clipboard.writeText(DEPOSIT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const handleCryptoSend = useCallback(() => {
    setCryptoSending(true);
    setTimeout(() => {
      setCryptoSending(false);
      setCryptoSent(true);
      setTimeout(() => setCryptoSent(false), 3000);
    }, 2000);
  }, []);

  const txPerPage = 4;
  const txTotalPages = Math.max(1, Math.ceil(TRANSACTIONS.length / txPerPage));
  const paginatedTx = TRANSACTIONS.slice((txPage - 1) * txPerPage, txPage * txPerPage);

  const handleExport = () => {
    setExportDone(true);
    setTimeout(() => setExportDone(false), 2000);
  };

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
            <h2 className="text-2xl sm:text-3xl font-bold font-headline tracking-tight mb-2">{t("credits.title")}</h2>
            <p className="text-on-surface-variant text-sm">
              {t("credits.subtitle")}
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 bg-primary text-on-primary font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity flex items-center gap-2 w-fit"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
            {t("credits.add_credits")}
          </button>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <div className="bg-surface-container-lowest rounded-xl p-5 sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
              {t("credits.available_balance")}
            </p>
            <h3 className="text-3xl font-bold font-headline text-primary">$127.46</h3>
            <p className="text-xs text-on-surface-variant mt-2">≈ 4.2M tokens at current rates</p>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-5 sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
              {t("credits.this_month_spent")}
            </p>
            <h3 className="text-3xl font-bold font-headline">$50.76</h3>
            <div className="mt-3 w-full bg-surface-container rounded-full h-1.5">
              <div className="bg-primary h-1.5 rounded-full" style={{ width: "40%" }} />
            </div>
            <p className="text-xs text-on-surface-variant mt-2">40% of monthly budget ($125)</p>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-5 sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
              {t("credits.auto_refill")}
            </p>
            <div className="flex items-center gap-3 mt-1">
              <label className="relative inline-block w-11 h-6 cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={autoRefill}
                  onChange={() => setAutoRefill((v) => !v)}
                />
                <div className="w-11 h-6 bg-surface-container-highest rounded-full peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
              </label>
              <span className="text-sm font-medium">{autoRefill ? t("credits.enabled") : t("credits.disabled")}</span>
            </div>
            <p className="text-xs text-on-surface-variant mt-3">
              {autoRefill ? "Refill $50 when balance drops below $10" : "Enable to automatically add credits when balance is low"}
            </p>
          </div>
        </div>

        {/* Volume Discount Tiers */}
        <div className="bg-surface-container-lowest rounded-xl p-5 sm:p-6 mb-8">
          <h4 className="font-headline font-bold text-lg mb-4">{t("credits.volume_discounts")}</h4>
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
                    {t("credits.current_tier")}
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
            <div>
              <h4 className="font-headline font-bold text-lg">{t("credits.transaction_history")}</h4>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Need invoicing?{" "}
                <a href="/docs" className="text-primary hover:underline">Contact sales</a>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleExport}
                className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                  {exportDone ? "check_circle" : "download"}
                </span>
                {exportDone ? t("credits.downloaded") : t("credits.export_csv")}
              </button>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setTxPage((p) => Math.max(1, p - 1))}
                  disabled={txPage <= 1}
                  className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors disabled:opacity-30"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_left</span>
                </button>
                <span className="text-xs text-on-surface-variant tabular-nums min-w-[3ch] text-center">{txPage}</span>
                <button
                  onClick={() => setTxPage((p) => Math.min(txTotalPages, p + 1))}
                  disabled={txPage >= txTotalPages}
                  className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors disabled:opacity-30"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span>
                </button>
              </div>
            </div>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                <th className="text-left px-5 py-3.5">{t("credits.col_date")}</th>
                <th className="text-left px-5 py-3.5">{t("credits.col_type")}</th>
                <th className="text-right px-5 py-3.5">{t("credits.col_amount")}</th>
                <th className="text-right px-5 py-3.5">{t("credits.col_balance")}</th>
                <th className="text-right px-5 py-3.5">{t("credits.col_method")}</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTx.map((tx, i) => (
                <tr key={i} className="border-t border-outline-variant/10 hover:bg-surface-container/40 transition-colors">
                  <td className="px-5 py-3.5 text-xs text-on-surface-variant font-medium">{tx.date}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        tx.type === "Top-up"
                          ? "bg-primary/5 text-primary"
                          : tx.type === "Bonus"
                            ? "bg-outline-variant/10 text-on-surface"
                            : "bg-surface-container text-on-surface-variant"
                      }`}
                    >
                      {tx.type}
                    </span>
                  </td>
                  <td className={`px-5 py-3.5 text-right text-xs font-medium tabular-nums ${tx.amount.startsWith("+") ? "text-primary" : "text-on-surface"}`}>
                    {tx.amount}
                  </td>
                  <td className="px-5 py-3.5 text-right text-xs tabular-nums">{tx.balance}</td>
                  <td className="px-5 py-3.5 text-right text-xs text-on-surface-variant">{tx.method}</td>
                </tr>
              ))}
              {paginatedTx.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-on-surface-variant">No results</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Transaction History - Mobile */}
        <div className="md:hidden">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-headline font-bold text-lg">Transaction History</h4>
            <div className="flex items-center gap-3">
              <button
                onClick={handleExport}
                className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                  {exportDone ? "check_circle" : "download"}
                </span>
                {exportDone ? t("credits.downloaded") : t("credits.export_csv")}
              </button>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setTxPage((p) => Math.max(1, p - 1))}
                  disabled={txPage <= 1}
                  className="w-7 h-7 flex items-center justify-center text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors disabled:opacity-30"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_left</span>
                </button>
                <span className="text-xs text-on-surface-variant tabular-nums">{txPage}</span>
                <button
                  onClick={() => setTxPage((p) => Math.min(txTotalPages, p + 1))}
                  disabled={txPage >= txTotalPages}
                  className="w-7 h-7 flex items-center justify-center text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors disabled:opacity-30"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_right</span>
                </button>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {paginatedTx.map((tx, i) => (
              <div key={i} className="bg-surface-container-lowest rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      tx.type === "Top-up"
                        ? "bg-primary/5 text-primary"
                        : tx.type === "Bonus"
                          ? "bg-outline-variant/10 text-on-surface"
                          : "bg-surface-container text-on-surface-variant"
                    }`}
                  >
                    {tx.type}
                  </span>
                  <span className={`text-sm font-medium tabular-nums ${tx.amount.startsWith("+") ? "text-primary" : "text-on-surface"}`}>
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
            className="bg-surface-container-lowest rounded-xl shadow-xl w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/10">
              <h3 className="font-headline font-bold text-lg">{t("credits.add_credits")}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Payment Tab Switcher */}
            <div className="px-6 pt-5">
              <div className="grid grid-cols-2 gap-1 bg-surface-container p-1 rounded-xl">
                <button
                  onClick={() => setPaymentTab("card")}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
                    paymentTab === "card"
                      ? "bg-surface-container-lowest shadow-sm text-primary"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>credit_card</span>
                  {t("credits.tab_card")}
                </button>
                <button
                  onClick={() => setPaymentTab("crypto")}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
                    paymentTab === "crypto"
                      ? "bg-surface-container-lowest shadow-sm text-primary"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>currency_bitcoin</span>
                  {t("credits.tab_crypto")}
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-6">
              {paymentTab === "card" ? (
                <>
                  {/* Preset Amounts */}
                  <div>
                    <p className="text-sm font-medium text-on-surface mb-3">{t("credits.select_amount")}</p>
                    <div className="grid grid-cols-3 gap-2">
                      {PRESET_AMOUNTS.map((amt) => (
                        <button
                          key={amt}
                          onClick={() => { setSelectedAmount(amt); setUseCustom(false); }}
                          className={`py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                            !useCustom && selectedAmount === amt
                              ? "bg-primary text-on-primary"
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
                    <p className="text-sm font-medium text-on-surface mb-2">{t("credits.custom_amount")}</p>
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
                    <p className="text-sm font-medium text-on-surface mb-2">{t("credits.payment_method")}</p>
                    <div className="flex items-center gap-3 bg-surface-container rounded-lg px-4 py-3">
                      <span className="material-symbols-outlined" style={{ fontSize: 20 }}>credit_card</span>
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
                          <span className="font-medium text-primary">+${bonusValue.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm pt-2 border-t border-outline-variant/10">
                        <span className="font-semibold">{t("credits.total_credits")}</span>
                        <span className="font-bold text-primary">${totalCredits.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Network Selector */}
                  <div>
                    <p className="text-sm font-medium text-on-surface mb-2">{t("credits.network")}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {NETWORKS.map((net) => (
                        <button
                          key={net.id}
                          onClick={() => setSelectedNetwork(net.id)}
                          className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                            selectedNetwork === net.id
                              ? "bg-primary/10 text-primary ring-1 ring-primary/30"
                              : "bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                          }`}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{net.icon}</span>
                          {net.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Token Selector */}
                  <div>
                    <p className="text-sm font-medium text-on-surface mb-2">{t("credits.token")}</p>
                    <div className="grid grid-cols-3 gap-2">
                      {TOKENS.map((token) => (
                        <button
                          key={token.id}
                          onClick={() => setSelectedToken(token.id)}
                          className={`py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                            selectedToken === token.id
                              ? "bg-primary/10 text-primary ring-1 ring-primary/30"
                              : "bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                          }`}
                        >
                          {token.id}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Amount */}
                  <div>
                    <p className="text-sm font-medium text-on-surface mb-2">{t("credits.amount_usd")}</p>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {[25, 50, 100].map((amt) => (
                        <button
                          key={amt}
                          onClick={() => { setSelectedAmount(amt); setUseCustom(false); }}
                          className={`py-2 rounded-lg text-sm font-semibold transition-colors ${
                            !useCustom && selectedAmount === amt
                              ? "bg-primary text-on-primary"
                              : "bg-surface-container text-on-surface-variant hover:text-on-surface"
                          }`}
                        >
                          ${amt}
                        </button>
                      ))}
                    </div>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm font-medium">$</span>
                      <input
                        type="number"
                        min="1"
                        placeholder="Custom amount"
                        value={customAmount}
                        onFocus={() => setUseCustom(true)}
                        onChange={(e) => { setCustomAmount(e.target.value); setUseCustom(true); }}
                        className="w-full pl-8 pr-4 py-2.5 bg-surface-container-lowest rounded-lg text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all border border-outline-variant/10"
                      />
                    </div>
                  </div>

                  {/* Deposit Address */}
                  <div>
                    <p className="text-sm font-medium text-on-surface mb-2">{t("credits.send_to")}</p>
                    <div className="flex items-center gap-2 bg-surface-container rounded-lg px-3 py-2.5">
                      <code className="text-xs text-on-surface-variant font-mono flex-1 truncate">
                        {DEPOSIT_ADDRESS}
                      </code>
                      <button
                        onClick={handleCopyAddress}
                        className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline shrink-0"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                          {copied ? "check" : "content_copy"}
                        </span>
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <p className="text-[11px] text-on-surface-variant mt-1.5">
                      Only send {selectedToken} on {NETWORKS.find((n) => n.id === selectedNetwork)?.label} network
                    </p>
                  </div>

                  {/* Crypto Success Message */}
                  {cryptoSent && (
                    <div className="flex items-center gap-2 bg-primary/5 text-primary rounded-lg px-4 py-3">
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>check_circle</span>
                      <span className="text-sm font-medium">Payment received! Credits will be added shortly.</span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-outline-variant/10 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 bg-surface-container text-on-surface-variant font-semibold rounded-lg text-sm hover:bg-surface-container-high transition-colors"
              >
                {t("credits.cancel")}
              </button>
              {paymentTab === "card" ? (
                <button
                  disabled={activeAmount <= 0}
                  className="flex-1 py-2.5 bg-primary text-on-primary font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Pay ${activeAmount > 0 ? activeAmount.toFixed(2) : "0.00"}
                </button>
              ) : (
                <button
                  onClick={walletAddress ? handleCryptoSend : undefined}
                  disabled={activeAmount <= 0 || cryptoSending || cryptoSent}
                  className="flex-1 py-2.5 bg-primary text-on-primary font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {cryptoSending ? (
                    <>
                      <span className="material-symbols-outlined animate-spin" style={{ fontSize: 16 }}>progress_activity</span>
                      Confirming...
                    </>
                  ) : cryptoSent ? (
                    <>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check_circle</span>
                      Received
                    </>
                  ) : walletAddress ? (
                    `Send $${activeAmount > 0 ? activeAmount.toFixed(2) : "0.00"} ${selectedToken}`
                  ) : (
                    <>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>account_balance_wallet</span>
                      Connect Wallet to Pay
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </SettingsLayout>
  );
}
