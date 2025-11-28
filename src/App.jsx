import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import {
  LayoutDashboard,
  ArrowRightLeft,
  Package,
  FileText,
  Plus,
  Trash2,
  Edit,
  Printer,
  Share2,
  Search,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Download,
  Settings
} from 'lucide-react';

// --- Utility Functions ---
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MAD' }).format(amount);
};

const generateId = () => Math.random().toString(36).substr(2, 9);

// --- Main Component ---
function App() {
  // --- State Management ---
  const [view, setView] = useState('dashboard'); // dashboard, transactions, inventory, reports
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });
  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('inventory');
    return saved ? JSON.parse(saved) : [];
  });
  const [deliveryConfig, setDeliveryConfig] = useState(() => {
    const saved = localStorage.getItem('deliveryConfig');
    return saved ? JSON.parse(saved) : [];
  });
  const [packagingConfig, setPackagingConfig] = useState(() => {
    const saved = localStorage.getItem('packagingConfig');
    return saved ? JSON.parse(saved) : [];
  });

  // --- Persistence ---
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('deliveryConfig', JSON.stringify(deliveryConfig));
  }, [deliveryConfig]);

  useEffect(() => {
    localStorage.setItem('packagingConfig', JSON.stringify(packagingConfig));
  }, [packagingConfig]);

  // --- Derived State (Metrics) ---
  const totalIncome = transactions
    .filter(t => t.type === 'sale')
    .reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);

  const totalExpenses = transactions
    .reduce((acc, t) => {
      let expense = 0;
      if (t.type === 'purchase' || t.type === 'expense') {
        expense += parseFloat(t.amount || 0);
      }
      if (t.type === 'sale') {
        expense += parseFloat(t.deliveryCost || 0) + parseFloat(t.packagingCost || 0);
      }
      return acc + expense;
    }, 0);

  const netProfit = totalIncome - totalExpenses;

  const inventoryValue = inventory.reduce((acc, item) => {
    return acc + (parseFloat(item.buyPrice || 0) * parseFloat(item.quantity || 0));
  }, 0);

  // --- Navigation ---
  const NavItem = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setView(id)}
      className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${view === id
        ? 'bg-blue-600 text-white'
        : 'text-gray-600 hover:bg-gray-100'
        }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-blue-600">BizManager</h1>
          <p className="text-xs text-gray-500 mt-1">Accounting & Inventory</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem id="transactions" icon={ArrowRightLeft} label="Transactions" />
          <NavItem id="inventory" icon={Package} label="Inventory" />
          <NavItem id="reports" icon={FileText} label="Reports" />
          <NavItem id="settings" icon={Settings} label="Settings" />
        </nav>

        <div className="p-4 border-t border-gray-100 text-xs text-gray-400 text-center">
          v1.0.0 • Local Storage
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 capitalize">{view}</h2>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>

        {/* Views */}
        {view === 'dashboard' && (
          <Dashboard
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
            netProfit={netProfit}
            inventoryValue={inventoryValue}
            transactions={transactions}
          />
        )}

        {view === 'transactions' && (
          <TransactionManager
            transactions={transactions}
            setTransactions={setTransactions}
            inventory={inventory}
            setInventory={setInventory}
            deliveryConfig={deliveryConfig}
            packagingConfig={packagingConfig}
          />
        )}

        {view === 'inventory' && (
          <InventoryManager
            inventory={inventory}
            setInventory={setInventory}
          />
        )}

        {view === 'reports' && (
          <ReportView
            transactions={transactions}
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
            netProfit={netProfit}
          />
        )}

        {view === 'settings' && (
          <SettingsView
            deliveryConfig={deliveryConfig}
            setDeliveryConfig={setDeliveryConfig}
            packagingConfig={packagingConfig}
            setPackagingConfig={setPackagingConfig}
          />
        )}
      </main>
    </div>
  );
}

// --- Placeholder Sub-Components ---

