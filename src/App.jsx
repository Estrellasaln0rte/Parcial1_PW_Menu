import Header from './components/Header';
import Menu from './components/Menu';
import Footer from './components/Footer';
import './styles/index.css';

function App() {
  return (
    <div className="app-container">
      {/* 1. Zona del Header (Navegación) */}
      <Header />

      <main>

      {/* 3. Zona del Menú (La que ya trabajamos) */}
      <Menu />
      </main>

      {/* 4. Zona del Footer / Contacto */}
      <Footer />
    </div>
  );
}

export default App;