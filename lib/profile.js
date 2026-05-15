import { supabase } from './supabase'
import { getCurrentUser } from './auth'

const AVATAR_BUCKET = 'avatars'

export async function getCurrentProfile() {
  if (!supabase) {
    return {
      profile: null,
      error: 'Supabase não configurado',
    }
  }

  const { user, error: userError } = await getCurrentUser()

  if (userError) {
    return {
      profile: null,
      error: userError,
    }
  }

  if (!user) {
    return {
      profile: null,
      error: 'Usuário não autenticado',
    }
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, username, bio, avatar_url, created_at')
    .eq('id', user.id)
    .single()

  return {
    profile: data,
    error,
  }
}

export async function updateProfileBio(bio) {
  if (!supabase) {
    return {
      profile: null,
      error: 'Supabase não configurado',
    }
  }

  const { user, error: userError } = await getCurrentUser()

  if (userError) {
    return {
      profile: null,
      error: userError,
    }
  }

  if (!user) {
    return {
      profile: null,
      error: 'Usuário não autenticado',
    }
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({
      bio,
    })
    .eq('id', user.id)
    .select('id, name, username, bio, avatar_url, created_at')
    .single()

  return {
    profile: data,
    error,
  }
}

export async function uploadAvatar(file) {
  if (!supabase) {
    return {
      avatarUrl: null,
      profile: null,
      error: 'Supabase não configurado',
    }
  }

  const { user, error: userError } = await getCurrentUser()

  if (userError) {
    return {
      avatarUrl: null,
      profile: null,
      error: userError,
    }
  }

  if (!user) {
    return {
      avatarUrl: null,
      profile: null,
      error: 'Usuário não autenticado',
    }
  }

  if (!file) {
    return {
      avatarUrl: null,
      profile: null,
      error: 'Nenhum arquivo selecionado',
    }
  }

  const fileExtension = file.name.split('.').pop()
  const filePath = `${user.id}/avatar-${Date.now()}.${fileExtension}`

  const { error: uploadError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type,
    })

  if (uploadError) {
    return {
      avatarUrl: null,
      profile: null,
      error: uploadError,
    }
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from(AVATAR_BUCKET)
    .getPublicUrl(filePath)

  const { data: profile, error: updateError } = await supabase
    .from('profiles')
    .update({
      avatar_url: publicUrl,
    })
    .eq('id', user.id)
    .select('id, name, username, bio, avatar_url, created_at')
    .single()

  return {
    avatarUrl: publicUrl,
    profile,
    error: updateError,
  }
}

export async function updateProfile({ bio, file }) {
  if (file) {
    const avatarResult = await uploadAvatar(file)

    if (avatarResult.error) {
      return avatarResult
    }
  }

  if (typeof bio === 'string') {
    return updateProfileBio(bio)
  }

  return getCurrentProfile()
}