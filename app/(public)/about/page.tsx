export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          About ATLVeg
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Discover the best vegetarian and vegan-friendly restaurants in Atlanta
        </p>
      </div>

      {/* Purpose Section */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-8 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          🌱 Our Purpose
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          ATLVeg helps you discover restaurants and eateries in Atlanta that cater to vegetarian and vegan lifestyles. 
          Whether you're a lifelong vegetarian, exploring plant-based options, or simply looking for healthier meal choices, 
          we make it easy to find places that welcome and accommodate your dietary preferences.
        </p>
      </div>

      {/* Veg Score Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          🏆 Understanding the Veg Score
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-3">
              What is the Veg Score?
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              The Veg Score is our unique rating system that evaluates how vegetarian and vegan-friendly a restaurant is, 
              rated from 0 to 100. It's calculated based on the restaurant's name, type of cuisine, and other available information.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-3">
              How is it calculated?
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              We analyze restaurant names, cuisine types, and menu descriptions to identify veg-friendly keywords. 
              Restaurants with terms like "vegan," "plant-based," or "vegetarian" score higher, while traditional meat-focused establishments score lower.
            </p>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Score Categories
          </h3>
          
          <div className="grid gap-3">
            <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="w-16 h-8 bg-green-500 rounded flex items-center justify-center text-white text-sm font-bold">
                70+
              </div>
              <div>
                <span className="font-semibold text-green-800 dark:text-green-200">Vegan/Veg Friendly</span>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Restaurants that are fully vegetarian/vegan or have extensive plant-based options
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="w-16 h-8 bg-yellow-500 rounded flex items-center justify-center text-white text-sm font-bold">
                50-69
              </div>
              <div>
                <span className="font-semibold text-yellow-800 dark:text-yellow-200">Veg Options Available</span>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Restaurants with good vegetarian selections and accommodating options
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="w-16 h-8 bg-orange-500 rounded flex items-center justify-center text-white text-sm font-bold">
                30-49
              </div>
              <div>
                <span className="font-semibold text-orange-800 dark:text-orange-200">Limited Veg Options</span>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  Restaurants with some vegetarian options, though not the main focus
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="w-16 h-8 bg-gray-500 rounded flex items-center justify-center text-white text-sm font-bold">
                0-29
              </div>
              <div>
                <span className="font-semibold text-gray-800 dark:text-gray-200">Minimal Veg Options</span>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Primarily meat-focused restaurants with very limited vegetarian choices
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How to Use Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          🚀 How to Use ATLVeg
        </h2>
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              1
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Browse the Feed</h4>
              <p className="text-gray-600 dark:text-gray-400">
                Scroll through our curated list of veg-friendly restaurants in Atlanta
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              2
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Check the Veg Label</h4>
              <p className="text-gray-600 dark:text-gray-400">
                Look for the colored label on each restaurant card to see how veg-friendly it is
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              3
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Get Directions or Details</h4>
              <p className="text-gray-600 dark:text-gray-400">
                Use the directions button to navigate there, or click details to see the full Veg Score and more info
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center py-6">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          ATLVeg is designed to help you make informed dining choices. 
          Always check with restaurants directly about specific dietary requirements and allergens.
        </p>
      </div>
    </div>
  );
}
