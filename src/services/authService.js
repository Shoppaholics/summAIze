import { supabase } from "../lib/supabaseClientFrontend.js";

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
  const response = await supabase.auth.getSession();
  if (response.error) {
    console.error(response.error.stack);
    return { error: "Error getting user session details" };
  }

  const userId = response.data?.session?.user?.id;

  if (!userId) {
    return { error: "User ID not found" };
  }

  // Retrieve connected emails
  const { data, error } = await supabase
    .from("user_nylas")
    .select("user_id, email, provider")
    .eq("user_id", userId);

  if (error) {
    console.error(error.stack);
    return { error: "Error getting user connected emails" };
  }

  return {
    session: response.data?.session,
    connectedEmails: data,
    error: null,
  };
};
