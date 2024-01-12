import Sobre from './components/Sobre';
import Home from './components/Home';
import Gastos from './components/Gastos';
import {BrowserRouter, Link, Route, Routes} from 'react-router-dom';
import {Nav} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <div className="App">
      <h1> CRUD de Gastos </h1>
      <BrowserRouter>

      <Nav variant="tabs">
        <Nav.Link as={Link} to="/"> Página Inicial </Nav.Link>
        <Nav.Link as={Link} to="/gastos"> Página de Gastos </Nav.Link>
        <Nav.Link as={Link} to="/sobre"> Sobre </Nav.Link>
      </Nav>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gastos" element={<Gastos />} />
        <Route path="/sobre" element={<Sobre />} />
      </Routes>

      </BrowserRouter>
    </div>
  );
}

export default App;
