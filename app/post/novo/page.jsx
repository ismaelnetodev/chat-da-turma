import {redirect} from 'next/navigation'
import PostForm from '@/components/PostForm'
import { getCurrentUser } from  '@/lib/auth'

export default async function NovoPostPage() {
    const {user} = await getCurrentUser()

    if (!user) {
        redirect('/auth/login')
    }

    return (
        <div>
            <h1>Novo Post</h1>
            <PostForm />
        </div>
    )
}