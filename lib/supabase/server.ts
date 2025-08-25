import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Check if we have valid Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const isValidSupabaseConfig = supabaseUrl && supabaseKey && 
  !supabaseUrl.includes('your-project') && 
  !supabaseKey.includes('your_anon_key_here');

export function createSupabaseServerClient() {
  if (!isValidSupabaseConfig) {
    // Return mock client for development
    return {
      auth: {
        getUser: async () => {
          // Check for dev auth token in cookies
          const cookieStore = cookies();
          const devUser = cookieStore.get('dev_auth_user');
          if (devUser) {
            try {
              const user = JSON.parse(devUser.value);
              return { data: { user }, error: null };
            } catch (e) {
              return { data: { user: null }, error: null };
            }
          }
          return { data: { user: null }, error: null };
        }
      }
    };
  }

  const cookieStore = cookies();
  return createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
        set(name: string, value: string, options: any) { cookieStore.set({ name, value, ...options }); },
        remove(name: string, options: any) { cookieStore.set({ name, value: "", ...options }); },
      },
    }
  );
}
