import React, { useState, useEffect, useMemo } from 'react';

// --- Components ---
import Header from '../components/Header';
import KpiCard from '../components/KpiCard';
import ChartCard from '../components/ChartCard';
import LineChartCard from '../components/LineChartCard';
import StackedBarChartCard from '../components/StackedBarChartCard';
import CdaSearch from '../components/CdaSearch';

// --- Services ---
import { getSummaryFile, getDashboardByCDA } from '../services/summaryService';

// --- CSS ---
import '../App.css';

// --- Configuração dos Widgets do Dashboard ---

const AVAILABLE_WIDGETS = [
  { id: 'saldo_cdas', name: 'Saldo por Tipo', Component: ChartCard, props: { title: "Saldo por Tipo de Dívida", dataKey: "Saldo", xAxisKey: "name" } },
  { id: 'quantidade_cdas', name: 'Quantidade por Tipo', Component: ChartCard, props: { title: "Quantidade por Tipo de Dívida", dataKey: "Quantidade", xAxisKey: "name" } },
  { id: 'inscricoes', name: 'Inscrições por Ano', Component: LineChartCard, props: { title: "Inscrições de Dívidas por Ano", dataKey: "Quantidade", xAxisKey: "ano" } },
  { id: 'distribuicao_cdas', name: 'Distribuição de Status', Component: StackedBarChartCard, props: { title: "Distribuição de Status por Tipo de Dívida (%)" } },
  { id: 'search', name: 'Busca Dinâmica de CDAs', Component: CdaSearch, props: {} }
];

// --- Funções Auxiliares de Formatação ---
const formatCurrency = (value) => {
    if (typeof value !== 'number') return value;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}
const formatNumber = (value) => {
    if (typeof value !== 'number') return value;
    return new Intl.NumberFormat('pt-BR').format(value);
}

const Dashboard = () => {
  // --- Estados do Componente ---
  const [globalData, setGlobalData] = useState({});
  const [singleCdaData, setSingleCdaData] = useState(null);
  const [cdaInput, setCdaInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // O estado inicial agora inclui 'search' para que ele apareça por padrão
  const [selectedWidgets, setSelectedWidgets] = useState(['saldo_cdas', 'quantidade_cdas', 'inscricoes', 'distribuicao_cdas', 'search']);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const dataToDisplay = singleCdaData || globalData;

  // --- Efeito para Buscar os Dados Globais ---
  useEffect(() => {
    const fetchGlobalData = async () => {
      setIsLoading(true);
      const filesToFetch = ['saldo_cdas', 'quantidade_cdas', 'inscricoes', 'distribuicao_cdas'];
      try {
        const dataPromises = filesToFetch.map(file => getSummaryFile(file).then(res => [file, res.data]));
        const allResponses = await Promise.all(dataPromises);
        setGlobalData(Object.fromEntries(allResponses));
      } catch (err) {
        setError("Falha ao carregar dados globais.");
        console.error("ERRO GLOBAL:", err);
      }
      setIsLoading(false);
    };
    
    fetchGlobalData();
  }, []);

  // --- Lógica para os KPIs ---
  const kpiTotals = useMemo(() => {
    if (!dataToDisplay.saldo_cdas || !dataToDisplay.quantidade_cdas) {
      return { totalSaldo: 0, totalQtd: 0 };
    }
    const totalSaldo = dataToDisplay.saldo_cdas.reduce((acc, item) => acc + item.Saldo, 0);
    const totalQtd = dataToDisplay.quantidade_cdas.reduce((acc, item) => acc + item.Quantidade, 0);
    return { totalSaldo, totalQtd };
  }, [dataToDisplay]);

  // --- Funções de Manipulação de Eventos ---
  const handleCdaSearch = async () => {
    if (!cdaInput) return;
    setIsLoading(true);
    setError('');
    try {
      const response = await getDashboardByCDA(cdaInput);
      setSingleCdaData(response.data);
    } catch (err) {
      setError(`CDA "${cdaInput}" não encontrada ou falha na busca.`);
      console.error("ERRO CDA SEARCH:", err);
    }
    setIsLoading(false);
  };

  const handleReset = () => {
    setSingleCdaData(null);
    setCdaInput('');
    setError('');
  };
  
  const handleWidgetSelection = (widgetId) => {
    setSelectedWidgets(prev => 
      prev.includes(widgetId) 
        ? prev.filter(id => id !== widgetId) 
        : [...prev, widgetId]
    );
  };
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  // --- Renderização ---
  return (
    <div className="dashboard-container">
      <Header onToggleSidebar={toggleSidebar} />
      <div className="app-layout">
        <aside className={`sidebar ${isSidebarOpen ? '' : 'closed'}`}>
          <h2>Montar Análise</h2>
          <div className="chart-selector">
            {AVAILABLE_WIDGETS.map(widget => (
              <button 
                key={widget.id} 
                className={`chart-selector-button ${selectedWidgets.includes(widget.id) ? 'selected' : ''}`} 
                onClick={() => handleWidgetSelection(widget.id)}
              >
                {widget.name}
              </button>
            ))}
          </div>
        </aside>

        <main className="main-content">
          <h1 style={{ padding: '0 2rem', marginTop: '2rem', textAlign: 'center' }}>
            {singleCdaData ? `Análise da CDA: ${cdaInput}` : "Painel de Dívida Ativa"}
          </h1>

          <div className="master-filter-container">
            <input
              type="text"
              value={cdaInput}
              onChange={(e) => setCdaInput(e.target.value)}
              placeholder="Digite o número da CDA"
              className="cda-input"
            />
            <button onClick={handleCdaSearch} className="search-button">Buscar</button>
            {singleCdaData && (
              <button onClick={handleReset} className="reset-button">Limpar e Ver Todos</button>
            )}
          </div>
          {error && <p className="error-message">{error}</p>}
          
          <div className="kpi-grid">
            <KpiCard title="Saldo em Dívida" value={formatCurrency(kpiTotals.totalSaldo)} />
            <KpiCard title="Quantidade de CDAs" value={formatNumber(kpiTotals.totalQtd)} />
          </div>

          <div className="charts-grid">
            {(isLoading) ? <div style={{gridColumn: '1 / -1', textAlign: 'center'}}>Carregando...</div> : 
              AVAILABLE_WIDGETS
                .filter(w => selectedWidgets.includes(w.id))
                .map(widget => {
                  const { Component, props, id } = widget;

                  // Lógica para renderizar a busca dinâmica dentro da grade
                  if (id === 'search') {
                    return (
                      <div key={id} className="search-widget">
                        <Component {...props} />
                      </div>
                    );
                  }
                  
                  // Lógica para renderizar os gráficos
                  const chartData = dataToDisplay[id];
                  if (!chartData) return null;
                  const componentProps = { ...props, data: chartData, tooltipFormatter: props.dataKey === 'Saldo' ? formatCurrency : formatNumber };
                  return <Component key={id} {...componentProps} />;
                })
            }
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;