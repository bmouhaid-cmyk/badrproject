import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import * as XLSX from 'xlsx';
import { supabase } from './supabase';
import {
  DigitalDashboard,
  DigitalAbonnementsManager,
  DigitalInventoryManager,
  DigitalTreasuryManager,
  DigitalTransactionsManager,
  DigitalSuppliersManager,
  DigitalReportView
} from './DigitalModules';
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
  ShieldAlert,
  X,
  Menu,
  User,
  Copy,
  Check,
  Truck,
  Phone,
  Landmark,
  Wallet,
  ArrowDown,
  ArrowUp,
  ArrowRight,
  WalletCards,
  ShoppingCart,
  CreditCard,
  Eye,
  AlertCircle,
  BarChart2,
  UserPlus,
  Archive,
  RotateCcw,
  Hourglass,
  MonitorSmartphone,
  Filter,
  History
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// --- Utility Functions ---
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MAD' }).format(amount);
};

const generateId = () => Math.random().toString(36).substr(2, 9);

// --- Translations ---
const translations = {
  en: {
    dashboard: 'Dashboard',
    archives: 'Archives',
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
    unitPrice: 'Total Amount',
    delivery: 'Delivery',
    packaging: 'Packaging',
    phone: 'Phone',
    address: 'Address',
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
    deleteConfirm: 'Are you sure you want to delete this item?',
    deleteSelected: 'Delete Selected',
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
    adminOnly: 'This area is restricted to administrators.',
    pending: 'Pending',
    completed: 'Completed',
    refused: 'Refused',
    incorrectPin: 'Incorrect PIN',
    income: 'Income',
    expenses: 'Expenses',
    incomeVsExpenses: 'Income vs Expenses',
    profit: 'Profit',
    selectedSummary: 'Selected Summary',
    items: 'items',
    revenue: 'Revenue',
    monthlyTrend: 'Monthly Trend',
    expenseBreakdown: 'Expense Breakdown',
    topItems: 'Top Items',
    pendingCollection: 'Pending Collection',
    profitMargin: 'Profit Margin',
    history: 'History',
    inventoryHistory: 'Inventory History',
    supplierPayments: 'Supplier Payments',
    treasury: 'Treasury & Banks',
    bankAccounts: 'Bank Accounts',
    internalTransfer: 'Internal Transfer',
    manageAccounts: 'Manage Accounts',
    adjustBalance: 'Adjustment / Movement'
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
    unitPrice: 'Montant Total',
    delivery: 'Livraison',
    packaging: 'Emballage',
    phone: 'Téléphone',
    address: 'Adresse',
    status: 'Statut',
    notes: 'Notes',
    addItem: 'Ajouter Article',
    itemName: 'Nom de l\'article',
    supplier: 'Fournisseur',
    buyPrice: 'Prix d\'achat',
    sellPrice: 'Prix de vente',
    deliveryCompany: 'Société de Livraison',
    lowStock: 'Stock Faible',
    suppliers: 'Fournisseurs',
    pendingBalance: 'Reste à payer',
    pendingCollection: 'Reste à encaisser',
    profitMargin: 'Marge Bénéficiaire',
    financialReport: 'Rapport Financier',
    thisMonth: 'Ce Mois',
    lastMonth: 'Mois Dernier',
    thisYear: 'Cette Année',
    allTime: 'Tout le temps',
    monthlyTrend: 'Tendance Mensuelle',
    digital_dashboard: 'Tableau de bord Digital',
    digital_abonnements: 'Abonnements',
    digital_inventory: 'Produits Digitaux',
    digital_treasury: 'Trésorerie Digitale',
    digital_transactions: 'Transactions Digitales',
    expenseBreakdown: 'Répartition des Dépenses',
    topItems: 'Meilleurs Produits',
    revenue: 'Chiffre d\'affaires',
    expenses: 'Dépenses',
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
    deleteConfirm: 'Êtes-vous sûr de vouloir supprimer cet élément ?',
    deleteSelected: 'Supprimer la sélection',
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
    adminOnly: 'Cette zone est réservée aux administrateurs.',
    pending: 'En attente',
    completed: 'Terminé',
    refused: 'Refusé',
    incorrectPin: 'Code PIN incorrect',
    income: 'Revenus',
    expenses: 'Dépenses',
    incomeVsExpenses: 'Revenus vs Dépenses',
    profit: 'Bénéfice',
    selectedSummary: 'Résumé de la sélection',
    items: 'éléments',
    revenue: 'Revenue',
    monthlyTrend: 'Monthly Trend',
    expenseBreakdown: 'Expense Breakdown',
    topItems: 'Top Items',
    pendingCollection: 'Pending Collection',
    profitMargin: 'Profit Margin',
    history: 'Historique',
    inventoryHistory: 'Historique Stock',
    supplierPayments: 'Paiements Fournisseurs',
    treasury: 'Trésorerie & Banques',
    bankAccounts: 'Comptes Bancaires',
    internalTransfer: 'Virement Interne',
    manageAccounts: 'Gérer les Comptes',
    adjustBalance: 'Ajustement / Mouvement'
  },
  ar: {
    dashboard: 'لوحة القيادة',
    archives: 'الأرشيف',
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
    unitPrice: 'المبلغ الإجمالي',
    delivery: 'التوصيل',
    packaging: 'التغليف',
    phone: 'الهاتف',
    address: 'العنوان',
    status: 'الحالة',
    notes: 'ملاحظات',
    addItem: 'إضافة عنصر',
    itemName: 'اسم العنصر',
    supplier: 'المورد',
    buyPrice: 'سعر الشراء',
    sellPrice: 'سعر البيع',
    deliveryCompany: 'شركة التوصيل',
    lowStock: 'مخزون منخفض',
    suppliers: 'الموردين',
    pendingBalance: 'الباقي للدفع',
    pendingCollection: 'الباقي للتحصيل',
    profitMargin: 'هامش الربح',
    financialReport: 'التقرير المالي',
    thisMonth: 'هذا الشهر',
    lastMonth: 'الشهر الماضي',
    thisYear: 'هذه السنة',
    allTime: 'كل الوقت',
    monthlyTrend: 'الاتجاه الشهري',
    expenseBreakdown: 'توزيع المصاريف',
    topItems: 'أفضل المنتجات',
    revenue: 'الإيرادات',
    expenses: 'المصاريف',
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
    adminOnly: 'هذه المنطقة مخصصة للمسؤولين فقط.',
    pending: 'قيد الانتظار',
    completed: 'مكتمل',
    refused: 'مرفوض',
    incorrectPin: 'الرمز السري غير صحيح',
    income: 'الدخل',
    expenses: 'المصاريف',
    incomeVsExpenses: 'الدخل مقابل المصاريف',
    profit: 'الربح',
    selectedSummary: 'ملخص المحدد',
    items: 'عناصر',
    revenue: 'الإيرادات',
    monthlyTrend: 'الاتجاه الشهري',
    expenseBreakdown: 'توزيع المصاريف',
    topItems: 'أفضل العناصر',
    pendingCollection: 'مبالغ قيد التحصيل',
    profitMargin: 'هامش الربح',
    history: 'السجل',
    inventoryHistory: 'سجل المخزون',
    supplierPayments: 'مدفوعات الموردين',
    treasury: 'الخزينة والبنوك',
    bankAccounts: 'الحسابات البنكية',
    internalTransfer: 'تحويل داخلي',
    manageAccounts: 'إدارة الحسابات',
    adjustBalance: 'تعديل / حركة'
  }
};

