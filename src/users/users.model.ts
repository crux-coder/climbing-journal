import getSupabaseClient from "src/config/supabase";
import { AppError } from "src/common/app.error";

export type User = {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
    password: string;
    created_at: string;
    updated_at: string;
}

export const createUser = async (user: User): Promise<User> => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
        .from('users')
        .insert(user)
        .single();

    if (error) {
        throw new AppError(
            error.message,
            400,
            'USER_CREATION_FAILED',
            'Failed to create user. Please check your input and try again.',
        );
    }

    return data;
};

export const getUsers = async (): Promise<User[]> => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
        .from('users')
        .select();

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

export const getUserById = async (id: string): Promise<User | null> => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
        .from('users')
        .select()
        .eq('id', id)
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

export const updateUser = async (id: string, user: User): Promise<User> => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
        .from('users')
        .update(user)
        .eq('id', id)
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