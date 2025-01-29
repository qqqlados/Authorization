import { MapIcon } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'
import HeaderAuthContent from './header-auth-content'

export default function HeaderNav() {
	return (
		<nav className='fixed w-full top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
			<div className='container flex h-16 items-center justify-between'>
				<div className='ml-6 flex items-center gap-2'>
					<MapIcon className='h-6 w-6' />
					<span className='text-xl font-bold'>Travel Companion</span>
				</div>
				<div className='flex basis-[258px] grow-0 items-center gap-4'>
					<ThemeToggle />

					<HeaderAuthContent />
				</div>
			</div>
		</nav>
	)
}
