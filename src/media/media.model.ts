import { SupabaseClient } from "@supabase/supabase-js";
import { AppError } from "src/common/app.error";
import { Database } from "src/config/database.types";
import { v4 as uuidv4 } from "uuid";

export type Media = {
  id: string;
  created_at: string;
  type: string;
  url: string;
  user_id: string;
  owner_id: string;
  owner_type: "CLIMBING_ROUTE" | "CLIMBING_PITCH";
};

export const create = async (
  supabase: SupabaseClient<Database>,
  file: Express.Multer.File,
  bucket: string,
  ownerId: string,
  ownerType: "CLIMBING_ROUTE" | "CLIMBING_PITCH",
): Promise<string> => {
  const STORAGE_BASE_URL = process.env.SUPABASE_STORAGE_BASE_URL;
  const fileName = `${bucket}/${uuidv4()}-${file.originalname}`;

  const { data, error } = await supabase.storage
    .from("climbing-journal")
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      cacheControl: "3600",
    });

  if (error) {
    throw new AppError(
      error.message,
      400,
      "UPLOAD_FAILED",
      "Failed to upload media. Please try again.",
    );
  }

  const { error: insertError } = await supabase.from("media").insert([
    {
      type: file.mimetype,
      url: `${STORAGE_BASE_URL}${data.fullPath}`,
      owner_id: ownerId,
      owner_type: ownerType,
    },
  ]);

  if (insertError) {
    throw new AppError(
      insertError.message,
      400,
      "INSERT_FAILED",
      "Failed to insert media. Please try again.",
    );
  }

  return data.fullPath;
};

export const createMany = async (
  supabase: SupabaseClient<Database>,
  media: Express.Multer.File[],
  bucket: string,
  ownerId: string,
  ownerType: "CLIMBING_ROUTE" | "CLIMBING_PITCH",
): Promise<string[]> => {
  const paths = await Promise.all(
    media.map(async (file) => {
      const path = await create(supabase, file, bucket, ownerId, ownerType);

      return path;
    }),
  );

  return paths;
};

export const getById = async (
  supabase: SupabaseClient<Database>,
  id: string,
): Promise<string> => {
  const { data } = await supabase.storage
    .from("climbing-journal")
    .getPublicUrl(id);

  if (!data.publicUrl) {
    throw new AppError(
      "Failed to retrieve media. Please check the ID and try again.",
      400,
      "RETRIEVAL_FAILED",
      "Failed to retrieve media. Please check the ID and try again.",
    );
  }

  return data.publicUrl;
};

export const remove = async (
  supabase: SupabaseClient<Database>,
  id: string,
): Promise<void> => {
  const { error } = await supabase.storage
    .from("climbing-journal")
    .remove([id]);

  if (error) {
    throw new AppError(
      error.message,
      400,
      "DELETION_FAILED",
      "Failed to delete media. Please check the ID and try again.",
    );
  }
};

export default {
  create,
  createMany,
  getById,
  remove,
};
