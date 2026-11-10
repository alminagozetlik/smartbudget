import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Wallet,
  PieChart,
  Settings,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Search,
  Bell,
  Menu,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const initialTransactions = [
  { id: 1, title: "Maaş", category: "Gelir", amount: 35000, type: "income", date: "10 Kas 2026" },
  { id: 2, title: "Market Alışverişi", category: "Market", amount: 1250, type: "expense", date: "9 Kas 2026" },
  { id: 3, title: "Netflix", category: "Abonelik", amount: 300, type: "expense", date: "8 Kas 2026" },
  { id: 4, title: "Freelance Proje", category: "Ek Gelir", amount: 5000, type: "income", date: "7 Kas 2026" },
  { id: 5, title: "Restoran", category: "Yeme İçme", amount: 850, type: "expense", date: "6 Kas 2026" },
];



const formatMoney = (amount) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(amount);

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [userName, setUserName] = useState(() => {
  return localStorage.getItem("smartbudget_username") || "Kullanıcı";
});
const [searchTerm, setSearchTerm] = useState("");
const [filterType, setFilterType] = useState("all");
const [monthlyBudget, setMonthlyBudget] = useState(() => {
  const saved = Number(localStorage.getItem("smartbudget_monthly_budget"));
  return Number.isFinite(saved) && saved > 0 ? saved : 15000;
});

  const [transactions, setTransactions] = useState(() => {
  const saved = localStorage.getItem("smartbudget_transactions");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      console.error("Kaydedilen işlemler okunamadı.");
    }
  }
  return initialTransactions;
});

const [showModal, setShowModal] = useState(false);

const [form, setForm] = useState({
  title: "",
  amount: "",
  type: "expense",
  category: "Market",
  date: new Date().toLocaleDateString("en-CA"),
});

useEffect(() => {
  localStorage.setItem(
    "smartbudget_transactions",
    JSON.stringify(transactions)
  );
}, [transactions]);
useEffect(() => {
  localStorage.setItem(
    "smartbudget_monthly_budget",
    String(monthlyBudget)
  );
}, [monthlyBudget]);
useEffect(() => {
  localStorage.setItem("smartbudget_username", userName);
}, [userName]);
const addTransaction = (e) => {
  e.preventDefault();

  const amount = Number(form.amount);

  if (!form.title.trim() || !Number.isFinite(amount) || amount <= 0) {
    alert("Lütfen geçerli bir işlem adı ve tutar girin.");
    return;
  }

  const newTransaction = {
    id: crypto.randomUUID(),
    title: form.title.trim(),
    amount,
    type: form.type,
    category: form.category,
    date: form.date,
  };

  setTransactions((prev) => [newTransaction, ...prev]);

  setShowModal(false);

  setForm({
    title: "",
    amount: "",
    type: "expense",
    category: "Market",
    date: new Date().toLocaleDateString("en-CA"),
  });
};

