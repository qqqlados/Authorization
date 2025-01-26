"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMapEvent,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon } from "lucide-react";

// Fix for default markers
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export interface Location {
  id: number;
  name: string;
  description: string;
  coordinates: [number, number];
  comments?: string[];
}

interface MapProps {
  onLocationSelect?: (location: Location) => void;
  showRoute?: boolean;
  locations?: Location[];
  isEditing?: boolean;
}

const sampleLocations: Location[] = [
  {
    id: 1,
    name: "Paris",
    description: "The City of Light",
    coordinates: [48.8566, 2.3522],
    comments: ["Must visit the Louvre", "Evening at Eiffel Tower"],
  },
  {
    id: 2,
    name: "Rome",
    description: "The Eternal City",
    coordinates: [41.9028, 12.4964],
    comments: ["Colosseum tour booked", "Try local pasta"],
  },
  {
    id: 3,
    name: "Barcelona",
    description: "City of Gaudi",
    coordinates: [41.3851, 2.1734],
    comments: ["Sagrada Familia tickets", "Evening at Las Ramblas"],
  },
];

export default function Map({
  onLocationSelect,
  showRoute = false,
  locations = sampleLocations,
  isEditing = false,
}: MapProps) {
  const [selectedLocations, setSelectedLocations] =
    useState<Location[]>(locations);
  const [tempMarker, setTempMarker] = useState<[number, number] | null>(null);
  const [newLocationName, setNewLocationName] = useState("");
  const [newLocationDescription, setNewLocationDescription] = useState("");

  useEffect(() => {
    window.dispatchEvent(new Event("resize"));
  }, []);

  useEffect(() => {
    if (JSON.stringify(selectedLocations) !== JSON.stringify(locations)) {
      setSelectedLocations(locations);
    }
  }, [locations, selectedLocations]);

  function MapClickHandler({
    onClick,
  }: {
    onClick: (e: L.LeafletMouseEvent) => void;
  }) {
    useMapEvent("click", onClick);
    return null;
  }

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    if (!isEditing) return;
    const { lat, lng } = e.latlng;
    setTempMarker([lat, lng]);
  };

  const handleAddLocation = () => {
    if (!tempMarker || !newLocationName) return;
    const newLocation: Location = {
      id: Date.now(),
      name: newLocationName,
      description: newLocationDescription || "Click to add description",
      coordinates: tempMarker,
      comments: [],
    };
    setSelectedLocations([...selectedLocations, newLocation]);
    if (onLocationSelect) {
      onLocationSelect(newLocation);
    }
    setTempMarker(null);
    setNewLocationName("");
    setNewLocationDescription("");
  };

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden border relative">
      <MapContainer
        center={[48.8566, 2.3522]}
        zoom={4}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler onClick={handleMapClick} />

        {selectedLocations.map((location) => (
          <Marker key={location.id} position={location.coordinates} icon={icon}>
            <Popup>
              <div className="p-2 space-y-2">
                <h3 className="font-semibold">{location.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {location.description}
                </p>
                {location.comments && location.comments.length > 0 && (
                  <div className="mt-2">
                    <h4 className="text-sm font-medium">Notes:</h4>
                    <ul className="text-sm text-muted-foreground">
                      {location.comments.map((comment, index) => (
                        <li key={index} className="pl-2 border-l-2">
                          {comment}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {tempMarker && (
          <Marker position={tempMarker} icon={icon}>
            <Popup>
              <div className="p-2 space-y-2">
                <Input
                  placeholder="Location name"
                  value={newLocationName}
                  onChange={(e) => setNewLocationName(e.target.value)}
                  className="mb-2"
                />
                <Input
                  placeholder="Description (optional)"
                  value={newLocationDescription}
                  onChange={(e) => setNewLocationDescription(e.target.value)}
                  className="mb-2"
                />
                <Button
                  size="sm"
                  onClick={handleAddLocation}
                  className="w-full"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add to Trip
                </Button>
              </div>
            </Popup>
          </Marker>
        )}

        {showRoute && selectedLocations.length > 1 && (
          <Polyline
            positions={selectedLocations.map((loc) => loc.coordinates)}
            color="#0070f3"
            weight={3}
            opacity={0.7}
          />
        )}
      </MapContainer>
    </div>
  );
}
