import { AppError } from "src/common/app.error";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "src/config/database.types";

export type User = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  created_at: string;
  updated_at: string;
};

export const createUser = async (
  supabase: SupabaseClient<Database>,
  user: User,
): Promise<User> => {
  const { data, error } = await supabase.from("users").insert(user).single();

  if (error) {
    throw new AppError(
      error.message,
      400,
      "USER_CREATION_FAILED",
      "Failed to create user. Please check your input and try again.",
    );
  }

  return data;
};

export const getUsers = async (
  supabase: SupabaseClient<Database>,
): Promise<User[]> => {
  const { data, error } = await supabase.from("users").select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getUserById = async (
  supabase: SupabaseClient<Database>,
  id: string,
): Promise<User | null> => {
  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const updateUser = async (
  supabase: SupabaseClient<Database>,
  id: string,
  user: User,
): Promise<User> => {
  const { data, error } = await supabase
    .from("users")
    .update(user)
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export default {
  createUser,
  getUsers,
  getUserById,
  updateUser,
};
