import { getAnonSupabaseClient } from "src/config/supabase";
import { AppError } from "src/common/app.error";
import { Session, SupabaseClient, User } from "@supabase/supabase-js";
import { Database } from "src/config/database.types";

export type SignupRequest = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
};

export type SupabaseSignupRequest = {
  email: string;
  password: string;
  options: {
    data: {
      first_name: string;
      last_name: string;
    };
  };
};

export type SigninRequest = {
  email: string;
  password: string;
};

export type SupabaseSigninRequest = {
  email: string;
  password: string;
};

export const signup = async (
  signupRequest: SupabaseSignupRequest,
): Promise<{ user: User | null; session: Session | null }> => {
  const supabase = getAnonSupabaseClient();

  const { data, error } = await supabase.auth.signUp(signupRequest);

  if (error) {
    throw new AppError(error.message, 400, "SIGNUP_ERROR", error.message);
  }

  return data;
};

export const signin = async (
  signinRequest: SupabaseSigninRequest,
): Promise<{ user: User | null; session: Session | null }> => {
  const supabase = getAnonSupabaseClient();

  const { data, error } = await supabase.auth.signInWithPassword(signinRequest);

  if (error) {
    throw new AppError(error.message, 400, "SIGNIN_ERROR", error.message);
  }

  return data;
};

export const me = async (
  supabase: SupabaseClient<Database>,
  jwt: string,
): Promise<User | null> => {
  const { data, error } = await supabase.auth.getUser(jwt);

  const { user } = data;

  if (error) {
    throw new AppError(error.message, 400, "ME_ERROR", error.message);
  }

  return data.user;
};

export default {
  signup,
  signin,
  me,
};
