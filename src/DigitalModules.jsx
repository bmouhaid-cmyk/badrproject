import React, { useState, useMemo, useRef } from 'react';
import { 
  Users, Package, ArrowRightLeft, Landmark, Truck, Search, Plus, Edit, Trash2, X, Download, Filter, Save, AlertTriangle, CheckCircle, Clock, WalletCards, ArrowDown, ArrowUp, Wallet, Settings, FileText, Share2, Printer
} from 'lucide-react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { useReactToPrint } from 'react-to-print';

export const DigitalDashboard = ({ subscriptions, digitalTransactions, t }) => {
  const activeSubs = subscriptions.filter(s => s.status === 'active').length;
  const terminatedSubs = subscriptions.filter(s => s.status === 'terminated').length;
  
  // Find expiring in next 7 days
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);
  
  const expiringSubs = subscriptions.filter(s => {
    if (s.status !== 'active') return false;
    const endDate = new Date(s.end_date);
    return endDate <= nextWeek && endDate >= today;
  });

  const mrr = subscriptions
    .filter(s => s.status === 'active')
    .reduce((acc, curr) => {
      const months = parseInt(curr.duration_months) || 1;
      return acc + (parseFloat(curr.amount_paid || 0) / months);
    }, 0);

  // Group subscriptions by product for chart
  const subByProduct = subscriptions.reduce((acc, curr) => {
    if (curr.status === 'active') {
      acc[curr.product_name] = (acc[curr.product_name] || 0) + 1;
    }
    return acc;
  }, {});
  
  const pieData = Object.keys(subByProduct).map(key => ({
    name: key,
    value: subByProduct[key]
  }));

  return (
    <div className="space-y-6">
      {expiringSubs.length > 0 && (
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <AlertTriangle className="text-orange-500 mr-3" />
            <div>
              <h3 className="text-orange-800 font-bold">Abonnements expirant bientôt !</h3>
              <p className="text-orange-700 text-sm">Vous avez {expiringSubs.length} abonnement(s) qui expirent dans les 7 prochains jours.</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-gray-500 text-sm font-semibold uppercase mb-2">Abonnements Actifs</h3>
          <p className="text-3xl font-bold text-gray-900">{activeSubs}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-gray-500 text-sm font-semibold uppercase mb-2">MRR (Revenu Mensuel)</h3>
          <p className="text-3xl font-bold text-purple-600">{mrr.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-gray-500 text-sm font-semibold uppercase mb-2">Abonnements Expirés</h3>
          <p className="text-3xl font-bold text-red-500">{terminatedSubs}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-gray-500 text-sm font-semibold uppercase mb-2">Produits Vendus</h3>
          <p className="text-3xl font-bold text-gray-900">
            {digitalTransactions.filter(t => t.type === 'sale').length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Répartition par Produit (Actifs)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pieData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" tick={{fill: '#6B7280'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fill: '#6B7280'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  cursor={{fill: '#F3F4F6'}}
                />
                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Abonnés" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Transactions Récentes</h3>
          <div className="space-y-4">
            {digitalTransactions.slice(0, 5).map(t => (
              <div key={t.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${t.type === 'sale' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {t.type === 'sale' ? <ArrowRightLeft size={16} /> : <Landmark size={16} />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{t.item_name || 'Transaction'}</p>
                    <p className="text-xs text-gray-500">{new Date(t.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`font-bold ${t.type === 'sale' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.type === 'sale' ? '+' : '-'}{parseFloat(t.amount).toLocaleString()} MAD
                </span>
              </div>
            ))}
            {digitalTransactions.length === 0 && (
              <p className="text-gray-500 text-center py-4">Aucune transaction récente.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const DigitalAbonnementsManager = ({ subscriptions, digitalInventory, supabase, t }) => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({ id: null, customer_name: '', customer_phone: '', product_id: '', duration_months: 1, amount_paid: 0, start_date: new Date().toISOString().split('T')[0], status: 'active', notes: '' });

  const calculateEndDate = (startDateStr, months) => {
    const d = new Date(startDateStr);
    d.setMonth(d.getMonth() + parseInt(months));
    return d.toISOString().split('T')[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const end_date = calculateEndDate(formData.start_date, formData.duration_months);
      const product = digitalInventory.find(i => i.id === formData.product_id);
      
      const dbSub = {
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        product_id: formData.product_id,
        product_name: product ? product.name : 'Unknown',
        duration_months: parseInt(formData.duration_months),
        start_date: formData.start_date,
        end_date: end_date,
        amount_paid: parseFloat(formData.amount_paid),
        status: formData.status,
        notes: formData.notes
      };

      if (formData.id) {
        await supabase.from('subscriptions').update(dbSub).eq('id', formData.id);
      } else {
        await supabase.from('subscriptions').insert([dbSub]);
      }
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert('Error saving subscription');
    }
  };

  const handleTerminate = async (id) => {
    if(window.confirm('Marquer comme terminé ?')) {
      await supabase.from('subscriptions').update({ status: 'terminated' }).eq('id', id);
    }
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (sub.customer_phone && sub.customer_phone.includes(searchTerm)) ||
                          sub.product_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (statusFilter === 'all') return true;
    
    const endDate = new Date(sub.end_date);
    const today = new Date();
    const diffDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
    
    if (statusFilter === 'active' && sub.status === 'active' && diffDays > 7) return true;
    if (statusFilter === 'expiring' && sub.status === 'active' && diffDays > 0 && diffDays <= 7) return true;
    if (statusFilter === 'expired' && sub.status === 'active' && diffDays <= 0) return true;
    if (statusFilter === 'terminated' && sub.status === 'terminated') return true;
    
    return false;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl font-bold text-gray-800">Gestion des Abonnements</h2>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Chercher client, tél, produit..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none w-64"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none bg-white"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actifs (Sains)</option>
            <option value="expiring">Expirant bientôt (≤ 7j)</option>
            <option value="expired">Expirés</option>
            <option value="terminated">Terminés</option>
          </select>
          <button 
            onClick={() => { 
              if(digitalInventory.length === 0) {
                alert("Veuillez d'abord ajouter un Produit Digital dans le catalogue avant de créer un abonnement.");
                return;
              }
              setFormData({ id: null, customer_name: '', customer_phone: '', product_id: '', duration_months: 1, amount_paid: 0, start_date: new Date().toISOString().split('T')[0], status: 'active', notes: '' }); 
              setShowForm(true); 
            }} 
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center shadow-sm"
          >
            <Plus size={18} className="mr-2"/> Nouvel Abonnement
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6 shadow-sm">
          <h3 className="text-lg font-bold mb-4">{formData.id ? 'Modifier Abonnement' : 'Nouvel Abonnement'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du Client</label>
                <input required type="text" className="w-full border-gray-300 rounded-lg p-2 border" value={formData.customer_name} onChange={e => setFormData({...formData, customer_name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone Client</label>
                <input type="text" className="w-full border-gray-300 rounded-lg p-2 border" value={formData.customer_phone} onChange={e => setFormData({...formData, customer_phone: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Produit Digital</label>
                <select required className="w-full border-gray-300 rounded-lg p-2 border" value={formData.product_id} onChange={e => setFormData({...formData, product_id: e.target.value})}>
                  <option value="">Sélectionner produit...</option>
                  {digitalInventory.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Durée (Mois)</label>
                <select className="w-full border-gray-300 rounded-lg p-2 border" value={formData.duration_months} onChange={e => setFormData({...formData, duration_months: e.target.value})}>
                  <option value={1}>1 Mois</option>
                  <option value={3}>3 Mois</option>
                  <option value={6}>6 Mois</option>
                  <option value={12}>12 Mois (1 An)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
                <input required type="date" className="w-full border-gray-300 rounded-lg p-2 border" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Montant Payé (MAD)</label>
                <input required type="number" step="0.01" className="w-full border-gray-300 rounded-lg p-2 border" value={formData.amount_paid} onChange={e => setFormData({...formData, amount_paid: e.target.value})} />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Annuler</button>
              <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Enregistrer</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
            <tr>
              <th className="px-6 py-4 font-semibold">Client</th>
              <th className="px-6 py-4 font-semibold">Produit</th>
              <th className="px-6 py-4 font-semibold">Période</th>
              <th className="px-6 py-4 font-semibold">Montant</th>
              <th className="px-6 py-4 font-semibold">Statut</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredSubscriptions.map(s => {
              const endDate = new Date(s.end_date);
              const today = new Date();
              const diffDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
              
              let statusBadge = <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Actif</span>;
              if (s.status === 'terminated') statusBadge = <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold flex items-center inline-flex"><CheckCircle size={12} className="mr-1"/>Terminé</span>;
              else if (diffDays <= 0) statusBadge = <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center inline-flex"><AlertTriangle size={12} className="mr-1"/>Expiré</span>;
              else if (diffDays <= 7) statusBadge = <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold flex items-center inline-flex"><Clock size={12} className="mr-1"/>Expir. dans {diffDays}j</span>;

              return (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{s.customer_name}<br/><span className="text-xs text-gray-400">{s.customer_phone}</span></td>
                  <td className="px-6 py-4">{s.product_name}</td>
                  <td className="px-6 py-4 text-xs">
                    Du: {new Date(s.start_date).toLocaleDateString()}<br/>
                    Au: {new Date(s.end_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-mono font-bold">{parseFloat(s.amount_paid || 0).toLocaleString()} MAD</td>
                  <td className="px-6 py-4">{statusBadge}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {s.status === 'active' && <button onClick={() => handleTerminate(s.id)} className="text-red-500 hover:text-red-700 text-xs font-medium mr-3">Désactiver</button>}
                    <button onClick={() => { setFormData(s); setShowForm(true); }} className="text-blue-500 hover:text-blue-700"><Edit size={16}/></button>
                  </td>
                </tr>
              );
            })}
            {filteredSubscriptions.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <Users size={48} className="text-gray-300 mb-4" />
                    <p className="text-lg font-medium text-gray-900">Aucun abonnement trouvé</p>
                    <p className="text-sm">Vérifiez vos filtres ou ajoutez un nouvel abonnement.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const DigitalInventoryManager = ({ digitalInventory, supabase, t }) => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ id: null, name: '', buy_price: 0, sell_price: 0, category: '', notes: '' });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MAD' }).format(amount);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await supabase.from('digital_inventory').update(formData).eq('id', formData.id);
      } else {
        await supabase.from('digital_inventory').insert([formData]);
      }
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert('Error saving digital product');
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Archiver ce produit digital ?')) {
      await supabase.from('digital_inventory').update({ is_deleted: true }).eq('id', id);
    }
  };

  const filteredInventory = digitalInventory.filter(item => {
    return item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const totalProducts = digitalInventory.length;
  const avgSellPrice = totalProducts > 0 ? digitalInventory.reduce((acc, item) => acc + parseFloat(item.sell_price || 0), 0) / totalProducts : 0;
  const uniqueCategories = [...new Set(digitalInventory.map(i => i.category).filter(Boolean))].length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
            <Package size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Catalogue Digital</h3>
            <p className="text-sm text-gray-500">Gestion de vos services, licences et abonnements digitaux</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => { setFormData({ id: null, name: '', buy_price: 0, sell_price: 0, category: '', notes: '' }); setShowForm(true); }} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center shadow-sm">
            <Plus size={18} className="mr-2"/> Nouveau Produit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Package size={20} />
            </div>
            <p className="text-sm font-semibold text-gray-500 uppercase">Produits Actifs</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalProducts}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <FileText size={20} />
            </div>
            <p className="text-sm font-semibold text-gray-500 uppercase">Catégories</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{uniqueCategories}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <WalletCards size={20} />
            </div>
            <p className="text-sm font-semibold text-gray-500 uppercase">Prix Moyen de Vente</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(avgSellPrice)}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Chercher un produit ou service..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
          />
        </div>
        <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-2 font-medium">
          <Download size={18} /> Exporter
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-fade-in-up">
          <h3 className="text-lg font-bold text-gray-800 mb-4">{formData.id ? 'Modifier le Produit' : 'Ajouter un Nouveau Produit'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du Produit / Service</label>
                <input required type="text" placeholder="Ex: Licence Windows, Abonnement Netflix..." className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} />
              </div>
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <input type="text" placeholder="Ex: Logiciels, Streaming..." className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" value={formData.category} onChange={e=>setFormData({...formData, category:e.target.value})} />
              </div>
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Coût d'achat unitaire (MAD)</label>
                <input type="number" step="0.01" className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" value={formData.buy_price} onChange={e=>setFormData({...formData, buy_price:e.target.value})} />
              </div>
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix de vente unitaire (MAD)</label>
                <input required type="number" step="0.01" className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" value={formData.sell_price} onChange={e=>setFormData({...formData, sell_price:e.target.value})} />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 border-t pt-4">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">Annuler</button>
              <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium flex items-center">
                <Save size={18} className="mr-2" /> Enregistrer
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
            <tr>
              <th className="px-6 py-4 font-semibold">Nom</th>
              <th className="px-6 py-4 font-semibold">Prix Achat</th>
              <th className="px-6 py-4 font-semibold">Prix Vente</th>
              <th className="px-6 py-4 font-semibold">Marge</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredInventory.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{item.name}<br/><span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-md mt-1 inline-block">{item.category || 'Sans catégorie'}</span></td>
                <td className="px-6 py-4 font-mono">{formatCurrency(parseFloat(item.buy_price || 0))}</td>
                <td className="px-6 py-4 font-mono text-purple-600 font-bold">{formatCurrency(parseFloat(item.sell_price || 0))}</td>
                <td className="px-6 py-4 font-mono text-green-600 font-medium">{(parseFloat(item.sell_price || 0) - parseFloat(item.buy_price || 0)) > 0 ? '+' : ''}{formatCurrency(parseFloat(item.sell_price || 0) - parseFloat(item.buy_price || 0))}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => { setFormData(item); setShowForm(true); }} className="text-blue-500 hover:text-blue-700"><Edit size={16}/></button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
            {filteredInventory.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <Package size={48} className="text-gray-300 mb-4" />
                    <p className="text-lg font-medium text-gray-900">Aucun produit trouvé</p>
                    <p className="text-sm">Commencez par ajouter vos services ou produits digitaux au catalogue.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const DigitalTreasuryManager = ({ digitalTransactions, bankAccounts }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MAD' }).format(amount);
  };

  const getDigitalAccountBalance = (accountId) => {
    // We only calculate based on digital transactions for this digital view.
    // However, if we want the true global balance, we'd need physical transactions too.
    // For now, we show the sub-balance of digital activity for that account, 
    // OR we can just show the real account balance if we had access to it. 
    // Since we don't have physical transactions here, we'll calculate the digital contribution.
    const account = bankAccounts.find(b => b.id === accountId);
    if (!account) return 0;
    
    // Start with 0 (not initial_balance) because we want to see how much DIGITAL contributed, 
    // OR start with initial_balance if we want to treat it as a true total.
    // Let's use 0 so it's strictly "Digital Treasury Flow" for that account.
    let balance = 0; 
    digitalTransactions.forEach(tx => {
      if (tx.bank_account_id === accountId) {
        if (tx.type === 'sale') balance += parseFloat(tx.amount || 0);
        else if (tx.type === 'purchase' || tx.type === 'expense') balance -= parseFloat(tx.amount || 0);
      }
    });
    return balance;
  };

  const soldeGlobal = bankAccounts.reduce((sum, acc) => sum + getDigitalAccountBalance(acc.id), 0);
  
  const trueTotalEntrees = digitalTransactions
    .filter(t => t.type === 'sale')
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    
  const trueTotalSorties = digitalTransactions
    .filter(t => t.type === 'purchase' || t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Landmark size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Trésorerie & Banques (Digitale)</h3>
            <p className="text-sm text-gray-500">Gestion des flux et liquidités pour vos produits digitaux</p>
          </div>
        </div>
        <div>
          <select className="border border-gray-300 rounded-lg p-2 text-sm text-gray-700 bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500 outline-none">
            <option>Lifetime</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <WalletCards size={20} />
            </div>
            <p className="text-sm font-semibold text-gray-500 uppercase">Solde Global Digital</p>
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

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        {bankAccounts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Aucun compte bancaire configuré.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {bankAccounts.map(account => (
               <div key={account.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                 <div className="flex justify-between items-start mb-2">
                   <div className="flex items-center space-x-2">
                     <Wallet className="text-blue-500" size={20}/>
                     <h4 className="font-bold text-gray-800">{account.name}</h4>
                   </div>
                   <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 capitalize">{account.type}</span>
                 </div>
                 <p className="text-2xl font-bold text-gray-900 mt-4">{formatCurrency(getDigitalAccountBalance(account.id))}</p>
               </div>
             ))}
          </div>
        )}
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <h4 className="font-bold text-gray-800 text-lg">Transactions Récentes</h4>
        <div className="flex items-center space-x-3 overflow-x-auto w-full md:w-auto">
          <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 border rounded-lg font-medium text-sm whitespace-nowrap">
            <ArrowRightLeft size={16} />
            <span>Internal Transfer</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 border rounded-lg font-medium text-sm whitespace-nowrap">
            <Plus size={16} />
            <span>Adjustment / Movement</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 border rounded-lg font-medium text-sm whitespace-nowrap">
            <Settings size={16} />
            <span>Manage Accounts</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 border rounded-lg font-medium text-sm whitespace-nowrap">
            <FileText size={16} />
            <span>History</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export const DigitalTransactionsManager = ({ digitalTransactions, supabase, bankAccounts, digitalInventory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'sale',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    item_name: '',
    notes: '',
    bank_account_id: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newTx = {
        type: formData.type,
        amount: parseFloat(formData.amount),
        date: formData.date,
        item_name: formData.item_name,
        notes: formData.notes,
        bank_account_id: formData.bank_account_id || null,
        status: 'completed'
      };
      const { error } = await supabase.from('digital_transactions').insert([newTx]);
      if (error) throw error;
      setShowForm(false);
      setFormData({
        type: 'sale', amount: '', date: new Date().toISOString().split('T')[0], item_name: '', notes: '', bank_account_id: ''
      });
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la création de la transaction: ' + err.message);
    }
  };

  const filteredTransactions = digitalTransactions.filter(t => {
    const matchesSearch = (t.item_name && t.item_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (t.notes && t.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (!matchesSearch) return false;
    if (typeFilter !== 'all' && t.type !== typeFilter) return false;
    
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Transactions Digitales</h2>
          <p className="text-gray-500 text-sm">Historique des flux financiers (abonnements et licences).</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Chercher une transaction..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none w-64"
            />
          </div>
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none bg-white"
          >
            <option value="all">Tous les types</option>
            <option value="sale">Ventes (Entrées)</option>
            <option value="expense">Dépenses (Sorties)</option>
            <option value="purchase">Achats</option>
          </select>
          <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center shadow-sm">
            <Plus size={18} className="mr-2"/> Nouvelle Transaction
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Créer une Transaction Digitale</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type d'opération</label>
                <select required className="w-full border p-2 rounded-lg bg-white" value={formData.type} onChange={e=>setFormData({...formData, type:e.target.value})}>
                  <option value="sale">Vente (Entrée)</option>
                  <option value="expense">Dépense (Sortie)</option>
                  <option value="purchase">Achat (Sortie)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Montant (MAD)</label>
                <input required type="number" step="0.01" className="w-full border p-2 rounded-lg" value={formData.amount} onChange={e=>setFormData({...formData, amount:e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input required type="date" className="w-full border p-2 rounded-lg" value={formData.date} onChange={e=>setFormData({...formData, date:e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Compte Bancaire / Caisse</label>
                <select required className="w-full border p-2 rounded-lg bg-white" value={formData.bank_account_id} onChange={e=>setFormData({...formData, bank_account_id:e.target.value})}>
                  <option value="">Sélectionner un compte</option>
                  {bankAccounts && bankAccounts.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description / Motif</label>
                <input required type="text" placeholder="Ex: Achat licence serveur, Vente abonnement..." className="w-full border p-2 rounded-lg" value={formData.item_name} onChange={e=>setFormData({...formData, item_name:e.target.value})} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">Annuler</button>
              <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"><Save size={18} className="mr-2"/> Enregistrer</button>
            </div>
          </form>
        </div>
      )}
      
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
            <tr>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Type</th>
              <th className="px-6 py-4 font-semibold">Description</th>
              <th className="px-6 py-4 font-semibold">Compte</th>
              <th className="px-6 py-4 font-semibold text-right">Montant</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredTransactions.map(t => {
              const account = bankAccounts?.find(b => b.id === t.bank_account_id);
              return (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{new Date(t.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${t.type === 'sale' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {t.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">{t.item_name || t.notes}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 font-medium">
                      {account ? account.name : 'Non spécifié'}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-mono font-bold ${t.type === 'sale' ? 'text-green-600' : 'text-red-500'}`}>
                    {t.type === 'sale' ? '+' : '-'}{parseFloat(t.amount).toLocaleString()} MAD
                  </td>
                </tr>
              );
            })}
            {filteredTransactions.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <ArrowRightLeft size={48} className="text-gray-300 mb-4" />
                    <p className="text-lg font-medium text-gray-900">Aucune transaction trouvée</p>
                    <p className="text-sm">Vérifiez vos filtres ou effectuez une nouvelle opération.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const DigitalSuppliersManager = ({ digitalSuppliers, digitalTransactions, supabase, t }) => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ id: null, name: '', contact: '', email: '', phone: '', notes: '' });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MAD' }).format(amount);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await supabase.from('digital_suppliers').update(formData).eq('id', formData.id);
      } else {
        await supabase.from('digital_suppliers').insert([formData]);
      }
      setShowForm(false);
      window.location.reload(); // Quick refresh to grab new data
    } catch (err) {
      console.error(err);
      alert('Error saving supplier');
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Supprimer ce fournisseur digital (Panel) ?')) {
      await supabase.from('digital_suppliers').delete().eq('id', id);
      window.location.reload();
    }
  };

  const filteredSuppliers = digitalSuppliers?.filter(item => {
    return item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           (item.contact && item.contact.toLowerCase().includes(searchTerm.toLowerCase()));
  }) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
            <Truck size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Fournisseurs Digitaux (Panels)</h3>
            <p className="text-sm text-gray-500">Gérez vos fournisseurs de serveurs, licences et panels IPTV</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => { setFormData({ id: null, name: '', contact: '', email: '', phone: '', notes: '' }); setShowForm(true); }} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center shadow-sm">
            <Plus size={18} className="mr-2"/> Nouveau Fournisseur
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Chercher un fournisseur..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
          />
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-fade-in-up">
          <h3 className="text-lg font-bold text-gray-800 mb-4">{formData.id ? 'Modifier le Fournisseur' : 'Ajouter un Fournisseur (Panel)'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du Fournisseur / Panel</label>
                <input required type="text" className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact (Nom de la personne)</label>
                <input type="text" className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" value={formData.contact} onChange={e=>setFormData({...formData, contact:e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" value={formData.email} onChange={e=>setFormData({...formData, email:e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone / WhatsApp</label>
                <input type="text" className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" value={formData.phone} onChange={e=>setFormData({...formData, phone:e.target.value})} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes / Liens du Panel</label>
                <input type="text" placeholder="Ex: http://cms.panel.com - User: admin..." className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" value={formData.notes} onChange={e=>setFormData({...formData, notes:e.target.value})} />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 border-t pt-4">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">Annuler</button>
              <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium flex items-center">
                <Save size={18} className="mr-2" /> Enregistrer
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
            <tr>
              <th className="px-6 py-4 font-semibold">Fournisseur (Panel)</th>
              <th className="px-6 py-4 font-semibold">Contact / Téléphone</th>
              <th className="px-6 py-4 font-semibold">Notes / Lien</th>
              <th className="px-6 py-4 font-semibold text-right">Achats Totaux (MAD)</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredSuppliers.map(item => {
              const totalPurchases = digitalTransactions
                ? digitalTransactions
                    .filter(t => t.type === 'purchase' && (t.party === item.name || t.item_name?.includes(item.name)))
                    .reduce((acc, t) => acc + parseFloat(t.amount || 0), 0)
                : 0;

              return (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{item.name}<br/><span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-md mt-1 inline-block">{item.email || 'Aucun email'}</span></td>
                  <td className="px-6 py-4">{item.contact || 'N/A'}<br/><span className="text-xs text-gray-500">{item.phone}</span></td>
                  <td className="px-6 py-4 text-xs max-w-xs truncate">{item.notes}</td>
                  <td className="px-6 py-4 text-right font-mono text-purple-600 font-bold">{formatCurrency(totalPurchases)}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => { setFormData(item); setShowForm(true); }} className="text-blue-500 hover:text-blue-700"><Edit size={16}/></button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16}/></button>
                  </td>
                </tr>
              );
            })}
            {filteredSuppliers.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <Truck size={48} className="text-gray-300 mb-4" />
                    <p className="text-lg font-medium text-gray-900">Aucun fournisseur trouvé</p>
                    <p className="text-sm">Commencez par ajouter vos fournisseurs ou panels.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const DigitalReportView = ({ digitalTransactions, digitalInventory, t }) => {
  const [dateFilter, setDateFilter] = useState('thisMonth');
  const reportRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => reportRef.current,
  });

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Digital Financial Report',
          text: `Mabox.ma Digital Financial Report - ${t(dateFilter)}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      alert('Web Share API not supported');
    }
  };

  const getFilteredTransactions = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    return digitalTransactions.filter(t => {
      const tDate = new Date(t.date);
      if (dateFilter === 'thisMonth') return tDate >= startOfMonth;
      if (dateFilter === 'lastMonth') return tDate >= startOfLastMonth && tDate <= endOfLastMonth;
      if (dateFilter === 'thisYear') return tDate >= startOfYear;
      return true;
    });
  };

  const filteredTransactions = getFilteredTransactions();

  const calculateKPIs = () => {
    let income = 0;
    let expenses = 0;

    filteredTransactions.forEach(t => {
      const amount = parseFloat(t.amount || 0);
      if (t.type === 'sale') {
        income += amount;
      } else if (t.type === 'expense' || t.type === 'purchase') {
        expenses += amount;
      }
    });

    const netProfit = income - expenses;
    const margin = income > 0 ? (netProfit / income) * 100 : 0;

    return { income, expenses, netProfit, margin };
  };

  const { income, expenses, netProfit, margin } = calculateKPIs();

  const getTrendData = () => {
    const data = {};
    const isDaily = dateFilter === 'thisMonth' || dateFilter === 'lastMonth';

    filteredTransactions.forEach(t => {
      const date = new Date(t.date);
      const key = isDaily ? date.getDate() : date.toLocaleString('default', { month: 'short' });
      if (!data[key]) data[key] = { name: key, income: 0, expenses: 0 };
      const amount = parseFloat(t.amount || 0);
      if (t.type === 'sale') data[key].income += amount;
      else if (t.type === 'expense' || t.type === 'purchase') data[key].expenses += amount;
    });

    return Object.values(data).sort((a, b) => {
      if (isDaily) return a.name - b.name;
      return 0;
    });
  };

  const getExpenseBreakdown = () => {
    const data = { Purchase: 0, Expense: 0 };
    filteredTransactions.forEach(t => {
      if (t.type === 'expense' || t.type === 'purchase') {
        const amount = parseFloat(t.amount || 0);
        if (t.type === 'purchase') data.Purchase += amount;
        else data.Expense += amount;
      }
    });
    return Object.keys(data).map(key => ({ name: key, value: data[key] })).filter(d => d.value > 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MAD' }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 print:hidden">
        <h3 className="text-xl font-bold text-gray-800">Rapport Financier Digital</h3>
        <div className="flex items-center gap-2">
          <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-2">
            <option value="thisMonth">{t('thisMonth')}</option>
            <option value="lastMonth">{t('lastMonth')}</option>
            <option value="thisYear">{t('thisYear')}</option>
            <option value="allTime">{t('allTime')}</option>
          </select>
          <button onClick={handleShare} className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700">
            <Share2 size={20} /> <span className="hidden md:inline">{t('shareSummary')}</span>
          </button>
          <button onClick={handlePrint} className="bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-900">
            <Printer size={20} /> <span className="hidden md:inline">{t('printReport')}</span>
          </button>
        </div>
      </div>

      <div ref={reportRef} className="space-y-8 print:p-8">
        <div className="hidden print:block text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-600">Mabox.ma Digital</h1>
          <p className="text-gray-500">{t(dateFilter)} Report</p>
          <p className="text-sm text-gray-400">{new Date().toLocaleDateString()}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">{t('revenue')} (Digital)</p>
            <p className="text-2xl font-bold text-gray-800">{formatCurrency(income)}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">{t('expenses')} (Digital)</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(expenses)}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">{t('netProfit')} (Digital)</p>
            <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(netProfit)}
            </p>
            <p className="text-xs text-gray-400">{margin.toFixed(1)}% {t('profitMargin')}</p>
          </div>
        </div>

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
                <Pie data={getExpenseBreakdown()} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
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

      </div>
    </div>
  );
}
