import { SupabaseClient } from "@supabase/supabase-js";
import { AppError } from "src/common/app.error";
import { Database } from "src/config/database.types";

export type Template = {
  id: string;
  created_at: string;
};

export const create = async (
  supabase: SupabaseClient<Database>,
  template: Template,
): Promise<Template> => {
  /* This @ts-ignore is purposefully added in this position for two reasons:
     1. To ignore ts error since templates table does not exist in the database
     2. When new feature script is run, it will be replaced with empty string, otherwise we would have empty row if placed on the next line
    */
  const { data, error } = await supabase // @ts-ignore
    .from("templates") // @ts-ignore
    .insert(template)
    .single();

  if (error) {
    throw new AppError(
      error.message,
      400,
      "CREATION_FAILED",
      "Failed to create template. Please check your input and try again.",
    );
  }

  return data;
};

export const getAll = async (
  supabase: SupabaseClient<Database>,
): Promise<Template[]> => {
  /* This @ts-ignore is purposefully added in this position for two reasons:
     1. To ignore ts error since templates table does not exist in the database
     2. When new feature script is run, it will be replaced with empty string, otherwise we would have empty row if placed on the next line
    */
  const { data, error } = await supabase // @ts-ignore
    .from("templates")
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getById = async (
  supabase: SupabaseClient<Database>,
  id: string,
): Promise<Template | null> => {
  /* This @ts-ignore is purposefully added in this position for two reasons:
     1. To ignore ts error since templates table does not exist in the database
     2. When new feature script is run, it will be replaced with empty string, otherwise we would have empty row if placed on the next line
    */
  const { data, error } = await supabase // @ts-ignore
    .from("templates")
    .select()
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const update = async (
  supabase: SupabaseClient<Database>,
  id: string,
  template: Template,
): Promise<Template> => {
  /* This @ts-ignore is purposefully added in this position for two reasons:
     1. To ignore ts error since templates table does not exist in the database
     2. When new feature script is run, it will be replaced with empty string, otherwise we would have empty row if placed on the next line
    */
  const { data, error } = await supabase // @ts-ignore
    .from("templates")
    .update(template)
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export default {
  create,
  getAll,
  getById,
  update,
};
