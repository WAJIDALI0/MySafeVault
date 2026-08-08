const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ikntoumeerjdsgvjdify.supabase.co',
  'sb_publishable_eUt6lWPlD5I_UqdFCmx6oQ_AXc3zyn1'
);

async function test() {
  for (let i = 0; i < 5; i++) {
    const { data, error } = await supabase.auth.resetPasswordForEmail('wajidali35200@gmail.com', {
      redirectTo: `http://localhost:3000/api/auth/callback?next=/reset-password`,
    });
    console.log(`ATTEMPT ${i+1} ERROR:`, error ? error.message : null);
  }
}

test();
