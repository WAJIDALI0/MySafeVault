require('dotenv').config({ path: '.env' });
console.log("URL:", JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_URL));
console.log("ANON:", JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY));
console.log("APP_URL:", JSON.stringify(process.env.NEXT_PUBLIC_APP_URL));
