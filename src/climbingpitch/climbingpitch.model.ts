import { SupabaseClient } from "@supabase/supabase-js";
import { AppError } from "src/common/app.error";
import { Database } from "src/config/database.types";
import z from "zod";

export const ClimbingPitchZod = z
  .object({
    id: z.string().uuid(),
    pitch_order: z.number(),
    grade: z.string().nullable(),
    length: z.number().nullable(),
    description: z.string().nullable(),
    user_id: z.string().uuid(),
    created_at: z.string(),
    updated_at: z.string(),
    climbing_route_id: z.string().uuid(),
  })
  .strict();

export type ClimbingPitch = z.infer<typeof ClimbingPitchZod>;

export const create = async (
  supabase: SupabaseClient<Database>,
  climbingpitch: Omit<ClimbingPitch, "id" | "created_at" | "updated_at">,
): Promise<ClimbingPitch> => {
  const { data, error } = await supabase
    .from("climbing_pitches")
    .insert(climbingpitch)
    .single();

  if (error) {
    throw new AppError(
      error.message,
      400,
      "CREATION_FAILED",
      "Failed to create climbingpitch. Please check your input and try again.",
    );
  }

  return data;
};

export const createMany = async (
  supabase: SupabaseClient<Database>,
  climbingpitches: Omit<ClimbingPitch, "id" | "created_at" | "updated_at">[],
): Promise<ClimbingPitch[]> => {
  const { data, error } = await supabase
    .from("climbing_pitches")
    .insert(climbingpitches)
    .select();

  if (error) {
    throw new AppError(
      error.message,
      400,
      "CREATION_FAILED",
      "Failed to create climbing pitches. Please check your input and try again.",
    );
  }

  return data;
};

export const getAll = async (
  supabase: SupabaseClient<Database>,
): Promise<ClimbingPitch[]> => {
  const { data, error } = await supabase.from("climbing_pitches").select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getById = async (
  supabase: SupabaseClient<Database>,
  id: string,
): Promise<ClimbingPitch | null> => {
  const { data, error } = await supabase
    .from("climbing_pitches")
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
  climbingpitch: ClimbingPitch,
): Promise<ClimbingPitch> => {
  const { data, error } = await supabase
    .from("climbing_pitches")
    .update(climbingpitch)
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const updateMany = async (
  supabase: SupabaseClient<Database>,
  climbingpitches: ClimbingPitch[],
): Promise<ClimbingPitch[]> => {
  const updates = climbingpitches.map(async (climbingpitch) => {
    const { id, ...updateData } = climbingpitch;
    const { data, error } = await supabase
      .from("climbing_pitches")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  });

  return Promise.all(updates);
};

export default {
  create,
  createMany,
  getAll,
  getById,
  update,
  updateMany,
};
