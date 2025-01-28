'use client'

import { useSession } from 'next-auth/react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from './ui/dropdown-menu'
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu'
import { Button } from './ui/button'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export default function ProfileDropdown() {
	const { data: session } = useSession()
	const [active, setActive] = useState<boolean>(false)

	const profileLetter = session?.user?.name?.charAt(0).toUpperCase()

	return (
		<div className='min-w-[200px]'>
			{session ? (
				<DropdownMenu onOpenChange={() => setActive(state => !state)}>
					<DropdownMenuTrigger>
						<Button className='w-full p-2 flex justify-start items-center gap-2' variant='outline' size='icon'>
							<div className='grid place-items-center w-8 h-8 bg-slate-300 rounded-full'>
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
					<DropdownMenuContent className='text-sm pl-8'>
						<DropdownMenuItem>Settings</DropdownMenuItem>
						<DropdownMenuItem>About me</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			) : (
				<div role='status' className='max-w-sm animate-pulse'>
					<div className='h-[38px] bg-gray-200 rounded dark:bg-gray-700 w-[150px]'></div>
				</div>
			)}
		</div>
	)
}