const LoginScreen = ({ users, onLogin, t }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find(u => String(u.pin) === pin);
    if (user) {
      onLogin(user);
    } else {
      setError(t('incorrectPin'));
      setPin('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 transition-colors duration-200">
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
              className="w-full text-center text-2xl tracking-widest border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white border-gray-300 text-gray-900"
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

    const handleArchive = async (tItem) => {
    if (tItem.status !== 'completed') return alert("Vous ne pouvez archiver que les transactions complétées.");
    if (window.confirm("Voulez-vous archiver cette transaction ?")) {
      const { error } = await supabase.from('transactions').update({ is_archived: true }).eq('id', tItem.id);
      if (!error) {
        setTransactions(prev => prev.map(t => t.id === tItem.id ? { ...t, is_archived: true } : t));
      } else {
        alert("Error archiving: " + error.message);
      }
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
            <h4 className="text-lg font-bold mb-4 text-gray-800">{t('addUser')}</h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('name')}</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 bg-white text-gray-900"
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 bg-white text-gray-900"
                  value={formData.pin}
                  onChange={e => setFormData({ ...formData, pin: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('role')}</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 bg-white text-gray-900"
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
              <tr key={user.id} className="hover:bg-gray-50:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                    {t(user.role)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900:text-red-300">
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


const ArchiveManager = ({ transactions, setTransactions, t, supabase }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  
  const archivedTransactions = transactions.filter(t => t.is_archived);
  
  const filteredArchived = archivedTransactions.filter(t => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const itemNameStr = typeof t.item_name === 'string' ? t.item_name : String(t.item_name || '');
    const partyStr = typeof t.party === 'string' ? t.party : String(t.party || '');
    const categoryStr = typeof t.category === 'string' ? t.category : String(t.category || '');
    return itemNameStr.toLowerCase().includes(term) || 
           partyStr.toLowerCase().includes(term) || 
           categoryStr.toLowerCase().includes(term);
  });

  const handleUnarchive = async (id) => {
    const { error } = await supabase.from('transactions').update({ is_archived: false }).eq('id', id);
    if (!error) {
      setTransactions(prev => prev.map(t => t.id === id ? { ...t, is_archived: false } : t));
    } else {
      alert("Error unarchiving: " + error.message);
    }
  };

  const handleArchivePeriod = async () => {
    try {
      if (!startDate || !endDate) return alert("Veuillez sélectionner les dates.");
      if (window.confirm(`Êtes-vous sûr de vouloir archiver les transactions entre le ${startDate} et le ${endDate} ?`)) {
        const idsToArchive = transactions.filter(t => t && !t.is_archived && t.status === 'completed' && t.date && t.date >= startDate && t.date <= endDate).map(t => t.id);
        if (idsToArchive.length === 0) return alert("Aucune transaction trouvée pour cette période.");
        
        const { error } = await supabase.from('transactions').update({ is_archived: true }).in('id', idsToArchive);
        if (!error) {
          setTransactions(prev => prev.map(t => idsToArchive.includes(t?.id) ? { ...t, is_archived: true } : t));
          alert("Période archivée avec succès !");
        } else {
          alert("Erreur lors de l'archivage: " + error.message);
        }
      }
    } catch (err) {
      console.error("Crash dans handleArchivePeriod:", err);
      alert("Une erreur inattendue s'est produite.");
    }
  };

  
  const handleUnarchiveSelected = async () => {
    if (selectedIds.length === 0) return alert("Veuillez sélectionner au moins une transaction.");
    if (window.confirm(`Êtes-vous sûr de vouloir désarchiver ${selectedIds.length} transaction(s) ?`)) {
      const { error } = await supabase.from('transactions').update({ is_archived: false }).in('id', selectedIds);
      if (!error) {
        setTransactions(prev => prev.map(t => selectedIds.includes(t.id) ? { ...t, is_archived: false } : t));
        setSelectedIds([]);
        alert("Transactions désarchivées avec succès !");
      } else {
        alert("Erreur: " + error.message);
      }
    }
  };

  const handleUnarchivePeriod = async () => {
    try {
      if (!startDate || !endDate) return alert("Veuillez sélectionner les dates.");
      if (window.confirm(`Êtes-vous sûr de vouloir désarchiver les transactions entre le ${startDate} et le ${endDate} ?`)) {
        const idsToUnarchive = transactions.filter(t => t && t.is_archived && t.date && t.date >= startDate && t.date <= endDate).map(t => t.id);
        if (idsToUnarchive.length === 0) return alert("Aucune transaction archivée trouvée pour cette période.");
        
        const { error } = await supabase.from('transactions').update({ is_archived: false }).in('id', idsToUnarchive);
        if (!error) {
          setTransactions(prev => prev.map(t => idsToUnarchive.includes(t?.id) ? { ...t, is_archived: false } : t));
          alert("Période désarchivée avec succès !");
        } else {
          alert("Erreur lors du désarchivage: " + error.message);
        }
      }
    } catch (err) {
      console.error("Crash dans handleUnarchivePeriod:", err);
      alert("Une erreur inattendue s'est produite.");
    }
  };

  const handleArchiveAll = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir archiver le chapitre actuel ? Toutes les transactions complétées seront archivées. Vos soldes resteront intacts.")) {
      const idsToArchive = transactions.filter(t => !t.is_archived && t.status === 'completed').map(t => t.id);
      if (idsToArchive.length === 0) return alert("Aucune transaction à archiver.");
      
      const { error } = await supabase.from('transactions').update({ is_archived: true }).in('id', idsToArchive);
      if (!error) {
        setTransactions(prev => prev.map(t => idsToArchive.includes(t.id) ? { ...t, is_archived: true } : t));
        alert("Chapitre archivé avec succès !");
      } else {
        alert("Error archiving: " + error.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gray-100 text-gray-600 rounded-lg">
            <Archive size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Archives des Transactions</h3>
            <p className="text-sm text-gray-500">Chapitres précédents et historique caché.</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-3 items-center">
          <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg border border-gray-200">
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="text-sm border-gray-300 rounded p-1" />
            <span className="text-gray-500 text-sm">à</span>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="text-sm border-gray-300 rounded p-1" />
            <button onClick={handleArchivePeriod} className="bg-orange-500 text-white px-3 py-1.5 rounded text-sm hover:bg-orange-600">
              Archiver Période
            </button>
            <button onClick={handleUnarchivePeriod} className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700">
              Désarchiver Période
            </button>
          </div>
          <button onClick={handleArchiveAll} className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-red-700 whitespace-nowrap">
            Archiver Tout (Chapitre)
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
             <input type="text" placeholder="Rechercher dans les archives..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full md:w-1/3 border rounded-lg p-2 text-sm" />
             {selectedIds.length > 0 && (
               <button onClick={handleUnarchiveSelected} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-blue-700 flex items-center gap-2">
                 <RotateCcw size={18} />
                 Désarchiver Sélection ({selectedIds.length})
               </button>
             )}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input 
                      type="checkbox" 
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds(filteredArchived.map(t => t.id));
                        } else {
                          setSelectedIds([]);
                        }
                      }}
                      checked={filteredArchived.length > 0 && selectedIds.length === filteredArchived.length}
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('date')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('type')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('party')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('amount')}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredArchived.map(tx => (
                  <tr key={tx.id} className="hover:bg-gray-50 opacity-70">
                    <td className="px-6 py-4 whitespace-nowrap">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(tx.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds(prev => [...prev, tx.id]);
                        } else {
                          setSelectedIds(prev => prev.filter(id => id !== tx.id));
                        }
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t(tx.type)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.party || tx.item_name || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{parseFloat(tx.amount || 0).toFixed(2)} MAD</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleUnarchive(tx.id)} className="text-blue-600 hover:text-blue-900 flex items-center justify-end gap-1 w-full">
                        <RotateCcw size={16} /> Désarchiver
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredArchived.length === 0 && (
                  <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-500">Aucune transaction archivée trouvée.</td></tr>
                )}
              </tbody>
            </table>
          </div>
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
  const [suppliers, setSuppliers] = useState([]);
  const [digitalSuppliers, setDigitalSuppliers] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [view, setView] = useState(() => localStorage.getItem('mabox_view') || 'dashboard'); // dashboard, transactions, inventory, reports, settings, users, treasury
  const [language, setLanguage] = useState(() => localStorage.getItem('mabox_language') || 'en'); // en, fr, ar
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('mabox_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  // Digital ERP State
  const [erpMode, setErpMode] = useState(() => localStorage.getItem('mabox_erpMode') || 'physical'); // 'physical' or 'digital'
  const [digitalInventory, setDigitalInventory] = useState([]);
  const [digitalTransactions, setDigitalTransactions] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);

  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- Persist State to LocalStorage ---
  useEffect(() => {
    localStorage.setItem('mabox_view', view);
  }, [view]);

  useEffect(() => {
    localStorage.setItem('mabox_erpMode', erpMode);
  }, [erpMode]);

  useEffect(() => {
    localStorage.setItem('mabox_language', language);
  }, [language]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('mabox_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('mabox_user');
    }
  }, [currentUser]);

  // --- Initial Load (Supabase) ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: inventoryData, error: inventoryError } = await supabase.from('inventory').select('*');
        if (inventoryError) throw inventoryError;
        // Filter out deleted items from initial fetch
        setInventory(inventoryData.filter(i => !i.is_deleted));

        // Fetch Transactions
        const { data: txData, error: txError } = await supabase.from('transactions').select('*').order('date', { ascending: false });
        if (txError) throw txError;
        if (txData) setTransactions(txData.filter(t => t.status !== 'deleted'));

        const { data: digiInvData } = await supabase.from('digital_inventory').select('*').order('created_at', { ascending: false });
        if (digiInvData) setDigitalInventory(digiInvData);

        const { data: digiSupData } = await supabase.from('digital_suppliers').select('*').order('created_at', { ascending: false });
        if (digiSupData) setDigitalSuppliers(digiSupData);


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

        const { data: supData, error: supError } = await supabase.from('suppliers').select('*').order('name');
        if (supError) console.error('Error fetching suppliers:', supError); // Don't throw, just log
        if (supData) setSuppliers(supData);

        const { data: bankData, error: bankError } = await supabase.from('bank_accounts').select('*').order('name');
        if (bankError) console.error('Error fetching bank accounts:', bankError);
        if (bankData) setBankAccounts(bankData.filter(b => !b.is_deleted));

        // Fetch Digital ERP Data
        const { data: digInvData, error: digInvErr } = await supabase.from('digital_inventory').select('*');
        if (digInvErr) console.error('Error digital inventory:', digInvErr);
        if (digInvData) setDigitalInventory(digInvData.filter(i => !i.is_deleted));

        const { data: digTxData, error: digTxErr } = await supabase.from('digital_transactions').select('*').order('date', { ascending: false });
        if (digTxErr) console.error('Error digital transactions:', digTxErr);
        if (digTxData) setDigitalTransactions(digTxData.filter(t => t.status !== 'deleted'));

        const { data: subData, error: subErr } = await supabase.from('subscriptions').select('*').order('created_at', { ascending: false });
        if (subErr) console.error('Error subscriptions:', subErr);
        if (subData) setSubscriptions(subData);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please check your connection and configuration.');
      }
    };

    fetchData();

    // Real-time subscriptions
    const invSub = supabase.channel('inventory').on('postgres_changes', { event: '*', schema: 'public', table: 'inventory' }, payload => {
      if (payload.eventType === 'INSERT') setInventory(prev => [...prev, payload.new]);
      if (payload.eventType === 'UPDATE') setInventory(prev => prev.map(i => String(i.id) === String(payload.new.id) ? payload.new : i));
      if (payload.eventType === 'DELETE') setInventory(prev => prev.filter(i => String(i.id) !== String(payload.old.id)));
    }).subscribe();

    const txSub = supabase.channel('transactions').on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, payload => {
      if (payload.eventType === 'INSERT') setTransactions(prev => [payload.new, ...prev]);
      // Note: For complex updates/deletes that affect order, re-fetching might be safer, but simple state updates work for now
      if (payload.eventType === 'DELETE') setTransactions(prev => prev.filter(t => t.id !== payload.old.id));
      if (payload.eventType === 'UPDATE') {
        if (payload.new.status === 'deleted') {
          setTransactions(prev => prev.filter(t => String(t.id) !== String(payload.new.id)));
        } else {
          setTransactions(prev => prev.map(t => String(t.id) === String(payload.new.id) ? payload.new : t));
        }
      }
    }).subscribe();

    const bankSub = supabase.channel('bank_accounts').on('postgres_changes', { event: '*', schema: 'public', table: 'bank_accounts' }, payload => {
      if (payload.eventType === 'INSERT') setBankAccounts(prev => [...prev, payload.new]);
      if (payload.eventType === 'UPDATE') setBankAccounts(prev => prev.map(b => String(b.id) === String(payload.new.id) ? payload.new : b));
      if (payload.eventType === 'DELETE') setBankAccounts(prev => prev.filter(b => String(b.id) !== String(payload.old.id)));
    }).subscribe();

    // Digital Subs
    const digInvSub = supabase.channel('digital_inventory').on('postgres_changes', { event: '*', schema: 'public', table: 'digital_inventory' }, payload => {
      if (payload.eventType === 'INSERT') setDigitalInventory(prev => [...prev, payload.new]);
      if (payload.eventType === 'UPDATE') setDigitalInventory(prev => prev.map(i => String(i.id) === String(payload.new.id) ? payload.new : i));
      if (payload.eventType === 'DELETE') setDigitalInventory(prev => prev.filter(i => String(i.id) !== String(payload.old.id)));
    }).subscribe();

    const digTxSub = supabase.channel('digital_transactions').on('postgres_changes', { event: '*', schema: 'public', table: 'digital_transactions' }, payload => {
      if (payload.eventType === 'INSERT') setDigitalTransactions(prev => [payload.new, ...prev]);
      if (payload.eventType === 'DELETE') setDigitalTransactions(prev => prev.filter(t => t.id !== payload.old.id));
      if (payload.eventType === 'UPDATE') {
        if (payload.new.status === 'deleted') setDigitalTransactions(prev => prev.filter(t => String(t.id) !== String(payload.new.id)));
        else setDigitalTransactions(prev => prev.map(t => String(t.id) === String(payload.new.id) ? payload.new : t));
      }
    }).subscribe();

    const subSub = supabase.channel('subscriptions').on('postgres_changes', { event: '*', schema: 'public', table: 'subscriptions' }, payload => {
      if (payload.eventType === 'INSERT') setSubscriptions(prev => [payload.new, ...prev]);
      if (payload.eventType === 'DELETE') setSubscriptions(prev => prev.filter(t => t.id !== payload.old.id));
      if (payload.eventType === 'UPDATE') setSubscriptions(prev => prev.map(t => String(t.id) === String(payload.new.id) ? payload.new : t));
    }).subscribe();

    return () => {
      supabase.removeChannel(invSub);
      supabase.removeChannel(txSub);
      supabase.removeChannel(bankSub);
      supabase.removeChannel(digInvSub);
      supabase.removeChannel(digTxSub);
      supabase.removeChannel(subSub);
    };
  }, []);

  // --- Derived State (Metrics) ---
  const digitalIncome = digitalTransactions
    ? digitalTransactions.filter(t => t.type === 'sale' && t.status === 'completed').reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0)
    : 0;

  const totalIncome = transactions
    .filter(t => t.type === 'sale' && t.status === 'completed')
    .reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0) + digitalIncome;

  const operatingExpenses = transactions
    .reduce((acc, curr) => {
      if (curr.type === 'expense') {
        // Only include expense if completed
        if (curr.status === 'completed') {
          return acc + parseFloat(curr.amount || 0);
        }
      } else if (curr.type === 'sale') {
        const delivery = parseFloat(curr.delivery_cost || 0);
        const packaging = parseFloat(curr.packaging_cost || 0);

        if (curr.status === 'completed') {
          return acc + delivery + packaging;
        } else if (curr.status === 'refused') {
          return acc + packaging;
        }
      }
      return acc;
    }, 0);

  const digitalExpenses = digitalTransactions
    ? digitalTransactions.filter(t => t.type === 'expense' && t.status === 'completed').reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0)
    : 0;

  const totalOperatingExpenses = operatingExpenses + digitalExpenses;

  // COGS (Cost of Goods Sold) Calculation
  const cogs = transactions
    .filter(t => t.type === 'sale' && t.status === 'completed')
    .reduce((acc, curr) => {
      // Find the item to get its buy price
      const item = inventory.find(i => i.id === curr.item_id);
      const buyPrice = item ? parseFloat(item.buy_price || 0) : 0;
      const quantity = parseInt(curr.quantity || 1);
      return acc + (buyPrice * quantity);
    }, 0);

  // Calculate Total Purchases (for Cash Flow / Total Expenses display)
  const digitalPurchases = digitalTransactions
    ? digitalTransactions.filter(t => t.type === 'purchase' && t.status === 'completed').reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0)
    : 0;

  const totalPurchases = transactions
    .filter(t => t.type === 'purchase' && t.status === 'completed')
    .reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0) + digitalPurchases;

  // Total Expenses for Display (Cash Flow Basis: Operating Expenses + Purchases)
  // This matches the "previous version" logic as requested.
  const totalExpenses = totalOperatingExpenses + totalPurchases;

  // Net Profit (Accrual Basis: Income - COGS - Operating Expenses)
  // This ensures profit is based on actual sales margin, not cash outflow.
  const netProfit = totalIncome - (cogs + totalOperatingExpenses);

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
        : 'text-gray-600 hover:bg-gray-100:bg-gray-700'
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
    <div className={`flex h-screen bg-gray-50 ${isRTL ? 'direction-rtl' : 'direction-ltr'} overflow-hidden transition-colors duration-200`}>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:relative z-50 h-full
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : (isRTL ? 'translate-x-full' : '-translate-x-full')} md:translate-x-0
        w-64 bg-white border-r border-gray-200 flex flex-col
      `}>
        <div className="p-4 border-b border-gray-200 flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${erpMode === 'physical' ? 'bg-blue-600' : 'bg-purple-600'}`}>
                <LayoutDashboard className="text-white" size={24} />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Mabox.ma</h1>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-500">
              <X size={24} />
            </button>
          </div>
          
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => { setErpMode('physical'); setView('dashboard'); }}
              className={`flex-1 text-sm py-1.5 rounded-md transition-colors ${erpMode === 'physical' ? 'bg-white shadow-sm font-bold text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              📦 Physique
            </button>
            <button
              onClick={() => { setErpMode('digital'); setView('digital_dashboard'); }}
              className={`flex-1 text-sm py-1.5 rounded-md transition-colors ${erpMode === 'digital' ? 'bg-white shadow-sm font-bold text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              💻 Digital
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {erpMode === 'physical' ? (
            <>
              <NavItem id="dashboard" icon={LayoutDashboard} label={t('dashboard')} />
              <NavItem id="treasury" icon={Landmark} label={t('treasury')} />
              <NavItem id="transactions" icon={ArrowRightLeft} label={t('transactions')} />
              <NavItem id="inventory" icon={Package} label={t('inventory')} />
              <NavItem id="archives" icon={Archive} label={t('archives')} />
              <NavItem id="history" icon={FileText} label={t('history')} />
              <NavItem id="suppliers" icon={Truck} label={t('suppliers')} />
            </>
          ) : (
            <>
              <NavItem id="digital_dashboard" icon={LayoutDashboard} label="Tableau de bord" />
              <NavItem id="digital_abonnements" icon={Users} label="Abonnements" />
              <NavItem id="digital_treasury" icon={Landmark} label={t('treasury')} />
              <NavItem id="digital_transactions" icon={ArrowRightLeft} label={t('transactions')} />
              <NavItem id="digital_inventory" icon={Package} label="Produits Digitaux" />
              <NavItem id="digital_suppliers" icon={Truck} label={t('suppliers')} />
            </>
          )}
          {currentUser.role === 'admin' && (
            <>
              <NavItem id="reports" icon={FileText} label={t('reports')} />
              <NavItem id="settings" icon={Settings} label={t('settings')} />
              <NavItem id="users" icon={Users} label={t('users')} />
            </>
          )}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex space-x-2">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded text-xs ${language === 'en' ? 'bg-blue-100 text-blue-700' : 'text-gray-500'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('fr')}
                className={`px-2 py-1 rounded text-xs ${language === 'fr' ? 'bg-blue-100 text-blue-700' : 'text-gray-500'}`}
              >
                FR
              </button>
              <button
                onClick={() => setLanguage('ar')}
                className={`px-2 py-1 rounded text-xs ${language === 'ar' ? 'bg-blue-100 text-blue-700' : 'text-gray-500'}`}
              >
                AR
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg mb-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
              {currentUser.name[0]}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
              <p className="text-xs text-gray-500 capitalize">{t(currentUser.role)}</p>
            </div>
          </div>
          <button
            onClick={() => setCurrentUser(null)}
            className="flex items-center space-x-3 w-full p-3 rounded-lg text-red-600 hover:bg-red-50:bg-red-900/20 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">{t('logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between z-30">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <LayoutDashboard className="text-white" size={20} />
            </div>
            <h1 className="font-bold text-lg text-gray-800">Mabox.ma</h1>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="text-gray-600 p-1">
            <Menu size={24} />
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <header className="hidden md:flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 capitalize">{t(view)}</h2>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString(language === 'ar' ? 'ar-MA' : language === 'fr' ? 'fr-FR' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </header>

          {/* Mobile Page Title */}
          <div className="md:hidden mb-6">
            <h2 className="text-2xl font-bold text-gray-800 capitalize">{t(view)}</h2>
            <div className="text-xs text-gray-500 mt-1">
              {new Date().toLocaleDateString(language === 'ar' ? 'ar-MA' : language === 'fr' ? 'fr-FR' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>

          {/* Views */}
          {view === 'dashboard' && (
            <Dashboard
              totalIncome={totalIncome}
              totalExpenses={totalExpenses}
              netProfit={netProfit}
              inventoryValue={inventoryValue}
              transactions={transactions}
              inventory={inventory}
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
              suppliers={suppliers}
              bankAccounts={bankAccounts.filter(b => !b.type?.endsWith('_digital'))}
              t={t}
            />
          )}

          
          {view === 'archives' && (
            <ArchiveManager
              transactions={transactions}
              setTransactions={setTransactions}
              supabase={supabase}
              t={t}
            />
          )}

          {view === 'treasury' && (
            <TreasuryManager
              transactions={transactions}
              digitalTransactions={digitalTransactions}
              setTransactions={setTransactions}
              bankAccounts={bankAccounts.filter(b => !b.type?.endsWith('_digital'))}
              setBankAccounts={setBankAccounts}
              supabase={supabase}
              t={t}
            />
          )}

          {view === 'inventory' && (
            <InventoryManager
              inventory={inventory}
              setInventory={setInventory}
              transactions={transactions}
              setTransactions={setTransactions}
              suppliers={suppliers}
              bankAccounts={bankAccounts.filter(b => !b.type?.endsWith('_digital'))}
              supabase={supabase}
              t={t}
            />
          )}

          {view === 'suppliers' && (
            <SupplierManager
              suppliers={suppliers}
              setSuppliers={setSuppliers}
              transactions={transactions}
              setTransactions={setTransactions}
              inventory={inventory}
              setInventory={setInventory}
              bankAccounts={bankAccounts.filter(b => !b.type?.endsWith('_digital'))}
              supabase={supabase}
              t={t}
            />
          )}

          {view === 'history' && (
            <HistoryView
              transactions={transactions}
              inventory={inventory}
              t={t}
            />
          )}

          {view === 'reports' && currentUser.role === 'admin' && erpMode !== 'digital' && (
            <ReportView
              transactions={transactions}
              inventory={inventory}
              t={t}
            />
          )}

          {view === 'reports' && currentUser.role === 'admin' && erpMode === 'digital' && (
            <DigitalReportView
              digitalTransactions={digitalTransactions}
              digitalInventory={digitalInventory}
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

          {/* --- DIGITAL ERP VIEWS --- */}
          {view === 'digital_dashboard' && (
            <DigitalDashboard 
              subscriptions={subscriptions} 
              digitalTransactions={digitalTransactions} 
              digitalInventory={digitalInventory}
              t={t} 
            />
          )}
          {view === 'digital_abonnements' && (
            <DigitalAbonnementsManager 
              subscriptions={subscriptions} 
              digitalInventory={digitalInventory} 
              supabase={supabase} 
              bankAccounts={bankAccounts.filter(b => b.type?.endsWith('_digital'))}
              t={t} 
            />
          )}
          {view === 'digital_inventory' && (
            <DigitalInventoryManager 
              digitalInventory={digitalInventory} 
              digitalSuppliers={digitalSuppliers}
              digitalTransactions={digitalTransactions}
              bankAccounts={bankAccounts.filter(b => b.type?.endsWith('_digital'))}
              supabase={supabase} 
              t={t} 
            />
          )}
          {view === 'digital_treasury' && (
            <DigitalTreasuryManager 
              digitalTransactions={digitalTransactions} 
              bankAccounts={bankAccounts.filter(b => b.type?.endsWith('_digital'))} 
              supabase={supabase}
            />
          )}
          {view === 'digital_transactions' && (
            <DigitalTransactionsManager 
              digitalTransactions={digitalTransactions} 
              supabase={supabase}
              bankAccounts={bankAccounts.filter(b => b.type?.endsWith('_digital'))}
              digitalInventory={digitalInventory}
              subscriptions={subscriptions}
              digitalSuppliers={digitalSuppliers}
            />
          )}
          {view === 'digital_suppliers' && (
            <DigitalSuppliersManager 
              digitalSuppliers={digitalSuppliers}
              digitalTransactions={digitalTransactions}
              digitalInventory={digitalInventory}
              bankAccounts={bankAccounts.filter(b => b.type?.endsWith('_digital'))}
              supabase={supabase}
              t={t}
            />
          )}

        </main>
      </div>
    </div>
  );
}

// --- Placeholder Sub-Components ---

const Dashboard = ({ totalIncome, totalExpenses, netProfit, inventoryValue, transactions, inventory, t }) => {
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
        <h3 className="text-lg font-semibold mb-4 text-gray-800">{t('recentActivity')}</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{t('date')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{t('status')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{t('type')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{t('details')}</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{t('amount')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentTransactions.map(tItem => (
                <tr key={tItem.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tItem.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${tItem.status === 'completed' ? 'bg-green-100 text-green-800' :
                        tItem.status === 'refused' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                      }`}>
                      {t(tItem.status || 'pending')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap capitalize text-sm text-gray-900">{t(tItem.type)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tItem.item_id ? (
                      <div>
                        <span className="font-medium text-gray-900">{inventory.find(i => i.id === tItem.item_id)?.name || 'Unknown Item'}</span>
                        {tItem.quantity && <span className="text-gray-500 ml-1">(x{tItem.quantity})</span>}
                        {tItem.party && <span className="text-gray-400 ml-1">- {tItem.party}</span>}
                      </div>
                    ) : (
                      tItem.party || tItem.category || '-'
                    )}
                  </td>
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

const TransactionManager = ({ transactions, setTransactions, inventory, setInventory, deliveryConfig, packagingConfig, suppliers, bankAccounts, t }) => {
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // New Status Filter
  const [partyFilter, setPartyFilter] = useState('');
  const [itemFilter, setItemFilter] = useState('');
  const [deliveryFilter, setDeliveryFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' }); // New Sort State
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'sale',
    status: 'pending',
    category: '',
    party: '',
    phone: '',
    address: '',
    itemId: '',
    quantity: '',
    amount: '',
    notes: '',
    deliveryCost: '',
    packagingCost: '',
    bankAccountId: '',
    bankFees: ''
  });

  // Local state for selections
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedPackaging, setSelectedPackaging] = useState('');


  // Derived state for autocomplete
  const parties = [...new Set(transactions.map(t => t.party).filter(Boolean))];
  const categories = [...new Set(transactions.map(t => t.category).filter(Boolean))];
  const deliveryCompanies = [...new Set(transactions.map(t => t.delivery_company).filter(Boolean))];

  useEffect(() => {
    let result = transactions.filter(t => {
      const dateMatch = (!dateFilter.start || t.date >= dateFilter.start) &&
        (!dateFilter.end || t.date <= dateFilter.end);
      const typeMatch = !typeFilter || t.type === typeFilter;
      const statusMatch = !statusFilter || t.status === statusFilter; // Apply Status Filter
      const partyMatch = !partyFilter || (t.party && t.party.toLowerCase().includes(partyFilter.toLowerCase()));

      // Improved Item Matching using item_name
      const itemName = t.item_name || (t.item_id ? (inventory.find(i => i.id === t.item_id)?.name || '') : '');
      const itemMatch = !itemFilter ||
        (itemName && itemName.toLowerCase().includes(itemFilter.toLowerCase())) ||
        (t.category && t.category.toLowerCase().includes(itemFilter.toLowerCase()));

      const deliveryMatch = !deliveryFilter || (t.delivery_company === deliveryFilter);

      return dateMatch && typeMatch && statusMatch && partyMatch && itemMatch && deliveryMatch;
    });

    // Sorting Logic
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Specific handling for 'item' key to sort by name
        if (sortConfig.key === 'item') {
          aValue = a.item_name || (a.item_id ? (inventory.find(i => i.id === a.item_id)?.name || '') : a.category) || '';
          bValue = b.item_name || (b.item_id ? (inventory.find(i => i.id === b.item_id)?.name || '') : b.category) || '';
        }

        // Handle nulls
        if (aValue === null || aValue === undefined) aValue = '';
        if (bValue === null || bValue === undefined) bValue = '';

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredTransactions(result);
  }, [transactions, dateFilter, typeFilter, statusFilter, partyFilter, itemFilter, deliveryFilter, sortConfig, inventory]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleExport = () => {
    const data = filteredTransactions.map(t => ({
      Date: t.date,
      Type: t.type,
      Party: t.party,
      Phone: t.phone,
      Address: t.address,
      Category: t.category,
      Item: t.item_id ? (inventory.find(i => i.id === t.item_id)?.name || 'Unknown') : '',
      Quantity: t.quantity,
      Amount: t.amount,
      Status: t.status,
      'Delivery Cost': t.delivery_cost || 0,
      'Packaging Cost': t.packaging_cost || 0,
      Notes: t.notes,
      'Delivery Company': t.delivery_company || ''
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    XLSX.writeFile(wb, `Transactions_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleTypeChange = (type) => {
    setFormData({ ...formData, type, itemId: '', quantity: '', amount: '', deliveryCost: '', packagingCost: '', phone: '', address: '' });
    setSelectedCompany('');
    setSelectedPackaging('');
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsEditing(true);
    setFormData({
      id: transaction.id,
      date: transaction.date,
      type: transaction.type,
      status: transaction.status || 'pending',
      category: transaction.category || '',
      party: transaction.party || '',
      phone: transaction.phone || '',
      address: transaction.address || '',
      itemId: transaction.item_id || '',
      quantity: transaction.quantity || '',
      amount: transaction.amount / (transaction.quantity || 1), // Derive unit price
      notes: transaction.notes || '',
      deliveryCost: transaction.delivery_cost || '',
      packagingCost: transaction.packaging_cost || '',
      bankAccountId: transaction.bank_account_id || '',
      bankFees: ''
    });
    setSelectedCompany(deliveryConfig.find(c => c.name === transaction.delivery_company)?.id || '');
    setSelectedPackaging(packagingConfig.find(p => p.cost === transaction.packaging_cost)?.id || '');
    setShowForm(true);
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
      date: formData.date,
      type: formData.type,
      status: formData.status,
      category: formData.item_id ? (inventory.find(i => i.id === formData.item_id)?.category || null) : (formData.type === 'expense' ? formData.category : null),
      party: formData.party,
      item_id: formData.type !== 'expense' ? formData.itemId : null,
      item_name: formData.type !== 'expense' ? (inventory.find(i => i.id === formData.itemId)?.name || '') : null,
      quantity: formData.type !== 'expense' ? parseInt(formData.quantity) : null,
      amount: parseFloat(formData.amount) * (formData.type !== 'expense' ? (formData.quantity || 1) : 1),
      notes: formData.notes,
      delivery_cost: formData.type === 'sale' ? (parseFloat(formData.deliveryCost) || 0) : 0,
      packaging_cost: formData.type === 'sale' ? (parseFloat(formData.packagingCost) || 0) : 0,
      phone: formData.phone,
      address: formData.address
    };

    const dbTransaction = {
      date: newTransaction.date,
      type: newTransaction.type,
      status: newTransaction.status,
      category: newTransaction.category,
      party: newTransaction.party,
      phone: newTransaction.phone,
      address: newTransaction.address,
      item_id: newTransaction.item_id,
      quantity: parseInt(newTransaction.quantity) || 0,
      amount: parseFloat(newTransaction.amount),
      notes: newTransaction.notes,
      delivery_cost: newTransaction.delivery_cost,
      packaging_cost: newTransaction.packaging_cost,
      delivery_company: selectedCompany ? deliveryConfig.find(c => c.id === selectedCompany)?.name : null,
      bank_account_id: formData.bankAccountId || null
    };

    let data, error;

    // --- REVERT OLD INVENTORY (If Editing) ---
    if (isEditing && editingTransaction && editingTransaction.item_id) {
      // Only revert if the old transaction actually affected inventory (i.e., NOT refused)
      if (editingTransaction.status !== 'refused') {
        const oldItem = inventory.find(i => i.id === editingTransaction.item_id);
        if (oldItem) {
          let revertedQty = parseInt(oldItem.quantity);
          if (editingTransaction.type === 'sale') {
            revertedQty += parseInt(editingTransaction.quantity);
          } else if (editingTransaction.type === 'purchase') {
            revertedQty -= parseInt(editingTransaction.quantity);
          }
          // Update Supabase (Revert)
          await supabase.from('inventory').update({ quantity: revertedQty }).eq('id', editingTransaction.item_id);
          // Update Local State (Revert)
          setInventory(prev => prev.map(i => i.id === editingTransaction.item_id ? { ...i, quantity: revertedQty } : i));
        }
      }
    }

    // --- SAVE TRANSACTION ---
    if (isEditing) {
      const { data: updatedData, error: updateError } = await supabase.from('transactions').update(dbTransaction).eq('id', formData.id).select();
      data = updatedData;
      error = updateError;
    } else {
      const txsToInsert = [dbTransaction];
      if ((formData.type === 'purchase' || formData.type === 'expense') && formData.status === 'completed' && formData.bankFees && parseFloat(formData.bankFees) > 0) {
          txsToInsert.push({
              date: dbTransaction.date,
              type: 'expense',
              category: 'Frais Bancaires',
              party: 'Banque',
              amount: parseFloat(formData.bankFees),
              status: 'completed',
              bank_account_id: formData.bankAccountId,
              notes: `Frais de paiement pour ${dbTransaction.party || 'Transaction'} (Achat/Dépense)`
          });
      }

      const { data: insertData, error: insertError } = await supabase.from('transactions').insert(txsToInsert).select();
      data = insertData;
      error = insertError;
    }

    if (error) {
      alert('Error saving transaction: ' + error.message);
      return;
    }

    if (data) {
      // Manual State Update for Transaction
      if (isEditing) {
        setTransactions(prev => prev.map(t => t.id === formData.id ? data[0] : t));
      } else {
        setTransactions(prev => [...data, ...prev]);
      }

      // --- APPLY NEW INVENTORY ---
      // Re-fetch inventory to get latest state (after reversion)
      // Actually, we updated local state, so 'inventory' variable might be stale in this closure? 
      // React state updates are not immediate. We should use the functional update or trust that we calculated 'revertedQty' correctly.
      // Better: Fetch fresh item from DB or use the calculated 'revertedQty' if item_id is same.

      if (formData.itemId && (formData.type === 'sale' || formData.type === 'purchase')) {
        // Only apply inventory change if status is NOT refused
        if (formData.status !== 'refused') {
          // We need the *current* inventory item. 
          // Since we might have just updated it (reverted), we can't rely solely on 'inventory' prop if it hasn't refreshed.
          // But we did setInventory. However, in this function execution, 'inventory' is still old.
          // Let's fetch the item fresh from Supabase to be safe.
          const { data: freshItemData } = await supabase.from('inventory').select('*').eq('id', formData.itemId).single();

          if (freshItemData) {
            const item = freshItemData;
            if (formData.type === 'sale') {
              if (parseInt(item.quantity) < parseInt(formData.quantity)) {
                alert(t('stockInsufficient') + ' (But transaction saved)');
                // This is tricky. If stock is low, we already saved the transaction. 
                // Ideally we check before saving. But for now, let's just proceed.
              }
              const newQty = parseInt(item.quantity) - parseInt(formData.quantity);
              await supabase.from('inventory').update({ quantity: newQty }).eq('id', formData.itemId);
              setInventory(prev => prev.map(i => i.id === formData.itemId ? { ...i, quantity: newQty } : i));
            } else if (formData.type === 'purchase') {
              // WAC Logic
              const currentQty = parseInt(item.quantity);
              const newQty = parseInt(formData.quantity);
              const currentBuyPrice = parseFloat(item.buy_price);
              const purchasePrice = parseFloat(formData.amount) / newQty;

              const totalValue = (currentQty * currentBuyPrice) + parseFloat(formData.amount);
              const totalQty = currentQty + newQty;
              const newBuyPrice = totalQty > 0 ? totalValue / totalQty : purchasePrice;

              const currentInitial = parseInt(item.initial_quantity || item.quantity);
              const newInitial = currentInitial + newQty;

              await supabase.from('inventory').update({ quantity: totalQty, buy_price: newBuyPrice, initial_quantity: newInitial }).eq('id', formData.itemId);
              setInventory(prev => prev.map(i => i.id === formData.itemId ? { ...i, quantity: totalQty, buy_price: newBuyPrice, initial_quantity: newInitial } : i));
            }
          }
        }
      }

      setShowForm(false);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        type: 'sale',
        status: 'pending',
        category: '',
        party: '',
        phone: '',
        address: '',
        itemId: '',
        quantity: '',
        amount: '',
        notes: '',
        deliveryCost: '',
        packagingCost: '',
        bankFees: ''
      });
      setSelectedCompany('');
      setSelectedPackaging('');
      setIsEditing(false);
      setEditingTransaction(null);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('deleteConfirm'))) {
      // 1. Fetch transaction details before deleting
      const { data: transaction, error: fetchError } = await supabase.from('transactions').select('*').eq('id', id).single();

      if (fetchError) {
        alert('Error fetching transaction details: ' + fetchError.message);
        return;
      }

      const { error } = await supabase.from('transactions').update({ status: 'deleted' }).eq('id', id);
      if (!error) {
        setTransactions(prev => prev.filter(t => t.id !== id));

        // 2. Revert Inventory Logic
        // Ensure we parse quantity correctly as integer
        if (transaction && transaction.item_id && transaction.status !== 'refused') {
          const qty = parseInt(transaction.quantity || 0);
          // Use maybeSingle() in case item was deleted or issue exists
          const { data: item } = await supabase.from('inventory').select('*').eq('id', transaction.item_id).maybeSingle();

          if (item) {
            let updates = {};
            let newQty = parseInt(item.quantity || 0);

            if (transaction.type === 'sale') {
              // Sale deleted -> Add back stock
              newQty += qty;
              updates.quantity = newQty;
            } else if (transaction.type === 'purchase') {
              // Purchase deleted -> Remove stock, Remove history
              newQty = Math.max(0, newQty - qty); // Prevent negative
              updates.quantity = newQty;
              const currentInitial = parseInt(item.initial_quantity || item.quantity || 0);
              updates.initial_quantity = Math.max(0, currentInitial - qty);
            }

            if (Object.keys(updates).length > 0) {
              // Vital Fix: Select data back from update to ensure we have the DB truth
              const { data: updatedItem, error: updateError } = await supabase.from('inventory').update(updates).eq('id', item.id).select().single();

              if (!updateError && updatedItem) {
                // Force update local state with exactly what is in DB
                setInventory(prev => prev.map(i => String(i.id) === String(updatedItem.id) ? updatedItem : i));
              } else {
                console.error("Failed to revert inventory:", updateError);
                // Fallback: Re-fetch entire inventory if single update fails to return (nuclear safety)
                const { data: fullInv } = await supabase.from('inventory').select('*').eq('is_deleted', false);
                if (fullInv) setInventory(fullInv);
              }
            }
          }
        }
      } else {
        alert('Error deleting transaction: ' + error.message);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(t('deleteConfirm'))) {
      // 1. Revert inventory for each if not already refused/deleted
      for (const id of selectedTransactions) {
          const tx = transactions.find(t => t.id === id);
          if (tx && tx.item_id && tx.status !== 'refused' && tx.status !== 'deleted') {
              const item = inventory.find(i => i.id === tx.item_id);
              if (item) {
                  let qtyChange = 0;
                  const qty = parseInt(tx.quantity || 0);
                  if (tx.type === 'sale') qtyChange = qty;
                  else if (tx.type === 'purchase') qtyChange = -qty;
                  
                  if (qtyChange !== 0) {
                      const newQty = parseInt(item.quantity) + qtyChange;
                      let newInitial = parseInt(item.initial_quantity || item.quantity);
                      if (tx.type === 'purchase') newInitial = Math.max(0, newInitial - qty);
                      
                      await supabase.from('inventory').update({ quantity: newQty, initial_quantity: newInitial }).eq('id', item.id);
                      setInventory(prev => prev.map(i => i.id === item.id ? { ...i, quantity: newQty, initial_quantity: newInitial } : i));
                  }
              }
          }
      }

      // 2. Soft delete
      const { error } = await supabase.from('transactions').update({ status: 'deleted' }).in('id', selectedTransactions);
      if (!error) {
        setTransactions(prev => prev.filter(t => !selectedTransactions.includes(t.id)));
        setSelectedTransactions([]);
      } else {
        alert('Error deleting transactions: ' + error.message);
      }
    }
  };

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedTransactions(filteredTransactions.map(t => t.id));
    } else {
      setSelectedTransactions([]);
    }
  };

  const toggleSelectTransaction = (id) => {
    if (selectedTransactions.includes(id)) {
      setSelectedTransactions(prev => prev.filter(t => t !== id));
    } else {
      setSelectedTransactions(prev => [...prev, id]);
    }
  };

  const handleStatusChange = async (transaction, newStatus) => {
    const oldStatus = transaction.status;
    if (oldStatus === newStatus) return;

    // 1. Update Transaction in DB
    const { error } = await supabase.from('transactions').update({ status: newStatus }).eq('id', transaction.id);
    if (error) {
      alert('Error updating status: ' + error.message);
      return;
    }

    // 2. Update Inventory (if applicable)
    if (transaction.item_id) {
      const item = inventory.find(i => i.id === transaction.item_id);
      if (item) {
        let qtyChange = 0;
        const qty = parseInt(transaction.quantity || 0);

        // Case A: Was Active (Pending/Completed) -> Becomes Inactive (Refused/Deleted)
        // Action: Add back to stock (Revert)
        const isOldInactive = oldStatus === 'refused' || oldStatus === 'deleted';
        const isNewInactive = newStatus === 'refused' || newStatus === 'deleted';
        
        if (!isOldInactive && isNewInactive) {
          if (transaction.type === 'sale') qtyChange = qty; // Add back
          else if (transaction.type === 'purchase') qtyChange = -qty; // Remove (un-buy)
        }

        // Case B: Was Inactive (Refused/Deleted) -> Becomes Active (Pending/Completed)
        // Action: Deduct from stock (Apply)
        else if (isOldInactive && !isNewInactive) {
          if (transaction.type === 'sale') qtyChange = -qty; // Deduct
          else if (transaction.type === 'purchase') qtyChange = qty; // Add (buy)
        }

        // Case C: Pending <-> Completed
        // Action: No inventory change (both are considered "committed" for stock, just different for income)

        if (qtyChange !== 0) {
          const newQty = parseInt(item.quantity) + qtyChange;
          const updates = { quantity: newQty };

          // Update initial_quantity for Purchase status changes
          if (transaction.type === 'purchase') {
            const currentInitial = parseInt(item.initial_quantity || item.quantity);
            if (!isOldInactive && isNewInactive) {
              // Refusing a purchase -> Remove from history
              updates.initial_quantity = Math.max(0, currentInitial - qty);
            } else if (isOldInactive && !isNewInactive) {
              // Un-refusing a purchase -> Add to history
              updates.initial_quantity = currentInitial + qty;
            }
          }

          await supabase.from('inventory').update(updates).eq('id', item.id);
          // Update local inventory
          setInventory(prev => prev.map(i => i.id === item.id ? { ...i, ...updates } : i));
        }
      }
    }

    // 3. Update Local Transaction State
    setTransactions(prev => prev.map(t => t.id === transaction.id ? { ...t, status: newStatus } : t));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h3 className="text-xl font-bold text-gray-800">{t('transactions')}</h3>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <span className="text-sm text-gray-500">{t('filter')}:</span>
            <input
              type="date"
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-sm"
              value={dateFilter.start}
              onChange={e => setDateFilter({ ...dateFilter, start: e.target.value })}
            />
            <span className="text-gray-400">-</span>
            <input
              type="date"
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-sm"
              value={dateFilter.end}
              onChange={e => setDateFilter({ ...dateFilter, end: e.target.value })}
            />

            <select
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-sm"
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
            >
              <option value="">{t('allTypes')}</option>
              <option value="sale">{t('sale')}</option>
              <option value="purchase">{t('purchase')}</option>
              <option value="expense">{t('expense')}</option>
            </select>

            <select
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-sm"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="">{t('allStatuses') || 'All Statuses'}</option>
              <option value="pending">{t('pending')}</option>
              <option value="completed">{t('completed')}</option>
              <option value="refused">{t('refused')}</option>
            </select>

            <select
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-sm"
              value={`${sortConfig.key}-${sortConfig.direction}`}
              onChange={e => {
                const [key, direction] = e.target.value.split('-');
                setSortConfig({ key, direction });
              }}
            >
              <option value="date-desc">{t('date')} ({t('newest') || 'Newest'})</option>
              <option value="date-asc">{t('date')} ({t('oldest') || 'Oldest'})</option>
              <option value="status-asc">{t('status')}</option>
              <option value="party-asc">{t('client')}/{t('supplier')} (A-Z)</option>
              <option value="item-asc">{t('item')} (A-Z)</option>
              <option value="amount-desc">{t('amount')} ({t('highest') || 'Highest'})</option>
              <option value="amount-asc">{t('amount')} ({t('lowest') || 'Lowest'})</option>
            </select>

            <input
              type="text"
              placeholder={t('client') + '/' + t('supplier')}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-sm w-32"
              value={partyFilter}
              onChange={e => setPartyFilter(e.target.value)}
            />

            <input
              type="text"
              placeholder={t('item')}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-sm w-32"
              value={itemFilter}
              onChange={e => setItemFilter(e.target.value)}
            />

            <select
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-sm"
              value={deliveryFilter}
              onChange={e => setDeliveryFilter(e.target.value)}
            >
              <option value="">{t('deliveryCompany')}</option>
              {deliveryCompanies.map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>

            {(dateFilter.start || dateFilter.end || typeFilter || partyFilter || itemFilter || deliveryFilter) && (
              <button
                onClick={() => {
                  setDateFilter({ start: '', end: '' });
                  setTypeFilter('');
                  setStatusFilter('');
                  setPartyFilter('');
                  setItemFilter('');
                  setDeliveryFilter('');
                }}
                className="text-sm text-red-600 hover:text-red-800"
              >
                {t('clearFilters')}
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {selectedTransactions.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-700"
              >
                <Trash2 size={20} />
                <span>{t('deleteSelected')} ({selectedTransactions.length})</span>
              </button>
            )}
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
      </div>

      {selectedTransactions.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <h4 className="text-blue-800 font-semibold mb-2">{t('selectedSummary')} ({selectedTransactions.length} {t('items')})</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(() => {
              const selectedTxs = transactions.filter(t => selectedTransactions.includes(t.id) && t.status !== 'refused');

              const income = selectedTxs
                .filter(t => t.type === 'sale')
                .reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);

              const expenses = selectedTxs
                .reduce((acc, curr) => {
                  if (curr.type === 'expense' || curr.type === 'purchase') return acc + parseFloat(curr.amount || 0);
                  return acc;
                }, 0);

              // Operating expenses for sales (delivery + packaging)
              const salesOpEx = selectedTxs
                .filter(t => t.type === 'sale')
                .reduce((acc, curr) => acc + parseFloat(curr.delivery_cost || 0) + parseFloat(curr.packaging_cost || 0), 0);

              const cogs = selectedTxs
                .filter(t => t.type === 'sale')
                .reduce((acc, curr) => {
                  const item = inventory.find(i => i.id === curr.item_id);
                  const buyPrice = item ? parseFloat(item.buy_price || 0) : 0;
                  const quantity = parseInt(curr.quantity || 1);
                  return acc + (buyPrice * quantity);
                }, 0);

              const totalSelectedExpenses = expenses + salesOpEx; // Pure cash outflow from selection
              const netProfit = income - (salesOpEx + cogs);

              return (
                <>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-xs text-gray-500 uppercase">{t('totalIncome')}</p>
                    <p className="text-lg font-bold text-green-600">{formatCurrency(income)}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-xs text-gray-500 uppercase">{t('totalExpenses')}</p>
                    <p className="text-lg font-bold text-red-600">{formatCurrency(totalSelectedExpenses)}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-xs text-gray-500 uppercase">{t('netProfit')}</p>
                    <p className={`text-lg font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(netProfit)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">(Income - COGS - OpEx)</p>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h4 className="text-lg font-bold mb-4 text-gray-800">{t('newTransaction')}</h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('date')}</label>
                  <input
                    type="date"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 bg-white text-gray-900"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('type')} & Statut</label>
                  <div className="flex space-x-2 mt-1">
                    <select
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 bg-white text-gray-900"
                      value={formData.type}
                      onChange={e => handleTypeChange(e.target.value)}
                    >
                      <option value="sale">{t('sale')}</option>
                      <option value="purchase">{t('purchase')}</option>
                      <option value="expense">{t('expense')}</option>
                    </select>
                    <select
                      className={`block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 text-white font-medium
                        ${formData.status === 'pending' ? 'bg-yellow-500 border-yellow-600' :
                          formData.status === 'completed' ? 'bg-green-600 border-green-700' :
                            'bg-red-600 border-red-700'
                        }`}
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="pending" className="bg-white text-gray-900">{t('pending')}</option>
                      <option value="completed" className="bg-white text-gray-900">{t('completed')}</option>
                      <option value="refused" className="bg-white text-gray-900">{t('refused')}</option>
                    </select>
                  </div>
                </div>

                {(formData.type === 'purchase' || formData.type === 'expense') && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Catégorie</label>
                      <input
                        type="text"
                        list="transaction-categories"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 bg-white text-gray-900"
                        value={formData.category || ''}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                        placeholder="-- Sélectionnez --"
                      />
                      <datalist id="transaction-categories">
                        {categories.map((c, i) => <option key={i} value={c} />)}
                        {[...new Set(inventory.map(i => i.category).filter(Boolean))].map((c, i) => <option key={'inv'+i} value={c} />)}
                      </datalist>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Réf. Bon / Facture</label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 bg-white text-gray-900"
                        value={formData.notes || ''}
                        onChange={e => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="N° Bon..."
                      />
                    </div>
                  </>
                )}
              </div>

              {formData.type !== 'expense' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('item')}</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 bg-white text-gray-900"
                    value={formData.itemId}
                    onChange={e => handleItemChange(e.target.value)}
                    required={formData.type !== 'expense'}
                  >
                    <option value="">{t('item')}</option>
                    {inventory.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.name} {item.supplier ? `- ${item.supplier}` : ''} (Stock: {item.quantity}) - {t('buyPrice')}: {formatCurrency(item.buy_price)}
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 bg-white text-gray-900"
                  value={formData.party}
                  onChange={e => {
                    const val = e.target.value;
                    let updates = { party: val };

                    // Auto-fill phone if supplier exists
                    if (formData.type === 'purchase') {
                      const supplier = suppliers.find(s => s.name === val);
                      if (supplier && supplier.contact) {
                        updates.phone = supplier.contact;
                      }
                    }
                    setFormData({ ...formData, ...updates });
                  }}
                />
                <datalist id="parties">
                  {formData.type === 'purchase'
                    ? suppliers.map(s => <option key={s.id} value={s.name} />)
                    : parties.map((p, i) => <option key={i} value={p} />)
                  }
                </datalist>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('phone')}</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 bg-white text-gray-900"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('address')}</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 bg-white text-gray-900"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>

              {formData.type !== 'expense' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('quantity')}</label>
                    <input
                      type="number"
                      required
                      min="1"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 bg-white text-gray-900"
                      value={formData.quantity}
                      onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('unitPrice')}</label>
                    <input
                      type="number"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 bg-white text-gray-900"
                      value={formData.amount}
                      onChange={e => setFormData({ ...formData, amount: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {formData.type === 'sale' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  {/* Delivery Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('delivery')}</label>
                    <select
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 mb-2 bg-white text-gray-900"
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
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 bg-white text-gray-900"
                        value={formData.deliveryCost} // This value might be overwritten by manual input, which is fine
                        onChange={(e) => setFormData({ ...formData, deliveryCost: e.target.value })}
                      >
                        <option value="">{t('city')} (Optional)</option>
                        {deliveryConfig.find(c => c.id === selectedCompany)?.rates.map(r => (
                          <option key={r.id} value={r.cost}>{r.city} ({formatCurrency(r.cost)})</option>
                        ))}
                      </select>
                    )}
                    <input
                      type="number"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 bg-white text-gray-900"
                      value={formData.deliveryCost}
                      onChange={e => setFormData({ ...formData, deliveryCost: e.target.value })}
                      placeholder="Manual Cost (0.00)"
                    />
                  </div>

                  {/* Packaging Selection */}
                  <div>
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
              )}

              {(formData.type === 'purchase' || formData.type === 'expense') && formData.status === 'completed' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Compte Bancaire / Caisse</label>
                    <select
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 bg-white text-gray-900"
                      value={formData.bankAccountId}
                      onChange={e => setFormData({ ...formData, bankAccountId: e.target.value })}
                    >
                      <option value="">-- Aucun compte --</option>
                      {bankAccounts && bankAccounts.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Frais Bancaires (MAD)</label>
                    <input
                      type="number" step="0.01" min="0"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 bg-white text-gray-900"
                      value={formData.bankFees || ''}
                      onChange={e => setFormData({ ...formData, bankFees: e.target.value })}
                      placeholder="Optionnel"
                      disabled={isEditing}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Compte Bancaire / Caisse (Optionnel)</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 bg-white text-gray-900"
                    value={formData.bankAccountId}
                    onChange={e => setFormData({ ...formData, bankAccountId: e.target.value })}
                  >
                    <option value="">-- Aucun compte --</option>
                    {bankAccounts && bankAccounts.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {formData.type === 'sale' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('notes')}</label>
                <textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            )}

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
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={filteredTransactions.length > 0 && selectedTransactions.length === filteredTransactions.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('date')}
                >
                  {t('date')} {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('type')}
                >
                  {t('type')} {sortConfig.key === 'type' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('status')}
                >
                  {t('status')} {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('party')}
                >
                  {t('client')}/{t('supplier')} {sortConfig.key === 'party' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('address')}
                >
                  {t('address')} {sortConfig.key === 'address' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{t('deliveryCompany')}</th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('item')}
                >
                  {t('item')} {sortConfig.key === 'item' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('amount')}
                >
                  {t('amount')} {sortConfig.key === 'amount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map(tItem => (
                <tr key={tItem.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedTransactions.includes(tItem.id)}
                      onChange={() => toggleSelectTransaction(tItem.id)}
                    />
                  </td>
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      className={`text-xs font-semibold rounded-full px-2 py-1 border-0 cursor-pointer focus:ring-2 focus:ring-offset-1 focus:ring-blue-500
                      ${tItem.status === 'completed' ? 'bg-green-100 text-green-800' :
                          tItem.status === 'refused' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                        }`}
                      value={tItem.status || 'pending'}
                      onChange={(e) => handleStatusChange(tItem, e.target.value)}
                      onClick={(e) => e.stopPropagation()} // Prevent row click if any
                    >
                      <option value="pending">{t('pending')}</option>
                      <option value="completed">{t('completed')}</option>
                      <option value="refused">{t('refused')}</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tItem.party || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tItem.address || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tItem.delivery_company || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tItem.item_id ? (inventory.find(i => i.id === tItem.item_id)?.name || 'Unknown Item') : tItem.category}
                    {tItem.quantity && ` (x${tItem.quantity})`}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${tItem.type === 'sale' ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {tItem.type === 'sale' ? '+' : '-'}{formatCurrency(tItem.amount || 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleArchive(tItem)} className="text-orange-500 hover:text-orange-700 mr-4" title="Archiver">
                      <Archive size={18} />
                    </button>
                    <button onClick={() => handleEdit(tItem)} className="text-blue-600 hover:text-blue-900 mr-4" title="Modifier">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(tItem.id)} className="text-red-600 hover:text-red-900" title="Supprimer">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                    {t('noTransactions')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const InventoryManager = ({ inventory, setInventory, transactions, setTransactions, suppliers, bankAccounts, supabase, t }) => {
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const uniqueCategories = [...new Set(inventory.map(i => i.category).filter(Boolean))];
  const [statusFilter, setStatusFilter] = useState('Tous les Statuts');
  const [formData, setFormData] = useState({
    name: '', supplier: '', category: '', buyPrice: '', sellPrice: '', quantity: '', lowStockThreshold: 5, paymentStatus: 'none', bankAccountId: '', bankFees: ''
  });

  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedItemForAction, setSelectedItemForAction] = useState(null);
  
  const [purchaseForm, setPurchaseForm] = useState({ 
    date: new Date().toISOString().split('T')[0], 
    supplier: '', quantity: '', amount: '', status: 'pending', bankAccountId: '' 
  });

  const handleExport = () => {
    const data = inventory.map(item => ({
      Name: item.name,
      Supplier: item.supplier,
      'Buy Price': item.buy_price,
      'Sell Price': item.sell_price,
      Quantity: item.quantity,
      'Initial Quantity': item.initial_quantity || item.quantity,
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
    try {
      const dbItem = {
        name: formData.name,
        supplier: formData.supplier,
        category: formData.category,
        quantity: parseInt(formData.quantity) || 0,
        buy_price: parseFloat(formData.buyPrice) || 0,
        sell_price: parseFloat(formData.sellPrice) || 0,
        low_stock_threshold: parseInt(formData.lowStockThreshold) || 0,
        initial_quantity: parseInt(formData.quantity) || 0
      };

      let error = null;
      if (isEditing) {
        const { error: updateError } = await supabase.from('inventory').update(dbItem).eq('id', formData.id);
        error = updateError;
        if (!error) {
          setInventory(prev => prev.map(item => item.id === formData.id ? { ...item, ...dbItem } : item));
        }
      } else {
        const { data, error: insertError } = await supabase.from('inventory').insert([dbItem]).select();
        error = insertError;
        if (!error && data) {
          const newResult = data[0];
          setInventory(prev => [...prev, newResult]);
          if (parseInt(dbItem.quantity) > 0 && formData.paymentStatus !== 'none') {
            const transaction = {
              date: new Date().toISOString().split('T')[0],
              type: 'purchase', status: formData.paymentStatus, category: 'Initial Stock',
              party: dbItem.supplier || 'Initial Stock', item_id: newResult.id, item_name: newResult.name,
              quantity: parseInt(dbItem.quantity), amount: (parseFloat(dbItem.buy_price) || 0) * parseInt(dbItem.quantity),
              notes: 'Initial inventory creation',
              bank_account_id: formData.paymentStatus === 'completed' ? (formData.bankAccountId || null) : null
            };
            
            const txsToInsert = [transaction];
            if (formData.paymentStatus === 'completed' && formData.bankFees && parseFloat(formData.bankFees) > 0) {
                txsToInsert.push({
                    date: transaction.date,
                    type: 'expense',
                    category: 'Frais Bancaires',
                    party: 'Banque',
                    amount: parseFloat(formData.bankFees),
                    status: 'completed',
                    bank_account_id: formData.bankAccountId,
                    notes: `Frais de paiement pour ${dbItem.supplier || 'Stock Initial'} (Ajout Produit)`
                });
            }

            const { data: txData } = await supabase.from('transactions').insert(txsToInsert).select();
            if (txData) setTransactions(prev => [...txData, ...prev]);
          }
        }
      }
      if (error) { alert('Error saving item: ' + error.message); return; }
      setShowForm(false);
      setFormData({ name: '', supplier: '', category: '', buyPrice: '', sellPrice: '', quantity: '', lowStockThreshold: 5, paymentStatus: 'none', bankAccountId: '', bankFees: '' });
      setIsEditing(false);
    } catch (err) { alert('An unexpected error occurred.'); }
  };

  const handleEdit = (item) => {
    setFormData({ ...item, buyPrice: item.buy_price, sellPrice: item.sell_price, lowStockThreshold: item.low_stock_threshold, supplier: item.supplier || '', category: item.category || '' });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('deleteConfirm'))) {
      const { error } = await supabase.from('inventory').update({ is_deleted: true }).eq('id', id);
      if (!error) setInventory(prev => prev.filter(item => item.id !== id));
    }
  };

  const handlePurchaseSubmit = async (e) => {
    e.preventDefault();
    let targetItem = selectedItemForAction;
    if (!targetItem) {
        // Find if they selected an item in the form
        if (!purchaseForm.itemId) return alert("Veuillez sélectionner un produit");
        targetItem = inventory.find(i => i.id === purchaseForm.itemId);
    }
    
    const dbTransaction = {
      date: purchaseForm.date,
      type: 'purchase',
      party: purchaseForm.supplier,
      item_id: targetItem.id,
      item_name: targetItem.name,
      quantity: purchaseForm.quantity,
      amount: purchaseForm.amount,
      status: purchaseForm.status,
      bank_account_id: purchaseForm.status === 'completed' ? (purchaseForm.bankAccountId || null) : null
    };

    const { data, error } = await supabase.from('transactions').insert([dbTransaction]).select();
    if (data) {
      setTransactions(prev => [data[0], ...prev]);
      
      const currentQty = parseInt(targetItem.quantity || 0);
      const newQty = parseInt(purchaseForm.quantity);
      const currentBuyPrice = parseFloat(targetItem.buy_price || 0);
      const purchasePrice = parseFloat(purchaseForm.amount) / newQty; 
      
      const totalValue = (currentQty * currentBuyPrice) + parseFloat(purchaseForm.amount);
      const totalQty = currentQty + newQty;
      const newBuyPrice = totalQty > 0 ? totalValue / totalQty : purchasePrice;
      const currentInitial = parseInt(targetItem.initial_quantity || targetItem.quantity || 0);
      const newInitial = currentInitial + newQty;

      await supabase.from('inventory').update({ quantity: totalQty, buy_price: newBuyPrice, initial_quantity: newInitial }).eq('id', targetItem.id);
      setInventory(prev => prev.map(i => i.id === targetItem.id ? { ...i, quantity: totalQty, buy_price: newBuyPrice, initial_quantity: newInitial } : i));
      
      setShowPurchaseModal(false);
      setPurchaseForm({ date: new Date().toISOString().split('T')[0], supplier: '', quantity: '', amount: '', status: 'pending', bankAccountId: '' });
      setSelectedItemForAction(null);
    } else if (error) {
        alert(error.message);
    }
  };

  const openPurchaseModal = (item = null) => {
      setSelectedItemForAction(item);
      setPurchaseForm({ ...purchaseForm, supplier: item ? (item.supplier || '') : '', itemId: item ? item.id : '' });
      setShowPurchaseModal(true);
  };

  const openHistoryModal = (item = null) => {
      setSelectedItemForAction(item);
      setShowHistoryModal(true);
  };

  const filteredInventory = [...inventory].filter(item => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch = item.name.toLowerCase().includes(searchTermLower) ||
                            (item.category && item.category.toLowerCase().includes(searchTermLower)) ||
                            (item.supplier && item.supplier.toLowerCase().includes(searchTermLower));
      const isLowStock = parseInt(item.quantity) <= parseInt(item.low_stock_threshold);
      const isOutOfStock = parseInt(item.quantity) <= 0;
      let matchesStatus = true;
      if (statusFilter === 'Disponible') matchesStatus = !isOutOfStock && !isLowStock;
      if (statusFilter === 'Stock Bas') matchesStatus = isLowStock && !isOutOfStock;
      if (statusFilter === 'Rupture') matchesStatus = isOutOfStock;
      return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    let aVal = a[sortConfig.key];
    let bVal = b[sortConfig.key];
    
    if (sortConfig.key === 'totalValue') {
       aVal = a.buy_price * a.quantity;
       bVal = b.buy_price * b.quantity;
    } else if (sortConfig.key === 'status') {
       const getStatusStr = (q, t) => parseInt(q) <= 0 ? 'c' : (parseInt(q) <= parseInt(t) ? 'b' : 'a');
       aVal = getStatusStr(a.quantity, a.low_stock_threshold);
       bVal = getStatusStr(b.quantity, b.low_stock_threshold);
    }
    
    if (aVal === undefined || aVal === null) aVal = '';
    if (bVal === undefined || bVal === null) bVal = '';

    if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
    } else {
        aVal = parseFloat(aVal) || 0;
        bVal = parseFloat(bVal) || 0;
    }

    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Package size={32} /></div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Gestion de Stock & Inventaire</h3>
            <p className="text-sm text-gray-500">Suivi de la valeur des marchandises, niveaux de réapprovisionnement et alertes</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><TrendingUp size={20} /></div>
            <p className="text-sm font-semibold text-gray-500 uppercase">Valeur Totale du Stock</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(inventory.reduce((sum, item) => sum + (item.buy_price * item.quantity), 0))}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg"><FileText size={20} /></div>
            <p className="text-sm font-semibold text-gray-500 uppercase">Bénéfice Net Prévisionnel</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(inventory.reduce((sum, item) => sum + ((item.sell_price - item.buy_price) * item.quantity), 0))}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><AlertTriangle size={20} /></div>
            <p className="text-sm font-semibold text-gray-500 uppercase">Stock Bas / Ruptures</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{inventory.filter(item => item.quantity <= item.low_stock_threshold).length}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Package size={20} /></div>
            <p className="text-sm font-semibold text-gray-500 uppercase">Total Des Références (SKU)</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{inventory.length}</p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col xl:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-4 w-full xl:w-auto">
          <div className="relative w-full xl:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Rechercher (Produit, Catégorie, Fournisseur)..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 text-sm" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-gray-300 rounded-lg p-2 text-sm bg-white focus:ring-blue-500">
            <option>Tous les Statuts</option><option>Disponible</option><option>Stock Bas</option><option>Rupture</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2 overflow-x-auto w-full xl:w-auto pb-2 xl:pb-0">
          <button onClick={() => openHistoryModal()} className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 border rounded-lg font-medium text-sm whitespace-nowrap">
            <FileText size={16} /><span>Historique Mouvements</span>
          </button>
          <button onClick={handleExport} className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 border rounded-lg font-medium text-sm whitespace-nowrap">
            <Download size={16} /><span>Exporter</span>
          </button>
          <button onClick={() => { setIsEditing(false); setFormData({ name: '', supplier: '', category: '', buyPrice: '', sellPrice: '', quantity: '', lowStockThreshold: 5, paymentStatus: 'none', bankAccountId: '', bankFees: '' }); setShowForm(true); }} className="flex items-center space-x-2 px-4 py-2 bg-[#00b4d8] hover:bg-[#0096c7] text-white rounded-lg font-medium text-sm whitespace-nowrap">
            <Plus size={16} /><span>Nouveau Produit / Variante</span>
          </button>
          <button onClick={() => openPurchaseModal()} className="flex items-center space-x-2 px-4 py-2 bg-[#f4a261] hover:bg-[#e76f51] text-white rounded-lg font-medium text-sm whitespace-nowrap">
            <Package size={16} /><span>+ Nouvel Achat</span>
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h4 className="text-lg font-bold mb-4 text-gray-800">{isEditing ? t('edit') : t('addItem')}</h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('itemName')}</label>
                <input type="text" required className="mt-1 block w-full rounded-md border p-2" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('supplier')}</label>
                  <input type="text" list="supplier-list" className="w-full rounded-md border p-2" value={formData.supplier} onChange={e => setFormData({ ...formData, supplier: e.target.value })} placeholder={t('optional')} />
                  <datalist id="supplier-list">{suppliers.map(s => <option key={s.id} value={s.name} />)}</datalist>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                  <input type="text" list="category-list" className="w-full rounded-md border p-2" value={formData.category || ''} onChange={e => setFormData({ ...formData, category: e.target.value })} placeholder="Ex: tvbox, iptv" />
                  <datalist id="category-list">{uniqueCategories.map(c => <option key={c} value={c} />)}</datalist>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('buyPrice')}</label>
                  <input type="number" required className="mt-1 block w-full rounded-md border p-2" value={formData.buyPrice} onChange={e => setFormData({ ...formData, buyPrice: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('sellPrice')}</label>
                  <input type="number" required className="mt-1 block w-full rounded-md border p-2" value={formData.sellPrice} onChange={e => setFormData({ ...formData, sellPrice: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('quantity')}</label>
                  <input type="number" required className="mt-1 block w-full rounded-md border p-2" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} disabled={isEditing} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('lowStockAlert')}</label>
                  <input type="number" required className="mt-1 block w-full rounded-md border p-2" value={formData.lowStockThreshold} onChange={e => setFormData({ ...formData, lowStockThreshold: e.target.value })} />
                </div>
              </div>
              
              {!isEditing && formData.quantity > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4 space-y-4">
                  <h5 className="font-medium text-gray-800 flex items-center gap-2"><CreditCard size={18} className="text-blue-500" /> Détails du Paiement (Stock Initial)</h5>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Statut du Paiement</label>
                    <select className="w-full border-gray-300 rounded-lg p-2 border bg-white" value={formData.paymentStatus} onChange={(e) => setFormData({...formData, paymentStatus: e.target.value})}>
                        <option value="none">Ignorer (Stock Existant)</option>
                        <option value="pending">NON PAYÉ (Crédit)</option>
                        <option value="completed">PAYÉ (Immédiat)</option>
                    </select>
                  </div>
                  {formData.paymentStatus === 'completed' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Compte Bancaire / Caisse</label>
                        <select required className="w-full border-gray-300 rounded-lg p-2 border bg-white" value={formData.bankAccountId} onChange={(e) => setFormData({...formData, bankAccountId: e.target.value})}>
                            <option value="">Sélectionner un compte</option>
                            {bankAccounts && bankAccounts.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Frais Bancaires (MAD)</label>
                        <input type="number" step="0.01" min="0" className="w-full border-gray-300 rounded-lg p-2 border bg-white" value={formData.bankFees} onChange={(e) => setFormData({...formData, bankFees: e.target.value})} placeholder="Optionnel" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">{t('cancel')}</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{t('save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('name')}>Produit & SKU {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('category')}>Catégorie {sortConfig.key === 'category' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('supplier')}>Fournisseur {sortConfig.key === 'supplier' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('quantity')}>Quantité {sortConfig.key === 'quantity' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('buy_price')}>Prix d'Achat Moyen {sortConfig.key === 'buy_price' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}<br/><span className="text-[10px] text-gray-400 font-normal">(CMUP)</span></th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('totalValue')}>Valeur Totale {sortConfig.key === 'totalValue' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase cursor-pointer hover:bg-gray-100" onClick={() => handleSort('status')}>Statut {sortConfig.key === 'status' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredInventory.map((item, index) => {
                const isLowStock = parseInt(item.quantity) <= parseInt(item.low_stock_threshold);
                const isOutOfStock = parseInt(item.quantity) <= 0;
                const colors = ['bg-green-600', 'bg-purple-600', 'bg-blue-600', 'bg-orange-600'];
                const iconBg = colors[index % colors.length];
                const sku = `MAB-${String(item.id).substring(0, 4).toUpperCase()}`;

                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <button onClick={() => openPurchaseModal(item)} className="text-blue-500 hover:bg-blue-50 p-1 rounded-full bg-blue-50" title="Nouvel Achat">
                          <Plus size={14} />
                        </button>
                        <div className={`p-2 rounded-lg text-white ${iconBg}`}><Package size={20} /></div>
                        <div>
                          <div className="text-sm font-bold text-gray-900 cursor-pointer hover:text-blue-600" onClick={() => handleEdit(item)}>{item.name}</div>
                          <div className="text-xs text-gray-400">{sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {item.category ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {item.category}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">{item.supplier || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2"><span className="text-sm font-bold text-gray-900">{item.quantity}</span></div>
                      <div className="w-24 h-1.5 bg-gray-200 rounded-full mt-2 overflow-hidden">
                        <div className={`h-full rounded-full ${isOutOfStock ? 'bg-red-500' : isLowStock ? 'bg-orange-500' : 'bg-green-500'}`} style={{ width: `${Math.min(100, (item.quantity / Math.max(20, item.initial_quantity || item.quantity)) * 100)}%` }}></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900">MAD {parseFloat(item.buy_price).toFixed(2)}</div>
                      <div className="text-xs text-gray-500 mt-1">Vente: {parseFloat(item.sell_price).toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-blue-600">MAD {(item.buy_price * item.quantity).toFixed(2)}</div>
                      <div className="text-xs text-green-600 font-medium mt-1">Profit Prév: {((item.sell_price - item.buy_price) * item.quantity).toFixed(2)} MAD</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {isOutOfStock ? (
                        <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700"><span>RUPTURE</span></span>
                      ) : isLowStock ? (
                        <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700"><span>STOCK BAS</span></span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700"><span>DISPONIBLE</span></span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-3">
                        <button onClick={() => openHistoryModal(item)} className="text-gray-400 hover:text-indigo-600 transition-colors" title="Historique Mouvements"><History size={18} /></button>
                        <button onClick={() => handleEdit(item)} className="text-gray-400 hover:text-blue-600 transition-colors" title="Modifier"><Edit size={18} /></button>
                        <button onClick={() => handleDelete(item.id)} className="text-gray-400 hover:text-red-600 transition-colors" title="Supprimer"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
            <button onClick={() => setShowPurchaseModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20} /></button>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><ShoppingCart size={20} className="text-orange-500" /> Nouvel Achat de Stock</h3>
            <form onSubmit={handlePurchaseSubmit} className="space-y-4">
              {!selectedItemForAction && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Produit</label>
                  <select required className="w-full border rounded-lg p-2" value={purchaseForm.itemId} onChange={(e) => setPurchaseForm({...purchaseForm, itemId: e.target.value})}>
                      <option value="">Sélectionner un produit</option>
                      {inventory.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                  </select>
                </div>
              )}
              {selectedItemForAction && (
                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                      <p className="text-sm font-bold text-gray-800">{selectedItemForAction.name}</p>
                      <p className="text-xs text-gray-500">Stock Actuel: {selectedItemForAction.quantity}</p>
                  </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fournisseur</label>
                <select required className="w-full border rounded-lg p-2" value={purchaseForm.supplier} onChange={(e) => setPurchaseForm({...purchaseForm, supplier: e.target.value})}>
                    <option value="">Sélectionner un fournisseur</option>
                    {suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantité Achetée</label>
                    <input required type="number" min="1" className="w-full border rounded-lg p-2" value={purchaseForm.quantity} onChange={(e) => setPurchaseForm({...purchaseForm, quantity: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Montant (MAD)</label>
                    <input required type="number" step="0.01" min="0" className="w-full border rounded-lg p-2" value={purchaseForm.amount} onChange={(e) => setPurchaseForm({...purchaseForm, amount: e.target.value})} />
                  </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut du Paiement</label>
                <select className="w-full border rounded-lg p-2" value={purchaseForm.status} onChange={(e) => setPurchaseForm({...purchaseForm, status: e.target.value})}>
                    <option value="pending">NON PAYÉ (Crédit - Dette Fournisseur)</option>
                    <option value="completed">PAYÉ (Immédiat - Sortie de Trésorerie)</option>
                </select>
              </div>
              {purchaseForm.status === 'completed' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Compte Bancaire / Caisse Source</label>
                    <select required className="w-full border rounded-lg p-2" value={purchaseForm.bankAccountId} onChange={(e) => setPurchaseForm({...purchaseForm, bankAccountId: e.target.value})}>
                        <option value="">Sélectionner un compte</option>
                        {bankAccounts && bankAccounts.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </div>
              )}
              <div className="pt-4 flex justify-end gap-3">
                  <button type="submit" className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium">Enregistrer l'Achat</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full shadow-2xl relative max-h-[80vh] flex flex-col">
            <button onClick={() => setShowHistoryModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20} /></button>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><History size={20} className="text-indigo-500" /> Historique des Mouvements {selectedItemForAction ? `- ${selectedItemForAction.name}` : '(Tous les produits)'}</h3>
            
            <div className="overflow-y-auto flex-1 border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Produit</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Qté</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Montant</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {transactions
                            .filter(t => (t.type === 'purchase' || t.type === 'sale') && !t.is_archived && (!selectedItemForAction || t.item_id === selectedItemForAction.id))
                            .map(t => (
                            <tr key={t.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{new Date(t.date).toLocaleDateString()}</td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    {t.type === 'purchase' 
                                        ? <span className="text-orange-600 font-medium text-sm">Entrée (Achat/Initial)</span>
                                        : <span className="text-green-600 font-medium text-sm">Sortie (Vente)</span>
                                    }
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700">{t.item_name}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-right font-medium">
                                    {t.type === 'purchase' ? <span className="text-orange-600">+{t.quantity}</span> : <span className="text-green-600">-{t.quantity}</span>}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-right text-sm">MAD {parseFloat(t.amount || 0).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const ReportView = ({ transactions, inventory, t }) => {
  const [dateFilter, setDateFilter] = useState('thisMonth');
  const reportRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => reportRef.current,
  });

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Financial Report',
          text: `Mabox.ma Financial Report - ${t(dateFilter)}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      alert('Web Share API not supported');
    }
  };

  // --- Filtering Logic ---
  const getFilteredTransactions = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    return transactions.filter(t => {
      const tDate = new Date(t.date);
      if (dateFilter === 'thisMonth') return tDate >= startOfMonth;
      if (dateFilter === 'lastMonth') return tDate >= startOfLastMonth && tDate <= endOfLastMonth;
      if (dateFilter === 'thisYear') return tDate >= startOfYear;
      return true;
    });
  };

  const filteredTransactions = getFilteredTransactions();

  // --- KPI Calculations ---
  const calculateKPIs = () => {
    let income = 0;
    let expenses = 0;
    let pendingCol = 0;
    let pendingPay = 0;

    const activeTransactions = filteredTransactions.filter(t => !t.is_archived);
    activeTransactions.forEach(t => {
      const amount = parseFloat(t.amount || 0);
      if (t.type === 'sale') {
        if (t.status === 'completed') income += amount;
        if (t.status === 'pending') pendingCol += amount;
      } else if ((t.type === 'expense' && t.status === 'completed') || (t.type === 'purchase' && t.status === 'completed')) {
        expenses += amount;
      }
    });

    // Pending Payments (All time or filtered? Let's do filtered for consistency with the view, or maybe all time is better? 
    // The user asked for "Pending Payments" in the context of the report. 
    // Usually reports are for a period. "Pending created in this period" makes sense.)
    // But for "Pending Balance" in suppliers, it was all time. 
    // Let's stick to filtered for the report to show "Performance in this period".
    // Actually, for "Pending Payments", let's include all pending purchases in the filtered period.
    activeTransactions.forEach(t => {
      if (t.type === 'purchase' && t.status === 'pending') {
        pendingPay += parseFloat(t.amount || 0);
      }
    });

    const netProfit = income - expenses;
    const margin = income > 0 ? (netProfit / income) * 100 : 0;

    return { income, expenses, netProfit, margin, pendingCol, pendingPay };
  };

  const { income, expenses, netProfit, margin, pendingCol, pendingPay } = calculateKPIs();

  // --- Chart Data Preparation ---
  const getTrendData = () => {
    const data = {};
    const isDaily = dateFilter === 'thisMonth' || dateFilter === 'lastMonth';

    const activeTransactions = filteredTransactions.filter(t => !t.is_archived);
    activeTransactions.forEach(t => {
      if (t.status !== 'completed') return;

      const date = new Date(t.date);
      const key = isDaily
        ? date.getDate() // Day of month
        : date.toLocaleString('default', { month: 'short' }); // Month name

      if (!data[key]) data[key] = { name: key, income: 0, expenses: 0 };

      const amount = parseFloat(t.amount || 0);
      if (t.type === 'sale') data[key].income += amount;
      else if (t.type === 'expense' || t.type === 'purchase') data[key].expenses += amount;
    });

    return Object.values(data).sort((a, b) => {
      if (isDaily) return a.name - b.name;
      // Sort months logic could be added here if needed, but simple sort might fail for months. 
      // For simplicity in this iteration, we rely on insertion order or basic sort.
      return 0;
    });
  };

  const getExpenseBreakdown = () => {
    const data = { Purchase: 0, Delivery: 0, Packaging: 0, Other: 0 };
    const activeTransactions = filteredTransactions.filter(t => !t.is_archived);
    activeTransactions.forEach(t => {
      if ((t.type === 'expense' || t.type === 'purchase') && t.status === 'completed') {
        const amount = parseFloat(t.amount || 0);
        if (t.type === 'purchase') data.Purchase += amount;
        // Assuming we can identify delivery/packaging from category or type. 
        // Current schema might not have explicit 'delivery' type in transactions, usually it's 'expense' with category.
        // Let's assume 'expense' type.
        else if (t.category === 'delivery') data.Delivery += amount; // If category exists
        else if (t.category === 'packaging') data.Packaging += amount;
        else data.Other += amount;
      }
    });
    return Object.keys(data).map(key => ({ name: key, value: data[key] })).filter(d => d.value > 0);
  };

  const getTopItems = () => {
    const items = {};
    const activeTransactions = filteredTransactions.filter(t => !t.is_archived);
    activeTransactions.forEach(t => {
      if (t.type === 'sale' && t.status === 'completed') {
        const item = inventory.find(i => i.id === t.item_id);
        const name = item ? item.name : 'Unknown';
        if (!items[name]) items[name] = 0;
        items[name] += parseFloat(t.amount || 0);
      }
    });
    return Object.entries(items)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 print:hidden">
        <h3 className="text-xl font-bold text-gray-800">{t('financialReport')}</h3>
        <div className="flex items-center gap-2">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
          >
            <option value="thisMonth">{t('thisMonth')}</option>
            <option value="lastMonth">{t('lastMonth')}</option>
            <option value="thisYear">{t('thisYear')}</option>
            <option value="allTime">{t('allTime')}</option>
          </select>
          <button onClick={handleShare} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
            <Share2 size={20} /> <span className="hidden md:inline">{t('shareSummary')}</span>
          </button>
          <button onClick={handlePrint} className="bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-900">
            <Printer size={20} /> <span className="hidden md:inline">{t('printReport')}</span>
          </button>
        </div>
      </div>

      <div ref={reportRef} className="space-y-8 print:p-8">
        {/* Report Title (Print Only) */}
        <div className="hidden print:block text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Mabox.ma Management</h1>
          <p className="text-gray-500">{t(dateFilter)} Report</p>
          <p className="text-sm text-gray-400">{new Date().toLocaleDateString()}</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">{t('revenue')}</p>
            <p className="text-2xl font-bold text-gray-800">{formatCurrency(income)}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">{t('expenses')}</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(expenses)}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">{t('netProfit')}</p>
            <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(netProfit)}
            </p>
            <p className="text-xs text-gray-400">{margin.toFixed(1)}% {t('profitMargin')}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">{t('pendingCollection')}</p>
            <p className="text-2xl font-bold text-orange-500">{formatCurrency(pendingCol)}</p>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:break-inside-avoid">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-80">
            <h4 className="text-sm font-bold text-gray-700 mb-4">{t('monthlyTrend')}</h4>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getTrendData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#16a34a" name={t('income')} />
                <Line type="monotone" dataKey="expenses" stroke="#dc2626" name={t('expenses')} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-80">
            <h4 className="text-sm font-bold text-gray-700 mb-4">{t('expenseBreakdown')}</h4>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getExpenseBreakdown()}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {getExpenseBreakdown().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#dc2626', '#ea580c', '#ca8a04', '#6b7280'][index % 4]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Items & Recent Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:break-inside-avoid">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-80">
            <h4 className="text-sm font-bold text-gray-700 mb-4">{t('topItems')}</h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getTopItems()} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-80 overflow-auto">
            <h4 className="text-sm font-bold text-gray-700 mb-4">{t('recentActivity')}</h4>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t('date')}</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t('status')}</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{t('details')}</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">{t('amount')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTransactions.slice(0, 10).map(tItem => (
                  <tr key={tItem.id}>
                    <td className="px-4 py-2 text-sm text-gray-500">{tItem.date}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${tItem.status === 'completed' ? 'bg-green-100 text-green-800' :
                          tItem.status === 'refused' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                        }`}>
                        {t(tItem.status || 'pending')}
                      </span>
                    </td>
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
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-400 print:block hidden">
          <p>End of Report • Mabox.ma Management</p>
        </div>
      </div>
    </div>
  );
};

const HistoryView = ({ transactions, inventory, t }) => {
  const [activeTab, setActiveTab] = useState('inventoryHistory'); // 'inventoryHistory' or 'supplierPayments'

  const purchases = transactions.filter(t => t.type === 'purchase');

  return (
    <div className="space-y-6">
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          className={`py-2 px-4 font-medium text-sm focus:outline-none ${activeTab === 'inventoryHistory' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('inventoryHistory')}
        >
          {t('inventoryHistory')}
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm focus:outline-none ${activeTab === 'supplierPayments' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('supplierPayments')}
        >
          {t('supplierPayments')}
        </button>
      </div>

      {activeTab === 'inventoryHistory' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('date')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('item')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('supplier')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('quantity')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('cost')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {purchases.map(tItem => (
                  <tr key={tItem.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tItem.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tItem.item_id ? (inventory.find(i => i.id === tItem.item_id)?.name || 'Unknown Item') : tItem.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tItem.party}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tItem.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(tItem.amount)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${tItem.status === 'completed' ? 'bg-green-100 text-green-800' :
                          tItem.status === 'refused' ? 'bg-red-100 text-red-800' :
                          tItem.status === 'deleted' ? 'bg-gray-200 text-gray-800' :
                            'bg-yellow-100 text-yellow-800'
                        }`}>
                        {tItem.status === 'deleted' ? 'Supprimé' : t(tItem.status || 'pending')}
                      </span>
                    </td>
                  </tr>
                ))}
                {purchases.length === 0 && (
                  <tr><td colSpan="6" className="px-6 py-12 text-center text-sm text-gray-500">{t('noTransactions')}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'supplierPayments' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('date')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('supplier')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('amount')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {purchases.map(tItem => (
                  <tr key={tItem.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tItem.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tItem.party}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(tItem.amount)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${tItem.status === 'completed' ? 'bg-green-100 text-green-800' :
                          tItem.status === 'refused' ? 'bg-red-100 text-red-800' :
                          tItem.status === 'deleted' ? 'bg-gray-200 text-gray-800' :
                            'bg-yellow-100 text-yellow-800'
                        }`}>
                        {tItem.status === 'deleted' ? 'Supprimé' : t(tItem.status || 'pending')}
                      </span>
                    </td>
                  </tr>
                ))}
                {purchases.length === 0 && (
                  <tr><td colSpan="4" className="px-6 py-12 text-center text-sm text-gray-500">{t('noTransactions')}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const SupplierManager = ({ suppliers, setSuppliers, transactions, setTransactions, inventory, setInventory, bankAccounts, supabase, t }) => {
  const [newSupplier, setNewSupplier] = useState({ name: '', contact: '' });
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const uniqueCategories = [...new Set(inventory.map(i => i.category).filter(Boolean))];

  // Modals state
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  
  // Releve state
  const [releveStartDate, setReleveStartDate] = useState('');
  const [releveEndDate, setReleveEndDate] = useState('');
  const [releveSelectedIds, setReleveSelectedIds] = useState([]);

  // Purchase form state
  const [purchaseForm, setPurchaseForm] = useState({ 
    date: new Date().toISOString().split('T')[0], 
    mode: 'detailed', 
    itemId: '', 
    quantity: '1', 
    amount: '', 
    status: 'pending', 
    bankAccountId: '', 
    fees: '',
    detailedItems: [{ id: generateId(), itemId: '', quantity: '1', price: '' }],
    category: '',
    reference: '',
    notes: ''
  });
  // Payment form state
  const [paymentForm, setPaymentForm] = useState({ date: new Date().toISOString().split('T')[0], amount: '', bankAccountId: '', fees: '' });

  const getSupplierStats = (supplierName) => {
    const supplierPurchases = transactions.filter(t => t.type === 'purchase' && t.party === supplierName && (t.status === 'completed' || t.status === 'pending'));
    const supplierPayments = transactions.filter(t => t.type === 'expense' && t.category === 'Supplier Payment' && t.party === supplierName && t.status === 'completed');
    
    const totalPurchases = supplierPurchases.reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
    const paidViaCompletedPurchases = supplierPurchases.filter(t => t.status === 'completed').reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
    const paidViaPartialPayments = supplierPayments.reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
    
    const paid = paidViaCompletedPurchases + paidViaPartialPayments;
    const balance = totalPurchases - paid;
    const products = [...new Set(supplierPurchases.map(t => {
       if (t.item_id) {
           const item = inventory.find(i => i.id === t.item_id);
           return item ? item.name : 'Produit';
       }
       return t.category;
    }).filter(Boolean))].join(', ');
    return { totalPurchases, paid, balance, products };
  };

  let totalDebts = 0;
  let purchaseVolume = 0;
  let totalPaid = 0;
  
  suppliers.forEach(s => {
      const stats = getSupplierStats(s.name);
      totalDebts += (stats.balance > 0 ? stats.balance : 0);
      purchaseVolume += stats.totalPurchases;
      totalPaid += stats.paid;
  });

  const activeSuppliers = suppliers.length;

  const getGroupedReleveTransactions = () => {
    if (!selectedSupplier) return [];
    let filtered = transactions.filter(t => t.party === selectedSupplier && (t.type === 'purchase' || (t.type === 'expense' && t.category === 'Supplier Payment')));
    
    if (releveStartDate) filtered = filtered.filter(t => t.date >= releveStartDate);
    if (releveEndDate) filtered = filtered.filter(t => t.date <= releveEndDate);

    const groups = {};
    const result = [];
    
    filtered.forEach(t => {
       if (t.type === 'purchase' && t.notes && t.notes.includes('Réf:')) {
           const key = `${t.date}_${t.category}_${t.notes}`;
           if (!groups[key]) {
               groups[key] = {
                   id: t.id,
                   isGroup: true,
                   date: t.date,
                   type: 'purchase',
                   category: t.category,
                   notes: t.notes,
                   items: [],
                   totalAmount: 0,
                   status: t.status
               };
               result.push(groups[key]);
           }
           groups[key].items.push({ name: t.item_name, quantity: t.quantity, amount: t.amount });
           groups[key].totalAmount += parseFloat(t.amount || 0);
       } else {
           result.push({
               ...t,
               isGroup: false,
               totalAmount: parseFloat(t.amount || 0)
           });
       }
    });
    
    return result.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const handleExportSelectionCSV = () => {
    const groupedTx = getGroupedReleveTransactions();
    const selectedTx = groupedTx.filter(t => releveSelectedIds.includes(t.id));
    
    if (selectedTx.length === 0) {
        alert("Veuillez sélectionner au moins une transaction à exporter.");
        return;
    }
    
    const headers = ['Date', 'Type', 'Catégorie', 'Notes', 'Montant (MAD)'];
    const csvContent = [
        headers.join(','),
        ...selectedTx.map(t => {
            const typeStr = t.type === 'purchase' ? (t.isGroup ? 'Achat Détaillé' : 'Achat') : 'Paiement';
            const notes = `"${(t.notes || '').replace(/"/g, '""')}"`;
            return `${t.date},${typeStr},${t.category || ''},${notes},${t.totalAmount}`;
        })
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Releve_${selectedSupplier}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleAddSupplier = async () => {
    if (newSupplier.name) {
      if (editingId) {
        const originalSupplier = suppliers.find(s => s.id === editingId);
        const originalStats = getSupplierStats(originalSupplier.name);
        
        const { data, error } = await supabase.from('suppliers').update({ name: newSupplier.name, contact: newSupplier.contact }).eq('id', editingId).select();
        if (data) {
          setSuppliers(suppliers.map(s => s.id === editingId ? data[0] : s));
          
          let updatedTx = [...transactions];
          
          // Cascading Name Change to Transactions
          if (originalSupplier.name !== newSupplier.name) {
              await supabase.from('transactions').update({ party: newSupplier.name }).eq('party', originalSupplier.name);
              
              const oldNotes = `pour ${originalSupplier.name}`;
              const newNotes = `pour ${newSupplier.name}`;
              const feesToUpdate = transactions.filter(t => t.category === 'Frais Bancaires' && t.notes && t.notes.includes(oldNotes));
              for(const fee of feesToUpdate) {
                  const updatedNotes = fee.notes.replace(oldNotes, newNotes);
                  await supabase.from('transactions').update({ notes: updatedNotes }).eq('id', fee.id);
              }

              updatedTx = updatedTx.map(t => {
                  let modified = t;
                  if (t.party === originalSupplier.name) {
                      modified = { ...modified, party: newSupplier.name };
                  }
                  if (t.category === 'Frais Bancaires' && t.notes && t.notes.includes(oldNotes)) {
                      modified = { ...modified, notes: t.notes.replace(oldNotes, newNotes) };
                  }
                  return modified;
              });
          }

          const diffPurchases = parseFloat(newSupplier.totalPurchases || 0) - originalStats.totalPurchases;
          const diffPaid = parseFloat(newSupplier.totalPaid || 0) - originalStats.paid;
          
          let newTransactions = [];
          if (diffPurchases !== 0) {
              newTransactions.push({
                  date: new Date().toISOString().split('T')[0],
                  type: 'purchase',
                  party: newSupplier.name,
                  amount: diffPurchases,
                  status: 'completed',
                  category: 'Ajustement',
                  notes: 'Ajustement manuel du total achats'
              });
          }
          if (diffPaid !== 0) {
              newTransactions.push({
                  date: new Date().toISOString().split('T')[0],
                  type: 'expense',
                  category: 'Supplier Payment',
                  party: newSupplier.name,
                  amount: diffPaid,
                  status: 'completed',
                  notes: 'Ajustement manuel du total payé'
              });
          }
          
          if (newTransactions.length > 0) {
              const { data: txData } = await supabase.from('transactions').insert(newTransactions).select();
              if (txData) {
                  updatedTx = [...txData, ...updatedTx];
              }
          }
          
          setTransactions(updatedTx);
          setNewSupplier({ name: '', contact: '' });
          setEditingId(null);
          setShowAddForm(false);
        }
      } else {
        const { data, error } = await supabase.from('suppliers').insert([{ name: newSupplier.name, contact: newSupplier.contact }]).select();
        if (data) {
          setSuppliers([...suppliers, data[0]]);
          setNewSupplier({ name: '', contact: '' });
          setShowAddForm(false);
        }
      }
    }
  };

  const handleDeleteSupplier = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce fournisseur ? ATTENTION : Toutes les transactions, achats, et paiements liés seront supprimés, et le stock sera ajusté.")) {
      const supplierToDelete = suppliers.find(s => s.id === id);
      if (!supplierToDelete) return;

      // 1. Revert Inventory Quantities
      const supplierPurchases = transactions.filter(t => t.party === supplierToDelete.name && t.type === 'purchase');
      for (const purchase of supplierPurchases) {
          if (purchase.item_id) {
              const item = inventory.find(i => i.id === purchase.item_id);
              if (item) {
                  const currentQty = parseInt(item.quantity || 0);
                  const purchaseQty = parseInt(purchase.quantity || 0);
                  const newQty = Math.max(0, currentQty - purchaseQty);
                  
                  const currentInitial = parseInt(item.initial_quantity || item.quantity || 0);
                  const newInitial = Math.max(0, currentInitial - purchaseQty);

                  await supabase.from('inventory').update({ quantity: newQty, initial_quantity: newInitial }).eq('id', item.id);
                  setInventory(prev => prev.map(i => i.id === item.id ? { ...i, quantity: newQty, initial_quantity: newInitial } : i));
              }
          }
      }

      // 2. Delete related fee transactions (Frais Bancaires)
      const feesNotesStr = `pour ${supplierToDelete.name}`;
      const feesToDelete = transactions.filter(t => t.category === 'Frais Bancaires' && t.notes && t.notes.includes(feesNotesStr));
      for (const fee of feesToDelete) {
          await supabase.from('transactions').delete().eq('id', fee.id);
      }

      // 3. Delete all supplier transactions
      await supabase.from('transactions').delete().eq('party', supplierToDelete.name);

      // 4. Delete Supplier
      await supabase.from('suppliers').delete().eq('id', id);

      // 5. Add History Log
      const deletionLog = {
          date: new Date().toISOString().split('T')[0],
          type: 'expense',
          category: 'Log Système',
          party: 'Système',
          amount: 0,
          status: 'completed',
          notes: `Suppression du fournisseur "${supplierToDelete.name}" et de son historique.`
      };
      
      const { data: logData } = await supabase.from('transactions').insert([deletionLog]).select();

      // 6. Update local state
      setSuppliers(suppliers.filter(s => s.id !== id));
      const feesIds = feesToDelete.map(f => f.id);
      let updatedTransactions = transactions.filter(t => t.party !== supplierToDelete.name && !feesIds.includes(t.id));
      if (logData) {
          updatedTransactions = [logData[0], ...updatedTransactions];
      }
      setTransactions(updatedTransactions);
    }
  };

  const handlePurchaseSubmit = async (e) => {
    e.preventDefault();
    
    let transactionsToInsert = [];
    let inventoryUpdates = [];
    
    const commonFields = {
      date: purchaseForm.date,
      type: 'purchase',
      party: selectedSupplier,
      status: purchaseForm.status,
      bank_account_id: purchaseForm.status === 'completed' ? (purchaseForm.bankAccountId || null) : null,
      category: purchaseForm.mode === 'detailed' ? purchaseForm.category : '',
      notes: purchaseForm.mode === 'detailed' ? (purchaseForm.reference ? `Réf: ${purchaseForm.reference} | ${purchaseForm.notes}` : purchaseForm.notes) : ''
    };

    if (purchaseForm.mode === 'detailed') {
      purchaseForm.detailedItems.forEach(dItem => {
         const item = inventory.find(i => i.id === dItem.itemId);
         const lineAmount = parseFloat(dItem.price || 0) * parseInt(dItem.quantity || 1);
         
         if (item) {
             transactionsToInsert.push({
               ...commonFields,
               item_id: dItem.itemId,
               item_name: item.name,
               quantity: parseInt(dItem.quantity || 1),
               amount: lineAmount
             });
             
             inventoryUpdates.push({
                 item: item,
                 qtyToAdd: parseInt(dItem.quantity || 1),
                 lineAmount: lineAmount
             });
         }
      });
      
      if (purchaseForm.status === 'completed' && purchaseForm.fees && parseFloat(purchaseForm.fees) > 0) {
          transactionsToInsert.push({
              date: purchaseForm.date,
              type: 'expense',
              category: 'Frais Bancaires',
              party: 'Banque',
              amount: parseFloat(purchaseForm.fees),
              status: 'completed',
              bank_account_id: purchaseForm.bankAccountId,
              notes: `Frais de paiement pour ${selectedSupplier} (Nouvel Achat Détaillé)`
          });
      }
    } else {
        const item = inventory.find(i => i.id === purchaseForm.itemId);
        const dbTransaction = {
          ...commonFields,
          item_id: purchaseForm.itemId,
          item_name: item ? item.name : '',
          quantity: purchaseForm.quantity,
          amount: purchaseForm.amount
        };
        transactionsToInsert.push(dbTransaction);
        
        if (item) {
            inventoryUpdates.push({
                item: item,
                qtyToAdd: parseInt(purchaseForm.quantity || 0),
                lineAmount: parseFloat(purchaseForm.amount || 0)
            });
        }
        
        if (purchaseForm.status === 'completed' && purchaseForm.fees && parseFloat(purchaseForm.fees) > 0) {
            transactionsToInsert.push({
                date: purchaseForm.date,
                type: 'expense',
                category: 'Frais Bancaires',
                party: 'Banque',
                amount: parseFloat(purchaseForm.fees),
                status: 'completed',
                bank_account_id: purchaseForm.bankAccountId,
                notes: `Frais de paiement pour ${selectedSupplier} (Nouvel Achat)`
            });
        }
    }

    const { data, error } = await supabase.from('transactions').insert(transactionsToInsert).select();
    if (data) {
      setTransactions(prev => [...data, ...prev]);
      
      // Update inventory (WAC logic)
      for (const update of inventoryUpdates) {
          const item = update.item;
          const currentQty = parseInt(item.quantity || 0);
          const newQty = update.qtyToAdd;
          const currentBuyPrice = parseFloat(item.buy_price || 0);
          
          const totalValue = (currentQty * currentBuyPrice) + parseFloat(purchaseForm.amount);
          const totalQty = currentQty + newQty;
          const newBuyPrice = totalQty > 0 ? totalValue / totalQty : purchasePrice;
          const currentInitial = parseInt(item.initial_quantity || item.quantity || 0);
          const newInitial = currentInitial + newQty;

          await supabase.from('inventory').update({ quantity: totalQty, buy_price: newBuyPrice, initial_quantity: newInitial }).eq('id', purchaseForm.itemId);
          setInventory(prev => prev.map(i => i.id === purchaseForm.itemId ? { ...i, quantity: totalQty, buy_price: newBuyPrice, initial_quantity: newInitial } : i));
      }
      
      setShowPurchaseModal(false);
      setPurchaseForm({ date: new Date().toISOString().split('T')[0], itemId: '', quantity: '', amount: '', status: 'pending', bankAccountId: '', fees: '' });
    } else if (error) {
        alert(error.message);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSupplier || !paymentForm.amount || !paymentForm.bankAccountId) {
        alert("Veuillez remplir tous les champs");
        return;
    }

    const transactionsToInsert = [];

    // 1. Supplier payment
    transactionsToInsert.push({
      date: paymentForm.date,
      type: 'expense',
      category: 'Supplier Payment',
      party: selectedSupplier,
      amount: parseFloat(paymentForm.amount),
      status: 'completed',
      bank_account_id: paymentForm.bankAccountId,
      notes: "Paiement Fournisseur partiel/complet"
    });

    // 2. Fees payment (if any)
    if (paymentForm.fees && parseFloat(paymentForm.fees) > 0) {
      transactionsToInsert.push({
        date: paymentForm.date,
        type: 'expense',
        category: 'Frais Bancaires',
        party: 'Banque',
        amount: parseFloat(paymentForm.fees),
        status: 'completed',
        bank_account_id: paymentForm.bankAccountId,
        notes: `Frais de paiement pour ${selectedSupplier}`
      });
    }

    const { data, error } = await supabase.from('transactions').insert(transactionsToInsert).select();
    if (data) {
      setTransactions(prev => [...data, ...prev]);
      setShowPaymentModal(false);
      setPaymentForm({ date: new Date().toISOString().split('T')[0], amount: '', bankAccountId: '', fees: '' });
    } else if (error) {
      alert(error.message);
    }
  };

  const filteredSuppliers = suppliers.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Gestion des Achats & Fournisseurs</h3>
          <p className="text-sm text-gray-500">Suivi en temps réel des transactions, dettes et profils fournisseurs</p>
        </div>
        <div>
          <select className="border border-gray-300 rounded-lg p-2 text-sm text-gray-700 bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500">
            <option>Lifetime</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <AlertCircle size={20} />
            </div>
            <p className="text-sm font-semibold text-gray-500 uppercase">Total Dettes Fournisseurs</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalDebts)}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <BarChart2 size={20} />
            </div>
            <p className="text-sm font-semibold text-gray-500 uppercase">Volume Achats</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(purchaseVolume)}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Wallet size={20} />
            </div>
            <p className="text-sm font-semibold text-gray-500 uppercase">Total Volume Payé</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalPaid)}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Users size={20} />
            </div>
            <p className="text-sm font-semibold text-gray-500 uppercase">Fournisseurs Actifs</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{activeSuppliers}</p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col xl:flex-row justify-between items-center gap-4">
        <div className="flex space-x-2 w-full xl:w-auto">
          <div className="relative flex-1 xl:w-64">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg w-full text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2 overflow-x-auto w-full xl:w-auto pb-2 xl:pb-0">
          <button onClick={() => setShowAddForm(!showAddForm)} className="flex items-center space-x-2 px-3 py-2 text-gray-700 bg-white hover:bg-gray-50 border rounded-lg text-sm font-medium whitespace-nowrap">
            <UserPlus size={16} /><span>+ Fournisseur</span>
          </button>
          <button onClick={() => setShowPurchaseModal(true)} className="flex items-center space-x-2 px-3 py-2 text-white bg-orange-500 hover:bg-orange-600 rounded-lg text-sm font-medium whitespace-nowrap">
            <ShoppingCart size={16} /><span>+ Nouvel Achat</span>
          </button>
          <button onClick={() => setShowPaymentModal(true)} className="flex items-center space-x-2 px-3 py-2 text-white bg-purple-500 hover:bg-purple-600 rounded-lg text-sm font-medium whitespace-nowrap">
            <CreditCard size={16} /><span>+ Paiement</span>
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center animate-fade-in-up">
          <input
            type="text"
            placeholder={t('name')}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            value={newSupplier.name}
            onChange={e => setNewSupplier({ ...newSupplier, name: e.target.value })}
          />
          <input
            type="text"
            placeholder={t('phone')}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            value={newSupplier.contact}
            onChange={e => setNewSupplier({ ...newSupplier, contact: e.target.value })}
          />
          {editingId && (
            <>
              <input
                type="number"
                placeholder="Total Achats"
                title="Modifier le Total des Achats"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                value={newSupplier.totalPurchases}
                onChange={e => setNewSupplier({ ...newSupplier, totalPurchases: e.target.value })}
              />
              <input
                type="number"
                placeholder="Total Payé"
                title="Modifier le Total Payé"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                value={newSupplier.totalPaid}
                onChange={e => setNewSupplier({ ...newSupplier, totalPaid: e.target.value })}
              />
            </>
          )}
          <div className="flex space-x-2">
              <button
                onClick={handleAddSupplier}
                disabled={!newSupplier.name}
                className="bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap"
              >
                {editingId ? 'Modifier' : t('add')}
              </button>
              {editingId && (
                  <button
                    onClick={() => { setShowAddForm(false); setEditingId(null); setNewSupplier({ name: '', contact: '' }); }}
                    className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 whitespace-nowrap"
                  >
                    Annuler
                  </button>
              )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fournisseur</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Produits</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Achats</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Payé</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Balance</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredSuppliers.map(supplier => {
                const stats = getSupplierStats(supplier.name);
                const pseudoId = supplier.id ? supplier.id.substring(0, 4).toUpperCase() : '000';
                return (
                  <tr key={supplier.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-lg">
                          {supplier.name ? supplier.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">{supplier.name}</div>
                          <div className="text-xs text-gray-500">ID: #{pseudoId} | Créé: {supplier.created_at ? new Date(supplier.created_at).toLocaleDateString('fr-FR') : '-'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {stats.products ? (
                        <span className="text-sm text-gray-700 truncate max-w-[200px] block">{stats.products}</span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">No purchases yet</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-700">
                      <span className="text-gray-400 text-xs font-normal mr-1">MAD</span>{stats.totalPurchases.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-700">
                      <span className="text-gray-400 text-xs font-normal mr-1">MAD</span>{stats.paid.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">
                      <span className="text-gray-400 text-xs font-normal mr-1">MAD</span>{stats.balance.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {stats.balance > 0 ? (
                        <span className="px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-red-50 text-red-600 border border-red-200">
                          <span className="mr-1.5 w-1.5 h-1.5 bg-red-600 rounded-full inline-block"></span> NON PAYÉ
                        </span>
                      ) : stats.totalPurchases > 0 ? (
                         <span className="px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-green-50 text-green-600 border border-green-200">
                          <span className="mr-1.5 w-1.5 h-1.5 bg-green-600 rounded-full inline-block"></span> PAYÉ
                        </span>
                      ) : (
                        <span className="px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-gray-50 text-gray-500 border border-gray-200">
                          -
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button onClick={() => { setSelectedSupplier(supplier.name); setShowPurchaseModal(true); }} className="text-gray-400 hover:text-orange-600 transition-colors" title="Nouvel Achat"><ShoppingCart size={18} /></button>
                        <button onClick={() => { setSelectedSupplier(supplier.name); setShowPaymentModal(true); }} className="text-gray-400 hover:text-purple-600 transition-colors" title="Paiement"><CreditCard size={18} /></button>
                        <button onClick={() => { setSelectedSupplier(supplier.name); setShowHistoryModal(true); }} className="text-gray-400 hover:text-indigo-600 transition-colors" title="Historique"><History size={18} /></button>
                        <button onClick={() => { setEditingId(supplier.id); setNewSupplier({ name: supplier.name, contact: supplier.contact || '', totalPurchases: stats.totalPurchases, totalPaid: stats.paid }); setShowAddForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-gray-400 hover:text-blue-600 transition-colors" title="Modifier"><Edit size={18} /></button>
                        <button onClick={() => handleDeleteSupplier(supplier.id)} className="text-gray-400 hover:text-red-600 transition-colors" title="Supprimer"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALS */}
      
      {/* 1. New Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl relative text-gray-800 my-8">
            <button type="button" onClick={() => setShowPurchaseModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">Nouvel Achat <ShoppingCart size={24} className="text-orange-500" /></h3>
            <form onSubmit={handlePurchaseSubmit} className="space-y-6">
              
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">SÉLECTIONNER FOURNISSEUR</label>
                <select required className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-orange-500 outline-none" value={selectedSupplier} onChange={(e) => setSelectedSupplier(e.target.value)}>
                    <option value="">Sélectionner fournisseur...</option>
                    {suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-6 p-4 rounded-xl border border-gray-200 bg-gray-50">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" className="form-radio text-orange-500 focus:ring-orange-500 bg-white border-gray-300" checked={purchaseForm.mode === 'direct'} onChange={() => setPurchaseForm({...purchaseForm, mode: 'direct'})} />
                  <span className="text-gray-900 font-medium">Total Direct</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" className="form-radio text-purple-600 focus:ring-purple-600 bg-white border-gray-300" checked={purchaseForm.mode === 'detailed'} onChange={() => setPurchaseForm({...purchaseForm, mode: 'detailed'})} />
                  <span className="text-gray-900 font-medium">Détaillé</span>
                </label>
              </div>

              {purchaseForm.mode === 'direct' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Produit</label>
                    <select required className="w-full bg-white border border-gray-300 rounded-lg p-2 text-gray-900" value={purchaseForm.itemId} onChange={(e) => setPurchaseForm({...purchaseForm, itemId: e.target.value})}>
                        <option value="">Sélectionner un produit</option>
                        {inventory.map(i => <option key={i.id} value={i.id}>{i.name} (Stock: {i.quantity})</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
                        <input required type="number" min="1" className="w-full bg-white border border-gray-300 rounded-lg p-2 text-gray-900" value={purchaseForm.quantity} onChange={(e) => setPurchaseForm({...purchaseForm, quantity: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Montant (MAD)</label>
                        <input required type="number" step="0.01" min="0" className="w-full bg-white border border-gray-300 rounded-lg p-2 text-gray-900" value={purchaseForm.amount} onChange={(e) => setPurchaseForm({...purchaseForm, amount: e.target.value})} />
                      </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 border border-gray-300 border-dashed rounded-xl p-4 bg-gray-50/50">
                  {purchaseForm.detailedItems.map((dItem, index) => (
                    <div key={dItem.id} className="flex gap-2 items-start">
                      <div className="flex-1">
                        <select required className="w-full bg-white border border-gray-300 rounded-lg p-2 text-sm text-gray-900" value={dItem.itemId} onChange={(e) => {
                          const newItems = [...purchaseForm.detailedItems];
                          newItems[index].itemId = e.target.value;
                          setPurchaseForm({...purchaseForm, detailedItems: newItems});
                        }}>
                            <option value="">Produit...</option>
                            {inventory.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                        </select>
                      </div>
                      <div className="w-20">
                        <input required type="number" min="1" className="w-full bg-white border border-gray-300 rounded-lg p-2 text-sm text-gray-900 text-center" value={dItem.quantity} onChange={(e) => {
                          const newItems = [...purchaseForm.detailedItems];
                          newItems[index].quantity = e.target.value;
                          setPurchaseForm({...purchaseForm, detailedItems: newItems});
                        }} />
                      </div>
                      <div className="w-28">
                        <input required type="number" step="0.01" min="0" placeholder="Prix" className="w-full bg-white border border-gray-300 rounded-lg p-2 text-sm text-gray-900" value={dItem.price} onChange={(e) => {
                          const newItems = [...purchaseForm.detailedItems];
                          newItems[index].price = e.target.value;
                          setPurchaseForm({...purchaseForm, detailedItems: newItems});
                        }} />
                      </div>
                      <button type="button" onClick={() => {
                        if (purchaseForm.detailedItems.length > 1) {
                          setPurchaseForm({...purchaseForm, detailedItems: purchaseForm.detailedItems.filter(i => i.id !== dItem.id)});
                        }
                      }} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"><X size={18} /></button>
                    </div>
                  ))}
                  
                  <button type="button" onClick={() => {
                    setPurchaseForm({...purchaseForm, detailedItems: [...purchaseForm.detailedItems, { id: generateId(), itemId: '', quantity: '1', price: '' }]});
                  }} className="w-full py-2 border border-purple-300 border-dashed rounded-lg text-purple-600 text-sm font-medium hover:bg-purple-50 transition-colors">
                    + Ajouter une ligne
                  </button>

                  <div className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center mt-4 border-l-4 border-l-orange-500 shadow-sm">
                    <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider">SOMME CALCULÉE:</span>
                    <span className="text-orange-600 font-mono text-xl font-bold">
                      {purchaseForm.detailedItems.reduce((sum, item) => sum + (parseFloat(item.price || 0) * parseInt(item.quantity || 1)), 0).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD
                    </span>
                  </div>
                </div>
              )}

              {purchaseForm.mode === 'detailed' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">DÉSIGNATION / PRODUITS</label>
                    <input type="text" placeholder="Ex: pc, ecran (Entrée...)" className="w-full bg-white border border-gray-300 rounded-lg p-2 text-gray-900 text-sm focus:border-orange-500 focus:ring-0" value={purchaseForm.category} onChange={(e) => setPurchaseForm({...purchaseForm, category: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">MONTANT TOTALE</label>
                    <input readOnly type="number" step="0.01" className="w-full bg-gray-100 border border-gray-300 rounded-lg p-2 text-gray-500 text-sm cursor-not-allowed" value={purchaseForm.detailedItems.reduce((sum, item) => sum + (parseFloat(item.price || 0) * parseInt(item.quantity || 1)), 0).toFixed(2)} />
                  </div>
                </div>
              )}

              {purchaseForm.mode === 'detailed' && selectedSupplier && (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Balance Actuelle: {getSupplierStats(selectedSupplier).balance.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <span className="text-orange-600">+{purchaseForm.detailedItems.reduce((sum, item) => sum + (parseFloat(item.price || 0) * parseInt(item.quantity || 1)), 0).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center font-bold border-t border-gray-300 pt-2 text-gray-900">
                    <span>Projection Finale:</span>
                    <span>
                      {(getSupplierStats(selectedSupplier).balance + purchaseForm.detailedItems.reduce((sum, item) => sum + (parseFloat(item.price || 0) * parseInt(item.quantity || 1)), 0)).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">DATE OPÉRATION</label>
                  <input required type="date" className="w-full bg-white border border-gray-300 rounded-lg p-2 text-gray-900 text-sm" value={purchaseForm.date} onChange={(e) => setPurchaseForm({...purchaseForm, date: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">CATÉGORIE</label>
                  <select className="w-full bg-white border border-gray-300 rounded-lg p-2 text-gray-900 text-sm" value={purchaseForm.category} onChange={(e) => setPurchaseForm({...purchaseForm, category: e.target.value})}>
                      <option value="">-- Sélectionnez --</option>
                      {uniqueCategories.map((c, i) => <option key={i} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">RÉF. BON / FACTURE</label>
                  <input type="text" placeholder="N° Bon..." className="w-full bg-white border border-gray-300 rounded-lg p-2 text-gray-900 text-sm" value={purchaseForm.reference} onChange={(e) => setPurchaseForm({...purchaseForm, reference: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">OBSERVATIONS / NOTES <Edit size={14} className="text-gray-400" /></label>
                <textarea rows="2" placeholder="Notes additionnelles..." className="w-full bg-white border border-gray-300 rounded-lg p-2 text-gray-900 text-sm" value={purchaseForm.notes} onChange={(e) => setPurchaseForm({...purchaseForm, notes: e.target.value})} />
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">STATUT DU PAIEMENT</label>
                  <select className="w-full bg-white border border-gray-300 rounded-lg p-2 text-gray-900 text-sm focus:border-orange-500 focus:ring-0" value={purchaseForm.status} onChange={(e) => setPurchaseForm({...purchaseForm, status: e.target.value})}>
                      <option value="pending">NON PAYÉ (Crédit)</option>
                      <option value="completed">PAYÉ (Immédiat)</option>
                  </select>
                </div>
                {purchaseForm.status === 'completed' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Compte Bancaire / Caisse</label>
                        <select required className="w-full bg-white border border-gray-300 rounded-lg p-2 text-gray-900 text-sm focus:border-orange-500 focus:ring-0" value={purchaseForm.bankAccountId} onChange={(e) => setPurchaseForm({...purchaseForm, bankAccountId: e.target.value})}>
                            <option value="">Sélectionner un compte</option>
                            {bankAccounts && bankAccounts.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Frais Bancaires (MAD)</label>
                        <input type="number" step="0.01" min="0" className="w-full bg-white border border-gray-300 rounded-lg p-2 text-gray-900 text-sm focus:border-orange-500 focus:ring-0" value={purchaseForm.fees} onChange={(e) => setPurchaseForm({...purchaseForm, fees: e.target.value})} placeholder="Optionnel" />
                      </div>
                    </div>
                )}
              </div>

              {purchaseForm.mode === 'detailed' && (
                <div className="text-xs text-orange-600 flex items-center gap-1 bg-orange-50 p-2 rounded border border-orange-200">
                  DÉTAILS SYSTÈME (AUTO) 🤖: Ce formulaire créera plusieurs transactions groupées.
                </div>
              )}

              <div className="pt-6 flex justify-end gap-3 border-t border-gray-200">
                  <button type="button" onClick={() => setShowPurchaseModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Annuler</button>
                  <button type="submit" className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium shadow-sm transition-colors">Valider l'Achat</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Supplier Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
            <button onClick={() => setShowPaymentModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20} /></button>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><CreditCard size={20} className="text-purple-500" /> Paiement Fournisseur</h3>
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fournisseur</label>
                <select required className="w-full border-gray-300 rounded-lg p-2 border" value={selectedSupplier} onChange={(e) => setSelectedSupplier(e.target.value)}>
                    <option value="">Sélectionner un fournisseur</option>
                    {suppliers.map(s => <option key={s.id} value={s.name}>{s.name} (Dette: {getSupplierStats(s.name).balance} MAD)</option>)}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Montant à Payer (MAD)</label>
                  <input required type="number" step="0.01" min="0.01" className="w-full border-gray-300 rounded-lg p-2 border" value={paymentForm.amount} onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frais Bancaires (MAD)</label>
                  <input type="number" step="0.01" min="0" className="w-full border-gray-300 rounded-lg p-2 border" value={paymentForm.fees} onChange={(e) => setPaymentForm({...paymentForm, fees: e.target.value})} placeholder="Optionnel" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Compte Bancaire / Caisse (Source)</label>
                <select required className="w-full border-gray-300 rounded-lg p-2 border" value={paymentForm.bankAccountId} onChange={(e) => setPaymentForm({...paymentForm, bankAccountId: e.target.value})}>
                    <option value="">Sélectionner un compte</option>
                    {bankAccounts && bankAccounts.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowPaymentModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Annuler</button>
                  <button type="submit" className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-medium shadow-sm">Valider le Paiement</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. History Modal (Relevé) */}
      {showHistoryModal && selectedSupplier && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 max-w-6xl w-full shadow-2xl relative max-h-[90vh] flex flex-col my-8 border border-gray-200">
            <button onClick={() => setShowHistoryModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"><X size={24} /></button>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">Relevé : {selectedSupplier.toUpperCase()}</h3>
            
            {/* Filters */}
            <div className="flex flex-wrap items-end gap-4 mb-6 p-4 border border-gray-200 rounded-xl bg-gray-50">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">DATE DÉBUT</label>
                  <input type="date" className="bg-white border border-gray-300 rounded-lg p-2 text-gray-900 text-sm focus:ring-1 focus:ring-gray-300" value={releveStartDate} onChange={e => setReleveStartDate(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">DATE FIN</label>
                  <input type="date" className="bg-white border border-gray-300 rounded-lg p-2 text-gray-900 text-sm focus:ring-1 focus:ring-gray-300" value={releveEndDate} onChange={e => setReleveEndDate(e.target.value)} />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium hover:bg-indigo-100 transition-colors border border-indigo-100">
                    <Filter size={16} /> Filtrer
                </button>
            </div>

            {/* Selection actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 border border-indigo-200 rounded-xl bg-indigo-50/50">
                <div className="flex items-center gap-4">
                    <button onClick={() => {
                        const allIds = getGroupedReleveTransactions().map(t => t.id);
                        setReleveSelectedIds(releveSelectedIds.length === allIds.length ? [] : allIds);
                    }} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors shadow-sm">Tout Sélectionner</button>
                    <button onClick={() => {
                        const achatIds = getGroupedReleveTransactions().filter(t => t.type === 'purchase').map(t => t.id);
                        setReleveSelectedIds(achatIds);
                    }} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors shadow-sm">Sélectionner Achats</button>
                    <button onClick={() => {
                        const paiementIds = getGroupedReleveTransactions().filter(t => t.type === 'expense').map(t => t.id);
                        setReleveSelectedIds(paiementIds);
                    }} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors shadow-sm">Sélectionner Paiements</button>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-gray-600 font-medium text-sm border-r border-gray-300 pr-4">{releveSelectedIds.length} transaction(s) sélectionnée(s)</span>
                    <button onClick={handleExportSelectionCSV} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 shadow-sm transition-colors">
                        <Download size={16} /> Exporter la Sélection
                    </button>
                    <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 shadow-sm transition-colors">
                        <Printer size={16} /> Imprimer (PDF)
                    </button>
                </div>
            </div>

            {/* Two columns layout */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-2 gap-6 pb-4">
                {/* Achats Column */}
                <div className="space-y-4">
                    <h4 className="text-lg font-bold text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-200">Achats</h4>
                    {getGroupedReleveTransactions().filter(t => t.type === 'purchase').map(t => (
                        <div key={t.id} className={`relative p-4 rounded-xl border-l-4 border-l-orange-500 bg-white border border-gray-200 shadow-sm transition-colors ${releveSelectedIds.includes(t.id) ? 'ring-2 ring-indigo-500 bg-indigo-50/30' : ''}`}>
                            <div className="absolute top-4 left-4">
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 bg-white text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0" checked={releveSelectedIds.includes(t.id)} onChange={(e) => {
                                    if (e.target.checked) setReleveSelectedIds([...releveSelectedIds, t.id]);
                                    else setReleveSelectedIds(releveSelectedIds.filter(id => id !== t.id));
                                }} />
                            </div>
                            <div className="ml-8 flex justify-between items-start">
                                <div>
                                    <h5 className="text-gray-900 font-bold text-lg leading-tight">{t.isGroup ? 'Achat Détaillé' : 'Achat'}</h5>
                                    <span className="text-gray-500 text-sm">{new Date(t.date).toLocaleDateString('fr-FR')}</span>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className="px-3 py-1 bg-orange-100 text-orange-700 border border-orange-200 rounded-full text-xs font-bold tracking-wider">ACHAT</span>
                                    <div className="flex gap-2 text-gray-400">
                                        <button className="hover:text-gray-700 p-1"><Printer size={16} /></button>
                                        <button className="hover:text-indigo-600 p-1"><Edit size={16} /></button>
                                        <button className="hover:text-red-500 p-1"><Trash2 size={16} /></button>
                                    </div>
                                    <span className="text-orange-600 font-bold text-xl font-mono mt-1">-{t.totalAmount.toLocaleString('fr-FR', {minimumFractionDigits: 2, maximumFractionDigits: 2})} MAD</span>
                                </div>
                            </div>
                            <div className="ml-8 mt-4 space-y-2 text-sm border-t border-gray-100 pt-3">
                                <div className="text-gray-600"><span className="text-gray-400 mr-2">🏷️</span><strong className="text-gray-800 font-medium">Catégorie:</strong> {t.category}</div>
                                <div className="text-gray-600"><span className="text-gray-400 mr-2">✍️</span><strong className="text-gray-800 font-medium">Observations / Notes:</strong> {t.notes || 'Aucune observation'}</div>
                                {t.isGroup ? (
                                    <div className="text-gray-600 bg-gray-50 p-2 rounded border border-gray-100"><span className="text-indigo-400 mr-2">🤖</span><strong className="font-medium text-gray-700">Détails Système (Auto):</strong> 
                                        [Items: {t.items.map(item => `${item.quantity}x ${item.name} (Prix unitaire : ${(item.amount/item.quantity).toLocaleString('fr-FR', {minimumFractionDigits: 2})} MAD)`).join(' | ')} | Total Global : {t.totalAmount.toLocaleString('fr-FR', {minimumFractionDigits: 2})} MAD]
                                    </div>
                                ) : (
                                    <div className="text-gray-600 bg-gray-50 p-2 rounded border border-gray-100"><span className="text-indigo-400 mr-2">🤖</span><strong className="font-medium text-gray-700">Détails Système (Auto):</strong> [Produit: {t.item_name} | Qté: {t.quantity}]</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Paiements Column */}
                <div className="space-y-4">
                    <h4 className="text-lg font-bold text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-200">Paiements</h4>
                    {getGroupedReleveTransactions().filter(t => t.type === 'expense').map(t => (
                        <div key={t.id} className={`relative p-4 rounded-xl border-l-4 border-l-purple-500 bg-white border border-gray-200 shadow-sm transition-colors ${releveSelectedIds.includes(t.id) ? 'ring-2 ring-indigo-500 bg-indigo-50/30' : ''}`}>
                            <div className="absolute top-4 left-4">
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 bg-white text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0" checked={releveSelectedIds.includes(t.id)} onChange={(e) => {
                                    if (e.target.checked) setReleveSelectedIds([...releveSelectedIds, t.id]);
                                    else setReleveSelectedIds(releveSelectedIds.filter(id => id !== t.id));
                                }} />
                            </div>
                            <div className="ml-8 flex justify-between items-start">
                                <div>
                                    <h5 className="text-gray-900 font-bold text-lg leading-tight">Installment / Acompte</h5>
                                    <span className="text-gray-500 text-sm">{new Date(t.date).toLocaleDateString('fr-FR')}</span>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className="px-3 py-1 bg-purple-100 text-purple-700 border border-purple-200 rounded-full text-xs font-bold tracking-wider">CONFIRMÉ</span>
                                    <div className="flex gap-2 text-gray-400">
                                        <button className="hover:text-indigo-600 p-1"><Edit size={16} /></button>
                                        <button className="hover:text-red-500 p-1"><Trash2 size={16} /></button>
                                    </div>
                                    <span className="text-purple-600 font-bold text-xl font-mono mt-1">+{t.totalAmount.toLocaleString('fr-FR', {minimumFractionDigits: 2, maximumFractionDigits: 2})} MAD</span>
                                </div>
                            </div>
                            <div className="ml-8 mt-4 space-y-2 text-sm border-t border-gray-100 pt-3">
                                <div className="text-gray-600"><span className="text-gray-400 mr-2">✍️</span><strong className="text-gray-800 font-medium">Observations / Notes:</strong> {t.notes || 'Aucune observation'}</div>
                                <div className="text-gray-600 bg-gray-50 p-2 rounded border border-gray-100"><span className="text-indigo-400 mr-2">🤖</span><strong className="font-medium text-gray-700">Détails Système (Auto):</strong> ---</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};


const SettingsView = ({ deliveryConfig, setDeliveryConfig, packagingConfig, setPackagingConfig, t }) => {
  const [newCompany, setNewCompany] = useState({ name: '' });
  const [newRate, setNewRate] = useState({ city: '', cost: '' });
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [newPackaging, setNewPackaging] = useState({ name: '', cost: '' });
  const [editingCompanyId, setEditingCompanyId] = useState(null);
  const [editingCompanyName, setEditingCompanyName] = useState('');
  const [editingRate, setEditingRate] = useState(null); // { companyId, rateIndex, city, cost }

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

  const handleUpdateCompany = async (id) => {
    if (editingCompanyName) {
      await supabase.from('delivery_config').update({ name: editingCompanyName }).eq('id', id);
      setDeliveryConfig(deliveryConfig.map(c => c.id === id ? { ...c, name: editingCompanyName } : c));
      setEditingCompanyId(null);
      setEditingCompanyName('');
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

  const handleUpdateRate = async () => {
    if (editingRate && editingRate.city && editingRate.cost) {
      const company = deliveryConfig.find(c => c.id === editingRate.companyId);
      const updatedRates = [...company.rates];
      updatedRates[editingRate.rateIndex] = { ...updatedRates[editingRate.rateIndex], city: editingRate.city, cost: editingRate.cost };

      await supabase.from('delivery_config').update({ rates: updatedRates }).eq('id', editingRate.companyId);

      setDeliveryConfig(deliveryConfig.map(c =>
        c.id === editingRate.companyId ? { ...c, rates: updatedRates } : c
      ));
      setEditingRate(null);
    }
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
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 bg-white text-gray-900"
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
            <div key={company.id} className="border rounded-lg p-4 border-gray-200">
              <div className="flex justify-between items-center mb-4">
                {editingCompanyId === company.id ? (
                  <div className="flex gap-2 flex-1 mr-4">
                    <input
                      type="text"
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-1 bg-white text-gray-900"
                      value={editingCompanyName}
                      onChange={e => setEditingCompanyName(e.target.value)}
                    />
                    <button onClick={() => handleUpdateCompany(company.id)} className="text-green-600 hover:text-green-800"><Check size={18} /></button>
                    <button onClick={() => setEditingCompanyId(null)} className="text-gray-600 hover:text-gray-800"><X size={18} /></button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-lg text-gray-800">{company.name}</h4>
                    <button
                      onClick={() => {
                        setEditingCompanyId(company.id);
                        setEditingCompanyName(company.name);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={16} />
                    </button>
                  </div>
                )}
                <button
                  onClick={() => handleDeleteDeliveryCompany(company.id)}
                  className="text-red-500 hover:text-red-700"
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
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 text-sm bg-white text-gray-900"
                    value={selectedCompanyId === company.id ? newRate.city : ''}
                    onChange={e => {
                      setSelectedCompanyId(company.id);
                      setNewRate({ ...newRate, city: e.target.value });
                    }}
                  />
                  <input
                    type="number"
                    placeholder={t('cost')}
                    className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 text-sm bg-white text-gray-900"
                    value={selectedCompanyId === company.id ? newRate.cost : ''}
                    onChange={e => {
                      setSelectedCompanyId(company.id);
                      setNewRate({ ...newRate, cost: e.target.value });
                    }}
                  />
                  <button
                    onClick={() => handleAddRate(company.id)}
                    className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200:bg-gray-600"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="space-y-1">
                  {company.rates && company.rates.map((rate, index) => (
                    <div key={index} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                      {editingRate && editingRate.companyId === company.id && editingRate.rateIndex === index ? (
                        <div className="flex gap-2 flex-1 items-center">
                          <input
                            type="text"
                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-1 bg-white text-gray-900 text-xs"
                            value={editingRate.city}
                            onChange={e => setEditingRate({ ...editingRate, city: e.target.value })}
                          />
                          <input
                            type="number"
                            className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-1 bg-white text-gray-900 text-xs"
                            value={editingRate.cost}
                            onChange={e => setEditingRate({ ...editingRate, cost: e.target.value })}
                          />
                          <button onClick={handleUpdateRate} className="text-green-600 hover:text-green-800"><Check size={16} /></button>
                          <button onClick={() => setEditingRate(null)} className="text-gray-600 hover:text-gray-800"><X size={16} /></button>
                        </div>
                      ) : (
                        <>
                          <span className="text-gray-800">{rate.city}</span>
                          <div className="flex items-center gap-4">
                            <span className="font-medium text-gray-800">{formatCurrency(rate.cost)}</span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditingRate({ companyId: company.id, rateIndex: index, city: rate.city, cost: rate.cost })}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteRate(company.id, index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </>
                      )}
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
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 bg-white text-gray-900"
            value={newPackaging.name}
            onChange={e => setNewPackaging({ ...newPackaging, name: e.target.value })}
          />
          <input
            type="number"
            placeholder={t('cost')}
            className="w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 bg-white text-gray-900"
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
              <span className="font-medium text-gray-800">{pkg.name}</span>
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


const TreasuryManager = ({ transactions, digitalTransactions, setTransactions, bankAccounts, setBankAccounts, supabase, t }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', type: 'bank', initialBalance: 0 });
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Computations
  const getAccountBalance = (accountId) => {
    const account = bankAccounts.find(b => b.id === accountId);
    if (!account) return 0;
    let balance = parseFloat(account.initial_balance || 0);

    transactions.forEach(tx => {
      if (tx.status !== 'completed') return;
      
      // Regular transactions mapped to this account
      if (tx.bank_account_id === accountId) {
        if (tx.type === 'sale') balance += parseFloat(tx.amount || 0);
        else if (tx.type === 'purchase' || tx.type === 'expense') balance -= parseFloat(tx.amount || 0);
        else if (tx.type === 'transfer_out') balance -= parseFloat(tx.amount || 0);
      }
      
      // Transfers receiving into this account
      if (tx.to_bank_account_id === accountId && tx.type === 'transfer') {
         balance += parseFloat(tx.amount || 0);
      }
      // Outgoing transfers
      if (tx.bank_account_id === accountId && tx.type === 'transfer') {
         balance -= parseFloat(tx.amount || 0);
      }
    });

    if (digitalTransactions) {
      digitalTransactions.forEach(tx => {
        if (tx.bank_account_id === accountId) {
          if (tx.type === 'sale') balance += parseFloat(tx.amount || 0);
          else if (tx.type === 'purchase' || tx.type === 'expense') balance -= parseFloat(tx.amount || 0);
        }
      });
    }

    return balance;
  };

  const soldeGlobal = bankAccounts.reduce((sum, acc) => sum + getAccountBalance(acc.id), 0);
  
  const totalEntrees = transactions
    .filter(t => t.status === 'completed' && (t.type === 'sale' || t.type === 'transfer'))
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0); // Wait, transfer shouldn't count as global Entrée if it's internal. Let's just count sales.
    
  const digitalTotalEntrees = digitalTransactions
    ? digitalTransactions.filter(t => t.type === 'sale' && t.bank_account_id).reduce((sum, t) => sum + parseFloat(t.amount || 0), 0)
    : 0;
    
  const digitalTotalSorties = digitalTransactions
    ? digitalTransactions.filter(t => (t.type === 'purchase' || t.type === 'expense') && t.bank_account_id).reduce((sum, t) => sum + parseFloat(t.amount || 0), 0)
    : 0;

  const trueTotalEntrees = transactions
    .filter(t => t.status === 'completed' && t.type === 'sale' && t.bank_account_id)
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0) + digitalTotalEntrees;
    
  const trueTotalSorties = transactions
    .filter(t => t.status === 'completed' && (t.type === 'purchase' || t.type === 'expense') && t.bank_account_id)
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0) + digitalTotalSorties;

  const handleAddAccount = async (e) => {
    e.preventDefault();
    const newAccount = {
      name: formData.name,
      type: formData.type,
      initial_balance: parseFloat(formData.initialBalance || 0)
    };
    
    // Check if supabase exists
    const { data, error } = await supabase.from('bank_accounts').insert([newAccount]).select();
    if (error) {
      alert('Error: ' + error.message);
    } else if (data) {
      // Local state is updated by subscription, but we can do it optimistically too.
      setShowForm(false);
      setFormData({ name: '', type: 'bank', initialBalance: 0 });
    }
  };

  const handleDeleteAccount = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce compte ? Cette action est irréversible.")) {
      const { error } = await supabase.from('bank_accounts').delete().eq('id', id);
      if (error) {
        alert("Erreur lors de la suppression : " + error.message);
      } else {
        // Optimistic UI update or let subscription handle it. 
        // We'll let the subscription handle it since it fetches everything automatically,
        // or we can just window.location.reload() for simplicity.
        window.location.reload();
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Landmark size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{t('treasury')}</h3>
            <p className="text-sm text-gray-500">Gestion des comptes de trésorerie, caisse de liquidité et transactions</p>
          </div>
        </div>
        <div>
          <select className="border border-gray-300 rounded-lg p-2 text-sm text-gray-700 bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500">
            <option>Lifetime</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <WalletCards size={20} />
            </div>
            <p className="text-sm font-semibold text-gray-500 uppercase">Solde Global</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(soldeGlobal)}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <ArrowDown size={20} />
            </div>
            <p className="text-sm font-semibold text-gray-500 uppercase">Total Entrées</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(trueTotalEntrees)}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <ArrowUp size={20} />
            </div>
            <p className="text-sm font-semibold text-gray-500 uppercase">Total Sorties</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(trueTotalSorties)}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Landmark size={20} />
            </div>
            <p className="text-sm font-semibold text-gray-500 uppercase">Comptes Actifs</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{bankAccounts.length}</p>
        </div>
      </div>

      {/* Account List */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        {bankAccounts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Aucun compte bancaire configuré.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {bankAccounts.map(account => (
               <div key={account.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow relative group">
                 <div className="flex justify-between items-start mb-2">
                   <div className="flex items-center space-x-2">
                     <Wallet className="text-blue-500" size={20}/>
                     <h4 className="font-bold text-gray-800">{account.name}</h4>
                   </div>
                   <div className="flex items-center space-x-2">
                     <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 capitalize">{account.type}</span>
                     <button 
                       onClick={() => handleDeleteAccount(account.id)}
                       className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 transition-opacity"
                       title="Supprimer ce compte"
                     >
                       <Trash2 size={16} />
                     </button>
                   </div>
                 </div>
                 <p className="text-2xl font-bold text-gray-900 mt-4">{formatCurrency(getAccountBalance(account.id))}</p>
               </div>
             ))}
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <h4 className="font-bold text-gray-800 text-lg">Transactions Récentes</h4>
        <div className="flex items-center space-x-3 overflow-x-auto w-full md:w-auto">
          <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 border rounded-lg font-medium text-sm whitespace-nowrap">
            <ArrowRightLeft size={16} />
            <span>{t('internalTransfer')}</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 border rounded-lg font-medium text-sm whitespace-nowrap">
            <Plus size={16} />
            <span>{t('adjustBalance')}</span>
          </button>
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 border rounded-lg font-medium text-sm whitespace-nowrap"
          >
            <Settings size={16} />
            <span>{t('manageAccounts')}</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 border rounded-lg font-medium text-sm whitespace-nowrap">
            <FileText size={16} />
            <span>{t('history')}</span>
          </button>
        </div>
      </div>
      
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h4 className="text-lg font-bold mb-4 text-gray-800">Ajouter un Compte</h4>
            <form onSubmit={handleAddAccount} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom du Compte</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="bank">Banque</option>
                  <option value="cash">Caisse (Espèces)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Solde Initial</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  value={formData.initialBalance}
                  onChange={e => setFormData({ ...formData, initialBalance: e.target.value })}
                />
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Annuler</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Compte</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Montant</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {transactions.filter(t => t.bank_account_id || t.to_bank_account_id).slice(0, 10).map((tx) => {
                const isIncoming = tx.type === 'sale' || tx.type === 'transfer_in';
                const account = bankAccounts.find(b => b.id === tx.bank_account_id);
                return (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-600">{tx.date}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        isIncoming ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {t(tx.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{account?.name || '-'}</td>
                    <td className={`px-6 py-4 text-sm font-bold ${isIncoming ? 'text-green-600' : 'text-red-600'}`}>
                      {isIncoming ? '+' : '-'}{formatCurrency(tx.amount)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{tx.notes || tx.party || tx.category || '-'}</td>
                  </tr>
                );
              })}
              {transactions.filter(t => t.bank_account_id || t.to_bank_account_id).length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    Aucune transaction enregistrée.
                  </td>
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
