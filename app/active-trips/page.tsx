'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
	MapIcon,
	SearchIcon,
	CalendarIcon,
	MessageCircleIcon,
	PlusIcon,
	TrashIcon, // імпортуємо іконку для видалення
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { format } from 'date-fns'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import type { Location } from '@/components/map'

const MapComponent = dynamic(() => import('@/components/map'), {
	ssr: false,
	loading: () => (
		<div className='w-full h-[600px] bg-muted animate-pulse rounded-lg flex items-center justify-center'>
			<MapIcon className='w-10 h-10 text-muted-foreground/50' />
		</div>
	),
})

interface Trip {
	id: number
	name: string
	startDate: Date
	endDate: Date
	locations: Location[]
}

// Get trips from localStorage
const getTrips = () => {
	if (typeof window === 'undefined') return []
	const trips = localStorage.getItem('trips')
	return trips ? JSON.parse(trips) : []
}

// Save trips to localStorage
const saveTrips = (trips: Trip[]) => {
	if (typeof window === 'undefined') return
	localStorage.setItem('trips', JSON.stringify(trips))
}

export default function ActiveTrips() {
	const [trips, setTrips] = useState<Trip[]>([])
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null)
	const [showCommentInput, setShowCommentInput] = useState(false)
	const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
	const [newComment, setNewComment] = useState('')

	useEffect(() => {
		const savedTrips = getTrips()
		// Convert string dates back to Date objects
		const processedTrips = savedTrips.map((trip: any) => ({
			...trip,
			startDate: new Date(trip.startDate),
			endDate: new Date(trip.endDate),
		}))
		setTrips(processedTrips)
	}, [])

	const filteredTrips = trips.filter(trip => trip.name.toLowerCase().includes(searchQuery.toLowerCase()))

	const handleTripSelect = (trip: Trip) => {
		setSelectedTrip(trip)
	}

	const handleAddComment = (locationId: number) => {
		if (!newComment.trim() || !selectedTrip) return

		const updatedTrips = trips.map(trip => {
			if (trip.id === selectedTrip.id) {
				const updatedLocations = trip.locations.map(loc => {
					if (loc.id === locationId) {
						return {
							...loc,
							comments: [...(loc.comments || []), newComment],
						}
					}
					return loc
				})
				return { ...trip, locations: updatedLocations }
			}
			return trip
		})

		setTrips(updatedTrips)
		saveTrips(updatedTrips)

		// Update selected trip
		const updatedSelectedTrip = updatedTrips.find(t => t.id === selectedTrip.id)
		if (updatedSelectedTrip) {
			setSelectedTrip(updatedSelectedTrip)
		}

		setNewComment('')
		setShowCommentInput(false)
	}

	const handleDeleteTrip = (tripId: number) => {
		const updatedTrips = trips.filter(trip => trip.id !== tripId)
		setTrips(updatedTrips)
		saveTrips(updatedTrips)
		if (selectedTrip?.id === tripId) {
			setSelectedTrip(null) // Clear selected trip if it's deleted
		}
	}

	return (
		<>
			<div className='container flex h-16 items-center justify-between'>
				<div className='ml-6 flex items-center gap-2'>
					<MapIcon className='h-6 w-6' />
					<Link href='/'>
						<span className='text-xl font-bold'>Travel Companion</span>
					</Link>
				</div>
			</div>
			<div className='min-h-screen bg-background'>
				<main className='container mx-auto px-4 sm:px-6 lg:px-8 pt-24'>
					<div className='flex items-center justify-between mb-8'>
						<div>
							<h1 className='text-4xl font-bold mb-2'>Active Trips</h1>
							<p className='text-muted-foreground'>View and manage your ongoing journeys</p>
						</div>
						<div className='flex items-center gap-4'>
							<div className='relative w-64'>
								<SearchIcon className='absolute left-2 top-3 h-4 w-4 text-muted-foreground' />
								<Input className='pl-8' placeholder='Search trips...' value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
							</div>
							<Button asChild>
								<Link href='/start-planning'>
									<PlusIcon className='mr-2 h-4 w-4' />
									New Trip
								</Link>
							</Button>
						</div>
					</div>

					<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
						<div className='space-y-4'>
							{filteredTrips.length === 0 ? (
								<div className='text-center p-8 bg-card rounded-lg border'>
									<p className='text-muted-foreground'>No trips found</p>
									<Button asChild className='mt-4'>
										<Link href='/start-planning'>Create Your First Trip</Link>
									</Button>
								</div>
							) : (
								filteredTrips.map(trip => (
									<motion.div
										key={trip.id}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										className={`bg-card rounded-lg border p-4 cursor-pointer transition-colors ${
											selectedTrip?.id === trip.id ? 'border-primary' : ''
										}`}
										onClick={() => handleTripSelect(trip)}
									>
										<h3 className='text-xl font-semibold mb-2'>{trip.name}</h3>
										<div className='flex items-center text-sm text-muted-foreground mb-2'>
											<CalendarIcon className='h-4 w-4 mr-2' />
											<span>
												{format(trip.startDate, 'MMM d, yyyy')} - {format(trip.endDate, 'MMM d, yyyy')}
											</span>
										</div>
										<p className='text-sm text-muted-foreground'>{trip.locations.length} destinations</p>
										<Button
											variant='ghost'
											size='sm'
											className='mt-2 text-red-500'
											onClick={e => {
												e.stopPropagation() // Prevent the trip from being selected
												handleDeleteTrip(trip.id)
											}}
										>
											<TrashIcon className='h-4 w-4' />
											Delete
										</Button>
									</motion.div>
								))
							)}
						</div>

						<div className='lg:col-span-2'>
							{selectedTrip ? (
								<div className='space-y-4'>
									<div className='bg-card rounded-lg border p-4'>
										<MapComponent locations={selectedTrip.locations} showRoute={true} isEditing={false} />
									</div>

									<div className='bg-card rounded-lg border p-4'>
										<h3 className='text-xl font-semibold mb-4'>Trip Details</h3>
										{selectedTrip.locations.map(location => (
											<div key={location.id} className='mb-4 p-4 bg-background rounded-lg border'>
												<div className='flex items-center justify-between mb-2'>
													<h4 className='font-semibold'>{location.name}</h4>
													<Button
														variant='ghost'
														size='sm'
														onClick={() => {
															setSelectedLocation(location)
															setShowCommentInput(true)
														}}
													>
														<MessageCircleIcon className='h-4 w-4 mr-2' />
														Add Comment
													</Button>
												</div>
												<p className='text-sm text-muted-foreground mb-2'>{location.description}</p>
												{location.comments && location.comments.length > 0 && (
													<div className='space-y-2'>
														<h5 className='text-sm font-medium'>Comments:</h5>
														{location.comments.map((comment, index) => (
															<p key={index} className='text-sm text-muted-foreground pl-4 border-l-2'>
																{comment}
															</p>
														))}
													</div>
												)}
												{showCommentInput && selectedLocation?.id === location.id && (
													<div className='mt-2 flex gap-2'>
														<Input
															value={newComment}
															onChange={e => setNewComment(e.target.value)}
															placeholder='Add a comment...'
															className='flex-1'
														/>
														<Button size='sm' onClick={() => handleAddComment(location.id)}>
															Add
														</Button>
													</div>
												)}
											</div>
										))}
									</div>
								</div>
							) : (
								<div className='bg-card rounded-lg border p-8 text-center'>
									<MapIcon className='h-12 w-12 mx-auto mb-4 text-muted-foreground' />
									<h3 className='text-xl font-semibold mb-2'>Select a Trip</h3>
									<p className='text-muted-foreground'>Choose a trip from the list to view its details and locations</p>
								</div>
							)}
						</div>
					</div>
				</main>
			</div>
		</>
	)
}
