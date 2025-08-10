// src/components/StackedBarChartCard.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { STATUS_COLORS } from '../config/colors';
import CustomLegend from './CustomLegend';
const StackedBarChartCard = ({ title, data }) => {

  const tooltipFormatter = (value, name) => [`${value.toFixed(2)}%`, name];

  return (
    <div className="chart-card">
      <h3 style={{ textAlign: 'center' }}>{title}</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart 
            data={data} 
            layout="vertical" 
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis 
              type="number" 
              domain={[0, 100]} 
              tickFormatter={(tick) => `${Math.round(tick)}%`} 
            />
            <YAxis type="category" dataKey="name" width={80} />
            <Tooltip formatter={tooltipFormatter} />
            <Legend content={<CustomLegend />} />
            <Bar dataKey="Quitada" stackId="a" fill={STATUS_COLORS['Quitada'] || '#28a745'} />
            <Bar dataKey="Em cobrança" stackId="a" fill={STATUS_COLORS['Em cobrança'] || '#ffc107'} />
            <Bar dataKey="Cancelada" stackId="a" fill={STATUS_COLORS['Cancelada'] || '#dc3545'} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StackedBarChartCard;