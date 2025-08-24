import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Importe os componentes de página que acabamos de criar
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Componentes placeholder para as próximas aulas
const ClientsPage = () => <h1>Clients Page (Em Breve)</h1>;
const EventsPage = () => <h1>Events Page (Em Breve)</h1>;
const DashboardPage = () => <h1>Dashboard Page (Em Breve)</h1>;

function App() {
  return (
    <Router>
      <div className="App">
        {/* Aqui você pode adicionar um Navbar ou Header global */}
        
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Rotas Protegidas (exigem autenticação) */}
          {/* Por enquanto, vamos deixá-las públicas para testar a navegação */}
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/" element={<DashboardPage />} />

          {/* Rota para páginas não encontradas */}
          <Route path="*" element={<h1>404 - Página Não Encontrada</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
