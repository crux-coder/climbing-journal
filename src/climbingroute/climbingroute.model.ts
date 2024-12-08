import { SupabaseClient } from "@supabase/supabase-js";
import { AppError } from "src/common/app.error";
import { Database, Json } from "src/config/database.types";
import { User } from "src/users/users.model";
import z from "zod";

const ClimbingPitch = z
  .object({
    pitch_order: z.number(),
    grade: z.string().optional(),
    length: z.number().optional(),
    description: z.string().optional(),
  })
  .strict();

export type ClimbingPitch = z.infer<typeof ClimbingPitch>;

export type ClimbingRoute = {
  id: string;
  name: string;
  grade: string | null;
  type: string | null;
  length: number | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  // Pithes are optional, as a climbing route can be a boulder problem or a single pitch route
  pitches: ClimbingPitch[] | null;
  description: string | null;
  approach: string | null;
  user?: User;
};

export const create = async (
  supabase: SupabaseClient<Database>,
  climbingroute: ClimbingRoute,
): Promise<ClimbingRoute> => {
  const { data, error } = await supabase
    .from("climbing_routes")
    .insert(climbingroute)
    .single();

  if (error) {
    throw new AppError(
      error.message,
      400,
      "CREATION_FAILED",
      "Failed to create climbingroute. Please check your input and try again.",
    );
  }

  return data;
};

export const getAll = async (
  supabase: SupabaseClient<Database>,
): Promise<ClimbingRoute[]> => {
  const { data, error } = await supabase.from("climbing_routes").select();

  if (error) {
    throw new Error(error.message);
  }

  const parsedData = data.map((route) => {
    return {
      ...route,
      pitches: Array.isArray(route.pitches)
        ? route.pitches.map((pitch: Json) => {
            const validationResult = ClimbingPitch.safeParse(pitch);
            if (!validationResult.success) {
              throw new Error("Invalid JSON structure");
            }
            return validationResult.data;
          })
        : null,
    };
  });

  return parsedData;
};

export const getById = async (
  supabase: SupabaseClient<Database>,
  id: string,
): Promise<ClimbingRoute | null> => {
  const { data, error } = await supabase
    .from("climbing_routes")
    .select()
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const parsedData = {
    ...data,
    pitches: Array.isArray(data.pitches)
      ? data.pitches.map((pitch: Json) => {
          const validationResult = ClimbingPitch.safeParse(pitch);
          if (!validationResult.success) {
            throw new Error("Invalid JSON structure");
          }
          return validationResult.data;
        })
      : null,
  };

  return parsedData;
};

export const update = async (
  supabase: SupabaseClient<Database>,
  id: string,
  climbingroute: ClimbingRoute,
): Promise<ClimbingRoute> => {
  const { data, error } = await supabase
    .from("climbing_routes")
    .update(climbingroute)
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "42501") {
      throw new AppError(
        error.message,
        403,
        "UPDATE_FAILED",
        "Permission denied. You are not allowed to update this climbing route.",
      );
    } else {
      throw new AppError(
        error.message,
        400,
        "UPDATE_FAILED",
        "Failed to update climbing route. Please check your input and try again.",
      );
    }
  }

  return data;
};

export default {
  create,
  getAll,
  getById,
  update,
};
