import React, { useState, useEffect } from 'react';
import { getEventsApi } from '../../api/customerApi';
import EventCard from '../../components/cards/EventCard';
import { EVENT_CATEGORIES } from '../../constants/eventCategories';
import { useDebounce } from '../../hooks/useDebounce';

const HomeScreen = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEventsApi({ search: debouncedSearch, category });
        setEvents(data);
      } catch (err) {
        console.error('Failed to load events', err);
      }
    };
    fetchEvents();
  }, [debouncedSearch, category]);

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: 8 }}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: 8 }}>
          {EVENT_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 20 }}>
        {events.map((event) => (
          <EventCard key={event.id} event={event} onClick={(id) => console.log('Selected Event:', id)} />
        ))}
      </div>
    </div>
  );
};

export default HomeScreen;