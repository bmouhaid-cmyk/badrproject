import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://frfqzpwrvdxusdiigfrb.supabase.co';
const supabaseKey = 'sb_publishable_Ar-WyMQb9IvwpG6W3sMA6w_rPATLkLk';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.rpc('get_schema_info');
  // fallback if rpc not available
  if (error) {
    const res1 = await fetch(`${supabaseUrl}/rest/v1/digital_transactions?limit=1`, {
      headers: { 'apikey': supabaseKey }
    });
    console.log("digital_transactions columns:");
    const d1 = await res1.json();
    console.log(d1);
  }
}

check();
