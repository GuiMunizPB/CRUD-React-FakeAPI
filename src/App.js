import Sobre from './components/Sobre';
import Home from './components/Home';
import Acoes from './components/Acoes';
import {BrowserRouter, Link, Route, Routes} from 'react-router-dom';
import {Nav} from 'react-bootstrap';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <img src='https://paraiba.pb.gov.br/marca-do-governo/GOVPBBranco.png' class="LogoPB"/>
      <BrowserRouter>

      <Nav variant="tabs">
        <Nav.Link as={Link} to="/"> Página Inicial </Nav.Link>
        <Nav.Link as={Link} to="/acoes"> Página de Ações </Nav.Link>
        <Nav.Link as={Link} to="/sobre"> Sobre </Nav.Link>
      </Nav>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/acoes" element={<Acoes />} />
        <Route path="/sobre" element={<Sobre />} />
      </Routes>

      </BrowserRouter>
    </div>
  );
}

export default App;
