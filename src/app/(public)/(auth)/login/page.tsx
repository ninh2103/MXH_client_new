import LoginForm from '@/app/(public)/(auth)/login/login-form'
import useCheck from '@/queries/useCheck'

export default function Login() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <LoginForm />
    </div>
  )
}
