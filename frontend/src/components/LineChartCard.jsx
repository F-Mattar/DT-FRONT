// src/components/LineChartCard.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CustomLegend from './CustomLegend';

const DataFormatter = (number) => {
  if (Math.abs(number) >= 1e9) return (number / 1e9).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + ' bi';
  if (Math.abs(number) >= 1e6) return (number / 1e6).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + ' mi';
  if (Math.abs(number) >= 1e3) return (number / 1e3).toLocaleString('pt-BR', { maximumFractionDigits: 0 }) + ' mil';
  return number.toString();
};

const LineChartCard = ({ title, data, dataKey, xAxisKey, legendName, tooltipFormatter }) => {
  return (
    <div className="chart-card">
      <h3 style={{ textAlign: 'center' }}>{title}</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
            <XAxis dataKey={xAxisKey} type="number" domain={['dataMin', 'dataMax']} tickCount={10} />
            {/* Não permite decimais no eixo Y */}
            <YAxis tickFormatter={DataFormatter} allowDecimals={false} />
            <Tooltip formatter={tooltipFormatter} wrapperStyle={{ backgroundColor: '#fff', color: '#333', border: '1px solid #ccc', borderRadius: '5px', padding: '5px' }} />
            <Legend content={<CustomLegend />} />
            <Line type="monotone" dataKey={dataKey} name={legendName || dataKey} stroke="var(--chart-bar-color)" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChartCard;