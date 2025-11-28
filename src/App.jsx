import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import * as XLSX from 'xlsx';
import { supabase } from './supabase';
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
  Settings,
  Users,
  LogOut,
  ShieldAlert
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// --- Utility Functions ---
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MAD' }).format(amount);
};

const generateId = () => Math.random().toString(36).substr(2, 9);

// --- Translations ---
const translations = {
  en: {
    dashboard: 'Dashboard',
    transactions: 'Transactions',
    inventory: 'Inventory',
    reports: 'Reports',
    settings: 'Settings',
    totalIncome: 'Total Income',
    totalExpenses: 'Total Expenses',
    netProfit: 'Net Profit',
    inventoryValue: 'Inventory Value',
    recentActivity: 'Recent Activity',
    date: 'Date',
    type: 'Type',
    details: 'Details',
    amount: 'Amount',
    actions: 'Actions',
    newTransaction: 'New Transaction',
    exportExcel: 'Export Excel',
    filter: 'Filter',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    sale: 'Sale',
    purchase: 'Purchase',
    expense: 'Expense',
    client: 'Client',
    supplier: 'Supplier/Payee',
    item: 'Item',
    quantity: 'Quantity',
    unitPrice: 'Unit Price',
    delivery: 'Delivery',
    packaging: 'Packaging',
    notes: 'Notes',
    addItem: 'Add Item',
    itemName: 'Item Name',
    buyPrice: 'Buy Price',
    sellPrice: 'Sell Price',
    lowStock: 'Low Stock',
    financialReport: 'Financial Report',
    shareSummary: 'Share Summary',
    printReport: 'Print Report',
    deliveryConfig: 'Delivery Configuration',
    packagingConfig: 'Packaging Configuration',
    addCompany: 'Add Company',
    addOption: 'Add Option',
    name: 'Name',
    cost: 'Cost',
    city: 'City',
    rates: 'Rates',
    noActivity: 'No recent activity',
    noTransactions: 'No transactions found.',
    noInventory: 'No items in inventory.',
    deleteConfirm: 'Are you sure?',
    stockInsufficient: 'Insufficient stock!',
    lowStockAlert: 'Low Stock Alert',
    users: 'Users',
    addUser: 'Add User',
    pin: 'PIN',
    role: 'Role',
    admin: 'Admin',
    staff: 'Staff',
    login: 'Login',
    logout: 'Logout',
    welcome: 'Welcome',
    accessDenied: 'Access Denied',
    incorrectPin: 'Incorrect PIN',
    income: 'Income',
    expenses: 'Expenses',
    incomeVsExpenses: 'Income vs Expenses',
    profit: 'Profit'
  },
  fr: {
    dashboard: 'Tableau de bord',
    transactions: 'Transactions',
    inventory: 'Stock',
    reports: 'Rapports',
    settings: 'Paramètres',
    totalIncome: 'Revenu Total',
    totalExpenses: 'Dépenses Totales',
    netProfit: 'Bénéfice Net',
    inventoryValue: 'Valeur du Stock',
    recentActivity: 'Activité Récente',
    date: 'Date',
    type: 'Type',
    details: 'Détails',
    amount: 'Montant',
    actions: 'Actions',
    newTransaction: 'Nouvelle Transaction',
    exportExcel: 'Exporter Excel',
    filter: 'Filtrer',
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    sale: 'Vente',
    purchase: 'Achat',
    expense: 'Dépense',
    client: 'Client',
    supplier: 'Fournisseur/Bénéficiaire',
    item: 'Article',
    quantity: 'Quantité',
    unitPrice: 'Prix Unitaire',
    delivery: 'Livraison',
    packaging: 'Emballage',
    notes: 'Notes',
    addItem: 'Ajouter Article',
    itemName: 'Nom de l\'article',
    buyPrice: 'Prix d\'achat',
    sellPrice: 'Prix de vente',
    lowStock: 'Stock Faible',
    financialReport: 'Rapport Financier',
    shareSummary: 'Partager Résumé',
    printReport: 'Imprimer',
    deliveryConfig: 'Configuration Livraison',
    packagingConfig: 'Configuration Emballage',
    addCompany: 'Ajouter Société',
    addOption: 'Ajouter Option',
    name: 'Nom',
    cost: 'Coût',
    city: 'Ville',
    rates: 'Tarifs',
    noActivity: 'Aucune activité récente',
    noTransactions: 'Aucune transaction trouvée.',
    noInventory: 'Aucun article en stock.',
    deleteConfirm: 'Êtes-vous sûr ?',
    stockInsufficient: 'Stock insuffisant !',
    lowStockAlert: 'Alerte Stock Faible',
    users: 'Utilisateurs',
    addUser: 'Ajouter Utilisateur',
    pin: 'Code PIN',
    role: 'Rôle',
    admin: 'Administrateur',
    staff: 'Staff',
    login: 'Connexion',
    logout: 'Déconnexion',
    welcome: 'Bienvenue',
    accessDenied: 'Accès Refusé',
    incorrectPin: 'Code PIN incorrect',
    income: 'Revenus',
    expenses: 'Dépenses',
    incomeVsExpenses: 'Revenus vs Dépenses',
    profit: 'Bénéfice'
  },
  ar: {
    dashboard: 'لوحة القيادة',
    transactions: 'المعاملات',
    inventory: 'المخزون',
    reports: 'التقارير',
    settings: 'الإعدادات',
    totalIncome: 'إجمالي الدخل',
    totalExpenses: 'إجمالي المصاريف',
    netProfit: 'صافي الربح',
    inventoryValue: 'قيمة المخزون',
    recentActivity: 'النشاط الأخير',
    date: 'التاريخ',
    type: 'النوع',
    details: 'التفاصيل',
    amount: 'المبلغ',
    actions: 'إجراءات',
    newTransaction: 'معاملة جديدة',
    exportExcel: 'تصدير إكسل',
    filter: 'تصفية',
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    sale: 'بيع',
    purchase: 'شراء',
    expense: 'مصروف',
    client: 'العميل',
    supplier: 'المورد/المستفيد',
    item: 'العنصر',
    quantity: 'الكمية',
    unitPrice: 'سعر الوحدة',
    delivery: 'التوصيل',
    packaging: 'التغليف',
    notes: 'ملاحظات',
    addItem: 'إضافة عنصر',
    itemName: 'اسم العنصر',
    buyPrice: 'سعر الشراء',
    sellPrice: 'سعر البيع',
    lowStock: 'مخزون منخفض',
    financialReport: 'التقرير المالي',
    shareSummary: 'مشاركة الملخص',
    printReport: 'طباعة التقرير',
    deliveryConfig: 'إعدادات التوصيل',
    packagingConfig: 'إعدادات التغليف',
    addCompany: 'إضافة شركة',
    addOption: 'إضافة خيار',
    name: 'الاسم',
    cost: 'التكلفة',
    city: 'المدينة',
    rates: 'الأسعار',
    noActivity: 'لا يوجد نشاط حديث',
    noTransactions: 'لم يتم العثور على معاملات.',
    noInventory: 'لا توجد عناصر في المخزون.',
    deleteConfirm: 'هل أنت متأكد؟',
    stockInsufficient: 'المخزون غير كاف!',
    lowStockAlert: 'تنبيه مخزون منخفض',
    users: 'المستخدمين',
    addUser: 'إضافة مستخدم',
    pin: 'الرمز السري',
    role: 'الدور',
    admin: 'مدير',
    staff: 'موظف',
    login: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
    welcome: 'مرحبا',
    accessDenied: 'تم رفض الوصول',
    incorrectPin: 'الرمز السري غير صحيح',
    income: 'الدخل',
    expenses: 'المصاريف',
    incomeVsExpenses: 'الدخل مقابل المصاريف',
    profit: 'الربح'
  }
};

