// Manual implementation of the algorithm for testing
function calculateVegScore(place) {
  let score = 0;
  const reasoning = [];
  
  const name = place.displayName?.text || place.name || "";
  const types = place.types || [];
  
  // PRIMARY VEG KEYWORDS - These should guarantee high scores
  const primaryVegKeywords = [
    "vegan", "vegetarian", "plant-based", "plant based", "veggie", "vegetable"
  ];
  
  // SECONDARY VEG KEYWORDS - Health/veg-friendly indicators
  const secondaryVegKeywords = [
    "organic", "natural", "healthy", "fresh", "green", "earth", "sprout", 
    "leaf", "harvest", "garden", "superfood", "juice", "smoothie", "salad",
    "quinoa", "kale", "avocado", "Buddha bowl", "bowl"
  ];
  
  // ANTI-VEG KEYWORDS - Meat-focused indicators
  const antiVegKeywords = [
    "bbq", "barbecue", "steakhouse", "burger", "fried chicken", 
    "wings", "seafood", "sushi", "meat", "grill", "butcher", "smokehouse",
    "ribs", "brisket", "steak", "beef", "pork", "bacon"
  ];
  
  // Check name for veg-friendly keywords
  const nameLower = name.toLowerCase();
  
  // Primary veg keywords get MAJOR score boost
  const foundPrimaryVegKeywords = primaryVegKeywords.filter(keyword => nameLower.includes(keyword));
  if (foundPrimaryVegKeywords.length > 0) {
    score += foundPrimaryVegKeywords.length * 40; // Much higher score!
    reasoning.push(`PRIMARY veg keywords: ${foundPrimaryVegKeywords.join(", ")}`);
  }
  
  // Secondary veg keywords get moderate boost
  const foundSecondaryVegKeywords = secondaryVegKeywords.filter(keyword => nameLower.includes(keyword));
  if (foundSecondaryVegKeywords.length > 0) {
    score += foundSecondaryVegKeywords.length * 10;
    reasoning.push(`Health/veg-friendly keywords: ${foundSecondaryVegKeywords.join(", ")}`);
  }
  
  // Anti-veg keywords reduce score
  const foundAntiVegKeywords = antiVegKeywords.filter(keyword => nameLower.includes(keyword));
  if (foundAntiVegKeywords.length > 0) {
    score -= foundAntiVegKeywords.length * 20; // Increased penalty
    reasoning.push(`Meat-focused keywords: ${foundAntiVegKeywords.join(", ")}`);
  }
  
  // Type-based scoring with expanded categories
  const vegFriendlyTypes = [
    "meal_delivery", "meal_takeaway", "cafe", "health_food_store",
    "organic_store", "juice_bar", "salad_bar", "vegetarian_restaurant",
    "vegan_restaurant", "health_food_restaurant"
  ];
  
  const meatFocusedTypes = [
    "barbecue_restaurant", "steakhouse", "seafood_restaurant", "butcher_shop"
  ];
  
  const foundVegTypes = types.filter(type => vegFriendlyTypes.includes(type));
  const foundMeatTypes = types.filter(type => meatFocusedTypes.includes(type));
  
  if (foundVegTypes.length > 0) {
    score += foundVegTypes.length * 30; // Higher type bonus
    reasoning.push(`Veg-friendly business type: ${foundVegTypes.join(", ")}`);
  }
  
  if (foundMeatTypes.length > 0) {
    score -= foundMeatTypes.length * 25; // Higher penalty
    reasoning.push(`Meat-focused business type: ${foundMeatTypes.join(", ")}`);
  }
  
  // Base score for restaurants (lower base score to make room for veg bonuses)
  if (types.includes("restaurant") || types.includes("meal_delivery") || types.includes("cafe")) {
    score += 20; // Reduced base score
    reasoning.push("Base restaurant score");
  }
  
  // Ensure score is between 0-100
  score = Math.max(0, Math.min(100, score));
  
  // UPDATED THRESHOLDS - More reasonable for the new scoring
  let label;
  if (score >= 60) label = "Vegan/Veg Friendly";        // Lowered from 70
  else if (score >= 40) label = "Veg Options Available"; // Lowered from 50  
  else if (score >= 20) label = "Limited Veg Options";   // Lowered from 30
  else label = "Minimal Veg Options";
  
  return { score, label, reasoning };
}

// Test cases
const testCases = [
  { name: 'Green Seed Vegan', types: ['restaurant'] },
  { name: 'Atlanta Vegetarian Restaurant', types: ['restaurant'] },  
  { name: 'Plant Based Kitchen', types: ['restaurant'] },
  { name: 'The Steakhouse', types: ['restaurant'] },
  { name: 'Fresh Juice Bar', types: ['juice_bar'] },
  { name: 'Regular Pizza Place', types: ['restaurant'] },
  { name: 'Vegan Delights', types: ['restaurant'] },
  { name: 'Farm to Table Organic', types: ['restaurant'] }
];

console.log('Testing Veg Score Algorithm:\n');

testCases.forEach(test => {
  const result = calculateVegScore({ displayName: { text: test.name }, types: test.types });
  console.log(`${test.name}:`);
  console.log(`  Score: ${result.score}`);
  console.log(`  Label: ${result.label}`);
  console.log(`  Reasoning: ${result.reasoning.join(', ')}`);
  console.log('');
});
