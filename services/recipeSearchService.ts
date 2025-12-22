import { Recipe } from '../types';

// Mock data for simulation
const MOCK_RECIPES: Recipe[] = [
  {
    id: '1',
    title: 'Spaghetti Carbonara',
    description: 'Classic Roman pasta dish.',
    ingredients: ['Spaghetti', 'Eggs', 'Pancetta', 'Pecorino Romano'],
    instructions: ['Cook spaghetti.', 'Fry pancetta.', 'Mix eggs and cheese.', 'Combine all.'],
    category: 'Pasta',
    prepTime: '15 min',
    cookTime: '20 min',
    yields: '2 servings',
    imageUrl: '',
    addedBy: 'Chef John',
    userColor: '#FF5733',
  },
  {
    id: '2',
    title: 'Chicken Curry',
    description: 'A rich and spicy chicken curry.',
    ingredients: ['Chicken', 'Curry powder', 'Coconut milk', 'Onion', 'Garlic'],
    instructions: ['Sauté onion and garlic.', 'Add chicken and curry powder.', 'Stir in coconut milk and simmer.'],
    category: 'Curry',
    prepTime: '20 min',
    cookTime: '40 min',
    yields: '4 servings',
    imageUrl: '',
    addedBy: 'Chef Jane',
    userColor: '#33FF57',
  },
  {
    id: '3',
    title: 'Vegetable Stir Fry',
    description: 'Quick and healthy stir fry with seasonal vegetables.',
    ingredients: ['Broccoli', 'Carrots', 'Bell peppers', 'Soy sauce', 'Ginger'],
    instructions: ['Chop vegetables.', 'Stir fry vegetables.', 'Add soy sauce and ginger.'],
    category: 'Vegetarian',
    prepTime: '15 min',
    cookTime: '15 min',
    yields: '3 servings',
    imageUrl: '',
    addedBy: 'Chef Alex',
    userColor: '#5733FF',
  },
  {
    id: '4',
    title: 'Beef Stroganoff',
    description: 'Creamy beef and mushroom dish.',
    ingredients: ['Beef sirloin', 'Mushrooms', 'Onion', 'Sour cream', 'Egg noodles'],
    instructions: ['Cook egg noodles.', 'Sear beef.', 'Sauté mushrooms and onion.', 'Combine with sour cream.'],
    category: 'Beef',
    prepTime: '25 min',
    cookTime: '30 min',
    yields: '4 servings',
    imageUrl: '',
    addedBy: 'Chef Maria',
    userColor: '#FF33A8',
  },
  {
    id: '5',
    title: 'Lentil Soup',
    description: 'Hearty and healthy lentil soup.',
    ingredients: ['Lentils', 'Carrots', 'Celery', 'Onion', 'Vegetable broth'],
    instructions: ['Sauté vegetables.', 'Add lentils and broth.', 'Simmer until tender.'],
    category: 'Soup',
    prepTime: '15 min',
    cookTime: '45 min',
    yields: '6 servings',
    imageUrl: '',
    addedBy: 'Chef David',
    userColor: '#33A8FF',
  },
];

const simulateLatency = (min = 300, max = 800) => {
  return new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));
};

export const searchRecipes = async (term: string, userId: string): Promise<Recipe[]> => {
  await simulateLatency(); // Simulate network delay

  const lowerCaseTerm = term.toLowerCase();

  const filtered = MOCK_RECIPES.filter(recipe => {
    // Simulate searching by title and ingredients
    const matchesTitle = recipe.title.toLowerCase().includes(lowerCaseTerm);
    const matchesIngredients = recipe.ingredients.some(ingredient =>
      ingredient.toLowerCase().includes(lowerCaseTerm)
    );
    return matchesTitle || matchesIngredients;
  });

  return filtered;
};
