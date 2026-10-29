import React, { useState } from 'react';
import { createEventApi } from '../../api/organiserApi';
import { EVENT_CATEGORIES } from '../../constants/eventCategories';

const CreateEventScreen = () => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    category: EVENT_CATEGORIES[1],
    price: '',
    description: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEventApi(formData);
      alert('Event Created Successfully!');
    } catch (err) {
      alert('Failed to create event');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '20px auto', padding: 20 }}>
      <h2>Create New Event</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          required
        />
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        >
          {EVENT_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
        />
        <button type="submit" style={{ padding: 10, background: '#4f46e5', color: '#fff', border: 'none' }}>
          Publish Event
        </button>
      </form>
    </div>
  );
};

export default CreateEventScreen;