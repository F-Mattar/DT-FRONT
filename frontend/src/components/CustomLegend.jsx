// src/components/CustomLegend.jsx
import React from 'react';

const CustomLegend = ({ payload, layout = 'horizontal' }) => {
  const listStyle = {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: layout === 'vertical' ? 'column' : 'row',
    justifyContent: 'center',
    gap: layout === 'vertical' ? '12px' : '24px',
    height: layout === 'vertical' ? '100%' : 'auto',
  };

  return (
    <ul style={listStyle}>
      {payload.map((entry, index) => (
        <li key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
          <span style={{
            backgroundColor: entry.color,
            width: '14px',
            height: '14px',
            borderRadius: '4px',
            marginRight: '8px',
            display: 'inline-block'
          }}></span>
          <span style={{ color: 'var(--text-color)' }}>{entry.value}</span>
        </li>
      ))}
    </ul>
  );
};

export default CustomLegend;