import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { 
  initializeGame, 
  buyDrug, 
  sellDrug, 
  travelToLocation, 
  endDay, 
  payDebt,
  borrowMoney,
  repayDebt,
  depositMoney,
  withdrawMoney,
  fixGameState,
  debugAddCash,
  debugClearDebt,
  debugSetDaysRemaining,
  debugAddInventory,
  debugSetInventorySpace
} from '../game/gameLogic';
import { GAME_SETTINGS } from '../game/constants';

// Main game state atom with local storage persistence
export const gameStateAtom = atomWithStorage('drugwars-game-state', initializeGame(), {
  getItem: (key) => {
    const storedValue = localStorage.getItem(key);
    if (!storedValue) return initializeGame();
    
    try {
      // Parse the stored value and fix any corrupted state
      const parsedValue = JSON.parse(storedValue);
      return fixGameState(parsedValue);
    } catch (e) {
      console.error('Error parsing game state:', e);
      return initializeGame();
    }
  },
  setItem: (key, value) => {
    // Fix the state before storing it
    const fixedValue = fixGameState(value);
    localStorage.setItem(key, JSON.stringify(fixedValue));
  },
  removeItem: (key) => {
    localStorage.removeItem(key);
  },
});

// Derived atoms for specific parts of the game state
export const dayAtom = atom(
  (get) => get(gameStateAtom).day
);

export const maxDaysAtom = atom(
  (get) => get(gameStateAtom).maxDays
);

export const maxInventorySpaceAtom = atom(
  (get) => get(gameStateAtom).maxInventorySpace || GAME_SETTINGS.maxInventorySpace
);

export const cashAtom = atom(
  (get) => get(gameStateAtom).cash
);

export const bankBalanceAtom = atom(
  (get) => get(gameStateAtom).bankBalance || 0
);

export const debtAtom = atom(
  (get) => get(gameStateAtom).debt
);

export const currentLocationAtom = atom(
  (get) => get(gameStateAtom).currentLocation
);

export const inventoryAtom = atom(
  (get) => get(gameStateAtom).inventory
);

export const marketPricesAtom = atom(
  (get) => get(gameStateAtom).marketPrices
);

export const messagesAtom = atom(
  (get) => get(gameStateAtom).messages
);

// Add a writable atom for adding messages
export const addMessageAtom = atom(
  null,
  (get, set, message) => {
    const currentState = get(gameStateAtom);
    const newMessages = [...currentState.messages, message];
    // Limit to last 5 messages to prevent excessive memory usage
    const limitedMessages = newMessages.slice(-5);
    set(gameStateAtom, {
      ...currentState,
      messages: limitedMessages
    });
  }
);

// Add a writable atom for clearing all messages
export const clearMessagesAtom = atom(
  null,
  (get, set) => {
    const currentState = get(gameStateAtom);
    set(gameStateAtom, {
      ...currentState,
      messages: []
    });
  }
);

export const gameOverAtom = atom(
  (get) => get(gameStateAtom).gameOver
);

// Action atoms for game operations
export const buyDrugAtom = atom(
  null,
  (get, set, { drugId, quantity }) => {
    const currentState = get(gameStateAtom);
    const newState = buyDrug(currentState, drugId, quantity);
    set(gameStateAtom, newState);
  }
);

export const sellDrugAtom = atom(
  null,
  (get, set, { drugId, quantity }) => {
    const currentState = get(gameStateAtom);
    const newState = sellDrug(currentState, drugId, quantity);
    set(gameStateAtom, newState);
  }
);

export const travelAtom = atom(
  null,
  (get, set, locationId) => {
    console.log('travelAtom - Called');
    const currentState = get(gameStateAtom);
    const newState = travelToLocation(currentState, locationId);
    set(gameStateAtom, newState);
  }
);

export const endDayAtom = atom(
  null,
  (get, set) => {
    console.log('endDayAtom - Called');
    const currentState = get(gameStateAtom);
    console.log('endDayAtom - Current day before endDay:', currentState.day);
    const newState = endDay(currentState);
    console.log('endDayAtom - New day after endDay:', newState.day);
    set(gameStateAtom, newState);
  }
);

export const payDebtAtom = atom(
  null,
  (get, set, amount) => {
    const currentState = get(gameStateAtom);
    const newState = payDebt(currentState, amount);
    set(gameStateAtom, newState);
  }
);

export const borrowMoneyAtom = atom(
  null,
  (get, set, amount) => {
    const currentState = get(gameStateAtom);
    const newState = borrowMoney(currentState, amount);
    set(gameStateAtom, newState);
  }
);

export const repayDebtAtom = atom(
  null,
  (get, set, amount) => {
    const currentState = get(gameStateAtom);
    const newState = repayDebt(currentState, amount);
    set(gameStateAtom, newState);
  }
);

// Bank action atoms
export const depositMoneyAtom = atom(
  null,
  (get, set, amount) => {
    const currentState = get(gameStateAtom);
    const newState = depositMoney(currentState, amount);
    set(gameStateAtom, newState);
  }
);

export const withdrawMoneyAtom = atom(
  null,
  (get, set, amount) => {
    const currentState = get(gameStateAtom);
    const newState = withdrawMoney(currentState, amount);
    set(gameStateAtom, newState);
  }
);

// Add a fix state atom to manually fix corrupted state
export const fixStateAtom = atom(
  null,
  (get, set) => {
    const currentState = get(gameStateAtom);
    const fixedState = fixGameState(currentState);
    set(gameStateAtom, fixedState);
  }
);

// Debug atoms for development and testing
export const debugAddCashAtom = atom(
  null,
  (get, set, amount) => {
    const currentState = get(gameStateAtom);
    const newState = debugAddCash(currentState, amount);
    set(gameStateAtom, newState);
  }
);

export const debugClearDebtAtom = atom(
  null,
  (get, set) => {
    const currentState = get(gameStateAtom);
    const newState = debugClearDebt(currentState);
    set(gameStateAtom, newState);
  }
);

export const debugSetDaysRemainingAtom = atom(
  null,
  (get, set, days) => {
    const currentState = get(gameStateAtom);
    const newState = debugSetDaysRemaining(currentState, days);
    set(gameStateAtom, newState);
  }
);

export const debugAddInventoryAtom = atom(
  null,
  (get, set, { drugId, quantity }) => {
    const currentState = get(gameStateAtom);
    const newState = debugAddInventory(currentState, drugId, quantity);
    set(gameStateAtom, newState);
  }
);

export const debugSetInventorySpaceAtom = atom(
  null,
  (get, set, additionalSpace) => {
    const currentState = get(gameStateAtom);
    const newState = debugSetInventorySpace(currentState, additionalSpace);
    set(gameStateAtom, newState);
  }
);

export const resetGameAtom = atom(
  null,
  (get, set) => {
    set(gameStateAtom, initializeGame());
  }
);
