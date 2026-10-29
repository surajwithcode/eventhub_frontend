import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      style={{
        padding: '6px 12px',
        borderRadius: 20,
        border: 'none',
        cursor: 'pointer',
        background: theme === 'dark' ? '#f3f4f6' : '#334155',
        color: theme === 'dark' ? '#111827' : '#ffffff',
      }}
    >
      {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
};

export default ThemeToggle;