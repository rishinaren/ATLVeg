"use client";
import Link from "next/link";
import { useState } from "react";

// Function to track restaurant clicks
async function trackClick(placeId: string, placeName: string, placeAddress?: string) {
  try {
    await fetch('/api/clicks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        placeId,
        placeName,
        placeAddress,
      }),
    });
  } catch (error) {
    console.warn('Failed to track click:', error);
  }
}

export function PlaceCard({
  id,
  name,
  rating,
  priceLevel,
  distanceKm,
  vegLabel,
  lat,
  lng,
  address,
  isFavorite,
  types,
  photos,
}: {
  id: string; 
  name: string; 
  rating?: number; 
  priceLevel?: number; 
  distanceKm?: number; 
  vegLabel: string;
  lat: number; 
  lng: number; 
  address?: string; 
  isFavorite?: boolean;
  types?: string[];
  photos?: Array<{
    name: string;
    widthPx: number;
    heightPx: number;
  }>;
}) {
  const [imageError, setImageError] = useState(false);
  const price = typeof priceLevel === 'number' ? '$'.repeat(priceLevel || 0) : '';
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  
  // Check if we have photos available
  const hasPhoto = photos && photos.length > 0;
  const firstPhoto = hasPhoto ? photos[0] : null;
  const photoUrl = firstPhoto ? `/api/photo?name=${encodeURIComponent(firstPhoto.name)}&maxWidth=400` : null;
  
  // Debug logging
  if (photos) {
    console.log(`${name} has ${photos.length} photos:`, photos);
  } else {
    console.log(`${name} has no photos, will show map`);
  }
  
  const getVegLabelColor = (label: string) => {
    if (label.includes("Vegan") || label.includes("Friendly")) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    if (label.includes("Options Available")) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    if (label.includes("Limited")) return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
    return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  };

  return (
    <div className="group bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-800">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        {!imageError && hasPhoto && photoUrl ? (
          <img 
            src={photoUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => {
              console.log(`Failed to load photo for ${name}:`, photoUrl);
              setImageError(true);
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-green-400 to-blue-500 relative">
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyC04O8zgcvfZzxlaXKKQBl1Ie-5R1xAxXg&q=${encodeURIComponent(name)}&center=${lat},${lng}&zoom=15`}
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <span className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full">
                {hasPhoto && imageError ? "� Photo unavailable" : "�📍 Map View"}
              </span>
            </div>
          </div>
        )}
        
        {/* Veg Label Overlay */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getVegLabelColor(vegLabel)}`}>
            {vegLabel}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
            {name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
            {address || 'Address not available'}
          </p>
        </div>

        {/* Rating and Price */}
        <div className="flex items-center gap-3 text-sm">
          {rating !== undefined && (
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">⭐</span>
              <span className="font-medium">{rating.toFixed(1)}</span>
            </div>
          )}
          {price && (
            <span className="text-green-600 dark:text-green-400 font-medium">
              {price}
            </span>
          )}
          {distanceKm !== undefined && (
            <span className="text-gray-500">
              {distanceKm.toFixed(1)} km
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <a 
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg font-medium transition-colors text-sm"
            href={directions} 
            target="_blank" 
            rel="noreferrer"
          >
            📍 Directions
          </a>
          <Link 
            className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-center py-2 px-4 rounded-lg font-medium transition-colors text-sm"
            href={`/place/${id}`}
            onClick={() => trackClick(id, name, address)}
          >
            ℹ️ Details
          </Link>
        </div>
      </div>
    </div>
  );
}
