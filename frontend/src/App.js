import './index.css';
import Heading from './components/Heading';
import HomePage from './components/HomePage';
function App() {
  return (
    <div className="w-screen min-h-screen bg-[#23195e] text-white flex flex-col justify-center overflow-x-hidden">
     <Heading/>
     <HomePage/>
    </div>
  );
}
export default App;
