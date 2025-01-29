'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from './ui/dropdown-menu'
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu'
import { Button } from './ui/button'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { signOut, useSession } from 'next-auth/react'
import { LogOut } from 'lucide-react'

export default function ProfileDropdown() {
	const [active, setActive] = useState<boolean>(false)

	const { data: session, status } = useSession()

	const profileLetter = session?.user?.name?.charAt(0).toUpperCase()

	const handleLogout = () => {}

	return (
		<div className='min-w-[200px]'>
			{status == 'authenticated' && (
				<DropdownMenu onOpenChange={() => setActive(state => !state)}>
					<DropdownMenuTrigger className='focus:outline-none'>
						<Button
							className={cn('w-full p-2 flex justify-start items-center gap-2 transition duration-200 ease-in-out', active && 'bg-gray-100')}
							variant='outline'
							size='icon'
						>
							<div className='grid place-items-center w-8 h-8 bg-yellow-300 rounded-full'>
								<p>{profileLetter}</p>
							</div>
							<span>{session?.user?.name}</span>
							<div
								className={cn(
									'w-0 h-0 border-l-[7px] border-r-[7px] border-t-[7px] border-l-transparent border-r-transparent border-t-gray-600 transition duration-300 ease-in-out',
									active && 'rotate-180'
								)}
							></div>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className='cursor-pointer text-sm pl-3'>
						<DropdownMenuItem className='flex items-center gap-2 focus:outline-none' onClick={() => signOut({ callbackUrl: '/get-started' })}>
							<LogOut className='rotate-180 w-4 h-4' color='#303030' opacity={0.8} /> Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)}
			{status == 'loading' && (
				<div role='status' className='max-w-sm animate-pulse'>
					<div className='h-[38px] bg-gray-200 rounded dark:bg-gray-700 w-40'></div>
				</div>
			)}
		</div>
	)
}
