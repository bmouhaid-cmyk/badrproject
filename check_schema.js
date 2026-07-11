import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://frfqzpwrvdxusdiigfrb.supabase.co';
const supabaseKey = 'sb_publishable_Ar-WyMQb9IvwpG6W3sMA6w_rPATLkLk';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('digital_transactions').select('*').limit(1);
  if (error) {
    console.error('Error fetching digital_transactions:', error);
  } else {
    console.log('Digital transactions fetched successfully.');
    if (data.length > 0) {
      console.log('Keys:', Object.keys(data[0]));
    } else {
      console.log('No data yet, cannot verify columns directly from empty row without rpc.');
      // Attempt an insert with bank_account_id to see if it errors
      const testInsert = await supabase.from('digital_transactions').insert([{ 
        bank_account_id: '00000000-0000-0000-0000-000000000000',
        type: 'sale',
        amount: 0,
        date: new Date().toISOString(),
        status: 'completed'
      }]);
      console.log('Test insert result:', testInsert.error?.message || 'Success (or partial fail but column exists)');
    }
  }
}

check();
