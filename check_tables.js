import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://frfqzpwrvdxusdiigfrb.supabase.co';
const supabaseKey = 'sb_publishable_Ar-WyMQb9IvwpG6W3sMA6w_rPATLkLk';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const [resInv, resSup, resSub] = await Promise.all([
    fetch(`${supabaseUrl}/rest/v1/digital_inventory?limit=1`, { headers: { 'apikey': supabaseKey } }),
    fetch(`${supabaseUrl}/rest/v1/digital_suppliers?limit=1`, { headers: { 'apikey': supabaseKey } }),
    fetch(`${supabaseUrl}/rest/v1/subscriptions?limit=1`, { headers: { 'apikey': supabaseKey } })
  ]);
  
  console.log("digital_inventory:", await resInv.json());
  console.log("digital_suppliers:", await resSup.json());
  console.log("subscriptions:", await resSub.json());
}

check();
