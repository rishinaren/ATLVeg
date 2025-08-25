"use client";
import { useState, useEffect } from "react";
import { calculateVegScore } from "@/lib/vegScore";

type PlaceDetails = {
  id: string;
  name: string;
  address?: string;
  rating?: number;
  priceLevel?: number;
  types?: string[];
  lat: number;
  lng: number;
};

// Function to add/remove favorites
async function toggleFavorite(placeId: string, placeName: string, placeAddress?: string, isFavorite?: boolean) {
  try {
    if (isFavorite) {
      await fetch(`/api/favorites?placeId=${placeId}`, {
        method: 'DELETE',
      });
    } else {
      await fetch('/api/favorites', {
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
    }
  } catch (error) {
    console.warn('Failed to toggle favorite:', error);
    throw error;
  }
}

export default function PlacePage({ params }: { params: { id: string } }) {
  const [place, setPlace] = useState<PlaceDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [vegAnalysis, setVegAnalysis] = useState<{score: number; label: string; reasoning: string[]} | null>(null);

  const handleFavoriteToggle = async () => {
    if (!place) return;
    
    setFavoriteLoading(true);
    try {
      await toggleFavorite(place.id, place.name, place.address, isFavorite);
      setIsFavorite(!isFavorite);
    } catch (error) {
      // Handle error silently - in a real app you might show a toast
    } finally {
      setFavoriteLoading(false);
    }
  };

  useEffect(() => {
    // For now, we'll create demo data since we don't have a real database
    // In a real app, you'd fetch from your database or API
    const demoPlace: PlaceDetails = {
      id: params.id,
      name: "Verdura Plant-Based Kitchen",
      address: "123 Peachtree Street NE, Atlanta, GA 30309",
      rating: 4.5,
      priceLevel: 2,
      types: ["restaurant", "vegetarian_restaurant", "healthy", "organic"],
      lat: 33.7490,
      lng: -84.3880,
    };

    setPlace(demoPlace);
    
    const analysis = calculateVegScore({
      name: demoPlace.name,
      types: demoPlace.types,
      displayName: { text: demoPlace.name }
    });
    setVegAnalysis(analysis);
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🤷‍♀️</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Place Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Sorry, we couldn't find the restaurant you're looking for.
        </p>
      </div>
    );
  }

  const src = `https://www.google.com/maps/embed/v1/place?key=AIzaSyC04O8zgcvfZzxlaXKKQBl1Ie-5R1xAxXg&q=${encodeURIComponent(place.name)}&center=${place.lat},${place.lng}&zoom=15`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;
  
  const getVegScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600 dark:text-green-400";
    if (score >= 50) return "text-yellow-600 dark:text-yellow-400";
    if (score >= 30) return "text-orange-600 dark:text-orange-400";
    return "text-gray-600 dark:text-gray-400";
  };

  const getVegLabelColor = (label: string) => {
    if (label.includes("Vegan") || label.includes("Friendly")) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    if (label.includes("Options Available")) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    if (label.includes("Limited")) return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
    return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {place.name}
          </h1>
          {vegAnalysis && (
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getVegLabelColor(vegAnalysis.label)}`}>
              {vegAnalysis.label}
            </span>
          )}
        </div>
        
        <p className="text-gray-600 dark:text-gray-400">
          {place.address}
        </p>

        {/* Quick Stats */}
        <div className="flex items-center gap-6 text-sm">
          {place.rating && (
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">⭐</span>
              <span className="font-medium">{place.rating.toFixed(1)}</span>
            </div>
          )}
          {place.priceLevel && (
            <span className="text-green-600 dark:text-green-400 font-medium">
              {"$".repeat(place.priceLevel)}
            </span>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <iframe 
          width="100%" 
          height="400" 
          style={{ border: 0 }} 
          loading="lazy" 
          allowFullScreen 
          src={src}
          className="w-full"
        />
      </div>

      {/* Veg Score Details */}
      {vegAnalysis && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Veg Score
              </h2>
              <div className={`text-6xl font-bold ${getVegScoreColor(vegAnalysis.score)} mb-2`}>
                {vegAnalysis.score}
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                out of 100
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                How we calculated this score:
              </h3>
              <div className="space-y-2">
                {vegAnalysis.reasoning.map((reason, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-gray-700 dark:text-gray-300 text-sm">
                      {reason}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> The Veg Score is calculated based on available information about the restaurant's name, type, and menu descriptions. 
                We recommend contacting the restaurant directly to confirm specific dietary accommodations and ingredient details.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <a
          href={directionsUrl}
          target="_blank"
          rel="noreferrer"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-4 px-6 rounded-xl font-semibold transition-colors"
        >
          📍 Get Directions
        </a>
        <button
          onClick={handleFavoriteToggle}
          disabled={favoriteLoading}
          className={`flex-1 ${isFavorite 
            ? 'bg-red-600 hover:bg-red-700' 
            : 'bg-green-600 hover:bg-green-700'
          } text-white text-center py-4 px-6 rounded-xl font-semibold transition-colors disabled:opacity-50`}
        >
          {favoriteLoading ? '...' : isFavorite ? '💔 Remove Favorite' : '❤️ Add to Favorites'}
        </button>
        <button
          onClick={() => window.history.back()}
          className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-center py-4 px-6 rounded-xl font-semibold transition-colors"
        >
          ← Back to Feed
        </button>
      </div>
    </div>
  );
}
