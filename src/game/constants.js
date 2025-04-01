// Game constants for DrugWars

// Locations in the game
export const LOCATIONS = [
  { id: 'bronx', name: 'Bronx', description: 'The Bronx is known for its tough streets and high crime rate.' },
  { id: 'brooklyn', name: 'Brooklyn', description: 'Brooklyn has a mix of safe and dangerous areas.' },
  { id: 'queens', name: 'Queens', description: 'Queens is a diverse borough with varying levels of safety.' },
  { id: 'manhattan', name: 'Manhattan', description: 'Manhattan is the heart of NYC, with high police presence.' },
  { id: 'statenIsland', name: 'Staten Island', description: 'Staten Island is relatively isolated from the rest of NYC.' },
  { id: 'centralPark', name: 'Central Park', description: 'Central Park is a large urban park with hidden spots for deals.' },
];

// Drugs available in the game
export const DRUGS = [
  { id: 'weed', name: 'Weed', minPrice: 300, maxPrice: 800, volatility: 1.2 },
  { id: 'cocaine', name: 'Cocaine', minPrice: 1000, maxPrice: 3000, volatility: 1.5 },
  { id: 'heroin', name: 'Heroin', minPrice: 5000, maxPrice: 9000, volatility: 1.8 },
  { id: 'acid', name: 'Acid', minPrice: 1000, maxPrice: 4000, volatility: 2.0 },
  { id: 'speed', name: 'Speed', minPrice: 250, maxPrice: 1500, volatility: 1.3 },
  { id: 'ludes', name: 'Ludes', minPrice: 10, maxPrice: 40, volatility: 1.1 },
];

// Random events that can occur during gameplay
export const RANDOM_EVENTS = [
  {
    id: 'police_bust',
    name: 'Police Bust',
    description: 'You got caught in a police bust! You lose some drugs and cash.',
    probability: 0.05,
    effect: (state) => {
      // Logic to handle police bust
      // Calculate how many drugs to lose (up to 30% of total)
      const maxDrugsToLose = Math.floor(Math.random() * 0.3 * state.inventory.total);
      let drugsLost = 0;
      
      // Create a copy of the inventory to modify
      const updatedInventory = { ...state.inventory };
      
      // Go through each drug and remove some proportionally
      Object.keys(updatedInventory).forEach(drugId => {
        if (drugId !== 'total' && updatedInventory[drugId] > 0) {
          // Calculate how many of this drug to lose
          const drugLoss = Math.min(
            updatedInventory[drugId],
            Math.floor((updatedInventory[drugId] / updatedInventory.total) * maxDrugsToLose)
          );
          
          // Update the inventory
          updatedInventory[drugId] -= drugLoss;
          drugsLost += drugLoss;
        }
      });
      
      // Update the total
      updatedInventory.total = Math.max(0, updatedInventory.total - drugsLost);
      
      // Calculate cash lost (up to 20% of total)
      const cashLost = Math.floor(Math.random() * 0.2 * state.cash);
      
      return {
        ...state,
        inventory: updatedInventory,
        cash: state.cash - cashLost,
        messages: [...state.messages, `Police Bust! Lost ${drugsLost} drugs and $${cashLost}.`]
      };
    }
  },
  {
    id: 'new_trenchcoat',
    name: 'New Trenchcoat',
    description: 'You found a new trenchcoat with more pockets!',
    probability: 0.5, // 5% chance per day
    effect: (state) => {
      // Skip this event if the player has already found a trenchcoat
      if (state.foundTrenchcoat) {
        return state;
      }
      
      // Increase inventory capacity by 100
      const newMaxInventorySpace = state.maxInventorySpace + 100;
      
      return {
        ...state,
        maxInventorySpace: newMaxInventorySpace,
        foundTrenchcoat: true, // Mark that the player has found the trenchcoat
        messages: [...state.messages, `You found a new trenchcoat with more pockets!`]
      };
    }
  },
  {
    id: 'price_spike',
    name: 'Price Spike',
    description: 'There\'s a sudden spike in drug prices!',
    probability: 0.1,
    effect: (state) => {
      // Create new market prices with a significant increase (60-100% more)
      const increaseFactor = 1.6 + Math.random() * 0.4; // Random increase between 60-100%
      const spikePrices = {};
      
      // Apply increase to all drugs
      Object.keys(state.marketPrices).forEach(drugId => {
        // Calculate increased price, ensuring it doesn't go above the drug's maximum price
        const drug = DRUGS.find(d => d.id === drugId);
        if (drug) {
          const increasedPrice = Math.round(state.marketPrices[drugId] * increaseFactor);
          spikePrices[drugId] = Math.min(drug.maxPrice * 1.5, increasedPrice); // Allow up to 50% above normal max
        } else {
          spikePrices[drugId] = state.marketPrices[drugId];
        }
      });
      
      return {
        ...state,
        marketPrices: spikePrices,
        messages: [...state.messages, 'Drug prices have spiked in the area! Great time to sell!']
      };
    }
  },
  {
    id: 'price_plummet',
    name: 'Price Plummet',
    description: 'Drug prices have suddenly plummeted!',
    probability: 0.1,
    effect: (state) => {
      // Create new market prices with a significant discount (40-60% off)
      const discountFactor = 0.4 + Math.random() * 0.2; // Random discount between 40-60%
      const plummetPrices = {};
      
      // Apply discount to all drugs
      Object.keys(state.marketPrices).forEach(drugId => {
        // Calculate discounted price, ensuring it doesn't go below the drug's minimum price
        const drug = DRUGS.find(d => d.id === drugId);
        if (drug) {
          const discountedPrice = Math.round(state.marketPrices[drugId] * discountFactor);
          plummetPrices[drugId] = Math.max(drug.minPrice, discountedPrice);
        } else {
          plummetPrices[drugId] = state.marketPrices[drugId];
        }
      });
      
      return {
        ...state,
        marketPrices: plummetPrices,
        messages: [...state.messages, 'Drug prices have plummeted! Now is a great time to buy!']
      };
    }
  },
  {
    id: 'mugging',
    name: 'Mugging',
    description: 'You got mugged! You lose some cash.',
    probability: 0.07,
    effect: (state) => {
      // Logic to handle mugging
      const cashLost = Math.floor(Math.random() * 0.3 * state.cash);
      return {
        ...state,
        cash: state.cash - cashLost,
        messages: [...state.messages, `You got mugged! Lost $${cashLost}.`]
      };
    }
  },
];

// Game settings
export const GAME_SETTINGS = {
  startingCash: 2000,
  startingDebt: 5500,
  interestRate: 0.1, // 10% interest on debt per turn
  maxTurns: 30,
  maxInventorySpace: 100,
  maxLoan: 50000, // Maximum amount the player can borrow
};
