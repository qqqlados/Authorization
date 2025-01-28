'use client'

import { useState } from 'react'
import { MapIcon, PlusIcon, RouteIcon, SaveIcon, TrashIcon, CalendarIcon, ListIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Location } from '@/components/map'
import { useSession } from 'next-auth/react'
import SessionProviderClient from '@/components/providers/session-provider-client'
import HeaderNav from '@/components/header-nav'
import { auth } from '../auth'

const MapComponent = dynamic(() => import('@/components/map'), {
	ssr: false,
	loading: () => (
		<div className='w-full h-[600px] bg-muted animate-pulse rounded-lg flex items-center justify-center'>
			<MapIcon className='w-10 h-10 text-muted-foreground/50' />
		</div>
	),
})

// Get trips from localStorage or return empty array
const getTrips = () => {
	if (typeof window === 'undefined') return []
	const trips = localStorage.getItem('trips')
	return trips ? JSON.parse(trips) : []
}

// Save trips to localStorage
const saveTrips = (trips: any[]) => {
	if (typeof window === 'undefined') return
	localStorage.setItem('trips', JSON.stringify(trips))
}

export default async function StartPlanning() {
	const router = useRouter()
	const [showRoute, setShowRoute] = useState(false)
	const [tripName, setTripName] = useState('')
	const [startDate, setStartDate] = useState<Date>()
	const [endDate, setEndDate] = useState<Date>()
	const [selectedLocations, setSelectedLocations] = useState<Location[]>([])
	const [isEditing, setIsEditing] = useState(false)
	const [locationComment, setLocationComment] = useState('')
	const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)

	// console.log(session)

	// Якщо компонент серверний - сonst session = await auth()	- функція з файлу auth.ts

	const handleLocationSelect = (location: Location) => {
		setSelectedLocations([...selectedLocations, location])
	}

	const handleRemoveLocation = (locationId: number) => {
		setSelectedLocations(selectedLocations.filter(loc => loc.id !== locationId))
	}

	const handleNewTrip = () => {
		setTripName('')
		setStartDate(undefined)
		setEndDate(undefined)
		setSelectedLocations([])
		setIsEditing(true)
	}

	const handleSaveTrip = () => {
		if (!tripName || !startDate || !endDate || selectedLocations.length === 0) {
			alert('Please fill in all required fields and add at least one location')
			return
		}

		const newTrip = {
			id: Date.now(),
			name: tripName,
			startDate,
			endDate,
			locations: selectedLocations,
		}

		const existingTrips = getTrips()
		saveTrips([...existingTrips, newTrip])

		// Reset form
		setTripName('')
		setStartDate(undefined)
		setEndDate(undefined)
		setSelectedLocations([])
		setIsEditing(false)

		// Redirect to active trips
		router.push('/active-trips')
	}

	const handleAddComment = (location: Location) => {
		if (!locationComment.trim()) return
		const updatedLocations = selectedLocations.map(loc => {
			if (loc.id === location.id) {
				return {
					...loc,
					comments: [...(loc.comments || []), locationComment],
				}
			}
			return loc
		})
		setSelectedLocations(updatedLocations)
		setLocationComment('')
		setSelectedLocation(null)
	}

	return (
		<>
			<div className='container flex h-16 items-center justify-between'>
				{/* <div className='ml-6 flex items-center gap-2'>
					<MapIcon className='h-6 w-6' />
					<Link href='/'>
						<span className='text-xl font-bold'>Travel Companion</span>
					</Link>
				</div> */}
				<HeaderNav isAuthorized />
			</div>
			<div className='min-h-screen bg-background'>
				<main className='container mx-auto px-4 sm:px-6 lg:px-8 pt-24'>
					<div className='flex items-center justify-between mb-8'>
						<div>
							<h1 className='text-4xl font-bold mb-2'>Plan Your Trip</h1>
							<p className='text-muted-foreground'>Create and customize your perfect journey</p>
						</div>
						<div className='flex gap-4'>
							<Button asChild variant='outline'>
								<Link href='/active-trips'>
									<ListIcon className='mr-2 h-4 w-4' />
									View Active Trips
								</Link>
							</Button>
							<Button onClick={handleNewTrip}>
								<PlusIcon className='mr-2 h-4 w-4' />
								New Trip
							</Button>
						</div>
					</div>

					<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
						<div className='lg:col-span-2'>
							<div className='bg-card rounded-lg border p-4 mb-4'>
								<div className='flex items-center justify-between mb-4'>
									<h2 className='text-xl font-semibold'>Interactive Map</h2>
									<div className='flex gap-2'>
										<Button variant={isEditing ? 'default' : 'outline'} size='sm' onClick={() => setIsEditing(!isEditing)}>
											{isEditing ? 'Finish Editing' : 'Edit Route'}
										</Button>
										<Button variant={showRoute ? 'default' : 'outline'} size='sm' onClick={() => setShowRoute(!showRoute)}>
											<RouteIcon className='mr-2 h-4 w-4' />
											{showRoute ? 'Hide Route' : 'Show Route'}
										</Button>
									</div>
								</div>
								<MapComponent showRoute={showRoute} locations={selectedLocations} onLocationSelect={handleLocationSelect} isEditing={isEditing} />
							</div>
						</div>

						<div className='space-y-4'>
							<div className='bg-card rounded-lg border p-4'>
								<h2 className='text-xl font-semibold mb-4'>Trip Details</h2>
								<div className='space-y-4'>
									<div>
										<label className='text-sm font-medium'>Trip Name</label>
										<Input value={tripName} onChange={e => setTripName(e.target.value)} placeholder='Enter trip name' />
									</div>
									<div className='space-y-2'>
										<label className='text-sm font-medium'>Start Date</label>
										<Popover>
											<PopoverTrigger asChild>
												<Button variant='outline' className='w-full justify-start text-left font-normal'>
													<CalendarIcon className='mr-2 h-4 w-4' />
													{startDate ? format(startDate, 'PPP') : 'Pick a date'}
												</Button>
											</PopoverTrigger>
											<PopoverContent className='w-auto p-0' align='start'>
												<Calendar mode='single' selected={startDate} onSelect={setStartDate} initialFocus />
											</PopoverContent>
										</Popover>
									</div>
									<div className='space-y-2'>
										<label className='text-sm font-medium'>End Date</label>
										<Popover>
											<PopoverTrigger asChild>
												<Button variant='outline' className='w-full justify-start text-left font-normal'>
													<CalendarIcon className='mr-2 h-4 w-4' />
													{endDate ? format(endDate, 'PPP') : 'Pick a date'}
												</Button>
											</PopoverTrigger>
											<PopoverContent className='w-auto p-0' align='start'>
												<Calendar mode='single' selected={endDate} onSelect={setEndDate} initialFocus />
											</PopoverContent>
										</Popover>
									</div>
									<Button className='w-full' onClick={handleSaveTrip}>
										<SaveIcon className='mr-2 h-4 w-4' />
										Save Trip
									</Button>
								</div>
							</div>

							<div className='bg-card rounded-lg border p-4'>
								<h2 className='text-xl font-semibold mb-4'>Selected Places</h2>
								<div className='space-y-2'>
									{selectedLocations.length === 0 ? (
										<p className='text-muted-foreground text-sm'>No places selected yet. Click on the map to add destinations to your trip.</p>
									) : (
										selectedLocations.map((location, index) => (
											<div key={location.id} className='p-4 bg-background rounded border'>
												<div className='flex items-center justify-between mb-2'>
													<div>
														<p className='font-medium'>{location.name}</p>
														<p className='text-sm text-muted-foreground'>Stop {index + 1}</p>
													</div>
													<div className='flex gap-2'>
														<Button variant='ghost' size='sm' onClick={() => setSelectedLocation(location)}>
															Add Note
														</Button>
														<Button variant='ghost' size='sm' onClick={() => handleRemoveLocation(location.id)}>
															<TrashIcon className='h-4 w-4 text-destructive' />
														</Button>
													</div>
												</div>
												{location.comments && location.comments.length > 0 && (
													<div className='mt-2 space-y-1'>
														{location.comments.map((comment, i) => (
															<p key={i} className='text-sm text-muted-foreground pl-3 border-l-2'>
																{comment}
															</p>
														))}
													</div>
												)}
												{selectedLocation?.id === location.id && (
													<div className='mt-2 flex gap-2'>
														<Input
															value={locationComment}
															onChange={e => setLocationComment(e.target.value)}
															placeholder='Add a note...'
															className='flex-1'
														/>
														<Button size='sm' onClick={() => handleAddComment(location)}>
															Add
														</Button>
													</div>
												)}
											</div>
										))
									)}
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>
		</>
	)
}
