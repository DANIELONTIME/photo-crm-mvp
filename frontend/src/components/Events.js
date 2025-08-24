import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Events({ onNavigate }) {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventDate: '',
    startTime: '',
    endTime: '',
    location: '',
    clientId: '',
    notes: ''
  });
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEvents();
    loadClients();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data.data.events);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    }
  };

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
      await api.post('/events', formData);
      setFormData({
        title: '',
        description: '',
        eventDate: '',
        startTime: '',
        endTime: '',
        location: '',
        clientId: '',
        notes: ''
      });
      setShowForm(false);
      loadEvents();
    } catch (error) {
      console.error('Erro ao criar evento:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1>📅 Eventos</h1>
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
            {showForm ? 'Cancelar' : 'Novo Evento'}
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
          <h3>Novo Evento</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <input
                type="text"
                placeholder="Título do evento"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
                style={{ width: '100%', padding: '10px', fontSize: '16px' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <textarea
                placeholder="Descrição"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                style={{ width: '100%', padding: '10px', fontSize: '16px', height: '80px' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '15px' }}>
              <input
                type="date"
                value={formData.eventDate}
                onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                required
                style={{ padding: '10px', fontSize: '16px' }}
              />
              <input
                type="time"
                placeholder="Hora início"
                value={formData.startTime}
                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                style={{ padding: '10px', fontSize: '16px' }}
              />
              <input
                type="time"
                placeholder="Hora fim"
                value={formData.endTime}
                onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                style={{ padding: '10px', fontSize: '16px' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <input
                type="text"
                placeholder="Local"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                style={{ width: '100%', padding: '10px', fontSize: '16px' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <select
                value={formData.clientId}
                onChange={(e) => setFormData({...formData, clientId: e.target.value})}
                style={{ width: '100%', padding: '10px', fontSize: '16px' }}
              >
                <option value="">Selecionar cliente (opcional)</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
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
              {loading ? 'Salvando...' : 'Salvar Evento'}
            </button>
          </form>
        </div>
      )}

      <div>
        <h3>Agenda de Eventos ({events.length})</h3>
        {events.length === 0 ? (
          <p>Nenhum evento agendado ainda.</p>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {events.map(event => (
              <div 
                key={event.id}
                style={{ 
                  padding: '15px', 
                  backgroundColor: '#f8f9fa', 
                  border: '1px solid #ddd',
                  borderRadius: '8px'
                }}
              >
                <h4>{event.title}</h4>
                <p><strong>Data:</strong> {formatDate(event.eventDate)}</p>
                <p><strong>Horário:</strong> {event.startTime} - {event.endTime}</p>
                <p><strong>Local:</strong> {event.location || 'Não informado'}</p>
                {event.description && <p><strong>Descrição:</strong> {event.description}</p>}
                {event.notes && <p><strong>Observações:</strong> {event.notes}</p>}
                <p><strong>Status:</strong> {event.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Events;
