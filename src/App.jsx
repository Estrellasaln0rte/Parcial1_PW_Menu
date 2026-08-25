import Header from './components/Header';
import Carrousel from './components/Carrusel';
import Menu from './components/Menu';
import Footer from './components/Footer';
import './styles/index.css';

function App() {
  return (
    <div className="app-container">
      <Header />

      <main>
      <Carrousel />
      <Menu />
      </main>
      
      <Footer />
    </div>
  );
}

export default App;