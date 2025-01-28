import { MapIcon } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'
import { Button } from './ui/button'
import Link from 'next/link'
import ProfileDropdown from './profile-dropdown'

export default function HeaderNav({ isAuthorized }: { isAuthorized: boolean }) {
	return (
		<nav className='fixed w-full top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
			<div className='container flex h-16 items-center justify-between'>
				<div className='ml-6 flex items-center gap-2'>
					<MapIcon className='h-6 w-6' />
					<span className='text-xl font-bold'>Travel Companion</span>
				</div>
				<div className='flex items-center gap-4'>
					<ThemeToggle />
					{isAuthorized && <ProfileDropdown />}
					{!isAuthorized && (
						<>
							<Button variant='ghost' asChild>
								<Link href='/get-started'>Sign In</Link>
							</Button>
							<Button asChild>
								<Link href='/get-started'>Get Started</Link>
							</Button>
						</>
					)}
				</div>
			</div>
		</nav>
	)
}
