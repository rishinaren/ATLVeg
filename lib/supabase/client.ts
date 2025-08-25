"use client";
import { createClient } from "@supabase/supabase-js";
import { devAuth } from "@/lib/auth/dev-auth";

// Check if we have valid Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const isValidSupabaseConfig = supabaseUrl && supabaseKey && 
  !supabaseUrl.includes('your-project') && 
  !supabaseKey.includes('your_anon_key_here');

// Create real Supabase client if config is valid, otherwise use dev auth
export const supabase = isValidSupabaseConfig 
  ? createClient(supabaseUrl!, supabaseKey!)
  : {
      auth: {
        signUp: devAuth.signUp.bind(devAuth),
        signInWithPassword: ({ email, password }: { email: string; password: string }) => 
          devAuth.signIn({ email, password }),
        signOut: devAuth.signOut.bind(devAuth),
        getUser: devAuth.getUser.bind(devAuth),
        getSession: devAuth.getSession.bind(devAuth),
        onAuthStateChange: (callback: any) => {
          // Simple implementation for dev mode
          return { data: { subscription: { unsubscribe: () => {} } } };
        }
      }
    };