const LoginScreen = ({ users, onLogin, t }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find(u => u.pin === pin);
    if (user) {
      onLogin(user);
    } else {
      setError(t('incorrectPin'));
      setPin('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Mabox.ma Management</h1>
          <p className="text-gray-500">{t('login')}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('pin')}</label>
            <input
              type="password"
              className="w-full text-center text-2xl tracking-widest border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              value={pin}
              onChange={(e) => { setPin(e.target.value); setError(''); }}
              maxLength={4}
              autoFocus
            />
          </div>

          {error && <p className="text-red-500 text-center text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {t('login')}
          </button>
        </form>
      </div>
    </div>
  );
};

const UserManagement = ({ users, setUsers, t }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', pin: '', role: 'staff' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from('app_users').insert([{ ...formData }]).select();
    if (data) {
      setUsers([...users, data[0]]);
      setShowForm(false);
      setFormData({ name: '', pin: '', role: 'staff' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('deleteConfirm'))) {
      if (users.length <= 1) {
        alert('Cannot delete the last user!');
        return;
      }
      await supabase.from('app_users').delete().eq('id', id);
      setUsers(users.filter(u => u.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800">{t('users')}</h3>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        >
          <Plus size={20} />
          <span>{t('addUser')}</span>
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h4 className="text-lg font-bold mb-4">{t('addUser')}</h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('name')}</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('pin')}</label>
                <input
                  type="text"
                  required
                  maxLength={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  value={formData.pin}
                  onChange={e => setFormData({ ...formData, pin: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('role')}</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="staff">{t('staff')}</option>
                  <option value="admin">{t('admin')}</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {t('save')}
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('name')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('role')}</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                    {t(user.role)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Main Component ---
function App() {
  // --- State ---
  const [transactions, setTransactions] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [deliveryConfig, setDeliveryConfig] = useState([]);
  const [packagingConfig, setPackagingConfig] = useState([]);
  const [view, setView] = useState('dashboard'); // dashboard, transactions, inventory, reports, settings, users
  const [language, setLanguage] = useState('en'); // en, fr, ar
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);

  // --- Initial Load (Supabase) ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: invData, error: invError } = await supabase.from('inventory').select('*');
        if (invError) throw invError;
        if (invData) setInventory(invData);

        const { data: txData, error: txError } = await supabase.from('transactions').select('*').order('date', { ascending: false });
        if (txError) throw txError;
        if (txData) setTransactions(txData);

        const { data: userData, error: userError } = await supabase.from('app_users').select('*');
        if (userError) throw userError;
        if (userData && userData.length > 0) {
          setUsers(userData);
        } else {
          // Auto-create default admin if no users exist
          console.log('No users found. Creating default Admin...');
          const { data: newAdmin, error: createError } = await supabase
            .from('app_users')
            .insert([{ name: 'Admin', pin: '1234', role: 'admin' }])
            .select();

          if (newAdmin) {
            setUsers(newAdmin);
            console.log('Default Admin created.');
          } else if (createError) {
            console.error('Failed to create default admin:', createError);
          }
        }

        const { data: delData, error: delError } = await supabase.from('delivery_config').select('*');
        if (delError) throw delError;
        if (delData) setDeliveryConfig(delData);

        const { data: pkgData, error: pkgError } = await supabase.from('packaging_config').select('*');
        if (pkgError) throw pkgError;
        if (pkgData) setPackagingConfig(pkgData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please check your connection and configuration.');
      }
    };

    fetchData();

    // Real-time subscriptions
    const invSub = supabase.channel('inventory').on('postgres_changes', { event: '*', schema: 'public', table: 'inventory' }, payload => {
      if (payload.eventType === 'INSERT') setInventory(prev => [...prev, payload.new]);
      if (payload.eventType === 'UPDATE') setInventory(prev => prev.map(i => i.id === payload.new.id ? payload.new : i));
      if (payload.eventType === 'DELETE') setInventory(prev => prev.filter(i => i.id !== payload.old.id));
    }).subscribe();

    const txSub = supabase.channel('transactions').on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, payload => {
      if (payload.eventType === 'INSERT') setTransactions(prev => [payload.new, ...prev]);
      // Note: For complex updates/deletes that affect order, re-fetching might be safer, but simple state updates work for now
      if (payload.eventType === 'DELETE') setTransactions(prev => prev.filter(t => t.id !== payload.old.id));
    }).subscribe();

    return () => {
      supabase.removeChannel(invSub);
      supabase.removeChannel(txSub);
    };
  }, []);

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

  const inventoryValue = inventory.reduce((sum, item) => {
    return sum + (parseFloat(item.buy_price || 0) * parseInt(item.quantity || 0));
  }, 0);

  // --- Helper Functions ---
  const t = (key) => translations[language][key] || key;
  const isRTL = language === 'ar';

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

  if (!currentUser) {
    return <LoginScreen users={users} onLogin={setCurrentUser} t={t} />;
  }

  return (
    <div className={`flex h-screen bg-gray-50 font-sans text-gray-900 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Sidebar */}
      <aside className={`w-64 bg-white border-r border-gray-200 flex flex-col ${isRTL ? 'border-l border-r-0' : ''}`}>
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-blue-600">Mabox.ma</h1>
            <p className="text-xs text-gray-500 mt-1">{t('welcome')}, {currentUser.name}</p>
          </div>
        </div>

        <div className="px-4 pt-4">
          <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
            {['en', 'fr', 'ar'].map(lang => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`flex-1 text-xs py-1 rounded-md uppercase font-bold ${language === lang ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavItem id="dashboard" icon={LayoutDashboard} label={t('dashboard')} />
          <NavItem id="transactions" icon={ArrowRightLeft} label={t('transactions')} />
          <NavItem id="inventory" icon={Package} label={t('inventory')} />
          {currentUser.role === 'admin' && (
            <>
              <NavItem id="reports" icon={FileText} label={t('reports')} />
              <NavItem id="settings" icon={Settings} label={t('settings')} />
              <NavItem id="users" icon={Users} label={t('users')} />
            </>
          )}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => setCurrentUser(null)}
            className="flex items-center space-x-3 w-full p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">{t('logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 capitalize">{t(view)}</h2>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString(language === 'ar' ? 'ar-MA' : language === 'fr' ? 'fr-FR' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
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
            t={t}
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
            t={t}
          />
        )}

        {view === 'inventory' && (
          <InventoryManager
            inventory={inventory}
            setInventory={setInventory}
            t={t}
          />
        )}

        {view === 'reports' && currentUser.role === 'admin' && (
          <ReportView
            transactions={transactions}
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
            netProfit={netProfit}
            t={t}
          />
        )}

        {view === 'settings' && currentUser.role === 'admin' && (
          <SettingsView
            deliveryConfig={deliveryConfig}
            setDeliveryConfig={setDeliveryConfig}
            packagingConfig={packagingConfig}
            setPackagingConfig={setPackagingConfig}
            t={t}
          />
        )}

        {view === 'users' && currentUser.role === 'admin' && (
          <UserManagement
            users={users}
            setUsers={setUsers}
            t={t}
          />
        )}

        {/* Access Denied Fallback */}
        {['reports', 'settings', 'users'].includes(view) && currentUser.role !== 'admin' && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <ShieldAlert size={48} className="mb-4 text-red-500" />
            <h3 className="text-xl font-bold">{t('accessDenied')}</h3>
            <p>{t('adminOnly')}</p>
          </div>
        )}
      </main>
    </div>
  );
}

// --- Placeholder Sub-Components ---

const Dashboard = ({ totalIncome, totalExpenses, netProfit, inventoryValue, transactions, t }) => {
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title={t('totalIncome')} value={totalIncome} icon={TrendingUp} color="green" />
        <MetricCard title={t('totalExpenses')} value={totalExpenses} icon={TrendingDown} color="red" />
        <MetricCard title={t('netProfit')} value={netProfit} icon={ArrowRightLeft} color={netProfit >= 0 ? 'blue' : 'red'} />
        <MetricCard title={t('inventoryValue')} value={inventoryValue} icon={Package} color="purple" />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">{t('recentActivity')}</h3>
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('date')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('type')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('details')}</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('amount')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentTransactions.map(tItem => (
                <tr key={tItem.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tItem.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap capitalize text-sm text-gray-900">{t(tItem.type)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tItem.party || tItem.category || '-'}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${tItem.type === 'sale' ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {tItem.type === 'sale' ? '+' : '-'}{formatCurrency(tItem.amount)}
                  </td>
                </tr>
              ))}
              {recentTransactions.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">{t('noActivity')}</td>
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

const TransactionManager = ({ transactions, setTransactions, inventory, setInventory, deliveryConfig, packagingConfig, t }) => {
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
      Item: t.item_id ? (inventory.find(i => i.id === t.item_id)?.name || 'Unknown') : '',
      Quantity: t.quantity,
      Amount: t.amount,
      'Delivery Cost': t.delivery_cost || 0,
      'Packaging Cost': t.packaging_cost || 0,
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
        amount: formData.type === 'sale' ? item.sell_price : item.buy_price
      });
    } else {
      setFormData({ ...formData, itemId, amount: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTransaction = {
      ...formData,
      amount: parseFloat(formData.amount) * (formData.quantity || 1),
      delivery_cost: parseFloat(formData.deliveryCost) || 0,
      packaging_cost: parseFloat(formData.packagingCost) || 0,
      item_id: formData.itemId || null
    };

    // Remove camelCase keys that don't match DB columns if necessary, or just rely on Supabase ignoring extra fields if configured, 
    // but better to be precise. We'll construct the DB object explicitly.
    const dbTransaction = {
      date: newTransaction.date,
      type: newTransaction.type,
      category: newTransaction.category,
      party: newTransaction.party,
      item_id: newTransaction.item_id,
      quantity: newTransaction.quantity,
      amount: newTransaction.amount,
      notes: newTransaction.notes,
      delivery_cost: newTransaction.delivery_cost,
      packaging_cost: newTransaction.packaging_cost
    };

    const { data: txData, error: txError } = await supabase.from('transactions').insert([dbTransaction]).select();

    if (txData) {
      // Inventory Logic (Supabase)
      if (formData.type === 'sale' && formData.itemId) {
        const item = inventory.find(i => i.id === formData.itemId);
        if (item) {
          if (parseInt(item.quantity) < parseInt(formData.quantity)) {
            alert(t('stockInsufficient'));
            return;
          }
          const newQty = parseInt(item.quantity) - parseInt(formData.quantity);
          await supabase.from('inventory').update({ quantity: newQty }).eq('id', formData.itemId);
        }
      } else if (formData.type === 'purchase' && formData.itemId) {
        const item = inventory.find(i => i.id === formData.itemId);
        if (item) {
          // WAC Logic
          const currentQty = parseInt(item.quantity);
          const newQty = parseInt(formData.quantity);
          const currentBuyPrice = parseFloat(item.buy_price);
          const purchasePrice = parseFloat(formData.amount);

          const totalValue = (currentQty * currentBuyPrice) + (newQty * purchasePrice);
          const totalQty = currentQty + newQty;
          const newBuyPrice = totalQty > 0 ? totalValue / totalQty : purchasePrice;

          await supabase.from('inventory').update({ quantity: totalQty, buy_price: newBuyPrice }).eq('id', formData.itemId);
        }
      }

      // setTransactions is handled by real-time subscription in App.jsx, but we can update locally for instant feedback if needed.
      // For now, we rely on the subscription or parent refresh. 
      // Actually, App.jsx passes setTransactions. We should probably let the subscription handle it to avoid double entry if we are not careful.
      // But to be safe and responsive:
      // setTransactions([txData[0], ...transactions]); 

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
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('deleteConfirm'))) {
      const transaction = transactions.find(t => t.id === id);

      if (transaction && transaction.item_id) {
        const item = inventory.find(i => i.id === transaction.item_id);
        if (item) {
          let newQuantity = parseInt(item.quantity);

          if (transaction.type === 'sale') {
            newQuantity += parseInt(transaction.quantity);
          } else if (transaction.type === 'purchase') {
            newQuantity -= parseInt(transaction.quantity);
          }

          await supabase.from('inventory').update({ quantity: newQuantity }).eq('id', transaction.item_id);
        }
      }

      await supabase.from('transactions').delete().eq('id', id);
      // setTransactions handled by subscription
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h3 className="text-xl font-bold text-gray-800">{t('transactions')}</h3>

        <div className="flex items-center space-x-2 bg-white p-2 rounded-lg border border-gray-200">
          <span className="text-sm text-gray-500">{t('filter')}:</span>
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
            <span>{t('exportExcel')}</span>
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
          >
            <Plus size={20} />
            <span>{t('newTransaction')}</span>
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h4 className="text-lg font-bold mb-4">{t('newTransaction')}</h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('date')}</label>
                  <input
                    type="date"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('type')}</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    value={formData.type}
                    onChange={e => handleTypeChange(e.target.value)}
                  >
                    <option value="sale">{t('sale')}</option>
                    <option value="purchase">{t('purchase')}</option>
                    <option value="expense">{t('expense')}</option>
                  </select>
                </div>
              </div>

              {formData.type !== 'expense' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('item')}</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    value={formData.itemId}
                    onChange={e => handleItemChange(e.target.value)}
                    required={formData.type !== 'expense'}
                  >
                    <option value="">{t('item')}</option>
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
                  {formData.type === 'sale' ? t('client') : t('supplier')}
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
                    <label className="block text-sm font-medium text-gray-700">{t('quantity')}</label>
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
                    <label className="block text-sm font-medium text-gray-700">{t('unitPrice')}</label>
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
                    <label className="block text-sm font-medium text-gray-700">{t('delivery')}</label>
                    <select
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 mb-2"
                      value={selectedCompany}
                      onChange={(e) => {
                        setSelectedCompany(e.target.value);
                        setFormData({ ...formData, deliveryCost: '' }); // Reset cost when company changes
                      }}
                    >
                      <option value="">{t('addCompany')}</option>
                      {deliveryConfig.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>

                    {selectedCompany && (
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                        value={formData.deliveryCost} // We store the cost directly for simplicity, or could store rate ID
                        onChange={(e) => setFormData({ ...formData, deliveryCost: e.target.value })}
                      >
                        <option value="">{t('city')}</option>
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
                    <label className="block text-sm font-medium text-gray-700">{t('packaging')}</label>
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
                      <option value="">{t('addOption')}</option>
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
                    <label className="block text-sm font-medium text-gray-700">{t('amount')}</label>
                    <input
                      type="number"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                      value={formData.amount}
                      onChange={e => setFormData({ ...formData, amount: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('type')}</label>
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
                <label className="block text-sm font-medium text-gray-700">{t('notes')}</label>
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
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {t('save')}
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('date')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('type')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('client')}/{t('supplier')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('details')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('amount')}</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTransactions.map(tItem => (
              <tr key={tItem.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tItem.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${tItem.type === 'sale' ? 'bg-green-100 text-green-800' :
                      tItem.type === 'purchase' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                    }`}>
                    {t(tItem.type)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tItem.party || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tItem.itemId ? (inventory.find(i => i.id === tItem.itemId)?.name || 'Unknown Item') : tItem.category}
                  {tItem.quantity && ` x${tItem.quantity}`}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${tItem.type === 'sale' ? 'text-green-600' : 'text-red-600'
                  }`}>
                  {tItem.type === 'sale' ? '+' : '-'}{formatCurrency(tItem.amount || 0)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleDelete(tItem.id)} className="text-red-600 hover:text-red-900">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredTransactions.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                  {t('noTransactions')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const InventoryManager = ({ inventory, setInventory, t }) => {
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    buyPrice: '',
    sellPrice: '',
    quantity: '',
    lowStockThreshold: 5
  });

  const handleExport = () => {
    const data = inventory.map(item => ({
      Name: item.name,
      'Buy Price': item.buy_price,
      'Sell Price': item.sell_price,
      Quantity: item.quantity,
      'Low Stock Threshold': item.low_stock_threshold,
      'Total Value': item.buy_price * item.quantity
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventory");
    XLSX.writeFile(wb, `Inventory_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dbItem = {
      name: formData.name,
      quantity: parseInt(formData.quantity),
      buy_price: parseFloat(formData.buyPrice),
      sell_price: parseFloat(formData.sellPrice),
      low_stock_threshold: parseInt(formData.lowStockThreshold)
    };

    if (isEditing) {
      await supabase.from('inventory').update(dbItem).eq('id', formData.id);
    } else {
      await supabase.from('inventory').insert([dbItem]);
    }

    setShowForm(false);
    setFormData({ name: '', quantity: '', buyPrice: '', sellPrice: '', lowStockThreshold: 5 });
    setIsEditing(false);
  };

  const handleEdit = (item) => {
    setFormData({ ...item, buyPrice: item.buy_price, sellPrice: item.sell_price, lowStockThreshold: item.low_stock_threshold }); // Map DB snake_case to form camelCase
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('deleteConfirm'))) {
      await supabase.from('inventory').delete().eq('id', id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800">{t('inventory')}</h3>
        <div className="flex space-x-2">
          <button
            onClick={handleExport}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700"
          >
            <Download size={20} />
            <span>{t('exportExcel')}</span>
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setFormData({ name: '', buyPrice: '', sellPrice: '', quantity: '', lowStockThreshold: 5 });
              setShowForm(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
          >
            <Plus size={20} />
            <span>{t('addItem')}</span>
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h4 className="text-lg font-bold mb-4">{isEditing ? t('edit') : t('addItem')}</h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('itemName')}</label>
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
                  <label className="block text-sm font-medium text-gray-700">{t('buyPrice')}</label>
                  <input
                    type="number"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    value={formData.buyPrice}
                    onChange={e => setFormData({ ...formData, buyPrice: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('sellPrice')}</label>
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
                  <label className="block text-sm font-medium text-gray-700">{t('quantity')}</label>
                  <input
                    type="number"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    value={formData.quantity}
                    onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('lowStockAlert')}</label>
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
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {t('save')}
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('item')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('quantity')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('buyPrice')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('sellPrice')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('inventoryValue')}</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inventory.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                  {parseInt(item.quantity) <= parseInt(item.lowStockThreshold) && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                      {t('lowStock')}
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
                  {t('noInventory')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ReportView = ({ transactions, totalIncome, totalExpenses, netProfit, t }) => {
  const reportRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => reportRef.current,
  });

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Financial Report',
          text: `Net Profit: ${formatCurrency(netProfit)}\nTotal Income: ${formatCurrency(totalIncome)}\nTotal Expenses: ${formatCurrency(totalExpenses)}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      alert('Web Share API not supported');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center print:hidden">
        <h3 className="text-xl font-bold text-gray-800">{t('financialReport')}</h3>
        <div className="flex space-x-2">
          <button onClick={handleShare} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700">
            <Share2 size={20} />
            <span>{t('shareSummary')}</span>
          </button>
          <button onClick={handlePrint} className="bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-900">
            <Printer size={20} />
            <span>{t('printReport')}</span>
          </button>
        </div>
      </div>

      <div ref={reportRef} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 print:shadow-none print:border-none">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Mabox.ma Management</h1>
          <p className="text-gray-500">{t('financialReport')}</p>
          <p className="text-sm text-gray-400 mt-1">{new Date().toLocaleDateString()}</p>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="p-4 bg-green-50 rounded-lg border border-green-100 text-center">
            <p className="text-sm text-green-600 font-medium">{t('totalIncome')}</p>
            <p className="text-2xl font-bold text-green-700">{formatCurrency(totalIncome)}</p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg border border-red-100 text-center">
            <p className="text-sm text-red-600 font-medium">{t('totalExpenses')}</p>
            <p className="text-2xl font-bold text-red-700">{formatCurrency(totalExpenses)}</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 text-center">
            <p className="text-sm text-blue-600 font-medium">{t('netProfit')}</p>
            <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {formatCurrency(netProfit)}
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 print:break-inside-avoid">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 h-80">
            <h4 className="text-sm font-bold text-gray-700 mb-4 text-center">{t('incomeVsExpenses')}</h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: t('income'), amount: totalIncome, fill: '#16a34a' },
                  { name: t('expenses'), amount: totalExpenses, fill: '#dc2626' },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="amount" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 h-80">
            <h4 className="text-sm font-bold text-gray-700 mb-4 text-center">{t('profit')}</h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: t('netProfit'), amount: netProfit, fill: netProfit >= 0 ? '#2563eb' : '#dc2626' },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="amount" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-4">{t('recentActivity')}</h4>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t('date')}</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t('details')}</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">{t('amount')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.slice(0, 10).map(tItem => (
                <tr key={tItem.id}>
                  <td className="px-4 py-2 text-sm text-gray-500">{tItem.date}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">
                    {t(tItem.type)} - {tItem.party || tItem.category}
                  </td>
                  <td className={`px-4 py-2 text-right font-medium ${tItem.type === 'sale' ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {tItem.type === 'sale' ? '+' : '-'}{formatCurrency(tItem.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-400 print:block hidden">
          <p>End of Report • Mabox.ma Management</p>
        </div>
      </div>
    </div>
  );
};


const SettingsView = ({ deliveryConfig, setDeliveryConfig, packagingConfig, setPackagingConfig, t }) => {
  const [newCompany, setNewCompany] = useState({ name: '' });
  const [newRate, setNewRate] = useState({ city: '', cost: '' });
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [newPackaging, setNewPackaging] = useState({ name: '', cost: '' });

  // Helper to add a company
  const handleAddDeliveryCompany = async () => {
    if (newCompany.name) {
      const { data } = await supabase.from('delivery_config').insert([{ name: newCompany.name, rates: [] }]).select();
      if (data) {
        setDeliveryConfig([...deliveryConfig, data[0]]);
        setNewCompany({ name: '' });
      }
    }
  };

  const handleDeleteDeliveryCompany = async (id) => {
    if (window.confirm(t('deleteConfirm'))) {
      await supabase.from('delivery_config').delete().eq('id', id);
      setDeliveryConfig(deliveryConfig.filter(c => c.id !== id));
      if (selectedCompanyId === id) setSelectedCompanyId(null);
    }
  };

  const handleAddRate = async (companyId) => {
    if (newRate.city && newRate.cost) {
      const company = deliveryConfig.find(c => c.id === companyId);
      const updatedRates = [...(company.rates || []), { ...newRate, id: generateId() }]; // Add ID for key prop

      await supabase.from('delivery_config').update({ rates: updatedRates }).eq('id', companyId);

      setDeliveryConfig(deliveryConfig.map(c =>
        c.id === companyId ? { ...c, rates: updatedRates } : c
      ));
      setNewRate({ city: '', cost: '' });
    }
  };

  const handleDeleteRate = async (companyId, rateIndex) => {
    const company = deliveryConfig.find(c => c.id === companyId);
    const updatedRates = company.rates.filter((_, index) => index !== rateIndex);

    await supabase.from('delivery_config').update({ rates: updatedRates }).eq('id', companyId);

    setDeliveryConfig(deliveryConfig.map(c =>
      c.id === companyId ? { ...c, rates: updatedRates } : c
    ));
  };

  // Helper to add packaging
  const handleAddPackaging = async () => {
    if (newPackaging.name && newPackaging.cost) {
      const { data } = await supabase.from('packaging_config').insert([{ name: newPackaging.name, cost: parseFloat(newPackaging.cost) }]).select();
      if (data) {
        setPackagingConfig([...packagingConfig, data[0]]);
        setNewPackaging({ name: '', cost: '' });
      }
    }
  };

  const handleDeletePackaging = async (id) => {
    if (window.confirm(t('deleteConfirm'))) {
      await supabase.from('packaging_config').delete().eq('id', id);
      setPackagingConfig(packagingConfig.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      {/* Delivery Configuration */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4">{t('deliveryConfig')}</h3>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder={t('companyName')}
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
            value={newCompany.name}
            onChange={e => setNewCompany({ ...newCompany, name: e.target.value })}
          />
          <button
            onClick={handleAddDeliveryCompany}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={18} /> {t('add')}
          </button>
        </div>

        <div className="space-y-4">
          {deliveryConfig.map(company => (
            <div key={company.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-lg">{company.name}</h4>
                <button
                  onClick={() => handleDeleteDeliveryCompany(company.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Rates */}
              <div className="pl-4 border-l-2 border-gray-100">
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder={t('city')}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 text-sm"
                    value={selectedCompanyId === company.id ? newRate.city : ''}
                    onChange={e => {
                      setSelectedCompanyId(company.id);
                      setNewRate({ ...newRate, city: e.target.value });
                    }}
                  />
                  <input
                    type="number"
                    placeholder={t('cost')}
                    className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 text-sm"
                    value={selectedCompanyId === company.id ? newRate.cost : ''}
                    onChange={e => {
                      setSelectedCompanyId(company.id);
                      setNewRate({ ...newRate, cost: e.target.value });
                    }}
                  />
                  <button
                    onClick={() => handleAddRate(company.id)}
                    className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="space-y-1">
                  {company.rates && company.rates.map((rate, index) => (
                    <div key={index} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                      <span>{rate.city}</span>
                      <div className="flex items-center gap-4">
                        <span className="font-medium">{formatCurrency(rate.cost)}</span>
                        <button
                          onClick={() => handleDeleteRate(company.id, index)}
                          className="text-red-400 hover:text-red-600"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Packaging Configuration */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4">{t('packagingConfig')}</h3>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder={t('packagingName')}
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
            value={newPackaging.name}
            onChange={e => setNewPackaging({ ...newPackaging, name: e.target.value })}
          />
          <input
            type="number"
            placeholder={t('cost')}
            className="w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
            value={newPackaging.cost}
            onChange={e => setNewPackaging({ ...newPackaging, cost: e.target.value })}
          />
          <button
            onClick={handleAddPackaging}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={18} /> {t('add')}
          </button>
        </div>

        <div className="space-y-2">
          {packagingConfig.map(pkg => (
            <div key={pkg.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
              <span className="font-medium">{pkg.name}</span>
              <div className="flex items-center gap-4">
                <span className="text-gray-600">{formatCurrency(pkg.cost)}</span>
                <button
                  onClick={() => handleDeletePackaging(pkg.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
