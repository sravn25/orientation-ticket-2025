import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { redirect, RedirectType } from "next/navigation";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [authenticating, setAuthenticating] = useState(true);

  const getUser = useCallback(async () => {
    setAuthenticating(true);
    const { data, error } = await supabase.auth.getUser();
    if (error) console.debug(error);
    setUser(data?.user ?? null);
    setAuthenticating(false);
  }, []);

  useEffect(() => {
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthenticating(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [getUser]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) throw error;
  };

  const signOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setLoading(false);
    if (error) throw error;
    redirect("/", RedirectType.replace);
  };

  return {
    user,
    signIn,
    signOut,
    loading,
    authenticating,
  };
}
