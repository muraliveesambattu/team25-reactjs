import logo from './logo.svg';
import './App.css';
import User from './Components/User';
import { LifeCylceA } from './LifeCycleHooks/LifeCycleA';

function App() {
  return (
    <div className="App">
      {/* <User/> */}
      <LifeCylceA/>
    </div>
  );
}

export default App;
