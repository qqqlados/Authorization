'use client'

import Link from 'next/link'
import ProfileDropdown from './profile-dropdown'
import { Button } from './ui/button'
import { useSession } from 'next-auth/react'

export default function HeaderAuthContent() {
	const { status } = useSession()

	return (
		<>
			{status == 'unauthenticated' ? (
				<>
					<Button variant='ghost' asChild>
						<Link href='/sign-in'>Sign In</Link>
					</Button>
					<Button asChild>
						<Link href='/get-started'>Get Started</Link>
					</Button>
				</>
			) : (
				<ProfileDropdown />
			)}
		</>
	)
}
