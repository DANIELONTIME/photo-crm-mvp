import React from 'react';

function Dashboard({ user, onLogout, onNavigate }) {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px',
        borderBottom: '1px solid #ddd',
        paddingBottom: '20px'
      }}>
        <h1>Photo CRM</h1>
        <div>
          <span style={{ marginRight: '15px' }}>Olá, {user.name}!</span>
          <button 
            onClick={handleLogout}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#dc3545', 
              color: 'white', 
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Sair
          </button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div 
          onClick={() => onNavigate('clients')}
          style={{ 
            padding: '40px', 
            backgroundColor: '#f8f9fa', 
            textAlign: 'center',
            cursor: 'pointer',
            border: '1px solid #ddd',
            borderRadius: '8px'
          }}
        >
          <h2>👥 Clientes</h2>
          <p>Gerenciar clientes do estúdio</p>
        </div>
        
        <div 
          onClick={() => onNavigate('events')}
          style={{ 
            padding: '40px', 
            backgroundColor: '#f8f9fa', 
            textAlign: 'center',
            cursor: 'pointer',
            border: '1px solid #ddd',
            borderRadius: '8px'
          }}
        >
          <h2>📅 Eventos</h2>
          <p>Agenda de sessões fotográficas</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