const Dashboard = ({ totalIncome, totalExpenses, netProfit, inventoryValue, transactions }) => {
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Income" value={totalIncome} icon={TrendingUp} color="green" />
        <MetricCard title="Total Expenses" value={totalExpenses} icon={TrendingDown} color="red" />
        <MetricCard title="Net Profit" value={netProfit} icon={ArrowRightLeft} color={netProfit >= 0 ? 'blue' : 'red'} />
        <MetricCard title="Inventory Value" value={inventoryValue} icon={Package} color="purple" />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentTransactions.map(t => (
                <tr key={t.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap capitalize text-sm text-gray-900">{t.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t.party || t.category || '-'}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${t.type === 'sale' ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {t.type === 'sale' ? '+' : '-'}{formatCurrency(t.amount)}
                  </td>
                </tr>
              ))}
              {recentTransactions.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">No recent activity</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, icon: Icon, color }) => {
  const colorClasses = {
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
      <div className={`p-3 rounded-full ${colorClasses[color]}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{formatCurrency(value)}</p>
      </div>
    </div>
  );
};

const TransactionManager = ({ transactions, setTransactions, inventory, setInventory, deliveryConfig, packagingConfig }) => {
  const [showForm, setShowForm] = useState(false);
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'sale', // sale, purchase, expense
    category: '',
    party: '',
    itemId: '',
    quantity: '',
    amount: '',
    notes: '',
    deliveryCost: '',
    packagingCost: ''
  });

  // Local state for selections
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedPackaging, setSelectedPackaging] = useState('');


  // Derived state for autocomplete
  const parties = [...new Set(transactions.map(t => t.party).filter(Boolean))];
  const categories = [...new Set(transactions.map(t => t.category).filter(Boolean))];

  const filteredTransactions = transactions.filter(t => {
    if (dateFilter.start && t.date < dateFilter.start) return false;
    if (dateFilter.end && t.date > dateFilter.end) return false;
    return true;
  });

  const handleExport = () => {
    const data = filteredTransactions.map(t => ({
      Date: t.date,
      Type: t.type,
      Party: t.party,
      Category: t.category,
      Item: t.itemId ? (inventory.find(i => i.id === t.itemId)?.name || 'Unknown') : '',
      Quantity: t.quantity,
      Amount: t.amount,
      'Delivery Cost': t.deliveryCost || 0,
      'Packaging Cost': t.packagingCost || 0,
      Notes: t.notes
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    XLSX.writeFile(wb, `Transactions_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleTypeChange = (type) => {
    setFormData({ ...formData, type, itemId: '', quantity: '', amount: '', deliveryCost: '', packagingCost: '' });
    setSelectedCompany('');
    setSelectedPackaging('');
  };

  const handleItemChange = (itemId) => {
    const item = inventory.find(i => i.id === itemId);
    if (item) {
      setFormData({
        ...formData,
        itemId,
        amount: formData.type === 'sale' ? item.sellPrice : item.buyPrice
      });
    } else {
      setFormData({ ...formData, itemId, amount: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTransaction = {
      ...formData,
      id: generateId(),
      amount: parseFloat(formData.amount) * (formData.quantity || 1),
      deliveryCost: parseFloat(formData.deliveryCost) || 0,
      packagingCost: parseFloat(formData.packagingCost) || 0
    };

    // Inventory Logic
    if (formData.type === 'sale' && formData.itemId) {
      const item = inventory.find(i => i.id === formData.itemId);
      if (item) {
        if (parseInt(item.quantity) < parseInt(formData.quantity)) {
          alert('Insufficient stock!');
          return;
        }
        const updatedInventory = inventory.map(i =>
          i.id === formData.itemId
            ? { ...i, quantity: parseInt(i.quantity) - parseInt(formData.quantity) }
            : i
        );
        setInventory(updatedInventory);
      }
    } else if (formData.type === 'purchase' && formData.itemId) {
      const updatedInventory = inventory.map(i =>
        i.id === formData.itemId
          ? { ...i, quantity: parseInt(i.quantity) + parseInt(formData.quantity) }
          : i
      );
      setInventory(updatedInventory);
    }

    setTransactions([newTransaction, ...transactions]);
    setShowForm(false);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      type: 'sale',
      category: '',
      party: '',
      itemId: '',
      quantity: '',
      amount: '',
      notes: '',
      deliveryCost: '',
      packagingCost: ''
    });
    setSelectedCompany('');
    setSelectedPackaging('');
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this transaction? Stock will NOT be reverted automatically.')) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h3 className="text-xl font-bold text-gray-800">Transactions</h3>

        <div className="flex items-center space-x-2 bg-white p-2 rounded-lg border border-gray-200">
          <span className="text-sm text-gray-500">Filter:</span>
          <input
            type="date"
            className="border rounded px-2 py-1 text-sm"
            value={dateFilter.start}
            onChange={e => setDateFilter({ ...dateFilter, start: e.target.value })}
          />
          <span className="text-gray-400">-</span>
          <input
            type="date"
            className="border rounded px-2 py-1 text-sm"
            value={dateFilter.end}
            onChange={e => setDateFilter({ ...dateFilter, end: e.target.value })}
          />
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleExport}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700"
          >
            <Download size={20} />
            <span>Export Excel</span>
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
          >
            <Plus size={20} />
            <span>New Transaction</span>
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h4 className="text-lg font-bold mb-4">New Transaction</h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    value={formData.type}
                    onChange={e => handleTypeChange(e.target.value)}
                  >
                    <option value="sale">Sale (Vente)</option>
                    <option value="purchase">Purchase (Achat)</option>
                    <option value="expense">Expense (Charge)</option>
                  </select>
                </div>
              </div>

              {formData.type !== 'expense' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Item (Stock)</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    value={formData.itemId}
                    onChange={e => handleItemChange(e.target.value)}
                    required={formData.type !== 'expense'}
                  >
                    <option value="">Select Item</option>
                    {inventory.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.name} (Stock: {item.quantity})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {formData.type === 'sale' ? 'Client' : 'Supplier/Payee'}
                </label>
                <input
                  type="text"
                  list="parties"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  value={formData.party}
                  onChange={e => setFormData({ ...formData, party: e.target.value })}
                />
                <datalist id="parties">
                  {parties.map((p, i) => <option key={i} value={p} />)}
                </datalist>
              </div>

              {formData.type !== 'expense' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                    <input
                      type="number"
                      required
                      min="1"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                      value={formData.quantity}
                      onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Unit Price</label>
                    <input
                      type="number"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                      value={formData.amount}
                      onChange={e => setFormData({ ...formData, amount: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {formData.type === 'sale' && (
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  {/* Delivery Selection */}
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Delivery</label>
                    <select
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 mb-2"
                      value={selectedCompany}
                      onChange={(e) => {
                        setSelectedCompany(e.target.value);
                        setFormData({ ...formData, deliveryCost: '' }); // Reset cost when company changes
                      }}
                    >
                      <option value="">Select Company</option>
                      {deliveryConfig.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>

                    {selectedCompany && (
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                        value={formData.deliveryCost} // We store the cost directly for simplicity, or could store rate ID
                        onChange={(e) => setFormData({ ...formData, deliveryCost: e.target.value })}
                      >
                        <option value="">Select City/Rate</option>
                        {deliveryConfig.find(c => c.id === selectedCompany)?.rates.map(r => (
                          <option key={r.id} value={r.cost}>{r.city} ({formatCurrency(r.cost)})</option>
                        ))}
                      </select>
                    )}
                    {!selectedCompany && (
                      <input
                        type="number"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                        value={formData.deliveryCost}
                        onChange={e => setFormData({ ...formData, deliveryCost: e.target.value })}
                        placeholder="Manual Cost (0.00)"
                      />
                    )}
                  </div>

                  {/* Packaging Selection */}
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Packaging</label>
                    <select
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 mb-2"
                      value={selectedPackaging}
                      onChange={(e) => {
                        setSelectedPackaging(e.target.value);
                        const pkg = packagingConfig.find(p => p.id === e.target.value);
                        if (pkg) {
                          setFormData({ ...formData, packagingCost: pkg.cost });
                        } else {
                          setFormData({ ...formData, packagingCost: '' });
                        }
                      }}
                    >
                      <option value="">Select Packaging</option>
                      {packagingConfig.map(p => <option key={p.id} value={p.id}>{p.name} ({formatCurrency(p.cost)})</option>)}
                    </select>
                    <input
                      type="number"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                      value={formData.packagingCost}
                      onChange={e => setFormData({ ...formData, packagingCost: e.target.value })}
                      placeholder="Manual Cost (0.00)"
                    />
                  </div>
                </div>
              )}

              {formData.type === 'expense' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Amount</label>
                    <input
                      type="number"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                      value={formData.amount}
                      onChange={e => setFormData({ ...formData, amount: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <input
                      type="text"
                      list="categories"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                    />
                    <datalist id="categories">
                      {categories.map((c, i) => <option key={i} value={c} />)}
                    </datalist>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Party</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTransactions.map(t => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${t.type === 'sale' ? 'bg-green-100 text-green-800' :
                      t.type === 'purchase' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                    }`}>
                    {t.type.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.party || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {t.itemId ? (inventory.find(i => i.id === t.itemId)?.name || 'Unknown Item') : t.category}
                  {t.quantity && ` x${t.quantity}`}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${t.type === 'sale' ? 'text-green-600' : 'text-red-600'
                  }`}>
                  {t.type === 'sale' ? '+' : '-'}{formatCurrency(t.amount || 0)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleDelete(t.id)} className="text-red-600 hover:text-red-900">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredTransactions.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const InventoryManager = ({ inventory, setInventory }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    buyPrice: '',
    sellPrice: '',
    quantity: '',
    lowStockThreshold: '5'
  });

  const handleExport = () => {
    const data = inventory.map(item => ({
      Name: item.name,
      'Buy Price': item.buyPrice,
      'Sell Price': item.sellPrice,
      Quantity: item.quantity,
      'Low Stock Threshold': item.lowStockThreshold,
      'Total Value': item.buyPrice * item.quantity
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventory");
    XLSX.writeFile(wb, `Inventory_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      setInventory(inventory.map(item => item.id === editingItem.id ? { ...formData, id: item.id } : item));
    } else {
      setInventory([...inventory, { ...formData, id: generateId() }]);
    }
    setShowForm(false);
    setEditingItem(null);
    setFormData({ name: '', buyPrice: '', sellPrice: '', quantity: '', lowStockThreshold: '5' });
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setInventory(inventory.filter(item => item.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800">Inventory Items</h3>
        <div className="flex space-x-2">
          <button
            onClick={handleExport}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700"
          >
            <Download size={20} />
            <span>Export Excel</span>
          </button>
          <button
            onClick={() => {
              setEditingItem(null);
              setFormData({ name: '', buyPrice: '', sellPrice: '', quantity: '', lowStockThreshold: '5' });
              setShowForm(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
          >
            <Plus size={20} />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h4 className="text-lg font-bold mb-4">{editingItem ? 'Edit Item' : 'Add New Item'}</h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Item Name</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Buy Price</label>
                  <input
                    type="number"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    value={formData.buyPrice}
                    onChange={e => setFormData({ ...formData, buyPrice: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sell Price</label>
                  <input
                    type="number"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    value={formData.sellPrice}
                    onChange={e => setFormData({ ...formData, sellPrice: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantity</label>
                  <input
                    type="number"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    value={formData.quantity}
                    onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Low Stock Alert</label>
                  <input
                    type="number"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    value={formData.lowStockThreshold}
                    onChange={e => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buy Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sell Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inventory.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                  {parseInt(item.quantity) <= parseInt(item.lowStockThreshold) && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                      Low Stock
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(item.buyPrice)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(item.sellPrice)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(item.quantity * item.buyPrice)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-900 mr-4">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {inventory.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                  No items in inventory. Add one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ReportView = ({ transactions, totalIncome, totalExpenses, netProfit }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const text = `Business Report\n\nTotal Income: ${formatCurrency(totalIncome)}\nTotal Expenses: ${formatCurrency(totalExpenses)}\nNet Profit: ${formatCurrency(netProfit)}\n\nGenerated by BizManager`;
    navigator.clipboard.writeText(text).then(() => alert('Report summary copied to clipboard!'));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center print:hidden">
        <h3 className="text-xl font-bold text-gray-800">Financial Report</h3>
        <div className="space-x-3">
          <button
            onClick={handleShare}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 inline-flex"
          >
            <Share2 size={20} />
            <span>Share Summary</span>
          </button>
          <button
            onClick={handlePrint}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-900 inline-flex"
          >
            <Printer size={20} />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 print:shadow-none print:border-none">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Business Financial Report</h1>
          <p className="text-gray-500 mt-2">Generated on {new Date().toLocaleDateString()}</p>
        </div>

        <div className="grid grid-cols-3 gap-8 mb-8">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-center print:border-gray-300">
            <p className="text-sm text-gray-500 uppercase tracking-wide">Total Income</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-center print:border-gray-300">
            <p className="text-sm text-gray-500 uppercase tracking-wide">Total Expenses</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-center print:border-gray-300">
            <p className="text-sm text-gray-500 uppercase tracking-wide">Net Profit</p>
            <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {formatCurrency(netProfit)}
            </p>
          </div>
        </div>

        <div className="overflow-hidden">
          <h4 className="text-lg font-bold mb-4 border-b pb-2">Transaction History</h4>
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-500">Date</th>
                <th className="px-4 py-2 text-left font-medium text-gray-500">Type</th>
                <th className="px-4 py-2 text-left font-medium text-gray-500">Party/Category</th>
                <th className="px-4 py-2 text-right font-medium text-gray-500">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map(t => (
                <tr key={t.id}>
                  <td className="px-4 py-2 text-gray-900">{t.date}</td>
                  <td className="px-4 py-2 capitalize">{t.type}</td>
                  <td className="px-4 py-2 text-gray-900">{t.party || t.category}</td>
                  <td className={`px-4 py-2 text-right font-medium ${t.type === 'sale' ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {t.type === 'sale' ? '+' : '-'}{formatCurrency(t.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-400 print:block hidden">
          <p>End of Report • BizManager</p>
        </div>
      </div>
    </div>
  );
};


const SettingsView = ({ deliveryConfig, setDeliveryConfig, packagingConfig, setPackagingConfig }) => {
  const [newCompany, setNewCompany] = useState('');
  const [newPackaging, setNewPackaging] = useState({ name: '', cost: '' });

  // Helper to add a company
  const addCompany = () => {
    if (!newCompany.trim()) return;
    setDeliveryConfig([...deliveryConfig, { id: generateId(), name: newCompany, rates: [] }]);
    setNewCompany('');
  };

  // Helper to delete a company
  const deleteCompany = (id) => {
    setDeliveryConfig(deliveryConfig.filter(c => c.id !== id));
  };

  // Helper to add a rate to a company
  const addRate = (companyId, city, cost) => {
    const updated = deliveryConfig.map(c => {
      if (c.id === companyId) {
        return { ...c, rates: [...c.rates, { id: generateId(), city, cost }] };
      }
      return c;
    });
    setDeliveryConfig(updated);
  };

  // Helper to delete a rate
  const deleteRate = (companyId, rateId) => {
    const updated = deliveryConfig.map(c => {
      if (c.id === companyId) {
        return { ...c, rates: c.rates.filter(r => r.id !== rateId) };
      }
      return c;
    });
    setDeliveryConfig(updated);
  };

  // Helper to add packaging
  const addPackaging = () => {
    if (!newPackaging.name.trim() || !newPackaging.cost) return;
    setPackagingConfig([...packagingConfig, { id: generateId(), ...newPackaging }]);
    setNewPackaging({ name: '', cost: '' });
  };

  // Helper to delete packaging
  const deletePackaging = (id) => {
    setPackagingConfig(packagingConfig.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Delivery Configuration */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Delivery Configuration</h3>

        {/* Add Company */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="New Delivery Company Name (e.g., Tawsil)"
            className="flex-1 border rounded-lg px-4 py-2"
            value={newCompany}
            onChange={(e) => setNewCompany(e.target.value)}
          />
          <button
            onClick={addCompany}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Company
          </button>
        </div>

        {/* Companies List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {deliveryConfig.map(company => (
            <div key={company.id} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h4 className="font-bold text-lg">{company.name}</h4>
                <button onClick={() => deleteCompany(company.id)} className="text-red-500 hover:text-red-700">
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Rates List */}
              <div className="space-y-2 mb-4">
                {company.rates.map(rate => (
                  <div key={rate.id} className="flex justify-between items-center text-sm bg-white p-2 rounded border">
                    <span>{rate.city}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{formatCurrency(rate.cost)}</span>
                      <button onClick={() => deleteRate(company.id, rate.id)} className="text-gray-400 hover:text-red-500">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                {company.rates.length === 0 && <p className="text-xs text-gray-400 italic">No rates defined.</p>}
              </div>

              {/* Add Rate Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const city = e.target.city.value;
                  const cost = e.target.cost.value;
                  if (city && cost) {
                    addRate(company.id, city, cost);
                    e.target.reset();
                  }
                }}
                className="flex gap-2"
              >
                <input name="city" placeholder="City" className="flex-1 border rounded px-2 py-1 text-sm" required />
                <input name="cost" type="number" placeholder="Cost" className="w-20 border rounded px-2 py-1 text-sm" required />
                <button type="submit" className="bg-green-600 text-white px-2 py-1 rounded text-sm hover:bg-green-700">
                  <Plus size={16} />
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>

      {/* Packaging Configuration */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Packaging Configuration</h3>

        {/* Add Packaging */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Packaging Name (e.g., Box S)"
            className="flex-1 border rounded-lg px-4 py-2"
            value={newPackaging.name}
            onChange={(e) => setNewPackaging({ ...newPackaging, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Cost"
            className="w-32 border rounded-lg px-4 py-2"
            value={newPackaging.cost}
            onChange={(e) => setNewPackaging({ ...newPackaging, cost: e.target.value })}
          />
          <button
            onClick={addPackaging}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Option
          </button>
        </div>

        {/* Packaging List */}
        <div className="overflow-hidden border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {packagingConfig.map(p => (
                <tr key={p.id}>
                  <td className="px-6 py-4 text-sm text-gray-900">{p.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(p.cost)}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => deletePackaging(p.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {packagingConfig.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">No packaging options defined.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default App;
