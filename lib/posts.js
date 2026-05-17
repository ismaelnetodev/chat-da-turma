import {supabase} from './supabase'
import { getCurrentUser } from './auth'

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
        .select()
        .single()
    
    return {data, error}
}

export async function getPosts() {
    if (!supabase){
        return {
        posts: [],
        error: 'Supabase não configurado',
        }
    }

    const { user } = await getCurrentUser();

    const { data, error } = await supabase
        .from('posts')
        .select(`
            id,
            content,
            created_at,
            user_id,
            profiles:user_id (
                id,
                name,
                username,
                avatar_url
            ),
            post_likes (
                user_id
            )
         `)
        .order('created_at', { ascending: false })

    if (error){
        return {
            posts: [],
            error,
        };
    }

    const posts = data.map((post) => {
        const likes = post.post_likes || [];

        return {
            id: post.id,
            content: post.content,
            createdAt: post.created_at,
            userId: post.user_id,
            author: {
                id: post.profiles?.id,
                name: post.profiles?.name || 'Usuário',
                username: post.profiles?.username || 'usuario',
                avatarUrl: post.profiles?.avatar_url || null,
            },
            likesCount: likes.length,
            likedByMe: user ? likes.some((like) => like.user_id === user.id) : false
        }
    })

    return {
        posts,
        error: null,
    }
}

export async function toggleLike(postId) {
    if (!supabase){
        return {
        posts: [],
        error: 'Supabase não configurado',
        }
    }

    const { user, error: userError } = await getCurrentUser()

    if (userError || !user) {
        return {
            error: "Usuário não autenticado",
        }
    }

    const { data: existingLike, error: findError } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .maybeSingle()

    if (findError){
        return {
            error: findError,
        }
    }

    if (existingLike) {
        const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('id', existingLike.id)

        return {
            liked: false,
            error,
        }
    }

    const { error } = await supabase
        .from('post_likes')
        .insert([
            {
                post_id: postId,
                user_id: user.id,
            },
        ])
    
    return {
        liked: true,
        error,
    }
}