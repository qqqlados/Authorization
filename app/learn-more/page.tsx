"use client";

import { motion } from "framer-motion";
import { MapIcon, StarIcon, HeartIcon, CompassIcon, CloudSunIcon, UtensilsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LearnMore() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl font-bold mb-6">Discover Travel Companion</h1>
          
          <div className="prose prose-lg dark:prose-invert">
            <p className="text-xl text-muted-foreground mb-8">
              Travel Companion is your ultimate travel planning tool, designed to make your journey planning seamless and enjoyable.
            </p>

            <div className="grid gap-8 my-12">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-6 items-start"
                >
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-card rounded-lg border p-8 my-12">
              <h2 className="text-2xl font-bold mb-4">Ready to Start?</h2>
              <p className="text-muted-foreground mb-6">
                Begin planning your next adventure with Travel Companion. Create an account to save your trips and preferences.
              </p>
              <div className="flex gap-4">
                <Button asChild size="lg">
                  <Link href="/start-planning">Start Planning</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/get-started">Create Account</Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

const features = [
  {
    title: "Interactive Maps",
    description: "Visualize your entire journey with our interactive maps. Plan routes, add stops, and discover new places along the way. Our maps integrate with various services to provide real-time information about your destinations.",
    icon: CompassIcon,
  },
  {
    title: "Smart Planning",
    description: "Get personalized recommendations based on your interests and travel style. Our smart algorithm suggests attractions, restaurants, and activities that match your preferences and helps you create the perfect itinerary.",
    icon: StarIcon,
  },
  {
    title: "Weather Insights",
    description: "Stay prepared with accurate weather forecasts for all your planned destinations. Get detailed weather information for each day of your trip and receive alerts about weather changes that might affect your plans.",
    icon: CloudSunIcon,
  },
  {
    title: "Local Recommendations",
    description: "Discover hidden gems and local favorites at your destinations. Get insider tips about restaurants, cafes, and attractions that are off the beaten path.",
    icon: UtensilsIcon,
  },
  {
    title: "Trip Collections",
    description: "Save and organize your favorite places and trips. Create collections for different types of travel, share them with friends, and get inspired by other travelers' collections.",
    icon: HeartIcon,
  },
];