import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://frfqzpwrvdxusdiigfrb.supabase.co';
const supabaseKey = 'sb_publishable_Ar-WyMQb9IvwpG6W3sMA6w_rPATLkLk';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const digTx = {
    date: new Date().toISOString(),
    type: 'sale',
    item_name: `Abo Test`,
    amount: 100,
    bank_account_id: null,
    notes: 'Abonnement Digital'
  };
  const { data, error } = await supabase.from('digital_transactions').insert([digTx]).select();
  console.log('Error:', error);
  console.log('Data:', data);
}

check();
