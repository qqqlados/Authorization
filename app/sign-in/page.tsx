'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MapIcon } from 'lucide-react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

const signUpSchema = z.object({
	name: z.string().min(2, "Ім'я має бути не менше 2 символів"),
	email: z.string().email('Введіть коректний email'),
	password: z.string().min(6, 'Пароль має бути не менше 6 символів'),
})

type SignUpFormData = z.infer<typeof signUpSchema>

export default function GetStarted() {
	const {
		register,
		handleSubmit,

		formState: { errors },
	} = useForm<SignUpFormData>({
		resolver: zodResolver(signUpSchema),
	})
	const [loading, setLoading] = useState<boolean>(false)

	const router = useRouter()

	const onSubmit = async (data: SignUpFormData) => {
		try {
			setLoading(true)

			const result = await signIn('credentials', {
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

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
		<>
			<div className='min-h-screen bg-background'>
				<main className='container mx-auto px-4 sm:px-6 lg:px-8 pt-24'>
					<div className='max-w-md mx-auto'>
						<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className='text-center mb-8'>
							<MapIcon className='w-12 h-12 mx-auto mb-4' />
							<h1 className='text-3xl font-bold mb-2'>Create Your Account</h1>
							<p className='text-muted-foreground'>Join Travel Companion to start planning your perfect journey</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.2 }}
							className={cn('relative bg-card rounded-lg border p-6', loading && 'pointer-events-none')}
						>
							<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
								<div className='space-y-2'>
									<Label htmlFor='name'>Full Name</Label>
									<Input id='name' placeholder='Enter your name' {...register('name')} />
									{errors.name && <p className='text-red-500 text-sm'>{errors.name.message}</p>}
								</div>

								<div className='space-y-2'>
									<Label htmlFor='email'>Email</Label>
									<Input id='email' type='email' placeholder='Enter your email' {...register('email')} />
									{errors.email && <p className='text-red-500 text-sm'>{errors.email.message}</p>}
								</div>

								<div className='space-y-2'>
									<Label htmlFor='password'>Password</Label>
									<Input id='password' type='password' placeholder='Create a password' {...register('password')} />
									{errors.password && <p className='text-red-500 text-sm'>{errors.password.message}</p>}
								</div>

								<Button className='w-full' size='lg' type='submit' disabled={loading}>
									{loading ? 'Creating...' : 'Create Account'}
								</Button>
							</form>

							<div className='mt-6 text-center text-sm'>
								<p className='text-muted-foreground'>
									Already have an account?{' '}
									<Link href='/sign-in' className='text-primary hover:underline'>
										Sign in
									</Link>
								</p>
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.5, delay: 0.4 }}
							className='mt-8 text-center text-sm text-muted-foreground'
						>
							<p>
								By creating an account, you agree to our{' '}
								<Link href='/terms' className='hover:underline'>
									Terms of Service
								</Link>{' '}
								and{' '}
								<Link href='/privacy' className='hover:underline'>
									Privacy Policy
								</Link>
							</p>
						</motion.div>
					</div>
				</main>
			</div>
		</>
	)
}
