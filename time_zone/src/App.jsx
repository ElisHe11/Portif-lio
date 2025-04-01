import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [localTime, setLocalTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchedCities, setSearchedCities] = useState([]);
  const [lastSearchedCity, setLastSearchedCity] = useState('');

  // Substitua pela sua chave API da OpenWeather
  const API_KEY = "6384fbd6aa2948022941fb3917e0e7ce";

  const fetchLocalTime = async (e) => {
    e.preventDefault();
    
    // Validação reforçada
    const trimmedCity = city.trim();
    if (!trimmedCity) {
      setError('Por favor, digite o nome de uma cidade');
      setLocalTime(''); // Limpa o horário anterior
      return;
    }

    // Evitar nova busca pela mesma cidade
    if (lastSearchedCity === trimmedCity) return;

    setLoading(true);
    setError('');

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${trimmedCity}&appid=${API_KEY}`
      );

      const timezoneOffset = response.data.timezone;
      const time = calculateLocalTime(timezoneOffset);
      
      setLocalTime(time);
      setLastSearchedCity(trimmedCity);
      
      const cityName = response.data.name;
      const country = response.data.sys?.country;
      const displayName = `${cityName}${country ? `, ${country}` : ''}`;
      
      setSearchedCities(prev => {
        const exists = prev.some(c => c.name === displayName);
        if (!exists) {
          return [...prev, { name: displayName, time }];
        }
        return prev;
      });
      
    } catch (err) {
      setError('Cidade não encontrada. Verifique o nome e tente novamente.');
      setLocalTime('');
      setLastSearchedCity('');
    } finally {
      setLoading(false);
    }
  };

  const calculateLocalTime = (timezoneOffset) => {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const localTime = new Date(utc + timezoneOffset * 1000);
    
    return localTime.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const handleInputChange = (e) => {
    setCity(e.target.value);
    // Limpa o erro e o último resultado se o campo for esvaziado
    if (!e.target.value.trim()) {
      setError('');
      setLocalTime('');
    }
  };

  return (
    <div className="app">
      <h1>Consultar Horário Mundial</h1>
      
      <form onSubmit={fetchLocalTime} className="search-form">
        <input
          type="text"
          value={city}
          onChange={handleInputChange}
          placeholder="Digite o nome da cidade"
        />
        <button 
          type="submit" 
          disabled={loading || !city.trim()}
          aria-busy={loading}
        >
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {localTime && (
        <div className="result">
          <h2>Horário em {lastSearchedCity}:</h2>
          <div className="time">{localTime}</div>
        </div>
      )}

      {searchedCities.length > 0 && (
        <div className="history">
          <h3>Cidades consultadas:</h3>
          <ul>
            {searchedCities.map((item, index) => (
              <li key={index}>
                <span className="city-name">{item.name}</span>
                <span className="city-time">{item.time}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;