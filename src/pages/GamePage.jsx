import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { 
  gameStateAtom,
  dayAtom,
  cashAtom,
  debtAtom,
  currentLocationAtom,
  inventoryAtom,
  messagesAtom,
  gameOverAtom,
  maxDaysAtom,
  maxInventorySpaceAtom,
  marketPricesAtom,
  buyDrugAtom,
  sellDrugAtom,
  travelAtom,
  endDayAtom,
  payDebtAtom,
  borrowMoneyAtom,
  repayDebtAtom,
  resetGameAtom,
  fixStateAtom,
  addMessageAtom,
  clearMessagesAtom,
  debugAddCashAtom,
  debugClearDebtAtom,
  debugSetDaysRemainingAtom,
  debugAddInventoryAtom,
  debugSetInventorySpaceAtom
} from '../atoms/gameAtoms';
import { DRUGS, LOCATIONS, GAME_SETTINGS } from '../game/constants';

// Main game screens
const SCREENS = {
  MAIN: 'main',
  PRICES: 'prices',
  TRAVEL: 'travel',
  BUY: 'buy',
  SELL: 'sell',
  INVENTORY: 'inventory',
  LOAN_SHARK: 'loanShark',
  GAME_OVER: 'gameOver',
  DEBUG_MENU: 'debugMenu'
};

