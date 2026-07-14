import React, { useState, useMemo, useRef } from 'react';
import { 
  Users, Package, ArrowRightLeft, Landmark, Truck, Search, Plus, Edit, Trash2, X, Download, Filter, Save, AlertTriangle, CheckCircle, Clock, WalletCards, ArrowDown, ArrowUp, Wallet, Settings, FileText, Share2, Printer, Activity, History, CreditCard
} from 'lucide-react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { useReactToPrint } from 'react-to-print';

export const DigitalDashboard = ({ subscriptions = [], digitalTransactions = [], digitalInventory = [], t }) => {
  const isActive = (s) => s.status === 'active' || s.status === 'completed';
  const isCanceled = (s) => s.status === 'terminated' || s.status === 'canceled';

  const activeSubs = subscriptions.filter(isActive).length;
  const terminatedSubs = subscriptions.filter(isCanceled).length;
  
  // Find expiring in next 7 days
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);
  
  const expiringSubs = subscriptions.filter(s => {
    if (!isActive(s)) return false;
    const endDate = new Date(s.end_date);
    return endDate <= nextWeek && endDate >= today;
  });

  const mrr = subscriptions
    .filter(isActive)
    .reduce((acc, curr) => {
      const months = parseFloat(curr.duration_months) || 1;
      return acc + (parseFloat(curr.amount_paid || 0) / months);
    }, 0);

  const stockValue = digitalInventory.reduce((acc, item) => acc + (parseFloat(item.quantity || 0) * parseFloat(item.buy_price || 0)), 0);

  // Bénéfice Net (Profit per credit)
  let totalNetProfit = 0;
  let activeSubsForProfit = 0;
  subscriptions.forEach(sub => {
    if (sub.status === 'pending') return; // Exclude pending from profit!
    
    // Exclude subscriptions that have been refunded
    const isRefunded = isCanceled(sub) || digitalTransactions.some(tx => tx.subscription_id === sub.id && tx.type === 'expense');
    
    if (!isRefunded) {
      activeSubsForProfit++;
      const rev = parseFloat(sub.amount_paid || 0);
      const prod = digitalInventory.find(p => p.id === sub.product_id) || digitalInventory.find(p => p.name === sub.product_name);
      if (prod) {
        const costFor1Credit = parseFloat(prod.buy_price || 0);
        const numberOfCredits = sub?.notes && sub.notes.match(/\[CRD:(\d+)\]/) 
            ? parseInt(sub.notes.match(/\[CRD:(\d+)\]/)[1]) 
            : parseFloat(sub.duration_months) || 1;
        const totalCost = costFor1Credit * numberOfCredits;
        totalNetProfit += (rev - totalCost);
      } else {
        totalNetProfit += rev; // Default if product missing
      }
    }
  });

  // Calculate chart data for last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);
  
  // Group by day
  const dailyDataMap = {};
  for(let i = 0; i <= 30; i++) {
    const d = new Date(thirtyDaysAgo);
    d.setDate(d.getDate() + i);
    const dateStr = d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    dailyDataMap[dateStr] = { date: dateStr, Revenus: 0 };
  }

  digitalTransactions.forEach(tx => {
    const txDate = new Date(tx.date);
    if (txDate >= thirtyDaysAgo && tx.type === 'sale' && tx.status !== 'pending' && tx.status !== 'canceled') {
      const dateStr = txDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
      if (dailyDataMap[dateStr]) {
        dailyDataMap[dateStr].Revenus += parseFloat(tx.amount || 0);
      }
    }
  });
  
  const lineChartData = Object.values(dailyDataMap);

  const formatCurrency = (val) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MAD' }).format(val);

  return (
    <div className="space-y-8 animate-fade-in-up">
      {expiringSubs.length > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 p-4 rounded-xl shadow-sm flex items-center">
          <div className="p-2 bg-orange-100 rounded-full mr-4">
            <AlertTriangle className="text-orange-500" size={24}/>
          </div>
          <div>
            <h3 className="text-orange-800 font-bold text-lg">Abonnements expirant bientôt !</h3>
            <p className="text-orange-700 text-sm">Vous avez <strong className="font-black text-red-600">{expiringSubs.length}</strong> abonnement(s) qui expirent dans les 7 prochains jours.</p>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/80 text-sm font-semibold uppercase tracking-wider mb-1">MRR (Revenu Mensuel)</p>
              <h3 className="text-3xl font-bold">{formatCurrency(mrr)}</h3>
            </div>
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Wallet size={24} className="text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-300 font-medium flex items-center"><ArrowUp size={16} className="mr-1"/> Stable</span>
            <span className="ml-2 text-white/60">sur le mois</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Bénéfice Net (Crédits)</p>
              <h3 className="text-3xl font-bold text-gray-900">{formatCurrency(totalNetProfit)}</h3>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl">
              <WalletCards size={24} className="text-emerald-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500 text-xs">Calcul sur les {activeSubsForProfit} abonnements (Remboursements exclus)</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Abonnements Actifs</p>
              <h3 className="text-3xl font-bold text-gray-900">{activeSubs}</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <Users size={24} className="text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-orange-500 font-medium text-xs">{expiringSubs.length} expirent bientôt</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Valeur du Stock</p>
              <h3 className="text-3xl font-bold text-gray-900">{formatCurrency(stockValue)}</h3>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl">
              <Package size={24} className="text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500 text-xs">Valorisation au prix d'achat</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
            <Activity className="mr-2 text-indigo-500" size={20}/> Évolution des Revenus (30 jours)
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="date" tick={{fill: '#9ca3af', fontSize: 12}} axisLine={false} tickLine={false} minTickGap={20} />
                <YAxis tick={{fill: '#9ca3af', fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={(value) => `${value} MAD`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value) => [formatCurrency(value), "Revenus"]}
                />
                <Line type="monotone" dataKey="Revenus" stroke="#8b5cf6" strokeWidth={3} dot={false} activeDot={{r: 6, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
            <Clock className="mr-2 text-gray-400" size={20}/> Transactions Récentes
          </h3>
          <div className="flex-1 space-y-4 overflow-y-auto pr-2">
            {digitalTransactions.slice(0, 6).map(t => (
              <div key={t.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl transition-all duration-200 border border-transparent hover:border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className={`p-2.5 rounded-xl ${
                    t.type === 'sale' ? 'bg-green-100 text-green-600' : 
                    t.type === 'expense' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {t.type === 'sale' ? <ArrowRightLeft size={18} /> : 
                     t.type === 'expense' ? <ArrowDown size={18} /> : <Landmark size={18} />}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 truncate max-w-[140px]" title={t.item_name || 'Transaction'}>{t.item_name || 'Transaction'}</p>
                    <p className="text-xs text-gray-500 font-medium">{new Date(t.date).toLocaleDateString('fr-FR', {day: 'numeric', month: 'short', year: 'numeric'})}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`font-bold ${
                    t.type === 'sale' || t.type === 'other_revenue' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {t.type === 'sale' || t.type === 'other_revenue' ? '+' : '-'}{parseFloat(t.amount).toLocaleString('fr-FR')} MAD
                  </span>
                  <p className="text-[10px] uppercase font-bold text-gray-400 mt-0.5">{t.type}</p>
                </div>
              </div>
            ))}
            {digitalTransactions.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 py-10">
                <Package size={40} className="mb-3 opacity-20"/>
                <p className="text-sm">Aucune transaction récente.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const DigitalAbonnementsManager = ({ subscriptions, digitalInventory, supabase, bankAccounts = [], t }) => {
  const isActive = (s) => s.status === 'active' || s.status === 'completed';
  const isCanceled = (s) => s.status === 'terminated' || s.status === 'canceled';

  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({ id: null, customer_name: '', customer_phone: '', product_id: '', duration_months: 1, credits_to_deduct: 1, amount_paid: 0, start_date: new Date().toISOString().split('T')[0], status: 'completed', notes: '', bank_account_id: '' });

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
      
      const creditsToDeduct = parseFloat(formData.credits_to_deduct) || parseFloat(formData.duration_months);
      const notesSuffix = creditsToDeduct !== parseFloat(formData.duration_months) ? ` [CRD:${creditsToDeduct}]` : '';

      const dbSub = {
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        product_id: formData.product_id,
        product_name: product ? product.name : 'Unknown',
        duration_months: parseFloat(formData.duration_months),
        start_date: formData.start_date,
        end_date: end_date,
        amount_paid: parseFloat(formData.amount_paid),
        status: formData.status,
        notes: (formData.notes || '') + (formData.id ? '' : notesSuffix) // only append on insert
      };

      if (formData.id) {
        await supabase.from('subscriptions').update(dbSub).eq('id', formData.id);
        await supabase.from('digital_transactions').update({ status: formData.status }).eq('subscription_id', formData.id).eq('type', 'sale');
      } else {
        const { data: insertedSub, error: subErr } = await supabase.from('subscriptions').insert([dbSub]).select();
        
        if (!subErr && insertedSub && insertedSub[0]) {
          // Log digital transaction
          const digTx = {
            date: new Date().toISOString(),
            type: 'sale',
            item_name: `Abo: ${product ? product.name : 'Unknown'} - ${formData.customer_name}`,
            amount: parseFloat(formData.amount_paid),
            bank_account_id: formData.bank_account_id || null,
            subscription_id: insertedSub[0].id,
            digital_product_id: formData.product_id || null,
            status: formData.status,
            notes: 'Abonnement Digital'
          };
          const { error: digTxErr } = await supabase.from('digital_transactions').insert([digTx]);
          if (digTxErr) console.error('Error inserting digital transaction:', digTxErr);
          
          // Deduct stock (Credits)
          if (formData.product_id && product) {
            const creditsToDeduct = parseFloat(formData.credits_to_deduct) || parseFloat(formData.duration_months) || 1;
            const newQty = (product.quantity || 0) - creditsToDeduct;
            await supabase.from('digital_inventory').update({ quantity: newQty }).eq('id', product.id);
          }
        }
      }
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert('Error saving subscription');
    }
  };

  const handleDeleteAction = async (id) => {
    const sub = subscriptions.find(s => s.id === id);
    if (!sub) return;
    
    const action = window.prompt("S'agit-il d'un remboursement ou d'une suppression ?\n\nTapez 'R' pour Rembourser (termine l'abo et crée une dépense de remboursement)\nTapez 'S' pour Supprimer (efface complètement l'abonnement)");

    if (action && action.toLowerCase() === 'r') {
      // Find original transaction to refund from the correct bank account
      const { data: origTx } = await supabase.from('digital_transactions').select('bank_account_id').eq('subscription_id', id).eq('type', 'sale').maybeSingle();
      const bankAccountId = origTx ? origTx.bank_account_id : null;

      await supabase.from('subscriptions').update({ status: 'terminated' }).eq('id', id);
      const refundTx = {
          date: new Date().toISOString(),
          type: 'expense',
          item_name: `Remboursement Abo: ${sub.product_name} - ${sub.customer_name}`,
          amount: parseFloat(sub.amount_paid),
          subscription_id: sub.id,
          bank_account_id: bankAccountId,
          digital_product_id: sub.product_id || null,
          status: 'completed',
          notes: 'Remboursement suite à annulation'
      };
      const { error: refundErr } = await supabase.from('digital_transactions').insert([refundTx]);
      
      const creditsUsed = sub?.notes && sub.notes.match(/\[CRD:(\d+)\]/) 
          ? parseInt(sub.notes.match(/\[CRD:(\d+)\]/)[1]) 
          : parseFloat(sub.duration_months);
      const restockAmount = window.prompt(`Combien de crédits voulez-vous remettre en stock ? (Abonnement de ${sub.duration_months} mois, ${creditsUsed} crédits déduits)`, creditsUsed);
      if (restockAmount !== null && !isNaN(restockAmount) && parseFloat(restockAmount) > 0 && sub.product_id) {
        const prod = digitalInventory?.find(p => p.id === sub.product_id);
        if (prod) {
          await supabase.from('digital_inventory').update({ quantity: (prod.quantity || 0) + parseFloat(restockAmount) }).eq('id', sub.product_id);
        }
      }
      
      if (refundErr) console.error('Error inserting refund:', refundErr);
      else alert("Abonnement annulé, remboursement enregistré, et stock mis à jour si demandé.");
    } else if (action && action.toLowerCase() === 's') {
      if (window.confirm("Êtes-vous sûr de vouloir supprimer définitivement cet abonnement ?")) {
        const creditsUsed = sub?.notes && sub.notes.match(/\[CRD:(\d+)\]/) 
            ? parseInt(sub.notes.match(/\[CRD:(\d+)\]/)[1]) 
            : parseFloat(sub.duration_months);
        const restockAmount = window.prompt(`Combien de crédits voulez-vous remettre en stock avant suppression ? (Abonnement de ${sub.duration_months} mois, ${creditsUsed} crédits déduits)`, creditsUsed);
        if (restockAmount !== null && !isNaN(restockAmount) && parseFloat(restockAmount) > 0 && sub.product_id) {
          const prod = digitalInventory?.find(p => p.id === sub.product_id);
          if (prod) {
            await supabase.from('digital_inventory').update({ quantity: (prod.quantity || 0) + parseFloat(restockAmount) }).eq('id', sub.product_id);
          }
        }
        await supabase.from('subscriptions').delete().eq('id', id);
        alert("Abonnement supprimé.");
      }
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
    
    if (statusFilter === 'active' && isActive(sub) && diffDays > 7) return true;
    if (statusFilter === 'expiring' && isActive(sub) && diffDays > 0 && diffDays <= 7) return true;
    if (statusFilter === 'expired' && isActive(sub) && diffDays <= 0) return true;
    if (statusFilter === 'terminated' && isCanceled(sub)) return true;
    if (statusFilter === 'pending' && sub.status === 'pending') return true;
    
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
            <option value="active">Actifs / Complétés</option>
            <option value="pending">En attente (Pending)</option>
            <option value="expiring">Expirant bientôt (≤ 7j)</option>
            <option value="expired">Expirés</option>
            <option value="terminated">Terminés / Annulés</option>
          </select>
          <button 
            onClick={() => { 
              if(digitalInventory.length === 0) {
                alert("Veuillez d'abord ajouter un Produit Digital dans le catalogue avant de créer un abonnement.");
                return;
              }
              setFormData({ id: null, customer_name: '', customer_phone: '', product_id: '', duration_months: 1, credits_to_deduct: 1, amount_paid: 0, start_date: new Date().toLocaleString('sv').replace(' ', 'T').slice(0, 16), status: 'completed', notes: '', bank_account_id: '' }); 
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
                <input type="number" step="any" min="0" className="w-full border-gray-300 rounded-lg p-2 border focus:ring-2 focus:ring-purple-500" value={formData.duration_months} onChange={e => {
                      const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                      setFormData({...formData, duration_months: val, credits_to_deduct: val});
                    }} />
              </div>
              {!formData.id && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Crédits à déduire du stock</label>
                  <input required type="number" step="any" min="0" className="w-full border-gray-300 rounded-lg p-2 border focus:ring-2 focus:ring-purple-500" value={formData.credits_to_deduct} onChange={e => setFormData({...formData, credits_to_deduct: e.target.value})} />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date et heure de début</label>
                <input required type="datetime-local" className="w-full border-gray-300 rounded-lg p-2 border" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Montant Payé (MAD)</label>
                <input required type="number" step="0.01" className="w-full border-gray-300 rounded-lg p-2 border" value={formData.amount_paid} onChange={e => setFormData({...formData, amount_paid: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut du Paiement / Abonnement</label>
                <select required className="w-full border-gray-300 rounded-lg p-2 border" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                  <option value="completed">Complété (Payé & Actif)</option>
                  <option value="pending">En attente (Non payé)</option>
                  <option value="canceled">Annulé / Remboursé</option>
                </select>
              </div>
              {!formData.id && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Compte / Caisse (Encaissement)</label>
                  <select required className="w-full border-gray-300 rounded-lg p-2 border" value={formData.bank_account_id} onChange={e => setFormData({...formData, bank_account_id: e.target.value})}>
                    <option value="">Sélectionner une caisse...</option>
                    {bankAccounts.map(b => <option key={b.id} value={b.id}>{b.name} (Solde: {parseFloat(b.initial_balance || 0).toLocaleString()} MAD)</option>)}
                  </select>
                </div>
              )}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Login / Lien m3u / Notes</label>
                <textarea className="w-full border-gray-300 rounded-lg p-2 border" rows="2" placeholder="Informations de connexion, lien m3u, etc." value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}></textarea>
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
              if (isCanceled(s)) statusBadge = <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold flex items-center inline-flex"><CheckCircle size={12} className="mr-1"/>Annulé/Terminé</span>;
              else if (s.status === 'pending') statusBadge = <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold flex items-center inline-flex"><Clock size={12} className="mr-1"/>En attente</span>;
              else if (diffDays <= 0) statusBadge = <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center inline-flex"><AlertTriangle size={12} className="mr-1"/>Expiré</span>;
              else if (diffDays <= 7) statusBadge = <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold flex items-center inline-flex"><Clock size={12} className="mr-1"/>Expir. dans {diffDays}j</span>;

              return (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{s.customer_name}<br/><span className="text-xs text-gray-400">{s.customer_phone}</span></td>
                  <td className="px-6 py-4">{s.product_name}</td>
                  <td className="px-6 py-4 text-xs">
                    Du: {new Date(s.start_date).toLocaleDateString()} <span className="text-gray-400">à {new Date(s.start_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span><br/>
                    Au: <span className={diffDays <= 7 && isActive(s) ? 'text-red-500 font-bold' : ''}>{new Date(s.end_date).toLocaleDateString()}</span><br/>
                    <span className="text-purple-600 font-medium">({
                        s.notes && s.notes.match(/\[CRD:(\d+)\]/) 
                          ? parseInt(s.notes.match(/\[CRD:(\d+)\]/)[1]) 
                          : s.duration_months
                    } Crédits utilisés)</span>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold">{parseFloat(s.amount_paid || 0).toLocaleString()} MAD</td>
                  <td className="px-6 py-4">{statusBadge}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => { setFormData(s); setShowForm(true); }} className="text-blue-500 hover:text-blue-700" title="Modifier"><Edit size={18}/></button>
                    <button onClick={() => handleDeleteAction(s.id)} className="text-red-500 hover:text-red-700 ml-2" title="Annuler / Supprimer"><Trash2 size={18}/></button>
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

const PurchaseStockModal = ({ isOpen, onClose, digitalInventory, digitalSuppliers, bankAccounts, supabase, defaultSupplierId = '', defaultProductId = '' }) => {
  const [formData, setFormData] = useState({
    supplier_id: defaultSupplierId,
    product_id: defaultProductId,
    quantity: 1,
    unit_price: 0,
    amount_paid: '',
    bank_account_id: ''
  });

  if (!isOpen) return null;

  const handleProductChange = (e) => {
    const pid = e.target.value;
    const prod = digitalInventory?.find(p => p.id === pid);
    const up = prod ? prod.buy_price || 0 : 0;
    const q = formData.quantity || 1;
    const tp = (parseFloat(up) * parseFloat(q)).toFixed(2);
    setFormData({ ...formData, product_id: pid, unit_price: up, total_price: tp, amount_paid: tp });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const product = digitalInventory.find(p => p.id === formData.product_id);
      if (!product) return alert('Produit invalide');
      
      const newQuantity = (product.quantity || 0) + parseFloat(formData.quantity);
      
      const { error: invErr } = await supabase.from('digital_inventory').update({ quantity: newQuantity }).eq('id', formData.product_id);
      if (invErr) throw invErr;
      
      const totalAmount = formData.total_price !== undefined ? parseFloat(formData.total_price) : (parseFloat(formData.unit_price) * parseFloat(formData.quantity));
      
      const transactions = [];
      const tx = {
        date: new Date().toISOString(),
        type: 'purchase',
        item_name: `Achat stock: ${formData.quantity}x ${product.name}`,
        amount: totalAmount,
        bank_account_id: null, // Purchases on credit don't deduct from bank directly, the payment does
        digital_supplier_id: formData.supplier_id || null,
        digital_product_id: formData.product_id,
        status: 'completed',
        notes: 'Achat de stock (Réapprovisionner Stock)'
      };
      transactions.push(tx);

      const paidAmount = parseFloat(formData.amount_paid || 0);
      if (paidAmount > 0 && formData.bank_account_id) {
        transactions.push({
          date: new Date().toISOString(),
          type: 'supplier_payment',
          item_name: `Paiement Fournisseur (Réapprovisionnement: ${product.name})`,
          amount: paidAmount,
          bank_account_id: formData.bank_account_id,
          digital_supplier_id: formData.supplier_id || null,
          digital_product_id: formData.product_id,
          status: 'completed',
          notes: `Paiement d'Achat de stock`
        });
      }
      
      const { error: txErr } = await supabase.from('digital_transactions').insert(transactions);
      if (txErr) throw txErr;
      
      alert('Stock réapprovisionné et transaction enregistrée avec succès !');
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erreur: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800 flex items-center"><Package className="mr-2 text-purple-600"/> Réapprovisionner Stock</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fournisseur (Optionnel)</label>
            <select className="w-full border p-2 rounded-lg" value={formData.supplier_id} onChange={e=>setFormData({...formData, supplier_id:e.target.value})}>
              <option value="">Aucun fournisseur (Achat direct)</option>
              {digitalSuppliers && digitalSuppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Produit Digital</label>
            <select required className="w-full border p-2 rounded-lg" value={formData.product_id} onChange={handleProductChange}>
              <option value="">Sélectionner un produit</option>
              {digitalInventory && digitalInventory.map(p => <option key={p.id} value={p.id}>{p.name} (Stock actuel: {p.quantity||0})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
            <input required type="number" step="any" min="0" className="w-full border p-2 rounded-lg" value={formData.quantity} onChange={e=>{
              const q = e.target.value;
              const up = formData.unit_price || 0;
              const tp = q ? (parseFloat(up) * parseFloat(q)).toFixed(2) : formData.total_price;
              setFormData({...formData, quantity: q, total_price: tp, amount_paid: tp});
            }} />
          </div>
          <div className="flex gap-4 mt-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix Unitaire (MAD)</label>
              <input required type="number" step="0.01" className="w-full border p-2 rounded-lg" value={formData.unit_price} onChange={e=>{
                const up = e.target.value;
                const q = formData.quantity || 1;
                setFormData({...formData, unit_price: up, total_price: up ? (parseFloat(up) * parseFloat(q)).toFixed(2) : ''});
              }} />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix Général (Total MAD)</label>
              <input required type="number" step="0.01" className="w-full border p-2 rounded-lg" value={formData.total_price !== undefined ? formData.total_price : (parseFloat(formData.unit_price || 0) * parseFloat(formData.quantity || 0))} onChange={e=>{
                const tp = e.target.value;
                const q = formData.quantity || 1;
                setFormData({...formData, total_price: tp, unit_price: tp ? (parseFloat(tp) / parseFloat(q)).toFixed(2) : ''});
              }} />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Paiement depuis (Compte)</label>
              <select className="w-full border p-2 rounded-lg" value={formData.bank_account_id} onChange={e=>{
                const bankId = e.target.value;
                setFormData({...formData, bank_account_id: bankId, amount_paid: bankId ? formData.total_price : 0});
              }}>
                <option value="">À crédit (Aucun paiement immédiat)</option>
                {bankAccounts && bankAccounts.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Montant Payé (MAD)</label>
              <input type="number" step="0.01" className="w-full border p-2 rounded-lg bg-gray-50" disabled={!formData.bank_account_id} value={formData.amount_paid} onChange={e=>setFormData({...formData, amount_paid:e.target.value})} />
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center border border-gray-200 mt-2">
            <span className="text-gray-600 font-medium">Récapitulatif :</span>
            <span className="text-gray-600">
              {formData.bank_account_id && parseFloat(formData.amount_paid) > 0 ? `Paiement de ${formData.amount_paid} MAD` : 'Achat à crédit'}
            </span>
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg">Annuler</button>
            <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center hover:bg-purple-700"><Save size={18} className="mr-2"/> Confirmer l'Achat</button>
          </div>
        </form>
      </div>
    </div>
  );
};
const DigitalPaymentModal = ({ isOpen, onClose, digitalSuppliers, bankAccounts, digitalTransactions, supabase }) => {
  const [formData, setFormData] = useState({
    supplier_id: '',
    amount: '',
    fees: '',
    bank_account_id: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const supplier = digitalSuppliers.find(s => s.id === formData.supplier_id);
      if (!supplier) return alert('Fournisseur invalide');

      const transactionsToInsert = [];
      
      transactionsToInsert.push({
        date: new Date().toISOString(),
        type: 'supplier_payment',
        item_name: `Paiement Fournisseur: ${supplier.name}`,
        amount: parseFloat(formData.amount),
        bank_account_id: formData.bank_account_id,
        digital_supplier_id: formData.supplier_id,
        status: 'completed',
        notes: `Paiement effectué pour ${supplier.name}`
      });

      if (formData.fees && parseFloat(formData.fees) > 0) {
        transactionsToInsert.push({
          date: new Date().toISOString(),
          type: 'expense',
          item_name: `Frais bancaires`,
          amount: parseFloat(formData.fees),
          bank_account_id: formData.bank_account_id,
          digital_supplier_id: null,
          category: 'Frais Bancaires',
          status: 'completed',
          notes: `Frais de paiement pour ${supplier.name}`
        });
      }

      const { error } = await supabase.from('digital_transactions').insert(transactionsToInsert);
      if (error) throw error;

      alert('Paiement enregistré avec succès');
      onClose();
    } catch (error) {
      console.error(error);
      alert('Erreur: ' + error.message);
    }
  };

  const getSupplierBalance = (supplierId) => {
    const purchases = digitalTransactions?.filter(t => t.type === 'purchase' && t.digital_supplier_id === supplierId).reduce((sum, t) => sum + parseFloat(t.amount || 0), 0) || 0;
    const paid = digitalTransactions?.filter(t => t.type === 'supplier_payment' && t.digital_supplier_id === supplierId).reduce((sum, t) => sum + parseFloat(t.amount || 0), 0) || 0;
    return purchases - paid;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800 flex items-center"><CreditCard className="mr-2 text-indigo-600"/> Nouveau Paiement (Panel)</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fournisseur</label>
            <select required className="w-full border p-2 rounded-lg" value={formData.supplier_id} onChange={e=>setFormData({...formData, supplier_id:e.target.value})}>
              <option value="">Sélectionner un fournisseur</option>
              {digitalSuppliers && digitalSuppliers.map(s => <option key={s.id} value={s.id}>{s.name} (Reste: {getSupplierBalance(s.id).toFixed(2)} MAD)</option>)}
            </select>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Montant (MAD)</label>
              <input required type="number" step="0.01" min="0.01" className="w-full border p-2 rounded-lg" value={formData.amount} onChange={e=>setFormData({...formData, amount:e.target.value})} />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Frais Bancaires</label>
              <input type="number" step="0.01" min="0" placeholder="Optionnel" className="w-full border p-2 rounded-lg" value={formData.fees} onChange={e=>setFormData({...formData, fees:e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Compte Bancaire Source</label>
            <select required className="w-full border p-2 rounded-lg" value={formData.bank_account_id} onChange={e=>setFormData({...formData, bank_account_id:e.target.value})}>
              <option value="">Sélectionner un compte/caisse</option>
              {bankAccounts && bankAccounts.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg">Annuler</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center hover:bg-indigo-700"><Save size={18} className="mr-2"/> Confirmer le Paiement</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const DigitalInventoryManager = ({ digitalInventory, digitalTransactions, digitalSuppliers, bankAccounts, supabase, t }) => {
  const [showForm, setShowForm] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ id: null, name: '', buy_price: 0, sell_price: 0, category: '', notes: '', quantity: 0 });
  const [selectedHistoryProduct, setSelectedHistoryProduct] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MAD' }).format(amount);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (!payload.id) {
        delete payload.id;
      }
      if (payload.total_buy_price !== undefined) {
        delete payload.total_buy_price;
      }

      let res;
      if (formData.id) {
        res = await supabase.from('digital_inventory').update(payload).eq('id', formData.id);
      } else {
        res = await supabase.from('digital_inventory').insert([payload]);
      }

      if (res && res.error) {
        console.error('Supabase error:', res.error);
        alert('Erreur: ' + res.error.message);
        return;
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
  const stockValue = digitalInventory.reduce((acc, item) => acc + (parseFloat(item.quantity || 0) * parseFloat(item.buy_price || 0)), 0);
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
            <p className="text-sm font-semibold text-gray-500 uppercase">Valeur du Stock</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(stockValue)}</p>
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

        <div className="flex gap-2">
          <button onClick={() => setShowPurchaseModal(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center shadow-sm">
            <ArrowDown size={18} className="mr-2"/> Réapprovisionner
          </button>
          <button onClick={() => { setFormData({ id: null, name: '', buy_price: 0, sell_price: 0, category: '', notes: '', quantity: 0 }); setShowForm(true); }} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center shadow-sm">
            <Plus size={18} className="mr-2"/> Nouveau Produit
          </button>
        </div>
      </div>

      <PurchaseStockModal 
        isOpen={showPurchaseModal} 
        onClose={() => setShowPurchaseModal(false)}
        digitalInventory={digitalInventory}
        digitalSuppliers={digitalSuppliers}
        bankAccounts={bankAccounts}
        supabase={supabase}
      />

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
              <div className="lg:col-span-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Actuel (Manuel)</label>
                <input type="number" step="any" min="0" className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" value={formData.quantity} onChange={e=>{
                  const q = e.target.value;
                  const up = formData.buy_price || 0;
                  setFormData({...formData, quantity: q, total_buy_price: q ? (parseFloat(up) * parseFloat(q)).toFixed(2) : formData.total_buy_price});
                }} />
                <p className="text-xs text-gray-500 mt-1">Utilisez "Réapprovisionner" pour ajouter du stock de manière tracée. Cette case sert aux corrections d'inventaire.</p>
              </div>
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Coût d'achat unitaire (MAD)</label>
                <input type="number" step="0.01" className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" value={formData.buy_price} onChange={e=>{
                  const up = e.target.value;
                  const q = formData.quantity || 0;
                  setFormData({...formData, buy_price: up, total_buy_price: up ? (parseFloat(up) * parseFloat(q)).toFixed(2) : ''});
                }} />
              </div>
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Coût d'achat général (Total MAD)</label>
                <input type="number" step="0.01" className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" value={formData.total_buy_price !== undefined ? formData.total_buy_price : (parseFloat(formData.buy_price || 0) * parseFloat(formData.quantity || 0) || '')} onChange={e=>{
                  const tp = e.target.value;
                  const q = formData.quantity || 0;
                  setFormData({...formData, total_buy_price: tp, buy_price: tp && q > 0 ? (parseFloat(tp) / parseFloat(q)).toFixed(2) : ''});
                }} />
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

      {selectedHistoryProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl flex flex-col max-h-[90vh] animate-fade-in-up">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
              <div>
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <History className="text-purple-600" size={24} /> 
                  Historique: {selectedHistoryProduct.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">Mouvements de stock (Crédits) et transactions</p>
              </div>
              <button onClick={() => setSelectedHistoryProduct(null)} className="text-gray-400 hover:text-gray-600 p-2 bg-white rounded-full shadow-sm">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-0 overflow-y-auto flex-1">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-white border-b border-gray-200 text-gray-700 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Date</th>
                    <th className="px-6 py-3 font-semibold">Type</th>
                    <th className="px-6 py-3 font-semibold">Description</th>
                    <th className="px-6 py-3 font-semibold text-right">Montant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {digitalTransactions && digitalTransactions
                    .filter(tx => tx.digital_product_id === selectedHistoryProduct.id)
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map(tx => (
                      <tr key={tx.id} className="hover:bg-gray-50">
                        <td className="px-6 py-3">
                          <div className="font-medium text-gray-800">{new Date(tx.date).toLocaleDateString()}</div>
                          <div className="text-xs text-gray-500">{new Date(tx.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                        </td>
                        <td className="px-6 py-3">
                          <span className={`px-2 py-1 rounded-md text-xs font-medium ${tx.type === 'purchase' || tx.type === 'expense' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                            {tx.type === 'purchase' ? 'Réapprovisionnement' : tx.type === 'sale' ? 'Vente / Abonnement' : tx.type}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-gray-800">{tx.item_name || tx.notes}</td>
                        <td className={`px-6 py-3 text-right font-bold ${tx.type === 'sale' || tx.type === 'other_revenue' ? 'text-green-600' : 'text-red-600'}`}>
                          {tx.type === 'sale' || tx.type === 'other_revenue' ? '+' : '-'}{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MAD' }).format(tx.amount || 0)}
                        </td>
                      </tr>
                    ))}
                  {(!digitalTransactions || digitalTransactions.filter(tx => tx.digital_product_id === selectedHistoryProduct.id).length === 0) && (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                        Aucun mouvement enregistré pour ce produit.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-end">
              <button onClick={() => setSelectedHistoryProduct(null)} className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium shadow-sm">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
            <tr>
              <th className="px-6 py-4 font-semibold">Nom</th>
              <th className="px-6 py-4 font-semibold">Prix Achat</th>
              <th className="px-6 py-4 font-semibold">Stock (Crédits)</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredInventory.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{item.name}<br/><span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-md mt-1 inline-block">{item.category || 'Sans catégorie'}</span></td>
                <td className="px-6 py-4 font-mono">{formatCurrency(parseFloat(item.buy_price || 0))}</td>
                <td className="px-6 py-4 font-bold text-gray-800">
                  <span className={`px-2 py-1 rounded ${item.quantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {item.quantity || 0}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => setSelectedHistoryProduct(item)} className="text-gray-500 hover:text-gray-700" title="Historique des mouvements"><History size={16}/></button>
                  <button onClick={() => { setFormData(item); setShowForm(true); }} className="text-blue-500 hover:text-blue-700" title="Modifier"><Edit size={16}/></button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700" title="Supprimer"><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
            {filteredInventory.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
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

export const DigitalTreasuryManager = ({ digitalTransactions, bankAccounts, supabase }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', type: 'bank', initialBalance: 0 });
  const [sortOption, setSortOption] = useState('date_desc');
  const [typeFilter, setTypeFilter] = useState('all');
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
    
    let balance = 0; 
    digitalTransactions.forEach(tx => {
      if (tx.bank_account_id === accountId) {
        if (tx.type === 'sale') balance += parseFloat(tx.amount || 0);
        else if (tx.type === 'purchase' || tx.type === 'expense' || tx.type === 'supplier_payment') balance -= parseFloat(tx.amount || 0);
      }
    });
    return balance;
  };

  const soldeGlobal = bankAccounts.reduce((sum, acc) => sum + getDigitalAccountBalance(acc.id), 0);
  
  const trueTotalEntrees = digitalTransactions
    .filter(t => t.type === 'sale')
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    
  const trueTotalSorties = digitalTransactions
    .filter(t => t.bank_account_id && (t.type === 'purchase' || t.type === 'expense' || t.type === 'supplier_payment'))
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  const handleAddAccount = async (e) => {
    e.preventDefault();
    const newAccount = {
      name: formData.name,
      type: formData.type + '_digital',
      initial_balance: parseFloat(formData.initialBalance || 0)
    };
    
    const { data, error } = await supabase.from('bank_accounts').insert([newAccount]).select();
    if (error) {
      alert('Error: ' + error.message);
    } else if (data) {
      setShowForm(false);
      setFormData({ name: '', type: 'bank', initialBalance: 0 });
      window.location.reload();
    }
  };

  const handleDeleteAccount = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce compte digital ? Cette action est irréversible.")) {
      const { error } = await supabase.from('bank_accounts').delete().eq('id', id);
      if (error) {
        alert("Erreur lors de la suppression : " + error.message);
      } else {
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
               <div key={account.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow relative group">
                 <div className="flex justify-between items-start mb-2">
                   <div className="flex items-center space-x-2">
                     <Wallet className="text-blue-500" size={20}/>
                     <h4 className="font-bold text-gray-800">{account.name}</h4>
                   </div>
                   <div className="flex items-center space-x-2">
                     <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 capitalize">{account.type.replace('_digital', '')}</span>
                     <button 
                       onClick={() => handleDeleteAccount(account.id)}
                       className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 transition-opacity"
                       title="Supprimer ce compte"
                     >
                       <Trash2 size={16} />
                     </button>
                   </div>
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
          <select 
            className="border border-gray-300 rounded-lg p-2 text-sm text-gray-700 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">Tous les types</option>
            <option value="sale">Ventes / Entrées</option>
            <option value="purchase">Achats de stock</option>
            <option value="supplier_payment">Paiements Fournisseur</option>
            <option value="expense">Dépenses</option>
          </select>
          <select 
            className="border border-gray-300 rounded-lg p-2 text-sm text-gray-700 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="date_desc">Date (Plus récent)</option>
            <option value="date_asc">Date (Plus ancien)</option>
            <option value="amount_desc">Montant (Plus élevé)</option>
            <option value="amount_asc">Montant (Plus bas)</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 border rounded-lg font-medium text-sm whitespace-nowrap">
            <ArrowRightLeft size={16} />
            <span>Internal Transfer</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 border rounded-lg font-medium text-sm whitespace-nowrap">
            <Plus size={16} />
            <span>Adjustment / Movement</span>
          </button>
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 border rounded-lg font-medium text-sm whitespace-nowrap"
          >
            <Settings size={16} />
            <span>Manage Accounts</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 border rounded-lg font-medium text-sm whitespace-nowrap">
            <FileText size={16} />
            <span>History</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-100">
          {[...digitalTransactions].filter(t => {
            if (typeFilter === 'all') return true;
            if (typeFilter === 'sale') return t.type === 'sale' || t.type === 'other_revenue';
            return t.type === typeFilter;
          }).sort((a, b) => {
            switch (sortOption) {
              case 'date_asc': return new Date(a.date) - new Date(b.date);
              case 'amount_desc': return parseFloat(b.amount || 0) - parseFloat(a.amount || 0);
              case 'amount_asc': return parseFloat(a.amount || 0) - parseFloat(b.amount || 0);
              case 'date_desc': default: return new Date(b.date) - new Date(a.date);
            }
          }).slice(0, 10).map(t => (
            <div key={t.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${t.type === 'sale' || t.type === 'other_revenue' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {t.type === 'sale' || t.type === 'other_revenue' ? <ArrowDown size={20} /> : <ArrowUp size={20} />}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{t.item_name || t.notes || 'Transaction'}</h4>
                  <div className="flex items-center text-xs text-gray-500 mt-1 space-x-2">
                    <span>{new Date(t.date).toLocaleDateString()} {new Date(t.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    <span>•</span>
                    <span className="bg-gray-100 px-2 py-0.5 rounded capitalize">{t.type}</span>
                    {t.bank_account_id && (
                      <>
                        <span>•</span>
                        <span className="flex items-center"><Wallet size={12} className="mr-1"/> {bankAccounts.find(b => b.id === t.bank_account_id)?.name || 'Compte Inconnu'}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className={`text-lg font-bold ${t.type === 'sale' || t.type === 'other_revenue' ? 'text-green-600' : 'text-red-600'}`}>
                {t.type === 'sale' || t.type === 'other_revenue' ? '+' : '-'}{formatCurrency(t.amount)}
              </div>
            </div>
          ))}
          {digitalTransactions.length === 0 && (
             <div className="p-8 text-center text-gray-500">
               Aucune transaction digitale pour le moment.
             </div>
          )}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md animate-fade-in-up">
            <h4 className="text-lg font-bold mb-4 text-gray-800">Ajouter un Compte</h4>
            <form onSubmit={handleAddAccount} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom du Compte</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 border p-2"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Attijari, PayPal, Caisse Especes..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 border p-2"
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="bank">Banque (Virement, Carte)</option>
                  <option value="cash">Caisse (Espèces)</option>
                  <option value="mobile">Mobile Money (WafaCash, Orange...)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Solde Initial (MAD)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 border p-2"
                  value={formData.initialBalance}
                  onChange={e => setFormData({ ...formData, initialBalance: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50 font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 font-medium"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export const DigitalTransactionsManager = ({ digitalTransactions, supabase, bankAccounts, digitalInventory, subscriptions, digitalSuppliers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [itemSearch, setItemSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('allTypes');
  const [statusFilter, setStatusFilter] = useState('allStatuses');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortOrder, setSortOrder] = useState('Date (newest)');
  const [selectedIds, setSelectedIds] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    type: 'sale',
    amount: '',
    date: new Date().toLocaleString('sv').replace(' ', 'T').slice(0, 16),
    item_name: '',
    notes: '',
    bank_account_id: '',
    status: 'completed',
    customer_name: '',
    customer_phone: '',
    product_id: '',
    duration_months: 1,
    credits_to_deduct: 1,
    supplier_id: '',
    quantity: 1,
    unit_price: 0,
    new_product_name: '',
    new_product_buy_price: 0,
    new_product_sell_price: 0,
    new_product_category: '',
    new_supplier_name: '',
    new_supplier_phone: ''
  });

  const calculateEndDate = (startDateStr, months) => {
    const d = new Date(startDateStr);
    d.setMonth(d.getMonth() + parseInt(months));
    return d.toISOString().split('T')[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let finalProductId = formData.product_id;
      let finalSupplierId = formData.supplier_id;

      if (formData.type === 'purchase' && formData.supplier_id === 'NEW_SUPPLIER') {
        const { data: newSuppData, error: suppErr } = await supabase.from('digital_suppliers').insert([{
          name: formData.new_supplier_name,
          phone: formData.new_supplier_phone
        }]).select();
        if (suppErr) throw suppErr;
        if (newSuppData && newSuppData[0]) finalSupplierId = newSuppData[0].id;
      }

      if ((formData.type === 'sale' || formData.type === 'purchase') && formData.product_id === 'NEW_PRODUCT') {
        const productBuyPrice = formData.type === 'purchase' ? parseFloat(formData.unit_price) : parseFloat(formData.new_product_buy_price);
        const { data: newProdData, error: prodErr } = await supabase.from('digital_inventory').insert([{
          name: formData.new_product_name,
          category: formData.new_product_category || '',
          buy_price: productBuyPrice || 0,
          sell_price: parseFloat(formData.new_product_sell_price) || 0,
          quantity: 0
        }]).select();
        if (prodErr) throw prodErr;
        if (newProdData && newProdData[0]) {
          finalProductId = newProdData[0].id;
          digitalInventory.push(newProdData[0]);
        }
      }

      if (formData.type === 'sale' && !formData.id) {
        const product = digitalInventory.find(i => i.id === finalProductId);
        const creditsToDeduct = parseFloat(formData.credits_to_deduct) || parseFloat(formData.duration_months) || 1;
        
        if (product && (product.quantity || 0) < creditsToDeduct) {
          alert(`Stock insuffisant ! Le produit a ${product.quantity || 0} crédits, mais vous essayez d'en déduire ${creditsToDeduct}.`);
          return;
        }

        const end_date = calculateEndDate(formData.date, formData.duration_months);
        const notesSuffix = creditsToDeduct !== parseFloat(formData.duration_months) ? ` [CRD:${creditsToDeduct}]` : '';

        const dbSub = {
          customer_name: formData.customer_name,
          customer_phone: formData.customer_phone,
          product_id: finalProductId,
          product_name: product ? product.name : 'Unknown',
          duration_months: parseFloat(formData.duration_months),
          start_date: formData.date,
          end_date: end_date,
          amount_paid: parseFloat(formData.amount),
          status: 'active',
          notes: (formData.notes || '') + notesSuffix
        };

        const { data: insertedSub, error: subErr } = await supabase.from('subscriptions').insert([dbSub]).select();
        if (subErr) throw subErr;

        if (insertedSub && insertedSub[0]) {
          const digTx = {
            date: formData.date,
            type: 'sale',
            item_name: formData.item_name || `Abo: ${product ? product.name : 'Unknown'} - ${formData.customer_name}`,
            amount: parseFloat(formData.amount),
            bank_account_id: formData.bank_account_id || null,
            subscription_id: insertedSub[0].id,
            digital_product_id: finalProductId || null,
            status: 'completed',
            notes: formData.notes || 'Abonnement Digital'
          };
          const { error: digTxErr } = await supabase.from('digital_transactions').insert([digTx]);
          if (digTxErr) throw digTxErr;

          if (finalProductId && product) {
            const newQty = (product.quantity || 0) - creditsToDeduct;
            await supabase.from('digital_inventory').update({ quantity: newQty }).eq('id', product.id);
          }
        }
      } else if (formData.type === 'purchase' && !formData.id) {
        const product = digitalInventory.find(p => p.id === finalProductId);
        if (!product) return alert('Produit invalide');
        
        const totalAmount = formData.total_price !== undefined ? parseFloat(formData.total_price) : (parseFloat(formData.unit_price) * parseFloat(formData.quantity));
        const transactions = [];
        const tx = {
          date: formData.date,
          type: 'purchase',
          item_name: formData.item_name || `Achat stock: ${formData.quantity}x ${product.name}`,
          amount: totalAmount,
          bank_account_id: null,
          digital_supplier_id: finalSupplierId || null,
          digital_product_id: finalProductId,
          status: 'completed',
          notes: formData.notes || 'Réapprovisionnement'
        };
        transactions.push(tx);

        const paidAmount = parseFloat(formData.amount_paid || 0);
        if (paidAmount > 0 && formData.bank_account_id) {
          transactions.push({
            date: formData.date,
            type: 'supplier_payment',
            item_name: `Paiement Fournisseur (Réapprovisionnement: ${product.name})`,
            amount: paidAmount,
            bank_account_id: formData.bank_account_id,
            digital_supplier_id: finalSupplierId || null,
            digital_product_id: finalProductId,
            status: 'completed',
            notes: `Paiement direct d'Achat de stock`
          });
        }

        const { error: txErr } = await supabase.from('digital_transactions').insert(transactions);
        if (txErr) throw txErr;

        const newQuantity = (product.quantity || 0) + parseFloat(formData.quantity);
        const { error: invErr } = await supabase.from('digital_inventory').update({ quantity: newQuantity }).eq('id', finalProductId);
        if (invErr) throw invErr;

      } else {
        const txData = {
          type: formData.type === 'other_revenue' ? 'sale' : formData.type,
          amount: parseFloat(formData.amount),
          date: formData.date,
          item_name: formData.item_name,
          notes: formData.notes,
          bank_account_id: formData.bank_account_id || null,
          status: formData.status
        };
        if (formData.id) {
          const { error: updateErr } = await supabase.from('digital_transactions').update(txData).eq('id', formData.id);
          if (updateErr) throw updateErr;

          // If this transaction is linked to a subscription, update the subscription's status and amount_paid
          const originalTx = digitalTransactions.find(t => t.id === formData.id);
          if (originalTx && originalTx.subscription_id) {
            const subData = { 
              status: formData.status,
              amount_paid: parseFloat(formData.amount)
            };
            await supabase.from('subscriptions').update(subData).eq('id', originalTx.subscription_id);
          }
        } else {
          const { error: insertErr } = await supabase.from('digital_transactions').insert([txData]);
          if (insertErr) throw insertErr;
        }
      }

      setShowForm(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la sauvegarde: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette transaction ? (Ceci affectera vos soldes et calculs)')) {
      const tx = digitalTransactions.find(t => t.id === id);
      const { error } = await supabase.from('digital_transactions').delete().eq('id', id);
      if (error) {
        console.error(error);
        alert('Erreur lors de la suppression');
      } else {
        if (tx && tx.subscription_id) {
          await supabase.from('subscriptions').delete().eq('id', tx.subscription_id);
        }
      }
    }
  };

  const filteredTransactions = digitalTransactions.filter(t => {
    const searchTarget = `${t.item_name || ''} ${t.notes || ''}`.toLowerCase();
    const matchesSearch = searchTerm === '' || searchTarget.includes(searchTerm.toLowerCase());
    const matchesItem = itemSearch === '' || (t.item_name && t.item_name.toLowerCase().includes(itemSearch.toLowerCase()));
    
    if (!matchesSearch || !matchesItem) return false;
      if (typeFilter !== 'allTypes') {
        if (typeFilter === 'expense' && !['expense', 'supplier_payment', 'purchase'].includes(t.type)) return false;
        if (typeFilter === 'sale' && !['sale', 'other_revenue'].includes(t.type)) return false;
        if (typeFilter !== 'expense' && typeFilter !== 'sale' && t.type !== typeFilter) return false;
      }
    if (statusFilter !== 'allStatuses' && t.status !== statusFilter) return false;
    
    if (dateFrom && new Date(t.date) < new Date(dateFrom)) return false;
    if (dateTo && new Date(t.date) > new Date(dateTo)) return false;
    
    return true;
  }).sort((a, b) => {
    if (sortOrder === 'Date (newest)') return new Date(b.date) - new Date(a.date);
    if (sortOrder === 'Date (oldest)') return new Date(a.date) - new Date(b.date);
    if (sortOrder === 'Amount (highest)') return parseFloat(b.amount) - parseFloat(a.amount);
    if (sortOrder === 'Amount (lowest)') return parseFloat(a.amount) - parseFloat(b.amount);
    return 0;
  });

  const targetTransactions = selectedIds.length > 0 ? filteredTransactions.filter(t => selectedIds.includes(t.id)) : filteredTransactions;

  const totalIncome = targetTransactions.filter(t => t.type === 'sale' || t.type === 'other_revenue').reduce((acc, t) => acc + parseFloat(t.amount || 0), 0);
  const totalExpenses = targetTransactions.filter(t => t.type === 'purchase' || t.type === 'expense').reduce((acc, t) => acc + parseFloat(t.amount || 0), 0);
  const netProfit = totalIncome - totalExpenses;

  let netProfitCredits = 0;
  targetTransactions.forEach(t => {
     if (t.type === 'sale' || t.type === 'other_revenue') {
         if (t.subscription_id) {
             const sub = subscriptions?.find(s => s.id === t.subscription_id);
             const prod = digitalInventory?.find(p => p.id === (sub?.product_id || t.digital_product_id));
               const creditsUsed = sub?.notes && sub.notes.match(/\[CRD:(\d+)\]/) 
                   ? parseInt(sub.notes.match(/\[CRD:(\d+)\]/)[1]) 
                   : parseFloat(sub?.duration_months);
               const cost = (parseFloat(prod?.buy_price || 0)) * creditsUsed;
             netProfitCredits += (parseFloat(t.amount || 0) - cost);
         } else {
             const prod = digitalInventory?.find(p => p.id === t.digital_product_id);
             const cost = (parseFloat(prod?.buy_price || 0)) * (parseFloat(t.quantity || 1));
             netProfitCredits += (parseFloat(t.amount || 0) - cost);
         }
     } else if (t.type === 'expense' || t.type === 'purchase') {
         netProfitCredits -= parseFloat(t.amount || 0);
     }
  });

  const exportToExcel = () => {
    const dataToExport = filteredTransactions.map(t => ({
      Date: new Date(t.date).toLocaleDateString(),
      Type: t.type,
      Status: t.status || 'completed',
      Description: t.item_name || t.notes || '',
      Amount: parseFloat(t.amount || 0)
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DigitalTransactions");
    XLSX.writeFile(workbook, `Digital_Transactions_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 flex-shrink-0 mr-4">Transactions</h2>
        
        <div className="flex-1 overflow-x-auto pb-2 md:pb-0">
          <div className="flex flex-col gap-3 min-w-max">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium mr-1 text-gray-500">Filter:</span>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="border rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none" />
              <span>-</span>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="border rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none" />
              
              <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="border rounded-lg px-3 py-1.5 bg-white focus:ring-2 focus:ring-blue-500 outline-none ml-2">
                <option value="allTypes">allTypes</option>
                <option value="sale">Ventes (Entrées)</option>
                <option value="expense">Dépenses (Sorties)</option>
                <option value="purchase">Achats</option>
              </select>
              
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border rounded-lg px-3 py-1.5 bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="allStatuses">allStatuses</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
              
              <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="border rounded-lg px-3 py-1.5 bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="Date (newest)">Date (newest)</option>
                <option value="Date (oldest)">Date (oldest)</option>
                <option value="Amount (highest)">Amount (highest)</option>
                <option value="Amount (lowest)">Amount (lowest)</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <input type="text" placeholder="Client/Supplier/Pa..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="border rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none w-40 text-sm" />
              <input type="text" placeholder="Item" value={itemSearch} onChange={e => setItemSearch(e.target.value)} className="border rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none w-32 text-sm" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 ml-4 flex-shrink-0">
          <button onClick={exportToExcel} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center font-medium shadow-sm transition-colors text-sm">
            <Download size={16} className="mr-2" /> Export Excel
          </button>
          <button onClick={() => {
            setFormData({ id: null, type: 'expense', amount: '', date: new Date().toLocaleString('sv').replace(' ', 'T').slice(0, 16), item_name: '', notes: '', bank_account_id: '', customer_name: '', customer_phone: '', product_id: '', duration_months: 1, credits_to_deduct: 1, supplier_id: '', quantity: 1, unit_price: 0, new_product_name: '', new_product_buy_price: 0, new_product_sell_price: 0, new_supplier_name: '', new_supplier_phone: '', status: 'completed' });
            setShowForm(true);
          }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center font-medium shadow-sm transition-colors text-sm">
            <Plus size={16} className="mr-2" /> New Transaction
          </button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 shadow-sm">
        <h3 className="text-blue-800 font-medium mb-3">Selected Summary ({targetTransactions.length} items)</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">TOTAL INCOME</p>
            <p className="text-xl font-bold text-green-600">MAD {totalIncome.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">TOTAL EXPENSES</p>
            <p className="text-xl font-bold text-red-600">MAD {totalExpenses.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">NET PROFIT</p>
            <p className={`text-xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>MAD {netProfit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
            <p className="text-[10px] text-gray-400 mt-1">(Income - COGS - OpEx)</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Bénéfice Net (Crédits)</p>
            <p className={`text-xl font-bold ${netProfitCredits >= 0 ? 'text-green-600' : 'text-red-600'}`}>MAD {netProfitCredits.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
            <p className="text-[10px] text-gray-400 mt-1">(Income - Credit Cost)</p>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-800">{formData.id ? 'Modifier la Transaction' : 'Nouvelle Opération Universelle'}</h3>
            <p className="text-sm text-purple-600 bg-purple-50 p-2 rounded mt-2">
              <strong>Info :</strong> Depuis ce formulaire, vous pouvez créer directement des Abonnements, des achats de stocks, ou de simples transactions de dépenses/revenus.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type d'opération</label>
                <select required className="w-full border p-2 rounded-lg bg-white" value={formData.type} onChange={e=>setFormData({...formData, type:e.target.value})} disabled={!!formData.id}>
                  <option value="sale">Vente (Abonnement)</option>
                  <option value="purchase">Achat de Stock (Fournisseur)</option>
                  <option value="expense">Autre Dépense (Sortie)</option>
                  <option value="other_revenue">Autre Revenu (Entrée)</option>
                </select>
              </div>

              {formData.type === 'sale' && !formData.id && (
                <>
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
                      {digitalInventory.map(p => <option key={p.id} value={p.id}>{p.name} (Stock: {p.quantity||0})</option>)}
                      <option value="NEW_PRODUCT" className="font-bold text-purple-600">➕ Ajouter un nouveau produit...</option>
                    </select>
                  </div>
                  {formData.product_id === 'NEW_PRODUCT' && (
                    <div className="md:col-span-2 lg:col-span-3 bg-purple-50 p-4 rounded-lg border border-purple-100 mb-2">
                      <h4 className="font-semibold text-purple-800 mb-2">Détails du nouveau produit</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="lg:col-span-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit</label>
                          <input required type="text" className="w-full border p-2 rounded-lg" value={formData.new_product_name} onChange={e=>setFormData({...formData, new_product_name: e.target.value})} placeholder="Ex: Abonnement..." />
                        </div>
                        <div className="lg:col-span-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                          <input type="text" className="w-full border p-2 rounded-lg" value={formData.new_product_category} onChange={e=>setFormData({...formData, new_product_category: e.target.value})} placeholder="Ex: Streaming..." />
                        </div>
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Durée (Mois)</label>
                    <input type="number" step="any" min="0" className="w-full border-gray-300 rounded-lg p-2 border focus:ring-2 focus:ring-purple-500" value={formData.duration_months} onChange={e => {
                      const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                      setFormData({...formData, duration_months: val, credits_to_deduct: val});
                    }} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Crédits à déduire</label>
                    <input required type="number" step="any" min="0" className="w-full border-gray-300 rounded-lg p-2 border focus:ring-2 focus:ring-purple-500" value={formData.credits_to_deduct} onChange={e => setFormData({...formData, credits_to_deduct: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Montant Payé (MAD)</label>
                    <input required type="number" step="0.01" className="w-full border p-2 rounded-lg" value={formData.amount} onChange={e=>setFormData({...formData, amount:e.target.value})} />
                  </div>
                  <div className="lg:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Login / Lien m3u / Notes (Abonnement)</label>
                    <textarea className="w-full border-gray-300 rounded-lg p-2 border focus:ring-2 focus:ring-purple-500" rows="2" placeholder="Informations de connexion, lien m3u, etc." value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}></textarea>
                  </div>
                </>
              )}

              {formData.type === 'purchase' && !formData.id && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fournisseur (Optionnel)</label>
                    <select className="w-full border p-2 rounded-lg" value={formData.supplier_id} onChange={e=>setFormData({...formData, supplier_id:e.target.value})}>
                      <option value="">Aucun fournisseur</option>
                      {digitalSuppliers && digitalSuppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      <option value="NEW_SUPPLIER" className="font-bold text-blue-600">➕ Ajouter un nouveau fournisseur...</option>
                    </select>
                  </div>
                  {formData.supplier_id === 'NEW_SUPPLIER' && (
                    <div className="md:col-span-2 lg:col-span-3 bg-blue-50 p-4 rounded-lg border border-blue-100 mb-2">
                      <h4 className="font-semibold text-blue-800 mb-2">Nouveau Fournisseur</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nom du fournisseur</label>
                          <input required type="text" className="w-full border p-2 rounded-lg" value={formData.new_supplier_name} onChange={e=>setFormData({...formData, new_supplier_name: e.target.value})} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                          <input type="text" className="w-full border p-2 rounded-lg" value={formData.new_supplier_phone} onChange={e=>setFormData({...formData, new_supplier_phone: e.target.value})} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Produit Digital</label>
                    <select required className="w-full border p-2 rounded-lg" value={formData.product_id} onChange={e=>{
                      const pid = e.target.value;
                      const prod = digitalInventory?.find(p => p.id === pid);
                      const up = prod ? prod.buy_price || 0 : 0;
                      const q = formData.quantity || 1;
                      const tp = (parseFloat(up) * parseFloat(q)).toFixed(2);
                      setFormData({ ...formData, product_id: pid, unit_price: up, total_price: tp, amount_paid: tp });
                    }}>
                      <option value="">Sélectionner un produit</option>
                      {digitalInventory && digitalInventory.map(p => <option key={p.id} value={p.id}>{p.name} (Stock actuel: {p.quantity||0})</option>)}
                      <option value="NEW_PRODUCT" className="font-bold text-purple-600">➕ Ajouter un nouveau produit...</option>
                    </select>
                  </div>
                  {formData.product_id === 'NEW_PRODUCT' && (
                    <div className="md:col-span-2 lg:col-span-3 bg-purple-50 p-4 rounded-lg border border-purple-100 mb-2">
                      <h4 className="font-semibold text-purple-800 mb-2">Détails du nouveau produit</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit</label>
                          <input required type="text" className="w-full border p-2 rounded-lg" value={formData.new_product_name} onChange={e=>setFormData({...formData, new_product_name: e.target.value})} placeholder="Ex: Abonnement..." />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                          <input type="text" className="w-full border p-2 rounded-lg" value={formData.new_product_category} onChange={e=>setFormData({...formData, new_product_category: e.target.value})} placeholder="Ex: Streaming..." />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Prix d'achat standard</label>
                          <input type="number" step="0.01" className="w-full border p-2 rounded-lg" value={formData.new_product_buy_price} onChange={e=>setFormData({...formData, new_product_buy_price: e.target.value})} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Prix de vente standard</label>
                          <input type="number" step="0.01" className="w-full border p-2 rounded-lg" value={formData.new_product_sell_price} onChange={e=>setFormData({...formData, new_product_sell_price: e.target.value})} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantité à ajouter</label>
                    <input required type="number" step="any" min="0" className="w-full border p-2 rounded-lg" value={formData.quantity} onChange={e=>{
                      const q = e.target.value;
                      const up = formData.unit_price || 0;
                      const tp = q ? (parseFloat(up) * parseFloat(q)).toFixed(2) : formData.total_price;
                      setFormData({...formData, quantity: q, total_price: tp, amount_paid: tp});
                    }} />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4 mb-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prix Unitaire (MAD)</label>
                      <input required type="number" step="0.01" className="w-full border p-2 rounded-lg" value={formData.unit_price} onChange={e=>{
                        const up = e.target.value;
                        const q = formData.quantity || 1;
                        const tp = up ? (parseFloat(up) * parseFloat(q)).toFixed(2) : '';
                        setFormData({...formData, unit_price: up, total_price: tp, amount_paid: tp});
                      }} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prix Général (Total MAD)</label>
                      <input required type="number" step="0.01" className="w-full border p-2 rounded-lg" value={formData.total_price !== undefined ? formData.total_price : (parseFloat(formData.unit_price || 0) * parseFloat(formData.quantity || 0))} onChange={e=>{
                        const tp = e.target.value;
                        const q = formData.quantity || 1;
                        setFormData({...formData, total_price: tp, unit_price: tp ? (parseFloat(tp) / parseFloat(q)).toFixed(2) : '', amount_paid: tp});
                      }} />
                    </div>
                  </div>
                </>
              )}

              {((formData.type === 'expense' || formData.type === 'other_revenue') || formData.id) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Montant (MAD)</label>
                  <input required type="number" step="0.01" className="w-full border p-2 rounded-lg" value={formData.amount} onChange={e=>setFormData({...formData, amount:e.target.value})} disabled={!!formData.id && (formData.type === 'sale' || formData.type === 'purchase')} />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date et Heure</label>
                <input required type="datetime-local" className="w-full border p-2 rounded-lg" value={formData.date} onChange={e=>setFormData({...formData, date:e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Compte Bancaire / Caisse</label>
                <select required={formData.type !== 'purchase'} className="w-full border p-2 rounded-lg bg-white" value={formData.bank_account_id} onChange={e=>{
                  const val = e.target.value;
                  if (formData.type === 'purchase') {
                    setFormData({...formData, bank_account_id: val, amount_paid: val ? formData.total_price : 0});
                  } else {
                    setFormData({...formData, bank_account_id: val});
                  }
                }}>
                  <option value="">{formData.type === 'purchase' ? 'À crédit (Aucun paiement immédiat)' : 'Sélectionner un compte'}</option>
                  {bankAccounts && bankAccounts.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
              {formData.type === 'purchase' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Montant Payé (MAD)</label>
                  <input type="number" step="0.01" className="w-full border p-2 rounded-lg bg-gray-50" disabled={!formData.bank_account_id} value={formData.amount_paid} onChange={e=>setFormData({...formData, amount_paid:e.target.value})} />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select required className="w-full border p-2 rounded-lg bg-white" value={formData.status} onChange={e=>setFormData({...formData, status:e.target.value})}>
                  <option value="completed">Complété</option>
                  <option value="pending">En attente</option>
                  <option value="canceled">Annulé</option>
                </select>
              </div>
              <div className="lg:col-span-3">
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
              <th className="px-6 py-4 font-semibold w-12">
                <input 
                  type="checkbox" 
                  checked={selectedIds.length === filteredTransactions.length && filteredTransactions.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) setSelectedIds(filteredTransactions.map(t => t.id));
                    else setSelectedIds([]);
                  }}
                  className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4 cursor-pointer"
                />
              </th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Type & Statut</th>
              <th className="px-6 py-4 font-semibold">Description</th>
              <th className="px-6 py-4 font-semibold">Compte</th>
              <th className="px-6 py-4 font-semibold text-right">Montant</th>
              <th className="px-6 py-4 font-semibold text-right">Bénéfice Net</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredTransactions.map(t => {
              const account = bankAccounts?.find(b => b.id === t.bank_account_id);
              return (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(t.id)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedIds([...selectedIds, t.id]);
                        else setSelectedIds(selectedIds.filter(id => id !== t.id));
                      }}
                      className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4 cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>{new Date(t.date).toLocaleDateString()}</div>
                    <div className="text-[10px] text-gray-400">{new Date(t.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 items-start">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${t.type === 'sale' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {t.type}
                      </span>
                      {t.status === 'pending' && <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded border border-yellow-200">En attente</span>}
                      {t.status === 'canceled' && <span className="text-[10px] bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded border border-gray-200">Annulé</span>}
                      {t.status === 'completed' && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200">Complété</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {(() => {
                      let creditsUsed = 0;
                      let buyPricePerCredit = 0;
                      let sellPricePerCredit = 0;
                      let isProductSale = false;

                      if (t.type === 'sale' || t.type === 'other_revenue') {
                          if (t.subscription_id) {
                              const sub = subscriptions?.find(s => s.id === t.subscription_id);
                              const prod = digitalInventory?.find(p => p.id === (sub?.product_id || t.digital_product_id));
                              if (prod) {
                                  isProductSale = true;
                                  creditsUsed = sub?.notes && sub.notes.match(/\[CRD:(\d+)\]/) 
                                      ? parseInt(sub.notes.match(/\[CRD:(\d+)\]/)[1]) 
                                      : parseFloat(sub?.duration_months);
                                  buyPricePerCredit = parseFloat(prod?.buy_price || 0);
                                  sellPricePerCredit = parseFloat(t.amount || 0) / creditsUsed;
                              }
                          } else if (t.digital_product_id) {
                              const prod = digitalInventory?.find(p => p.id === t.digital_product_id);
                              if (prod) {
                                  isProductSale = true;
                                  creditsUsed = parseFloat(t.quantity || 1);
                                  buyPricePerCredit = parseFloat(prod?.buy_price || 0);
                                  sellPricePerCredit = parseFloat(t.amount || 0) / creditsUsed;
                              }
                          }
                      }

                      return (
                        <>
                          <div className="font-medium text-gray-900">{t.item_name || t.notes}</div>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {t.subscription_id && <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100">Abo: {subscriptions?.find(s=>s.id === t.subscription_id)?.customer_name || 'Lié'}</span>}
                            {t.digital_supplier_id && <span className="text-[10px] bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded border border-purple-100">Fourn: {digitalSuppliers?.find(ds=>ds.id === t.digital_supplier_id)?.name || 'Lié'}</span>}
                            {t.digital_product_id && <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded border border-indigo-100">Prod: {digitalInventory?.find(di=>di.id === t.digital_product_id)?.name || 'Lié'}</span>}
                          </div>
                          {isProductSale && creditsUsed > 0 && (
                            <div className="mt-1.5 flex flex-wrap gap-2 text-[10px] text-gray-600 bg-gray-50 px-2 py-1 rounded w-fit border border-gray-100">
                              <span className="flex items-center gap-1 font-medium"><span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span> {creditsUsed} Crédits</span>
                              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-400"></span> Achat: {buyPricePerCredit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} MAD/cr</span>
                              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> Vente: {sellPricePerCredit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} MAD/cr</span>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 font-medium">
                      {account ? account.name : 'Non spécifié'}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-mono font-bold ${t.type === 'sale' ? 'text-green-600' : 'text-red-500'}`}>
                    {t.type === 'sale' ? '+' : '-'}{parseFloat(t.amount).toLocaleString()} MAD
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-bold">
                    {(() => {
                      let rowProfit = 0;
                      if (t.type === 'sale' || t.type === 'other_revenue') {
                          if (t.subscription_id) {
                              const sub = subscriptions?.find(s => s.id === t.subscription_id);
                              const prod = digitalInventory?.find(p => p.id === (sub?.product_id || t.digital_product_id));
                              const creditsUsed = sub?.notes && sub.notes.match(/\[CRD:(\d+)\]/) 
                                  ? parseInt(sub.notes.match(/\[CRD:(\d+)\]/)[1]) 
                                  : parseFloat(sub?.duration_months);
                              const cost = (parseFloat(prod?.buy_price || 0)) * creditsUsed;
                              rowProfit = (parseFloat(t.amount || 0) - cost);
                          } else {
                              const prod = digitalInventory?.find(p => p.id === t.digital_product_id);
                              const cost = (parseFloat(prod?.buy_price || 0)) * (parseFloat(t.quantity || 1));
                              rowProfit = (parseFloat(t.amount || 0) - cost);
                          }
                      } else if (t.type === 'expense' || t.type === 'purchase') {
                          rowProfit = -parseFloat(t.amount || 0);
                      }
                      return (
                        <span className={rowProfit >= 0 ? 'text-green-600' : 'text-red-500'}>
                          {rowProfit > 0 ? '+' : ''}{rowProfit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} MAD
                        </span>
                      );
                    })()}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => { setFormData(t); setShowForm(true); }} className="text-blue-500 hover:text-blue-700" title="Modifier"><Edit size={16}/></button>
                    <button onClick={() => handleDelete(t.id)} className="text-red-500 hover:text-red-700" title="Supprimer"><Trash2 size={16}/></button>
                  </td>
                </tr>
              );
            })}
            {filteredTransactions.length === 0 && (
              <tr>
                <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
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
const DigitalSupplierHistoryModal = ({ isOpen, onClose, supplier, transactions, bankAccounts }) => {
  if (!isOpen || !supplier) return null;

  const supplierTx = transactions?.filter(t => 
    t.digital_supplier_id === supplier.id && 
    (t.type === 'purchase' || t.type === 'supplier_payment')
  ).sort((a, b) => new Date(b.date) - new Date(a.date)) || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 flex-shrink-0">
          <h3 className="text-lg font-bold text-gray-800 flex items-center"><History className="mr-2 text-indigo-600"/> Historique: {supplier.name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          {supplierTx.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Aucun historique trouvé pour ce fournisseur.</p>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 border-b text-gray-700">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Date</th>
                    <th className="px-4 py-3 font-semibold">Type</th>
                    <th className="px-4 py-3 font-semibold">Détails</th>
                    <th className="px-4 py-3 font-semibold">Compte / Caisse</th>
                    <th className="px-4 py-3 font-semibold text-right">Montant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {supplierTx.map(t => {
                    const isPayment = t.type === 'supplier_payment';
                    const bank = bankAccounts?.find(b => b.id === t.bank_account_id);
                    return (
                      <tr key={t.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div>{new Date(t.date).toLocaleDateString()}</div>
                          <div className="text-xs text-gray-400">{new Date(t.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${isPayment ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                            {isPayment ? 'Paiement' : 'Achat'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-800">{t.item_name || 'Transaction'}</p>
                          {t.notes && <p className="text-xs text-gray-500">{t.notes}</p>}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {bank ? bank.name : '-'}
                        </td>
                        <td className={`px-4 py-3 text-right font-bold font-mono ${isPayment ? 'text-green-600' : 'text-purple-600'}`}>
                          {isPayment ? '+' : '-'}{parseFloat(t.amount).toLocaleString('fr-FR')} MAD
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export const DigitalSuppliersManager = ({ digitalSuppliers, digitalTransactions, digitalInventory, bankAccounts, supabase, t }) => {
  const [showForm, setShowForm] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedHistorySupplier, setSelectedHistorySupplier] = useState(null);
  const [activeSupplierId, setActiveSupplierId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ id: null, name: '', contact: '', email: '', phone: '', notes: '' });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MAD' }).format(amount);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { id, ...payload } = formData;
      if (formData.id) {
        await supabase.from('digital_suppliers').update(payload).eq('id', formData.id);
      } else {
        await supabase.from('digital_suppliers').insert([payload]);
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
          <button onClick={() => setShowPaymentModal(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center shadow-sm">
            <CreditCard size={18} className="mr-2"/> Paiement
          </button>
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

      <PurchaseStockModal 
        isOpen={showPurchaseModal} 
        onClose={() => setShowPurchaseModal(false)}
        digitalInventory={digitalInventory}
        digitalSuppliers={digitalSuppliers}
        bankAccounts={bankAccounts}
        supabase={supabase}
        defaultSupplierId={activeSupplierId}
      />

      <DigitalPaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        digitalSuppliers={digitalSuppliers}
        bankAccounts={bankAccounts}
        digitalTransactions={digitalTransactions}
        supabase={supabase}
      />

      <DigitalSupplierHistoryModal
        isOpen={showHistoryModal}
        onClose={() => { setShowHistoryModal(false); setSelectedHistorySupplier(null); }}
        supplier={selectedHistorySupplier}
        transactions={digitalTransactions}
        bankAccounts={bankAccounts}
      />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
            <tr>
              <th className="px-6 py-4 font-semibold">Fournisseur (Panel)</th>
              <th className="px-6 py-4 font-semibold">Contact / Téléphone</th>
              <th className="px-6 py-4 font-semibold">Notes / Lien</th>
              <th className="px-6 py-4 font-semibold text-right">Achats Totaux (MAD)</th>
              <th className="px-6 py-4 font-semibold text-right">Total Payé (MAD)</th>
              <th className="px-6 py-4 font-semibold text-right">Reste (MAD)</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredSuppliers.map(item => {
              const totalPurchases = digitalTransactions
                ? digitalTransactions
                    .filter(t => t.type === 'purchase' && t.digital_supplier_id === item.id)
                    .reduce((acc, t) => acc + parseFloat(t.amount || 0), 0)
                : 0;
              const totalPaid = digitalTransactions
                ? digitalTransactions
                    .filter(t => t.type === 'supplier_payment' && t.digital_supplier_id === item.id)
                    .reduce((acc, t) => acc + parseFloat(t.amount || 0), 0)
                : 0;
              const balance = totalPurchases - totalPaid;

              return (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{item.name}<br/><span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-md mt-1 inline-block">{item.email || 'Aucun email'}</span></td>
                  <td className="px-6 py-4">{item.contact || 'N/A'}<br/><span className="text-xs text-gray-500">{item.phone}</span></td>
                  <td className="px-6 py-4 text-xs max-w-xs truncate">{item.notes}</td>
                  <td className="px-6 py-4 text-right font-mono text-purple-600 font-bold">{formatCurrency(totalPurchases)}</td>
                  <td className="px-6 py-4 text-right font-mono text-green-600 font-bold">{formatCurrency(totalPaid)}</td>
                  <td className="px-6 py-4 text-right font-mono text-red-600 font-bold">{formatCurrency(balance)}</td>
                  <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                    <button onClick={() => { setSelectedHistorySupplier(item); setShowHistoryModal(true); }} className="text-gray-400 hover:text-indigo-600 transition-colors" title="Historique"><History size={16}/></button>
                    <button onClick={() => { setActiveSupplierId(item.id); setShowPurchaseModal(true); }} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200" title="Nouvel Achat (Réapprovisionner)"><ArrowDown size={14} className="inline mr-1"/>Acheter</button>
                    <button onClick={() => { setFormData(item); setShowForm(true); }} className="text-blue-500 hover:text-blue-700"><Edit size={16}/></button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16}/></button>
                  </td>
                </tr>
              );
            })}
            {filteredSuppliers.length === 0 && (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
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
