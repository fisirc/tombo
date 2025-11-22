import { SignInData, SignUpData } from "@/types/";
import { supabase } from "./supabase";

export default class AuthService {
  static signIn = async (signInData: SignInData) => {
    const { data, error } = await supabase.auth.signInWithPassword(signInData);
    if (error) throw error;
    return data;
  }

  static signUp = async (signUpData: SignUpData) => {
    const { email, password, full_name } = signUpData;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name },
      },
    });
    if (error) throw error;
    return data;
  }

  static signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
}
