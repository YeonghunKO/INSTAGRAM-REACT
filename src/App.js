import Jumbotron from './components/jumbotron';
import { useContext } from 'react';
import FirebaseContext from './context/firebase';

function App() {
  const fire = useContext(FirebaseContext);
  // console.log(fire);
  return <Jumbotron />;
}
export default App;
