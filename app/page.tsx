'use client'

import { motion } from 'framer-motion'
import { MapIcon, CompassIcon, CloudSunIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import HeaderNav from '@/components/header-nav'

const MapComponent = dynamic(() => import('@/components/map'), {
	ssr: false,
	loading: () => (
		<div className='w-full h-[400px] bg-muted animate-pulse rounded-lg flex items-center justify-center'>
			<MapIcon className='w-10 h-10 text-muted-foreground/50' />
		</div>
	),
})

export default function Home() {
	return (
		<div className='min-h-screen bg-background'>
			<HeaderNav />

			<main className='container mx-auto px-4 sm:px-6 lg:px-8'>
				<section className='pt-32 pb-16'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className='text-center space-y-6 max-w-4xl mx-auto'
					>
						<motion.h1
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.2 }}
							className='text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight'
						>
							Plan Your Perfect Journey
							<br />
							<span className='text-primary'>With Ease</span>
						</motion.h1>

						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.4 }}
							className='text-xl text-muted-foreground'
						>
							Discover, plan, and organize your dream destinations with our interactive travel planner. Create personalized itineraries and explore
							the world like never before.
						</motion.p>

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.6 }}
							className='flex flex-wrap justify-center gap-4 pt-4'
						>
							<Button size='lg' asChild>
								<Link href='/start-planning'>Start Planning</Link>
							</Button>
							<Button size='lg' variant='outline' asChild>
								<Link href='/learn-more'>Learn More</Link>
							</Button>
						</motion.div>
					</motion.div>
				</section>

				<section className='py-16'>
					<motion.div
						initial={{ opacity: 0, y: 40 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7 }}
						className='grid grid-cols-1 md:grid-cols-3 gap-8'
					>
						{features.map((feature, index) => (
							<motion.div
								key={feature.title}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
								className='relative p-6 bg-card rounded-lg border hover:shadow-lg transition-shadow'
							>
								<div className='absolute -top-3 -left-3 w-12 h-12 bg-primary rounded-full flex items-center justify-center'>
									<feature.icon className='h-6 w-6 text-primary-foreground' />
								</div>
								<h3 className='text-xl font-semibold mt-4 mb-2'>{feature.title}</h3>
								<p className='text-muted-foreground'>{feature.description}</p>
							</motion.div>
						))}
					</motion.div>
				</section>

				<section className='py-16'>
					<div className='space-y-8'>
						<div className='text-center'>
							<h2 className='text-3xl font-bold mb-4'>Explore Destinations</h2>
							<p className='text-muted-foreground max-w-2xl mx-auto'>
								Interactive map to help you visualize and plan your journey. Click on markers to see details about each location.
							</p>
						</div>
						<MapComponent />
					</div>
				</section>
			</main>
		</div>
	)
}

const features = [
	{
		title: 'Interactive Maps',
		description: 'Visualize your journey with interactive maps and easily plan your routes between destinations.',
		icon: CompassIcon,
	},
	{
		title: 'Smart Planning',
		description: 'Get intelligent suggestions for attractions, restaurants, and activities based on your preferences.',
		icon: MapIcon,
	},
	{
		title: 'Weather Insights',
		description: 'Stay prepared with accurate weather forecasts for all your planned destinations.',
		icon: CloudSunIcon,
	},
]