const deleteTransaction = (id) => {
  const confirmed = window.confirm(
    "Bu işlemi silmek istediğinize emin misiniz?"
  );

  if (confirmed) {
    setTransactions((prev) =>
      prev.filter((transaction) => transaction.id !== id)
    );
  }
};
const exportTransactions = () => {
  const rows = [
    ["İşlem", "Kategori", "Tutar", "Tür", "Tarih"],
    ...transactions.map((t) => [
      t.title,
      t.category,
      t.amount,
      t.type === "income" ? "Gelir" : "Gider",
      t.date,
    ]),
  ];

  const csv = rows
    .map((row) =>
      row
        .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
        .join(";")
    )
    .join("\r\n");

  const blob = new Blob(["\uFEFF", csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "smartbudget-islemler.csv";
  link.click();

  URL.revokeObjectURL(url);
};

const resetTransactions = () => {
  const confirmed = window.confirm(
    "Tüm işlemler kalıcı olarak silinecek. Emin misiniz?"
  );

  if (confirmed) {
    setTransactions([]);
  }
};

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;
  const currentMonth = new Date().toLocaleDateString("en-CA").slice(0, 7);

const monthlyExpense = transactions
  .filter(
    (transaction) =>
      transaction.type === "expense" &&
      typeof transaction.date === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(transaction.date) &&
      transaction.date.startsWith(currentMonth)
  )
  .reduce((sum, transaction) => sum + transaction.amount, 0);

const remainingBudget = monthlyBudget - monthlyExpense;

const budgetPercentage =
  monthlyBudget > 0
    ? (monthlyExpense / monthlyBudget) * 100
    : 0;
  const filteredTransactions = transactions.filter((transaction) => {
  const matchesSearch = transaction.title
    .toLocaleLowerCase("tr-TR")
    .includes(searchTerm.toLocaleLowerCase("tr-TR"));

  const matchesType =
    filterType === "all" || transaction.type === filterType;

  return matchesSearch && matchesType;
});
  const colors = [
  "#10b981",
  "#6366f1",
  "#f59e0b",
  "#ec4899",
  "#06b6d4",
  "#8b5cf6",
];

const expenses = Object.entries(
  transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {})
).map(([name, value], index) => ({
  name,
  value,
  color: colors[index % colors.length],
}));

  return (
    <div className="min-h-screen bg-[#f7f9f8] text-slate-800 md:flex">

      {/* Sidebar */}
      <aside
  className={`${
    menuOpen ? "block" : "hidden"
  } md:block w-full md:w-64 md:shrink-0 bg-[#12372a] text-white p-6 md:min-h-screen`}
>
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-emerald-400 p-2 rounded-xl">
            <Wallet className="text-[#12372a]" size={24} />
          </div>
          <h1 className="text-xl font-bold">SmartBudget</h1>
        </div>

        <nav className="space-y-3">
  <button
  onClick={() => {
    setActivePage("dashboard");
    setMenuOpen(false);
  }}
  className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${
    activePage === "dashboard"
      ? "bg-emerald-500/20 text-emerald-300"
      : "text-slate-300 hover:bg-white/10"
  }`}
>
  <LayoutDashboard size={20} />
  Dashboard
  </button>
        <button
  onClick={() => {
    setActivePage("transactions");
    setMenuOpen(false);
  }}
  className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${
    activePage === "transactions"
      ? "bg-emerald-500/20 text-emerald-300"
      : "text-slate-300 hover:bg-white/10"
  }`}
>
  <Wallet size={20} />
  İşlemler
</button>
          <button
  onClick={() => {
    setActivePage("budget");
    setMenuOpen(false);
  }}
  className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${
    activePage === "budget"
      ? "bg-emerald-500/20 text-emerald-300"
      : "text-slate-300 hover:bg-white/10"
  }`}
>
  <PieChart size={20} />
  Bütçe
</button>
          <button
  onClick={() => {
    setActivePage("settings");
    setMenuOpen(false);
  }}
  className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${
    activePage === "settings"
      ? "bg-emerald-500/20 text-emerald-300"
      : "text-slate-300 hover:bg-white/10"
  }`}
>
  <Settings size={20} />
  Ayarlar
</button>
        </nav>

        <div className="mt-16 bg-white/10 rounded-2xl p-4">
          <p className="text-sm text-emerald-200">Finansal hedeflerin</p>
          <p className="text-xs text-slate-300 mt-2">
            Harcamalarını takip et, geleceğini planla.
          </p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 p-5 md:p-10">

        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-4 mb-9">
          <div>
            <p className="text-sm text-slate-500 mb-1">Finansal Genel Bakış</p>
            <h2 className="text-3xl font-bold">
  {activePage === "dashboard"
  ? "Dashboard"
  : activePage === "transactions"
  ? "İşlemler"
  : activePage === "budget"
  ? "Bütçe"
  : "Ayarlar"}
</h2>
            <p className="text-slate-500 mt-1">Paranı akıllıca yönet.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
  onClick={() => setMenuOpen(!menuOpen)}
  className="md:hidden bg-white p-3 rounded-xl shadow-sm border border-slate-100"
  aria-label="Menüyü aç veya kapat"
  aria-expanded={menuOpen}
>
  {menuOpen ? "✕" : <Menu size={20} />}
