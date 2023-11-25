import { createClient } from "@supabase/supabase-js";

const supabase_url = process.env.REACT_APP_SUPABASE_URL;
const service_role_key = process.env.REACT_APP_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabase_url, service_role_key, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
export default supabaseAdmin;
