import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://frfqzpwrvdxusdiigfrb.supabase.co';
const supabaseKey = 'sb_publishable_Ar-WyMQb9IvwpG6W3sMA6w_rPATLkLk';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('digital_transactions').select('*');
  console.log(data);
}

check();
