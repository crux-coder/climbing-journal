import { SupabaseClient } from "@supabase/supabase-js";
import {
  ClimbingPitch,
  ClimbingPitchZod,
} from "src/climbingpitch/climbingpitch.model";
import { AppError } from "src/common/app.error";
import { Database, Json } from "src/config/database.types";
import { Media } from "src/media/media.model";
import { User } from "src/users/users.model";

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
  images: Media[] | null;
  user?: User;
};

export const create = async (
  supabase: SupabaseClient<Database>,
  climbingroute: Omit<
    ClimbingRoute,
    "id" | "created_at" | "updated_at" | "pitches" | "images" | "user"
  >,
): Promise<ClimbingRoute> => {
  const { data, error } = await supabase
    .from("climbing_routes")
    .insert(climbingroute)
    .select();

  if (error) {
    throw new AppError(
      error.message,
      400,
      "CREATION_FAILED",
      "Failed to create climbingroute. Please check your input and try again.",
    );
  }

  return data[0] as ClimbingRoute;
};

export const getAll = async (
  supabase: SupabaseClient<Database>,
): Promise<ClimbingRoute[]> => {
  const { data, error } = await supabase
    .from("climbing_routes")
    .select("*, pitches:climbing_pitches(*)");

  if (error) {
    throw new Error(error.message);
  }

  const { data: images, error: imagesError } = await supabase
    .from("media")
    .select()
    .in(
      "owner_id",
      data.map((route) => {
        return route.id;
      }),
    )
    .eq("owner_type", "CLIMBING_ROUTE");

  if (imagesError) {
    throw new Error(imagesError.message);
  }

  const parsedData = data.map((route) => {
    return {
      ...route,
      pitches: Array.isArray(route.pitches)
        ? route.pitches.map((pitch: Json) => {
            const validationResult = ClimbingPitchZod.safeParse(pitch);
            if (!validationResult.success) {
              throw new Error("Invalid JSON structure");
            }
            return validationResult.data;
          })
        : null,
      images: Array.isArray(images) ? images : null,
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
    .select("*, pitches:climbing_pitches(*)")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }
  const { data: images, error: imagesError } = await supabase
    .from("media")
    .select()
    .eq("owner_id", data.id)
    .eq("owner_type", "CLIMBING_ROUTE");

  if (imagesError) {
    throw new Error(imagesError.message);
  }

  const parsedData = {
    ...data,
    pitches: Array.isArray(data.pitches)
      ? data.pitches.map((pitch: Json) => {
          const validationResult = ClimbingPitchZod.safeParse(pitch);
          if (!validationResult.success) {
            throw new Error("Invalid JSON structure");
          }
          return validationResult.data;
        })
      : null,
    images: Array.isArray(images) ? images : null,
  };

  return parsedData;
};

export const deleteById = async (
  supabase: SupabaseClient<Database>,
  id: string,
): Promise<void> => {
  const { error } = await supabase
    .from("climbing_routes")
    .delete()
    .eq("id", id);

  if (error) {
    if (error.code === "42501") {
      throw new AppError(
        error.message,
        403,
        "DELETE_FAILED",
        "Permission denied. You are not allowed to delete this climbing route.",
      );
    } else {
      throw new AppError(
        error.message,
        400,
        "DELETE_FAILED",
        "Failed to delete climbing route.",
      );
    }
  }
};

export const update = async (
  supabase: SupabaseClient<Database>,
  climbingroute: Partial<
    Omit<ClimbingRoute, "id" | "created_at" | "updated_at">
  > & { id: string },
): Promise<ClimbingRoute> => {
  const { data, error } = await supabase
    .from("climbing_routes")
    .update(climbingroute)
    .eq("id", climbingroute.id)
    .select();

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

  return data[0] as ClimbingRoute;
};

export default {
  create,
  getAll,
  getById,
  update,
  deleteById,
};
