import { DRUGS, LOCATIONS, RANDOM_EVENTS, GAME_SETTINGS } from './constants';

// Generate random prices for drugs based on location and day
export const generateMarketPrices = (location, day) => {
  const marketPrices = {};
  
  DRUGS.forEach(drug => {
    // Base price calculation
    const range = drug.maxPrice - drug.minPrice;
    const basePrice = drug.minPrice + Math.random() * range;
    
    // Add location-based variation
    const locationIndex = LOCATIONS.findIndex(loc => loc.id === location);
    const locationFactor = 0.8 + (locationIndex / LOCATIONS.length) * 0.4;
    
    // Add day-based variation (prices tend to increase over time)
    const dayFactor = 1 + (day / GAME_SETTINGS.maxTurns) * 0.2;
    
    // Add volatility (random fluctuation)
    const volatilityFactor = 0.7 + Math.random() * drug.volatility;
    
    // Calculate final price
    const finalPrice = Math.round(basePrice * locationFactor * dayFactor * volatilityFactor);
    
    marketPrices[drug.id] = finalPrice;
  });
  
  return marketPrices;
};

// Check if a random event should occur
export const checkForRandomEvent = () => {
  const randomValue = Math.random();
  let cumulativeProbability = 0;
  
  for (const event of RANDOM_EVENTS) {
    cumulativeProbability += event.probability;
    if (randomValue < cumulativeProbability) {
      console.log(`Random event: ${event.name}`);
      return event;
    }
  }
  
  return null;
};

// Buy drugs
export const buyDrug = (state, drugId, quantity) => {
  const drugPrice = state.marketPrices[drugId];
  const totalCost = drugPrice * quantity;
  
  // Check if player has enough cash
  if (state.cash < totalCost) {
    return {
      ...state,
      messages: [...state.messages, "You don't have enough cash for this purchase."]
    };
  }
  
  // Check if player has enough inventory space
  if (state.inventory.total + quantity > GAME_SETTINGS.maxInventorySpace) {
    return {
      ...state,
      messages: [...state.messages, "You don't have enough space in your inventory."]
    };
  }
  
  // Update inventory and cash
  const updatedInventory = {
    ...state.inventory,
    [drugId]: (state.inventory[drugId] || 0) + quantity,
    total: Math.max(0, (state.inventory.total || 0) + quantity)
  };
  
  return {
    ...state,
    inventory: updatedInventory,
    cash: state.cash - totalCost,
    //messages: [...state.messages, `Bought ${quantity} ${DRUGS.find(d => d.id === drugId).name} for $${totalCost}.`]
  };
};

// Sell drugs
export const sellDrug = (state, drugId, quantity) => {
  // Check if player has enough of the drug
  if (!state.inventory[drugId] || state.inventory[drugId] < quantity) {
    return {
      ...state,
      messages: [...state.messages, `You don't have enough ${DRUGS.find(d => d.id === drugId).name} to sell.`]
    };
  }
  
  const drugPrice = state.marketPrices[drugId];
  const totalProfit = drugPrice * quantity;
  
  // Update inventory and cash
  const updatedInventory = {
    ...state.inventory,
    [drugId]: Math.max(0, state.inventory[drugId] - quantity),
    total: Math.max(0, state.inventory.total - quantity)
  };
  
  return {
    ...state,
    inventory: updatedInventory,
    cash: state.cash + totalProfit,
    //messages: [...state.messages, `Sold ${quantity} ${DRUGS.find(d => d.id === drugId).name} for $${totalProfit}.`]
  };
};

// Travel to a new location
export const travelToLocation = (state, locationId) => {
  // Check if player is already at this location
  if (state.currentLocation === locationId) {
    return {
      ...state,
      messages: [...state.messages, "You're already at this location."]
    };
  }
  
  // Increase day by one when traveling
  const newDay = state.day + 1;
  
  // Generate new market prices for the new location
  const newMarketPrices = generateMarketPrices(locationId, newDay);
  
  // Check for random events when traveling
  const randomEvent = checkForRandomEvent();
  let updatedState = {
    ...state,
    day: newDay,
    currentLocation: locationId,
    marketPrices: newMarketPrices,
    messages: [...state.messages, `Traveled to ${LOCATIONS.find(loc => loc.id === locationId).name}. A new day has begun.`]
  };
  
  // Apply random event if one occurred
  if (randomEvent) {
    updatedState = randomEvent.effect(updatedState);
  }
  
  // Apply daily interest to debt
  if (updatedState.debt > 0) {
    const interest = Math.floor(updatedState.debt * GAME_SETTINGS.interestRate);
    updatedState = {
      ...updatedState,
      debt: updatedState.debt + interest,
      messages: [...updatedState.messages, `Interest added to debt: $${interest}.`]
    };
  }
  
  // Check if game is over due to reaching max days
  if (newDay >= updatedState.maxDays) {
    updatedState = {
      ...updatedState,
      gameOver: true,
      messages: [...updatedState.messages, `Game over! You've reached the maximum number of days (${updatedState.maxDays}).`]
    };
  }
  
  return updatedState;
};

