import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Clients({ onNavigate }) {
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const response = await api.get('/clients');
      setClients(response.data.data.clients);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/clients', formData);
      setFormData({ name: '', email: '', phone: '', address: '', notes: '' });
      setShowForm(false);
      loadClients();
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1>👥 Clientes</h1>
        <div>
          <button 
            onClick={() => setShowForm(!showForm)}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#28a745', 
              color: 'white', 
              border: 'none',
              marginRight: '10px',
              cursor: 'pointer'
            }}
          >
            {showForm ? 'Cancelar' : 'Novo Cliente'}
          </button>
          <button 
            onClick={() => onNavigate('dashboard')}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#6c757d', 
              color: 'white', 
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Voltar
          </button>
        </div>
      </header>

      {showForm && (
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '20px', 
          marginBottom: '20px',
          border: '1px solid #ddd',
          borderRadius: '8px'
        }}>
          <h3>Novo Cliente</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <input
                type="text"
                placeholder="Nome"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                style={{ width: '100%', padding: '10px', fontSize: '16px' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                style={{ width: '100%', padding: '10px', fontSize: '16px' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <input
                type="text"
                placeholder="Telefone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                style={{ width: '100%', padding: '10px', fontSize: '16px' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <input
                type="text"
                placeholder="Endereço"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                style={{ width: '100%', padding: '10px', fontSize: '16px' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <textarea
                placeholder="Observações"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                style={{ width: '100%', padding: '10px', fontSize: '16px', height: '80px' }}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                padding: '12px 24px', 
                backgroundColor: '#007bff', 
                color: 'white', 
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {loading ? 'Salvando...' : 'Salvar Cliente'}
            </button>
          </form>
        </div>
      )}

      <div>
        <h3>Lista de Clientes ({clients.length})</h3>
        {clients.length === 0 ? (
          <p>Nenhum cliente cadastrado ainda.</p>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {clients.map(client => (
              <div 
                key={client.id}
                style={{ 
                  padding: '15px', 
                  backgroundColor: '#f8f9fa', 
                  border: '1px solid #ddd',
                  borderRadius: '8px'
                }}
              >
                <h4>{client.name}</h4>
                <p><strong>Email:</strong> {client.email || 'Não informado'}</p>
                <p><strong>Telefone:</strong> {client.phone || 'Não informado'}</p>
                <p><strong>Endereço:</strong> {client.address || 'Não informado'}</p>
                {client.notes && <p><strong>Observações:</strong> {client.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Clients;
