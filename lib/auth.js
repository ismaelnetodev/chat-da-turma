import { supabase } from "./supabase";


export async function signUpUser({ name, username, email, password }) {
    if (!supabase){
        return {
            data: null,
            error: "Missing Database"
        };
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name, username
            },
        },
    })

    return { data, error };
}

export async function signInUser({email, password}){
    if (!supabase) {
        return {
        data: null,
        error: 'Supabase não configurado',
        }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })

    return { data, error }
}

export async function signOutUser() {
    if (!supabase) {
        return {
        data: null,
        error: 'Supabase não configurado',
        }
    }

    const { error } = await supabase.auth.signOut();

    return { error }
}

export async function getCurrentUser() {
    if (!supabase) {
        return {
        data: null,
        error: 'Supabase não configurado',
        }
    }

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser()

    return { user, error };
}