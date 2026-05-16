import {supabase} from './supabase'

export async function createPost(content, userId) {

    if (!supabase) {
        return {
            data: null,
            error: 'Supabase não configurado'
        }
    }

    const {data, error} = await supabase
        .from('posts')
        .insert([{content, user_id: userId}])
    
    return {data, error}
}