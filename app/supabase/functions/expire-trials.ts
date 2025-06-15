// supabase/functions/expire-trials.ts

// import { serve } from "https://deno.land/std/http/server.ts";
// import { createClient } from "https://esm.sh/@supabase/supabase-js";

// serve(async () => {
//   const supabase = createClient(
//     Deno.env.get("SUPABASE_URL")!,
//     Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
//   );

//   const now = new Date().toISOString();

//   const { error } = await supabase
//     .from("users")
//     .update({ is_pro: false })
//     .lt("trial_ends_at", now);

//   return new Response(
//     error ? JSON.stringify(error) : JSON.stringify({ success: true }),
//     { status: error ? 500 : 200 }
//   );
// });