// End the current day and move to the next
export const endDay = (state) => {
  // Check if game is over
  if (state.day >= state.maxDays) {
    return {
      ...state,
      gameOver: true,
      messages: [...state.messages, "Game Over! You've reached the maximum number of days."]
    };
  }
  
  // Calculate interest on debt
  const interestAmount = Math.round(state.debt * GAME_SETTINGS.interestRate);
  const newDebt = state.debt + interestAmount;
  
  // Generate new market prices for the current location
  console.log('endDay - Current day before increment:', state.day);
  const newMarketPrices = generateMarketPrices(state.currentLocation, state.day + 1);
  const newDayNumber = state.day + 1;
  console.log('endDay - New day after increment:', newDayNumber);
  
  return {
    ...state,
    day: newDayNumber,
    debt: newDebt,
    marketPrices: newMarketPrices,
    messages: [
      `Day ${newDayNumber} begins. Interest of $${interestAmount} added to your debt.`
    ]
  };
};

// Pay back some debt
export const payDebt = (state, amount) => {
  // Check if player has enough cash
  if (state.cash < amount) {
    return {
      ...state,
      messages: [...state.messages, "You don't have enough cash to pay this much."]
    };
  }
  
  // Check if player is trying to pay more than they owe
  if (amount > state.debt) {
    return {
      ...state,
      messages: [...state.messages, "You can't pay more than you owe."]
    };
  }
  
  return {
    ...state,
    cash: state.cash - amount,
    debt: state.debt - amount,
    messages: [...state.messages, `Paid $${amount} toward your debt.`]
  };
};

// Borrow money from the loan shark
export const borrowMoney = (state, amount) => {
  // Check if borrowing would exceed max loan
  if (state.debt + amount > GAME_SETTINGS.maxLoan) {
    return {
      ...state,
      messages: [...state.messages, `You can't borrow that much. Maximum loan is $${GAME_SETTINGS.maxLoan}.`]
    };
  }
  
  return {
    ...state,
    cash: state.cash + amount,
    debt: state.debt + amount,
    messages: [...state.messages, `Borrowed $${amount} from the loan shark.`]
  };
};

// Repay debt (same as payDebt but with a different message)
export const repayDebt = (state, amount) => {
  // Check if player has enough cash
  if (state.cash < amount) {
    return {
      ...state,
      messages: [...state.messages, "You don't have enough cash to repay this much."]
    };
  }
  
  // Check if player is trying to pay more than they owe
  if (amount > state.debt) {
    return {
      ...state,
      messages: [...state.messages, "You can't repay more than you owe."]
    };
  }
  
  return {
    ...state,
    cash: state.cash - amount,
    debt: state.debt - amount,
    //messages: [...state.messages, `Repaid $${amount} of your debt.`]
  };
};

// Fix corrupted game state (for handling existing bugs like negative inventory)
export const fixGameState = (state) => {
  // Create a fixed copy of the state
  const fixedState = { ...state };
  
  // Fix inventory issues
  if (fixedState.inventory) {
    // Create a copy of the inventory
    const fixedInventory = { ...fixedState.inventory };
    let totalDrugs = 0;
    
    // Fix individual drug counts and calculate the correct total
    Object.keys(fixedInventory).forEach(drugId => {
      if (drugId !== 'total') {
        // Ensure drug count is non-negative
        fixedInventory[drugId] = Math.max(0, fixedInventory[drugId] || 0);
        totalDrugs += fixedInventory[drugId];
      }
    });
    
    // Set the correct total
    fixedInventory.total = totalDrugs;
    
    // Update the inventory in the fixed state
    fixedState.inventory = fixedInventory;
  }
  
  // Add any other state fixes here if needed
  
  return fixedState;
};

// Initialize a new game state
export const initializeGame = () => {
  const startingLocation = LOCATIONS[0].id;
  return {
    day: 1,
    maxDays: GAME_SETTINGS.maxTurns, // Store the max days in the state
    cash: GAME_SETTINGS.startingCash,
    debt: GAME_SETTINGS.startingDebt,
    currentLocation: startingLocation,
    maxInventorySpace: GAME_SETTINGS.maxInventorySpace, // Store max inventory space in state
    inventory: {
      total: 0
    },
    marketPrices: generateMarketPrices(startingLocation, 1),
    messages: ["Welcome to DrugWars! You start in the Bronx with $2000 cash and $5500 debt."],
    gameOver: false
  };
};

// Debug functions for development and testing
export const debugAddCash = (state, amount) => {
  return {
    ...state,
    cash: state.cash + amount
  };
};

export const debugClearDebt = (state) => {
  return {
    ...state,
    debt: 0
  };
};

export const debugSetDaysRemaining = (state, days) => {
  return {
    ...state,
    day: 1, // Always start from day 1
    maxDays: days // Store the actual days remaining as a separate property
  };
};

export const debugAddInventory = (state, drugId, quantity) => {
  // Create a copy of the inventory
  const updatedInventory = { ...state.inventory };
  
  // Update the specific drug quantity
  updatedInventory[drugId] = (updatedInventory[drugId] || 0) + quantity;
  
  // Recalculate total
  let totalDrugs = 0;
  Object.keys(updatedInventory).forEach(id => {
    if (id !== 'total') {
      totalDrugs += updatedInventory[id];
    }
  });
  updatedInventory.total = totalDrugs;
  
  return {
    ...state,
    inventory: updatedInventory
  };
};

export const debugSetInventorySpace = (state, newSpace) => {
  return {
    ...state,
    maxInventorySpace: newSpace,
    messages: [...state.messages, `Set trenchcoat capacity to ${newSpace} units.`]
  };
};
