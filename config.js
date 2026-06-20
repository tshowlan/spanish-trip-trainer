/* Supabase connection. The publishable key is meant to be public (it only
   allows the locked-down RPC functions in supabase_setup.sql), so it's safe
   to ship in the client. */
const SUPABASE_URL = "https://ijrpogqxbcacvcasdzco.supabase.co";
const SUPABASE_KEY = "sb_publishable_Xtb9sY3qDBCYJVlRZ90G7Q_RWlst5ZS";
// VAPID public key for web push (public by design; private key lives only in the edge function secret)
const VAPID_PUBLIC = "BEYdbCF7Fr9aPAWN4qIuPxYYI7QYJZ_-zjBjtSt9XtQJmkkmk-1x68SjXmOiXlnozhLcs6BxgvbJxklUtGgywAQ";
