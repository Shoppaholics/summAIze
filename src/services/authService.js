import { supabase } from "../lib/supabaseClient";

export const signIn = async (email, password) => {
  if (!email) {
    return { error: "Please enter email" };
  }

  if (!password) {
    return { error: "Please enter password" };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error(error);
    return { error: error.message };
  }

  return { success: "Sign-In successful" };
};

export const signUp = async (email, password) => {
  if (!email) {
    return { error: "Please enter email" };
  }

  if (!password) {
    return { error: "Please enter password" };
  }

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    console.error(error);
    return { error: error.message };
  }

  return { success: "Sign-Up successful" };
};

export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error(error);
    return { session: null, error: error.message };
  }

  return { session: data.session, error: null };
};
