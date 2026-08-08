const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'undefined',
  'undefined'
);

async function test() {
  try {
    const res = await supabase.auth.resetPasswordForEmail('test@example.com');
    console.log(res);
  } catch (err) {
    console.log(err);
  }
}
test();