</button>
            <div className="hidden sm:flex bg-white p-3 rounded-xl">
              <Bell size={20} className="text-slate-500" />
            </div>
            <div className="bg-emerald-100 text-emerald-700 font-bold w-11 h-11 rounded-full flex items-center justify-center">
              {userName
  .trim()
  .split(/\s+/)
  .slice(0, 2)
  .map((word) => word[0]?.toLocaleUpperCase("tr-TR"))
  .join("")}
            </div>
          </div>
          </header>

        {activePage === "dashboard" ? (
          <>
            {/* Summary Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
          <div className="bg-[#12372a] text-white p-6 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-7">
              <p className="text-emerald-100">Toplam Bakiye</p>
              <Wallet size={22} />
            </div>
            <h3 className="text-3xl font-bold">{formatMoney(balance)}</h3>
            <p className="text-emerald-200 text-sm mt-3">Güncel finansal durumun</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-7">
              <p className="text-slate-500">Toplam Gelir</p>
              <div className="bg-emerald-50 p-2 rounded-xl">
                <ArrowDownRight className="text-emerald-600" size={22} />
              </div>
            </div>
            <h3 className="text-3xl font-bold">{formatMoney(totalIncome)}</h3>
            <p className="text-emerald-600 text-sm mt-3 flex items-center gap-1">
              <TrendingUp size={16} /> Gelirlerin
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-7">
              <p className="text-slate-500">Toplam Gider</p>
              <div className="bg-rose-50 p-2 rounded-xl">
                <ArrowUpRight className="text-rose-500" size={22} />
              </div>
            </div>
            <h3 className="text-3xl font-bold">{formatMoney(totalExpense)}</h3>
            <p className="text-slate-400 text-sm mt-3">Toplam harcamaların</p>
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Transactions */}
          <div className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-xl font-bold">Son İşlemler</h3>
                <p className="text-sm text-slate-400 mt-1">Finansal hareketlerin</p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-xl text-sm font-medium transition"
              >
                <Plus size={18} /> Yeni İşlem
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 text-sm border-b border-slate-100">
                    <th className="pb-4 font-medium">İşlem</th>
                    <th className="pb-4 font-medium">Tarih</th>
                    <th className="pb-4 font-medium text-right">Tutar</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t.id} className="border-b border-slate-50 last:border-0">
                      <td className="py-4">
                        <p className="font-semibold text-sm">{t.title}</p>
                        <p className="text-xs text-slate-400 mt-1">{t.category}</p>
                      </td>
                      <td className="py-4 text-sm text-slate-500">
  {/^\d{4}-\d{2}-\d{2}$/.test(t.date)
    ? new Date(`${t.date}T12:00:00`).toLocaleDateString("tr-TR")
    : t.date}
</td>
                      <td className={`py-4 text-right font-semibold text-sm ${
                        t.type === "income" ? "text-emerald-600" : "text-rose-500"
                      }`}>
                        {t.type === "income" ? "+" : "-"}{formatMoney(t.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Expense Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold">Harcama Dağılımı</h3>
            <p className="text-sm text-slate-400 mt-1">Kategorilere göre giderler</p>

            <div className="h-60 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={expenses}
                    dataKey="value"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={4}
                  >
                    {expenses.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatMoney(value)} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4 mt-2">
              {expenses.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-slate-600">{item.name}</span>
                  </div>
                  <span className="font-semibold text-sm">{formatMoney(item.value)}</span>
                </div>
              ))}
            </div>
                  </div>

        </section>
          </>
        ) : activePage === "transactions" ? (
          <TransactionsPage
            transactions={filteredTransactions}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterType={filterType}
            setFilterType={setFilterType}
            onDelete={deleteTransaction}
            onAdd={() => setShowModal(true)}
          />
        ) : activePage === "budget" ? (
  <BudgetPage
    monthlyBudget={monthlyBudget}
    setMonthlyBudget={setMonthlyBudget}
    monthlyExpense={monthlyExpense}
    remainingBudget={remainingBudget}
    budgetPercentage={budgetPercentage}
  />
) : activePage === "settings" ? (
  <SettingsPage
    userName={userName}
    setUserName={setUserName}
    transactionCount={transactions.length}
    onExport={exportTransactions}
    onReset={resetTransactions}
  />
) : null}
      </main>
      {showModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl p-7 w-full max-w-md shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Yeni İşlem Ekle</h2>
        <button
          onClick={() => setShowModal(false)}
          className="text-slate-400 hover:text-slate-700 text-2xl"
          aria-label="Formu kapat"
        >
          ×
        </button>
      </div>

      <form onSubmit={addTransaction} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            İşlem Adı
          </label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            placeholder="Örn: Market alışverişi"
            className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Tutar (₺)
          </label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            required
            value={form.amount}
            onChange={(e) =>
              setForm({ ...form, amount: e.target.value })
            }
            placeholder="0.00"
            className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            İşlem Türü
          </label>
          <select
            value={form.type}
            onChange={(e) =>
              setForm({
                ...form,
                type: e.target.value,
                category: e.target.value === "income" ? "Gelir" : "Market",
              })
            }
            className="w-full border border-slate-200 rounded-xl p-3"
          >
            <option value="expense">Gider</option>
            <option value="income">Gelir</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Kategori
          </label>
          <select
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
            className="w-full border border-slate-200 rounded-xl p-3"
          >
            {(form.type === "income"
              ? ["Gelir", "Maaş", "Ek Gelir", "Diğer"]
              : ["Market", "Yeme İçme", "Abonelik", "Ulaşım", "Alışveriş", "Diğer"]
            ).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Tarih
          </label>
          <input
            type="date"
            required
            value={form.date}
            onChange={(e) =>
              setForm({ ...form, date: e.target.value })
            }
            className="w-full border border-slate-200 rounded-xl p-3"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-xl font-semibold transition"
        >
          İşlemi Kaydet
        </button>
      </form>
    </div>
  </div>
)}
    </div>
  );
}
function TransactionsPage({
  transactions,
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  onDelete,
  onAdd,
}) {
  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-7">
        <div>
          <h2 className="text-2xl font-bold">Tüm İşlemler</h2>
          <p className="text-slate-500 mt-1">
            Gelir ve giderlerini buradan yönetebilirsin.
          </p>
        </div>

        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl transition"
        >
          <Plus size={18} />
          Yeni İşlem
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">

        {/* Arama ve filtreleme */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search
              size={19}
              className="absolute left-3 top-3.5 text-slate-400"
            />

            <input
              type="text"
              placeholder="İşlem ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-emerald-500"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500"
          >
            <option value="all">Tüm İşlemler</option>
            <option value="income">Gelirler</option>
            <option value="expense">Giderler</option>
          </select>
        </div>

        {/* İşlem tablosu */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-sm text-slate-400">
                <th className="pb-4 font-medium">İşlem</th>
                <th className="pb-4 font-medium">Kategori</th>
                <th className="pb-4 font-medium">Tarih</th>
                <th className="pb-4 font-medium text-right">Tutar</th>
                <th className="pb-4 font-medium text-right">İşlem</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b border-slate-50 last:border-0"
                >
                  <td className="py-4 font-medium text-sm">
                    {transaction.title}
                  </td>

                  <td className="py-4 text-sm text-slate-500">
                    {transaction.category}
                  </td>

                  <td className="py-4 text-sm text-slate-500">
                    {/^\d{4}-\d{2}-\d{2}$/.test(transaction.date)
                      ? new Date(
                          `${transaction.date}T12:00:00`
                        ).toLocaleDateString("tr-TR")
                      : transaction.date}
                  </td>

                  <td
                    className={`py-4 text-right font-semibold text-sm ${
                      transaction.type === "income"
                        ? "text-emerald-600"
                        : "text-rose-500"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatMoney(transaction.amount)}
                  </td>

                  <td className="py-4 text-right">
                    <button
                      onClick={() => onDelete(transaction.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                      title="İşlemi Sil"
                      aria-label={`${transaction.title} işlemini sil`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {transactions.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              Gösterilecek işlem bulunamadı.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
function BudgetPage({
  monthlyBudget,
  setMonthlyBudget,
  monthlyExpense,
  remainingBudget,
  budgetPercentage,
}) {
  const [budgetInput, setBudgetInput] = useState(String(monthlyBudget));

  const isOverBudget = remainingBudget < 0;

  const saveBudget = (e) => {
    e.preventDefault();

    const amount = Number(budgetInput);

    if (!Number.isFinite(amount) || amount <= 0) {
      alert("Lütfen sıfırdan büyük bir bütçe girin.");
      return;
    }

    setMonthlyBudget(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Aylık Bütçem</h2>
        <p className="text-slate-500 mt-1">
          Harcamalarını kontrol et ve finansal hedeflerini takip et.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-7 shadow-sm border border-slate-100">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-7">
          <h3 className="text-xl font-bold">Bütçe Durumu</h3>

          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              isOverBudget
                ? "bg-rose-100 text-rose-700"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {isOverBudget ? "Limit aşıldı" : "Limit içinde"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div>
            <p className="text-slate-500 text-sm mb-2">Aylık Limit</p>
            <h3 className="text-2xl font-bold">
              {formatMoney(monthlyBudget)}
            </h3>
          </div>

          <div>
            <p className="text-slate-500 text-sm mb-2">Harcanan</p>
            <h3 className="text-2xl font-bold text-rose-500">
              {formatMoney(monthlyExpense)}
            </h3>
          </div>

          <div>
            <p className="text-slate-500 text-sm mb-2">
              {isOverBudget ? "Limit Aşımı" : "Kalan Bütçe"}
            </p>

            <h3
              className={`text-2xl font-bold ${
                isOverBudget ? "text-rose-500" : "text-emerald-600"
              }`}
            >
              {formatMoney(Math.abs(remainingBudget))}
            </h3>
          </div>
        </div>

        <div className="mb-3 flex justify-between text-sm">
          <span className="text-slate-500">Bütçe Kullanımı</span>
          <span className="font-semibold">
            %{budgetPercentage.toFixed(1)}
          </span>
        </div>

        <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isOverBudget ? "bg-rose-500" : "bg-emerald-500"
            }`}
            style={{
              width: `${Math.min(budgetPercentage, 100)}%`,
            }}
          />
        </div>

        <p className="text-sm text-slate-500 mt-4">
          {isOverBudget
            ? "Bu ay belirlediğin harcama limitini aştın."
            : "Harcamaların şu anda belirlediğin limitin içinde."}
        </p>
      </div>

      <div className="bg-white rounded-2xl p-7 shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold mb-2">Bütçe Limitini Güncelle</h3>

        <p className="text-sm text-slate-500 mb-6">
          Aylık harcama hedefini istediğin zaman değiştirebilirsin.
        </p>

        <form onSubmit={saveBudget} className="flex flex-col sm:flex-row gap-3">
          <input
  type="number"
  min="0"
  step="1000"
  value={budgetInput}
            onChange={(e) => setBudgetInput(e.target.value)}
            className="flex-1 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500"
            placeholder="Aylık bütçe tutarı"
          />

          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            Bütçeyi Kaydet
          </button>
        </form>
      </div>
    </div>
  );
}
function SettingsPage({
  userName,
  setUserName,
  transactionCount,
  onExport,
  onReset,
}) {
  const [nameInput, setNameInput] = useState(userName);

  const saveName = (e) => {
    e.preventDefault();

    const newName = nameInput.trim();

    if (!newName) {
      alert("Lütfen bir kullanıcı adı girin.");
      return;
    }

    setUserName(newName);
    alert("Kullanıcı adı güncellendi.");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Uygulama Ayarları</h2>
        <p className="text-slate-500 mt-1">
          Profil bilgilerini ve finansal verilerini yönet.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-7 shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold mb-2">Profil Bilgileri</h3>
        <p className="text-sm text-slate-500 mb-6">
          Uygulamada görüntülenecek kullanıcı adını belirle.
        </p>

        <form onSubmit={saveName} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            maxLength={40}
            placeholder="Kullanıcı adın"
            className="flex-1 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500"
          />

          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            Kaydet
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl p-7 shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold mb-2">Veri Yönetimi</h3>

        <p className="text-sm text-slate-500 mb-6">
          Kayıtlı işlem sayısı: {transactionCount}
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onExport}
            className="bg-[#12372a] hover:bg-[#1b4d3a] text-white px-6 py-3 rounded-xl font-medium transition"
          >
            İşlemleri CSV Olarak İndir
          </button>

          <button
            onClick={onReset}
            disabled={transactionCount === 0}
            className="border border-rose-200 text-rose-600 hover:bg-rose-50 px-6 py-3 rounded-xl font-medium transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Tüm İşlemleri Sil
          </button>
        </div>

        <p className="text-xs text-slate-400 mt-5">
          Verilerin bu tarayıcıda saklanır. Tüm işlemleri silme
          işlemi geri alınamaz.
        </p>
      </div>
    </div>
  );
}

export default App;