const CalculatorGamePage = () => {
  // Screen state
  const [currentScreen, setCurrentScreen] = useState(SCREENS.MAIN);
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [loanAction, setLoanAction] = useState(null);
  const [loanAmount, setLoanAmount] = useState(1000);
  const [debugMode, setDebugMode] = useState(false);
  
  // Debug menu state
  const [debugMenuScreen, setDebugMenuScreen] = useState('main');
  const [debugCashAmount, setDebugCashAmount] = useState(10000);
  const [debugDaysRemaining, setDebugDaysRemaining] = useState(30);
  const [debugDrugId, setDebugDrugId] = useState(DRUGS[0].id);
  const [debugDrugQuantity, setDebugDrugQuantity] = useState(100);
  const [debugTrenchcoatSpace, setDebugTrenchcoatSpace] = useState(100);
  
  // Game state atoms
  const [cash] = useAtom(cashAtom);
  const [debt] = useAtom(debtAtom);
  const [day] = useAtom(dayAtom);
  const [currentLocation] = useAtom(currentLocationAtom);
  const [marketPrices] = useAtom(marketPricesAtom);
  const [inventory] = useAtom(inventoryAtom);
  const [messages] = useAtom(messagesAtom);
  const [gameOver] = useAtom(gameOverAtom);
  const [maxDays] = useAtom(maxDaysAtom);
  const [maxInventorySpace] = useAtom(maxInventorySpaceAtom);
  
  // Get location name from location ID
  const locationName = LOCATIONS.find(loc => loc.id === currentLocation)?.name || 'Unknown';
  
  // Action atoms
  const [, buyDrug] = useAtom(buyDrugAtom);
  const [, sellDrug] = useAtom(sellDrugAtom);
  const [, travel] = useAtom(travelAtom);
  const [, endDay] = useAtom(endDayAtom);
  const [, resetGame] = useAtom(resetGameAtom);
  const [, payDebt] = useAtom(payDebtAtom);
  const [, borrowMoney] = useAtom(borrowMoneyAtom);
  const [, repayDebt] = useAtom(repayDebtAtom);
  const [, fixState] = useAtom(fixStateAtom);
  const [, addMessage] = useAtom(addMessageAtom);
  const [, clearMessages] = useAtom(clearMessagesAtom);
  const [, debugAddCash] = useAtom(debugAddCashAtom);
  const [, debugClearDebt] = useAtom(debugClearDebtAtom);
  const [, debugSetDaysRemaining] = useAtom(debugSetDaysRemainingAtom);
  const [, debugAddInventory] = useAtom(debugAddInventoryAtom);
  const [, debugSetInventorySpace] = useAtom(debugSetInventorySpaceAtom);
  
  // Handle drug buying
  const handleBuy = () => {
    if (selectedDrug && quantity > 0) {
      buyDrug({ drugId: selectedDrug, quantity: parseInt(quantity) });
      setQuantity(1);
      setCurrentScreen(SCREENS.MAIN);
    }
  };
  
  // Handle drug selling
  const handleSell = () => {
    if (selectedDrug && quantity > 0) {
      sellDrug({ drugId: selectedDrug, quantity: parseInt(quantity) });
      setQuantity(1);
      setCurrentScreen(SCREENS.MAIN);
    }
  };
  
  // Calculate max affordable quantity
  const calculateMaxBuyQuantity = (drugId) => {
    const price = marketPrices[drugId];
    const maxAffordable = Math.floor(cash / price);
    const maxSpace = maxInventorySpace - inventory.total;
    return Math.min(maxAffordable, maxSpace);
  };
  
  // Handle travel to location
  const handleTravel = (locationId) => {
    travel(locationId);
    setCurrentScreen(SCREENS.MAIN);
  };
  
  // Handle end day
  const handleEndDay = () => {
    console.log('handleEndDay - Called with current day:', day);
    endDay();
  };

  const renderMessagesScreen = () => {
    return (
      <>
        <div className="calculator-title">Notice:</div>
        {messages.map((message, index) => (
          <div key={index} className="calculator-text">
            {message}
          </div>
        ))}
        <div className="calculator-buttons">
        <button 
          className="calculator-button"
          onClick={() => {
            clearMessages();
            setCurrentScreen(SCREENS.MAIN)}
          }
        >
          CONTINUE
        </button>
      </div>
      </>
    );
  }
  
  // Render main menu screen
  const renderMainScreen = () => {
    if (messages.length > 0) {
      return renderMessagesScreen();
    }
    return (
      <>
        <div className="calculator-title">DRUGWARS!</div>
        <div className="calculator-text">
          DAY: {day}/{maxDays} | CASH: ${cash}
        </div>
        <div className="calculator-text">
          DEBT: ${debt} | LOCATION: {locationName}
        </div>
        <div className="calculator-text">
          INVENTORY: {inventory.total}/{maxInventorySpace}
        </div>
        
        <div className="calculator-menu">
          <div className="calculator-menu-item" onClick={() => setCurrentScreen(SCREENS.BUY)}>
            <span className="calculator-menu-number">1:</span> BUY DRUGS
          </div>
          <div className="calculator-menu-item" onClick={() => setCurrentScreen(SCREENS.SELL)}>
            <span className="calculator-menu-number">2:</span> SELL DRUGS
          </div>
          <div className="calculator-menu-item" onClick={() => setCurrentScreen(SCREENS.INVENTORY)}>
            <span className="calculator-menu-number">3:</span> TRENCHCOAT
          </div>
          <div className="calculator-menu-item" onClick={() => setCurrentScreen(SCREENS.TRAVEL)}>
            <span className="calculator-menu-number">4:</span> TRAVEL
          </div>
          <div className="calculator-menu-item" onClick={() => setCurrentScreen(SCREENS.LOAN_SHARK)}>
            <span className="calculator-menu-number">5:</span> LOAN SHARK
          </div>
          <div className="calculator-menu-item" onClick={handleEndDay}>
            <span className="calculator-menu-number">6:</span> END DAY
          </div>
          {debugMode && (
            <div className="calculator-menu-item" onClick={() => setCurrentScreen(SCREENS.DEBUG_MENU)}>
              <span className="calculator-menu-number">7:</span> DEBUG MENU
            </div>
          )}
        </div>
      </>
    );
  };
  
  // Render prices screen
  const renderPricesScreen = () => (
    <>
      <div className="calculator-title">DRUG PRICES</div>
      <div className="calculator-text">LOCATION: {locationName}</div>
      
      {DRUGS.map((drug) => (
        <div key={drug.id} className="calculator-text">
          {drug.name}: ${marketPrices[drug.id]}
        </div>
      ))}
      
      <div className="calculator-buttons">
        <button 
          className="calculator-button"
          onClick={() => setCurrentScreen(SCREENS.MAIN)}
        >
          BACK
        </button>
      </div>
    </>
  );
  
  // Render inventory screen
  const renderInventoryScreen = () => (
    <>
      <div className="calculator-title">TRENCHCOAT</div>
      <div className="calculator-text">
        SPACE: {inventory.total}/{maxInventorySpace}
      </div>
      
      {DRUGS.map((drug) => (
        <div key={drug.id} className="calculator-text">
          {drug.name}: {inventory[drug.id] || 0}
        </div>
      ))}
      
      <div className="calculator-buttons">
        <button 
          className="calculator-button"
          onClick={() => setCurrentScreen(SCREENS.MAIN)}
        >
          BACK
        </button>
      </div>
    </>
  );
  
  // Render buy screen
  const renderBuyScreen = () => {
    // Calculate if the current quantity can be afforded
    const canAffordCurrentQuantity = selectedDrug ? 
      (marketPrices[selectedDrug] * quantity <= cash) : false;
    
    // Calculate max quantities
    const maxAffordable = selectedDrug ? 
      Math.floor(cash / marketPrices[selectedDrug]) : 0;
    const maxSpace = maxInventorySpace - inventory.total;
    const maxPossible = Math.min(maxAffordable, maxSpace);
    
    return (
    <>
      <div className="calculator-title">BUY DRUGS</div>
      <div className="calculator-text">CASH: ${cash}</div>
      
      {!selectedDrug ? (
      <>
        <div className="calculator-text">SELECT DRUG:</div>
        {DRUGS.map((drug) => {
          // Check if player can afford this drug
          const canAfford = cash >= marketPrices[drug.id];
          
          return (
            <div 
              key={drug.id} 
              className="calculator-menu-item" 
              style={{ 
                opacity: canAfford ? 1 : 0.5
              }}
              onClick={() => canAfford && setSelectedDrug(drug.id)}
            >
              <span className="calculator-menu-number">
                {DRUGS.indexOf(drug) + 1}:
              </span>
              {drug.name} (${marketPrices[drug.id]}) - HAVE: {inventory[drug.id] || 0}
            </div>
          );
        })}
      </>
      ) : <>&nbsp;</>}
      
      {selectedDrug && (
        <>
          <div className="calculator-text">
            <span className="calculator-text-uppercase">{DRUGS.find(d => d.id === selectedDrug)?.name}</span> QTY: {quantity} (${marketPrices[selectedDrug] * quantity})
            {!canAffordCurrentQuantity && <span style={{color: 'red'}}> - Can't afford!</span>}
          </div>
          <div className="calculator-buttons">
            <button 
              className="calculator-button decrement-button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              -1
            </button>
            <button 
              className="calculator-button decrement-button"
              onClick={() => setQuantity(Math.max(1, quantity - 10))}
              disabled={quantity <= 1}
            >
              -10
            </button>
            <button 
              className="calculator-button increment-button"
              onClick={() => setQuantity(quantity + 1)}
              disabled={quantity >= maxPossible}
            >
              +1
            </button>
            <button 
              className="calculator-button increment-button"
              onClick={() => setQuantity(quantity + 10)}
              disabled={quantity + 10 > maxPossible}
            >
              +10
            </button>
          </div>
          <div className="calculator-buttons" style={{ marginTop: '5px' }}>
            <button 
              className="calculator-button max-button"
              onClick={() => setQuantity(maxPossible)}
              disabled={maxPossible <= 0 || quantity === maxPossible}
            >
              MAX
            </button>
            <button 
              className="calculator-button action-button"
              onClick={handleBuy}
              disabled={!canAffordCurrentQuantity || quantity <= 0 || maxSpace <= 0}
            >
              BUY
            </button>
          </div>
        </>
      )}
      
      <div className="calculator-buttons" style={{ marginTop: '10px' }}>
        <button 
          className="calculator-button back-button"
          onClick={() => {
            setSelectedDrug(null);
            setQuantity(1);
            setCurrentScreen(SCREENS.MAIN);
          }}
        >
          BACK
        </button>
      </div>
    </>
  )};
  
  // Render sell screen
  const renderSellScreen = () => {
    // Calculate if the current quantity can be sold
    const canSellCurrentQuantity = selectedDrug ? 
      ((inventory[selectedDrug] || 0) >= quantity) : false;
    
    // Calculate max quantity that can be sold
    const maxSellable = selectedDrug ? (inventory[selectedDrug] || 0) : 0;
    
    return (
    <>
      <div className="calculator-title">SELL DRUGS</div>
      <div className="calculator-text">CASH: ${cash}</div>
      
      {!selectedDrug ? (
      <>
        <div className="calculator-text">SELECT DRUG:</div>
        {DRUGS.map((drug) => {
          // Check if player has this drug to sell
          const canSell = (inventory[drug.id] || 0) > 0;
          
          return (
            <div 
              key={drug.id} 
              className="calculator-menu-item" 
              style={{ 
                opacity: canSell ? 1 : 0.5
              }}
              onClick={() => canSell && setSelectedDrug(drug.id)}
            >
              <span className="calculator-menu-number">
                {DRUGS.indexOf(drug) + 1}:
              </span>
              {drug.name} (${marketPrices[drug.id]}) - HAVE: {inventory[drug.id] || 0}
            </div>
          );
        })}
      </>
      ) : <>&nbsp;</>}
      
      {selectedDrug && (
        <>
          <div className="calculator-text">
            <span className="calculator-text-uppercase">{DRUGS.find(d => d.id === selectedDrug)?.name}</span> QTY: {quantity} (${marketPrices[selectedDrug] * quantity})
            {!canSellCurrentQuantity && <span style={{color: 'red'}}> - Not enough!</span>}
          </div>
          <div className="calculator-buttons">
            <button 
              className="calculator-button decrement-button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              -1
            </button>
            <button 
              className="calculator-button decrement-button"
              onClick={() => setQuantity(Math.max(1, quantity - 10))}
              disabled={quantity <= 1}
            >
              -10
            </button>
            <button 
              className="calculator-button increment-button"
              onClick={() => setQuantity(quantity + 1)}
              disabled={quantity >= maxSellable}
            >
              +1
            </button>
            <button 
              className="calculator-button increment-button"
              onClick={() => setQuantity(quantity + 10)}
              disabled={quantity + 10 > maxSellable}
            >
              +10
            </button>
          </div>
          <div className="calculator-buttons" style={{ marginTop: '5px' }}>
            <button 
              className="calculator-button max-button"
              onClick={() => setQuantity(maxSellable)}
              disabled={maxSellable <= 0 || quantity === maxSellable}
            >
              MAX
            </button>
            <button 
              className="calculator-button action-button"
              onClick={handleSell}
              disabled={!canSellCurrentQuantity || quantity <= 0}
            >
              SELL
            </button>
          </div>
        </>
      )}
      
      <div className="calculator-buttons" style={{ marginTop: '10px' }}>
        <button 
          className="calculator-button back-button"
          onClick={() => {
            setSelectedDrug(null);
            setQuantity(1);
            setCurrentScreen(SCREENS.MAIN);
          }}
        >
          BACK
        </button>
      </div>
    </>
  )};
  
  // Render travel screen
  const renderTravelScreen = () => (
    <>
      <div className="calculator-title">TRAVEL</div>
      <div className="calculator-text">CURRENT: {locationName}</div>
      
      <div className="calculator-text">SELECT DESTINATION:</div>
      {LOCATIONS.map((location) => (
        <div 
          key={location.id} 
          className="calculator-menu-item" 
          style={{ 
            fontWeight: currentLocation === location.id ? 'bold' : 'normal',
            cursor: 'pointer',
            opacity: currentLocation === location.id ? 0.5 : 1
          }}
          onClick={() => {
            if (currentLocation !== location.id) {
              handleTravel(location.id);
            }
          }}
        >
          <span className="calculator-menu-number">
            {LOCATIONS.indexOf(location) + 1}:
          </span>
          {location.name}
        </div>
      ))}
      
      <div className="calculator-buttons">
        <button 
          className="calculator-button"
          onClick={() => setCurrentScreen(SCREENS.MAIN)}
        >
          BACK
        </button>
      </div>
    </>
  );
  
  // Render loan shark screen
  const renderLoanSharkScreen = () => (
    <>
      <div className="calculator-title">LOAN SHARK</div>
      <div className="calculator-text">
        CASH: ${cash} | DEBT: ${debt}
      </div>
      <div className="calculator-text">
        INTEREST: {GAME_SETTINGS.interestRate * 100}% PER DAY
      </div>
      
      {!loanAction && (
        <div className="calculator-menu">
          <div 
            className="calculator-menu-item" 
            onClick={() => {
              setLoanAction('borrow');
              setLoanAmount(1000); // Default to 1000 for borrowing
            }}
          >
            <span className="calculator-menu-number">1:</span>
            BORROW MONEY
          </div>
          <div 
            className="calculator-menu-item" 
            onClick={() => {
              setLoanAction('repay');
              // Set a reasonable default for repaying - either the full debt or all cash, whichever is smaller
              setLoanAmount(Math.min(debt, cash));
            }}
          >
            <span className="calculator-menu-number">2:</span>
            REPAY DEBT
          </div>
        </div>
      )}
      
      {loanAction && (
        <>
          <div className="calculator-text">
            AMOUNT: ${loanAmount}
          </div>
          <div className="calculator-buttons">
            <button 
              className="calculator-button decrement-button"
              onClick={() => setLoanAmount(Math.max(100, loanAmount - 100))}
            >
              -100
            </button>
            <button 
              className="calculator-button decrement-button"
              onClick={() => setLoanAmount(Math.max(1000, loanAmount - 1000))}
            >
              -1K
            </button>
            <button 
              className="calculator-button increment-button"
              onClick={() => setLoanAmount(loanAmount + 100)}
            >
              +100
            </button>
            <button 
              className="calculator-button increment-button"
              onClick={() => setLoanAmount(loanAmount + 1000)}
            >
              +1K
            </button>
          </div>
          <div className="calculator-buttons" style={{ marginTop: '5px' }}>
            {loanAction === 'borrow' && (
              <button 
                className="calculator-button max-button"
                onClick={() => setLoanAmount(GAME_SETTINGS.maxLoan - debt)}
              >
                MAX
              </button>
            )}
            {loanAction === 'repay' && (
              <button 
                className="calculator-button max-button"
                onClick={() => setLoanAmount(Math.min(debt, cash))}
              >
                MAX
              </button>
            )}
            <button 
              className="calculator-button action-button"
              onClick={() => {
                if (loanAction === 'borrow') {
                  borrowMoney(loanAmount);
                } else if (loanAction === 'repay') {
                  repayDebt(loanAmount);
                }
                setLoanAction(null);
              }}
            >
              {loanAction === 'borrow' ? 'BORROW' : 'REPAY'}
            </button>
          </div>
        </>
      )}
      
      <div className="calculator-buttons" style={{ marginTop: '10px' }}>
        <button 
          className="calculator-button back-button"
          onClick={() => {
            setLoanAction(null);
            setCurrentScreen(SCREENS.MAIN);
          }}
        >
          BACK
        </button>
      </div>
    </>
  );
  
  // Render game over screen
  const renderGameOverScreen = () => {
    const netWorth = cash - debt;
    let message = '';
    
    if (netWorth > 50000) {
      message = 'INCREDIBLE! YOU ARE A DRUG KINGPIN!';
    } else if (netWorth > 20000) {
      message = 'GREAT JOB! YOU HAVE MADE A FORTUNE!';
    } else if (netWorth > 0) {
      message = 'NOT BAD. YOU PAID OFF YOUR DEBT.';
    } else if (netWorth > -5000) {
      message = 'YOU SURVIVED, BARELY.';
    } else {
      message = 'THE LOAN SHARKS ARE AFTER YOU...';
    }
    
    return (
      <>
        <div className="calculator-title">GAME OVER</div>
        <div className="calculator-text">FINAL CASH: ${cash}</div>
        <div className="calculator-text">FINAL DEBT: ${debt}</div>
        <div className="calculator-text">
          NET WORTH: ${netWorth}
        </div>
        
        <div className="calculator-message">{message}</div>
        
        <div className="calculator-buttons" style={{ marginTop: '15px' }}>
          <button 
            className="calculator-button"
            onClick={() => {
              resetGame();
              setCurrentScreen(SCREENS.MAIN);
            }}
          >
            NEW GAME
          </button>
        </div>
      </>
    );
  };
  
  // Render debug menu
  const renderDebugMenu = () => {
    if (debugMenuScreen === 'main') {
      return (
        <>
          <div className="calculator-title">DEBUG MENU</div>
          <div className="calculator-text">
            This menu provides developer options.
          </div>
          
          <div className="calculator-menu">
            <div 
              className="calculator-menu-item" 
              onClick={() => setDebugMenuScreen('cash')}
            >
              <span className="calculator-menu-number">1:</span>
              ADD CASH
            </div>
            
            <div 
              className="calculator-menu-item" 
              onClick={() => {
                debugClearDebt();
              }}
            >
              <span className="calculator-menu-number">2:</span>
              CLEAR DEBT
            </div>
            
            <div 
              className="calculator-menu-item" 
              onClick={() => setDebugMenuScreen('days')}
            >
              <span className="calculator-menu-number">3:</span>
              SET DAYS REMAINING
            </div>
            
            <div 
              className="calculator-menu-item" 
              onClick={() => setDebugMenuScreen('inventory')}
            >
              <span className="calculator-menu-number">4:</span>
              ADD INVENTORY
            </div>
            
            <div 
              className="calculator-menu-item" 
              onClick={() => setDebugMenuScreen('trenchcoat')}
            >
              <span className="calculator-menu-number">5:</span>
              SET TRENCHCOAT SPACE
            </div>
            
            <div 
              className="calculator-menu-item" 
              onClick={() => {
                resetGame();
                setCurrentScreen(SCREENS.MAIN);
              }}
            >
              <span className="calculator-menu-number">6:</span>
              RESET GAME
            </div>
          </div>
          
          <div className="calculator-button-row" style={{ marginTop: '10px' }}>
            <button 
              className="calculator-button back-button"
              onClick={() => setCurrentScreen(SCREENS.MAIN)}
            >
              BACK
            </button>
          </div>
        </>
      );
    } else if (debugMenuScreen === 'cash') {
      return (
        <>
          <div className="calculator-title">ADD CASH</div>
          <div className="calculator-text">
            Current Cash: ${cash}
          </div>
          <div className="calculator-text">
            Amount to Add: ${debugCashAmount}
          </div>
          
          <div className="calculator-button-row">
            <button 
              className="calculator-button decrement-button"
              onClick={() => setDebugCashAmount(Math.max(1000, debugCashAmount - 1000))}
            >
              -1K
            </button>
            <button 
              className="calculator-button increment-button"
              onClick={() => setDebugCashAmount(debugCashAmount + 1000)}
            >
              +1K
            </button>
            <button 
              className="calculator-button increment-button"
              onClick={() => setDebugCashAmount(debugCashAmount + 10000)}
            >
              +10K
            </button>
          </div>
          
          <div className="calculator-button-row">
            <button 
              className="calculator-button action-button"
              onClick={() => {
                debugAddCash(debugCashAmount);
                setDebugMenuScreen('main');
              }}
            >
              ADD CASH
            </button>
          </div>
          
          <div className="calculator-button-row" style={{ marginTop: '10px' }}>
            <button 
              className="calculator-button back-button"
              onClick={() => setDebugMenuScreen('main')}
            >
              BACK
            </button>
          </div>
        </>
      );
    } else if (debugMenuScreen === 'days') {
      return (
        <>
          <div className="calculator-title">SET DAYS</div>
          <div className="calculator-text">
            Current Day: {day}/{maxDays}
          </div>
          <div className="calculator-text">
            Days Remaining: {debugDaysRemaining}
          </div>
          
          <div className="calculator-button-row">
            <button 
              className="calculator-button decrement-button"
              onClick={() => setDebugDaysRemaining(Math.max(1, debugDaysRemaining - 1))}
            >
              -1
            </button>
            <button 
              className="calculator-button decrement-button"
              onClick={() => setDebugDaysRemaining(Math.max(5, debugDaysRemaining - 5))}
            >
              -5
            </button>
            <button 
              className="calculator-button increment-button"
              onClick={() => setDebugDaysRemaining(debugDaysRemaining + 1)}
            >
              +1
            </button>
            <button 
              className="calculator-button increment-button"
              onClick={() => setDebugDaysRemaining(debugDaysRemaining + 5)}
            >
              +5
            </button>
            <button 
              className="calculator-button increment-button"
              onClick={() => setDebugDaysRemaining(debugDaysRemaining + 10)}
            >
              +10
            </button>
          </div>
          
          <div className="calculator-button-row">
            <button 
              className="calculator-button action-button"
              onClick={() => {
                debugSetDaysRemaining(debugDaysRemaining);
                setDebugMenuScreen('main');
              }}
            >
              SET DAYS
            </button>
          </div>
          
          <div className="calculator-button-row" style={{ marginTop: '10px' }}>
            <button 
              className="calculator-button back-button"
              onClick={() => setDebugMenuScreen('main')}
            >
              BACK
            </button>
          </div>
        </>
      );
    } else if (debugMenuScreen === 'inventory') {
      return (
        <>
          <div className="calculator-title">ADD INVENTORY</div>
          <div className="calculator-text">
            Drug: {DRUGS.find(drug => drug.id === debugDrugId)?.name}
          </div>
          <div className="calculator-text">
            Quantity: {debugDrugQuantity}
          </div>
          
          <div className="calculator-menu">
            {DRUGS.map((drug, index) => (
              <div 
                key={drug.id}
                className="calculator-menu-item" 
                onClick={() => setDebugDrugId(drug.id)}
                style={{ fontWeight: drug.id === debugDrugId ? 'bold' : 'normal' }}
              >
                <span className="calculator-menu-number">{index + 1}:</span>
                {drug.name}
              </div>
            ))}
          </div>
          
          <div className="calculator-button-row">
            <button 
              className="calculator-button decrement-button"
              onClick={() => setDebugDrugQuantity(Math.max(10, debugDrugQuantity - 10))}
            >
              -10
            </button>
            <button 
              className="calculator-button increment-button"
              onClick={() => setDebugDrugQuantity(debugDrugQuantity + 10)}
            >
              +10
            </button>
            <button 
              className="calculator-button increment-button"
              onClick={() => setDebugDrugQuantity(debugDrugQuantity + 100)}
            >
              +100
            </button>
          </div>
          
          <div className="calculator-button-row">
            <button 
              className="calculator-button action-button"
              onClick={() => {
                debugAddInventory({ drugId: debugDrugId, quantity: debugDrugQuantity });
                const drugName = DRUGS.find(drug => drug.id === debugDrugId)?.name;
                setDebugMenuScreen('main');
              }}
            >
              ADD DRUG
            </button>
          </div>
          
          <div className="calculator-button-row" style={{ marginTop: '10px' }}>
            <button 
              className="calculator-button back-button"
              onClick={() => setDebugMenuScreen('main')}
            >
              BACK
            </button>
          </div>
        </>
      );
    } else if (debugMenuScreen === 'trenchcoat') {
      return (
        <>
          <div className="calculator-title">SET TRENCHCOAT SPACE</div>
          <div className="calculator-text">
            Current Space: {maxInventorySpace}
          </div>
          <div className="calculator-text">
            New Space: {debugTrenchcoatSpace}
          </div>
          
          <div className="calculator-button-row">
            <button 
              className="calculator-button decrement-button"
              onClick={() => setDebugTrenchcoatSpace(Math.max(10, debugTrenchcoatSpace - 10))}
            >
              -10
            </button>
            <button 
              className="calculator-button increment-button"
              onClick={() => setDebugTrenchcoatSpace(debugTrenchcoatSpace + 10)}
            >
              +10
            </button>
            <button 
              className="calculator-button increment-button"
              onClick={() => setDebugTrenchcoatSpace(debugTrenchcoatSpace + 100)}
            >
              +100
            </button>
          </div>
          
          <div className="calculator-button-row">
            <button 
              className="calculator-button action-button"
              onClick={() => {
                debugSetInventorySpace(debugTrenchcoatSpace);
                setDebugMenuScreen('main');
              }}
            >
              SET SPACE
            </button>
          </div>
          
          <div className="calculator-button-row" style={{ marginTop: '10px' }}>
            <button 
              className="calculator-button back-button"
              onClick={() => setDebugMenuScreen('main')}
            >
              BACK
            </button>
          </div>
        </>
      );
    }
  };
  
  // Handle key press for menu navigation
  const handleKeyPress = (e) => {
    if (currentScreen === SCREENS.MAIN) {
      switch (e.key) {
        case 'F1':
          // Toggle debug mode when F1 is pressed
          setDebugMode(prev => !prev);
          break;
        default:
          break;
      }
    }
  };

  // Set up key press listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentScreen, debugMode]); // Add debugMode as a dependency
  
  // Render the appropriate screen based on current state
  const renderScreen = () => {
    if (gameOver) {
      return renderGameOverScreen();
    }
    
    switch (currentScreen) {
      case SCREENS.PRICES:
        return renderPricesScreen();
      case SCREENS.INVENTORY:
        return renderInventoryScreen();
      case SCREENS.BUY:
        return renderBuyScreen();
      case SCREENS.SELL:
        return renderSellScreen();
      case SCREENS.TRAVEL:
        return renderTravelScreen();
      case SCREENS.LOAN_SHARK:
        return renderLoanSharkScreen();
      case SCREENS.DEBUG_MENU:
        return renderDebugMenu();
      case SCREENS.MAIN:
      default:
        return renderMainScreen();
    }
  };
  
  return (
    <div onClick={(e) => {
      // Handle menu number clicks
      if (currentScreen === SCREENS.MAIN && e.target.className === 'calculator-menu-item') {
        const menuNumber = e.target.textContent.charAt(0);
        handleKeyPress({ key: menuNumber });
      }
    }}>
      {renderScreen()}
    </div>
  );
};

export default CalculatorGamePage;
