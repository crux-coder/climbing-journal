import getSupabaseClient from "src/config/supabase";
import { AppError } from "src/common/app.error";

export type Template = {
    id: string;
    created_at: string;
    updated_at: string;
}

export const create = async (template: Template): Promise<Template> => {
    const supabase = getSupabaseClient();
    /* This @ts-ignore is purposefully added in this position for two reasons:
     1. To ignore ts error since templates table does not exist in the database
     2. When new feature script is run, it will be replaced with empty string, otherwise we would have empty row if placed on the next line
    */
    const { data, error } = await supabase// @ts-ignore
        .from('templates')
        .insert(template)
        .single();

    if (error) {
        throw new AppError(
            error.message,
            400,
            'USER_CREATION_FAILED',
            'Failed to create template. Please check your input and try again.',
        );
    }

    return data;
};

export const getAll = async (): Promise<Template[]> => {
    const supabase = getSupabaseClient();
    /* This @ts-ignore is purposefully added in this position for two reasons:
     1. To ignore ts error since templates table does not exist in the database
     2. When new feature script is run, it will be replaced with empty string, otherwise we would have empty row if placed on the next line
    */
    const { data, error } = await supabase// @ts-ignore
        .from('templates')
        .select();

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

export const getById = async (id: string): Promise<Template | null> => {
    const supabase = getSupabaseClient();
    /* This @ts-ignore is purposefully added in this position for two reasons:
     1. To ignore ts error since templates table does not exist in the database
     2. When new feature script is run, it will be replaced with empty string, otherwise we would have empty row if placed on the next line
    */
    const { data, error } = await supabase// @ts-ignore
        .from('templates')
        .select()
        .eq('id', id)
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

export const update = async (id: string, template: Template): Promise<Template> => {
    const supabase = getSupabaseClient();
    /* This @ts-ignore is purposefully added in this position for two reasons:
     1. To ignore ts error since templates table does not exist in the database
     2. When new feature script is run, it will be replaced with empty string, otherwise we would have empty row if placed on the next line
    */
    const { data, error } = await supabase// @ts-ignore
        .from('templates')
        .update(template)
        .eq('id', id)
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