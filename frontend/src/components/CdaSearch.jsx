import React, { useState, useEffect } from 'react';
import { searchCDAs } from '../services/cdaService';
import { Select, MenuItem, FormControl, InputLabel, CircularProgress } from '@mui/material';
import './CdaSearch.css';

const STATUS_COLORS = {
  'Quitada': '#28a745',
  'Em cobrança': '#ffc107',
  'Cancelada': '#dc3545',
  'Desconhecida': '#6c757d',
};

const CdaSearch = () => {
  const [cdas, setCdas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ situacao: 'todos', idade: 'todos' });

  useEffect(() => {
    const fetchCdas = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.situacao !== 'todos') {
        params.append('situacao', filters.situacao);
      }
      
      if (filters.idade !== 'todos') {
        params.append('ano', filters.idade);
      }

      try {
        const response = await searchCDAs(params);
        setCdas(response.data);
      } catch (error) {
        console.error("Falha ao buscar CDAs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCdas();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const formatCurrency = (value) => {
    if (typeof value !== 'number') return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };
  
  // Gera uma lista de anos (idades) de 0 a 50 para o filtro
  const idadeOptions = Array.from({ length: 51 }, (_, i) => i);

  return (
    <div className="cda-search-container">
      <h3 className="cda-search-title">Busca Dinâmica de CDAs</h3>
      <div className="filters-container">
        <FormControl variant="outlined" size="small" className="filter-form-control">
          <InputLabel>Idade</InputLabel>
          <Select
            name="idade"
            value={filters.idade}
            onChange={handleFilterChange}
            label="Idade"
          >
            <MenuItem value="todos"><em>Todos</em></MenuItem>
            {idadeOptions.map(ano => (
              <MenuItem key={ano} value={ano}>{ano}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="outlined" size="small" className="filter-form-control">
          <InputLabel>Situação</InputLabel>
          <Select
            name="situacao"
            value={filters.situacao}
            onChange={handleFilterChange}
            label="Situação"
          >
            <MenuItem value="todos"><em>Todas</em></MenuItem>
            <MenuItem value={1}>Quitada</MenuItem>
            <MenuItem value={0}>Em cobrança</MenuItem>
            <MenuItem value={-1}>Cancelada</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading-spinner"><CircularProgress /></div>
        ) : (
          <table className="cda-table">
            <thead>
              <tr>
                <th>Anos (idade)</th>
                <th>Número (CDA)</th>
                <th>Saldo (R$)</th>
                <th>Situação</th>
              </tr>
            </thead>
            <tbody>
              {cdas.map((cda) => (
                <tr key={cda.numero_cda}>
                  <td>{cda.ano_idade}</td>
                  <td>{cda.numero_cda}</td>
                  <td>{formatCurrency(cda.saldo)}</td>
                  <td>
                    <span className="status-indicator" style={{ backgroundColor: STATUS_COLORS[cda.situacao_legivel] }} />
                    {cda.situacao_legivel}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CdaSearch;