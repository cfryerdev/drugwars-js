import '../styles/calculator.css';
import packageJson from '../../package.json';

const CalculatorLayout = ({ children }) => {
  return (
    <>
      <div className="calculator-body">
        <div className="calculator-screen">
          {children}
        </div>
      </div>
      <div className="calculator-note">
        Note: Debug menu accessible via F1.
        <p>Build by <a target="_blank" rel="noopener noreferrer" href="https://github.com/cfryerdev">cfryerdev</a> | v{packageJson.version}</p>
      </div>
    </>
  );
};

export default CalculatorLayout;
