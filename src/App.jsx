import './styles/index.css'
import CalculatorLayout from './components/CalculatorLayout';
import GamePage from './pages/GamePage';

function App() {
  return (
    <CalculatorLayout>
      <GamePage />
    </CalculatorLayout>
  );
}

export default App;
