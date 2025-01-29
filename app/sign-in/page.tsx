'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MapIcon } from 'lucide-react'
import Link from 'next/link'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { cn } from '@/lib/utils'

const signInSchema = z.object({
	email: z.string().email('Введіть коректний email'),
	password: z.string().min(6, 'Пароль має бути не менше 6 символів'),
})

type SignInFormData = z.infer<typeof signInSchema>

export default function SignIn() {
	const {
		register,
		handleSubmit,

		formState: { errors },
	} = useForm<SignInFormData>({
		resolver: zodResolver(signInSchema),
	})

	const [loading, setLoading] = useState<boolean>(false)

	const router = useRouter()

	const onSubmit = async (data: SignInFormData) => {
		try {
			setLoading(true)

			const result = await signIn('credentials', {
				name: 'Matthew',
				redirect: false,
				email: data.email,
				password: data.password,
			})

			// Відправка даних на API для обробки
			// const response = await fetch('/api/auth/register', {
			// 	method: 'POST',
			// 	headers: { 'Content-Type': 'application/json' },
			// 	body: JSON.stringify(data),
			// })

			if (result?.error === 'user_not_found') {
				throw new Error('Не вдалося знайти користувача. Введіть коректні дані.')
			} else {
				router.push(`/start-planning`)
			}
		} catch (error: any) {
			alert(error.message)
		}
	}

	useEffect(() => {
		return () => {
			setLoading(false)
		}
	}, [])

	return (
		<div className='min-h-screen bg-background'>
			<main className='container mx-auto px-4 sm:px-6 lg:px-8 pt-24'>
				<div className='max-w-md mx-auto'>
					<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className='text-center mb-8'>
						<MapIcon className='w-12 h-12 mx-auto mb-4' />
						<h1 className='text-3xl font-bold mb-2'>Welcome Back</h1>
						<p className='text-muted-foreground'>Sign in to continue planning your journey</p>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className={cn('bg-card rounded-lg border p-6', loading && 'pointer-events-none')}
					>
						<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
							<div className='space-y-2'>
								<Label htmlFor='email'>Email</Label>
								<Input id='email' type='email' placeholder='Enter your email' {...register('email')} />
								{errors.email && <p className='text-red-500 text-sm'>{errors.email.message}</p>}
							</div>

							<div className='space-y-2'>
								<Label htmlFor='password'>Password</Label>
								<Input id='password' type='password' placeholder='Enter your password' {...register('password')} />
								{errors.password && <p className='text-red-500 text-sm'>{errors.password.message}</p>}
							</div>

							<div className='flex items-center justify-between text-sm'>
								<Link href='/forgot-password' className='text-primary hover:underline'>
									Forgot password?
								</Link>
							</div>

							<Button className='w-full' size='lg' disabled={loading}>
								{loading ? 'Logging...' : 'Sign In'}
							</Button>
						</form>

						<div className='mt-6 text-center text-sm'>
							<p className='text-muted-foreground'>
								Don't have an account?{' '}
								<Link href='/get-started' className='text-primary hover:underline'>
									Create account
								</Link>
							</p>
						</div>
					</motion.div>
				</div>
			</main>
		</div>
	)
}
