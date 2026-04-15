'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

function translateError(message: string): string {
  if (message.includes('Invalid login credentials')) return '아이디 또는 비밀번호가 일치하지 않습니다.'
  if (message.includes('User already registered')) return '이미 가입된 이메일/아이디입니다.'
  if (message.includes('Password should be at least')) return '비밀번호는 최소 6자 이상이어야 합니다.'
  if (message.includes('Email not confirmed')) return '이메일 인증이 완료되지 않았습니다.'
  if (message.includes('Captcha check failed')) return '로봇 방지 인증에 실패했습니다.'
  return message // fallback to original if unknown
}

export async function login(formData: FormData) {
  const supabase = await createClient()

  const idInput = formData.get('email') as string
  const password = formData.get('password') as string

  // Append fake domain if no email format
  const email = idInput.includes('@') ? idInput : `${idInput}@nol2.com`

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect(`/login?error=${encodeURIComponent(translateError(error.message))}`)
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const idInput = formData.get('email') as string
  const password = formData.get('password') as string
  const nickname = formData.get('nickname') as string

  // Append fake domain if no email format
  const email = idInput.includes('@') ? idInput : `${idInput}@nol2.com`

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nickname,
      },
    },
  })

  if (error) {
    return redirect(`/signup?error=${encodeURIComponent(translateError(error.message))}`)
  }

  revalidatePath('/', 'layout')
  redirect('/signup/success')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
