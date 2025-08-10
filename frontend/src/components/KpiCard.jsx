// src/components/KpiCard.jsx
import React from 'react';
import './KpiCard.css';

const KpiCard = ({ title, value }) => {
  return (
    <div className="kpi-card">
      <h4 className="kpi-title">{title}</h4>
      <p className="kpi-value">{value}</p>
    </div>
  );
};

export default KpiCard;