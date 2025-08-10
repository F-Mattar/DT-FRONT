// src/components/Header.jsx
import React from 'react';
import logo from '../assets/logo-pgm-rio.png';
import './Header.css';

const Header = ({ onToggleSidebar }) => {
  return (
    <header className="app-header">
      <div className="header-left">
        <button onClick={onToggleSidebar} className="sidebar-toggle">
          ☰
        </button>
        <img src={logo} alt="Logo PGM Rio" className="logo" />
        <div className="header-title-block">
          <h1>Procuradoria Geral do Município</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;