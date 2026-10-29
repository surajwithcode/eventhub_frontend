import React from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

export default function SearchFilterBar({ searchQuery, setSearchQuery, sortOrder, setSortOrder }) {
  return (
    <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: '#131b2e', border: '1px solid #1e293b', padding: '8px 12px', borderRadius: '10px' }}>
        <Search size={18} color="#94a3b8" style={{ marginRight: '8px' }} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search events, setup packages..."
          style={{ width: '100%', background: 'transparent', border: 'none', color: '#fff', outline: 'none' }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', background: '#131b2e', border: '1px solid #1e293b', padding: '8px 12px', borderRadius: '10px', gap: '8px' }}>
        <ArrowUpDown size={16} color="#94a3b8" />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', cursor: 'pointer', fontSize: '13px' }}
        >
          <option value="default" style={{ background: '#131b2e' }}>Sort: Default</option>
          <option value="low-high" style={{ background: '#131b2e' }}>Price: Low to High</option>
          <option value="high-low" style={{ background: '#131b2e' }}>Price: High to Low</option>
        </select>
      </div>
    </div>
  );
}