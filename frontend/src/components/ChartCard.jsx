// src/components/ChartCard.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CustomLegend from './CustomLegend';

const DataFormatter = (number) => {
  if (Math.abs(number) >= 1e9) return (number / 1e9).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + ' bi';
  if (Math.abs(number) >= 1e6) return (number / 1e6).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + ' mi';
  if (Math.abs(number) >= 1e3) return (number / 1e3).toLocaleString('pt-BR', { maximumFractionDigits: 0 }) + ' mil';
  return number.toString();
};

const ChartCard = ({ title, data, dataKey, xAxisKey, legendName, tooltipFormatter }) => {
  const isQuantidade = dataKey === 'Quantidade';

  return (
    <div className="chart-card">
      <h3 style={{ textAlign: 'center' }}>{title}</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
            <XAxis dataKey={xAxisKey} />
            {/*Não permite decimais se for um gráfico de Quantidade */}
            <YAxis 
              tickFormatter={isQuantidade ? (tick) => Math.round(tick) : DataFormatter} 
              allowDecimals={!isQuantidade} 
            />
            <Tooltip formatter={tooltipFormatter} wrapperStyle={{ backgroundColor: '#fff', color: '#333', border: '1px solid #ccc', borderRadius: '5px', padding: '5px' }} />
            <Legend content={<CustomLegend />} />
            <Bar dataKey={dataKey} name={legendName || dataKey} fill="var(--chart-bar-color)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartCard;