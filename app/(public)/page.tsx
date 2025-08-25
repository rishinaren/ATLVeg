"use client";
import { useState, useEffect } from "react";
import { PlaceCard } from "@/components/PlaceCard";
import { calculateVegScore } from "@/lib/vegScore";

type RestaurantData = {
  id: string;
  name: string;
  rating?: number;
  priceLevel?: number;
  vegLabel: string;
  vegScore: number;
  lat: number;
  lng: number;
  address?: string;
  types?: string[];
  photos?: Array<{
    name: string;
    widthPx: number;
    heightPx: number;
  }>;
};

type PlaceLite = {
  id?: string;
  displayName?: { text: string };
  formattedAddress?: string;
  rating?: number;
  userRatingCount?: number;
  priceLevel?: number;
  types?: string[];
  location?: { latitude: number; longitude: number };
  photos?: Array<{
    name: string;
    widthPx: number;
    heightPx: number;
    authorAttributions?: Array<{
      displayName: string;
      uri: string;
      photoUri: string;
    }>;
  }>;
};

export default function Page() {
  const [restaurants, setRestaurants] = useState<RestaurantData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const searchQueries = [
    "vegetarian restaurants Atlanta",
    "vegan restaurants Atlanta",
    "healthy restaurants Atlanta",
    "plant based restaurants Atlanta",
    "salad restaurants Atlanta",
    "organic restaurants Atlanta",
    "juice bars Atlanta",
    "cafes Atlanta",
  ];

  const convertPlaceToRestaurant = (place: PlaceLite): RestaurantData => {
    const vegAnalysis = calculateVegScore(place);
    return {
      id: place.id || Math.random().toString(),
      name: place.displayName?.text || "Unknown Restaurant",
      rating: place.rating,
      priceLevel: place.priceLevel,
      vegLabel: vegAnalysis.label,
      vegScore: vegAnalysis.score,
      lat: place.location?.latitude || 0,
      lng: place.location?.longitude || 0,
      address: place.formattedAddress,
      types: place.types,
      photos: place.photos,
    };
  };

  const fetchRestaurants = async (pageNum: number = 0, isLoadMore = false) => {
    try {
      if (!isLoadMore) setLoading(true);
      else setLoadingMore(true);

      // Atlanta center coordinates
      const atlantaCenter = { lat: 33.7490, lng: -84.3880 };
      
      // Use different search queries for different pages to get variety
      const query = searchQueries[pageNum % searchQueries.length];
      
      const response = await fetch(`/api/places?q=${encodeURIComponent(query)}&lat=${atlantaCenter.lat}&lng=${atlantaCenter.lng}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch restaurants");
      }
      
      const data = await response.json();
      const places = data.places || [];
      
      // Debug: Log the first place to see if we're getting photos
      if (places.length > 0) {
        console.log("Sample place data:", JSON.stringify(places[0], null, 2));
      }
      
      const newRestaurants = places.map(convertPlaceToRestaurant);
      
      // Remove duplicates and sort by veg score
      const uniqueRestaurants = newRestaurants.filter((newRest, index, self) => 
        index === self.findIndex(r => r.name === newRest.name && r.address === newRest.address)
      );
      
      const sortedRestaurants = uniqueRestaurants.sort((a, b) => b.vegScore - a.vegScore);
      
      if (isLoadMore) {
        setRestaurants(prev => {
          // Prevent duplicates when loading more
          const existingNames = new Set(prev.map(r => r.name + r.address));
          const newUniqueRestaurants = sortedRestaurants.filter(r => 
            !existingNames.has(r.name + r.address)
          );
          return [...prev, ...newUniqueRestaurants];
        });
      } else {
        setRestaurants(sortedRestaurants);
      }
      
      setError(null);
    } catch (err) {
      console.error("Error fetching restaurants:", err);
      setError("Failed to load restaurants. Please try again.");
      
      // Fallback to demo data if API fails
      if (!isLoadMore) {
        setRestaurants([
          {
            id: "demo-1",
            name: "Verdura Atlanta",
            rating: 4.5,
            priceLevel: 2,
            vegLabel: "Vegan/Veg Friendly",
            vegScore: 95,
            lat: 33.7490,
            lng: -84.3880,
            address: "123 Peachtree St, Atlanta, GA",
            types: ["restaurant", "vegetarian_restaurant"],
            photos: undefined, // No photos for demo, will show map
          },
          {
            id: "demo-2", 
            name: "Plant-Based Kitchen",
            rating: 4.3,
            priceLevel: 2,
            vegLabel: "Vegan/Veg Friendly",
            vegScore: 90,
            lat: 33.7580,
            lng: -84.3963,
            address: "456 Ponce de Leon Ave, Atlanta, GA",
            types: ["restaurant", "vegan_restaurant"],
            photos: undefined, // No photos for demo, will show map
          },
        ]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchRestaurants(0);
  }, []);

  const loadMoreRestaurants = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchRestaurants(nextPage, true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            🌱 Discover Veg-Friendly Atlanta
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Finding the best vegetarian and vegan restaurants in the city
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 animate-pulse">
              <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="flex gap-2">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 py-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          🌱 Discover Veg-Friendly Atlanta
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          A curated feed of vegetarian and vegan-friendly restaurants, cafes, and eateries in Atlanta
        </p>
      </div>

      {error && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-yellow-800 dark:text-yellow-200">{error}</p>
          <button 
            onClick={() => fetchRestaurants(0)}
            className="mt-2 text-sm text-yellow-600 dark:text-yellow-400 hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Restaurant Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant, index) => (
          <PlaceCard
            key={`${restaurant.id}-${index}`}
            id={restaurant.id}
            name={restaurant.name}
            rating={restaurant.rating}
            priceLevel={restaurant.priceLevel}
            vegLabel={restaurant.vegLabel}
            lat={restaurant.lat}
            lng={restaurant.lng}
            address={restaurant.address}
            types={restaurant.types}
            photos={restaurant.photos}
          />
        ))}
      </div>

      {/* Load More Button */}
      {restaurants.length > 0 && (
        <div className="text-center py-8">
          <button
            onClick={loadMoreRestaurants}
            disabled={loadingMore}
            className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {loadingMore ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Loading more delicious options...
              </span>
            ) : (
              "🍽️ Load More Restaurants"
            )}
          </button>
        </div>
      )}

      {/* Empty State */}
      {restaurants.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🌱</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No restaurants found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            We couldn't find any veg-friendly restaurants at the moment.
          </p>
          <button
            onClick={() => fetchRestaurants(0)}
            className="text-green-600 dark:text-green-400 hover:underline"
          >
            Try searching again
          </button>
        </div>
      )}
    </div>
  );
}
