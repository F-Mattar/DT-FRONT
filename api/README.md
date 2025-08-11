# PGM-Rio - Painel de Dívida Ativa

Um painel interativo desenvolvido para a Procuradoria Geral do Município do Rio de Janeiro (PGM-Rio) para visualização e análise de Certidões de Dívida Ativa (CDAs). A plataforma permite a exploração de dados agregados através de gráficos e oferece funcionalidades de busca e detalhamento para CDAs.

## Features

* **Dashboard Principal:** Apresenta uma visão geral e agregada da Dívida Ativa.
    * Exibição de Indicadores Chave de Desempenho (KPIs) para o saldo total e a quantidade de CDAs.
    * **Gráficos Dinâmicos:**
        * Gráficos para visualização do saldo e da quantidade de dívidas por tipo (IPTU, ISS, etc.).
        * Gráfico de linha para o acompanhamento do histórico de inscrições de dívidas ao longo dos anos.
        * Visualização da distribuição percentual dos status de dívida (Quitada, Em Cobrança, Cancelada) para cada tipo de imposto.
* **Busca por CDA Individual:** Funcionalidade de busca por número de CDA para carregar um painel de análise detalhado e individual.
* **Busca Dinâmica de CDAs:** Tabela interativa com filtros por **idade** e **situação** da CDA, com resultados atualizados em tempo real.
* **Interface Customizável:** Barra lateral que permite ao usuário selecionar os widgets de análise a serem exibidos.

---

## Estrutura do Projeto

O projeto é organizado em uma estrutura de monorepo, com as responsabilidades claramente divididas:

* **/frontend:** Contém a aplicação frontend desenvolvida em React.
* **/api:** Contém a API backend desenvolvida em Python com FastAPI.
* **/data:** Armazena os arquivos `.json` estáticos que servem como fonte de dados para a API.

---

## Tecnologias

As seguintes ferramentas foram usadas na construção do projeto:

### **Frontend**
* **Framework:** [React.js](https://reactjs.org/)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **UI Library:** [Material-UI](https://mui.com/)
* **Estilização:** [Emotion](https://emotion.sh/) e CSS Modules
* **Gráficos:** [Recharts](https://recharts.org/)
* **Cliente HTTP:** [Axios](https://axios-http.com/)
* **Linting:** [ESLint](https://eslint.org/)

### **Backend**
* **Framework:** [FastAPI](https://fastapi.tiangolo.com/) (Python)
* **Servidor:** [Uvicorn](https://www.uvicorn.org/)
* **Validação de Dados:** [Pydantic](https://pydantic-docs.helpmanual.io/)

---

## Como Começar

Siga os passos abaixo para configurar e rodar o projeto em seu ambiente local. O projeto requer a execução simultânea do **backend** e do **frontend**.

### Pré-requisitos
* [Node.js](https://nodejs.org/en/) (versão 18 ou superior)
* [Python](https://www.python.org/) (versão 3.9 ou superior) e `pip`

### 1. Clonar o Repositório e Acessar a Pasta
```bash
# Clone este repositório
git clone [https://github.com/F-Mattar/DT-FRONT](https://github.com/F-Mattar/DT-FRONT)
```
# Acesse a pasta do projeto
cd DT-FRONT

### 2. Rodando o Backend (API)

Em um terminal, execute os seguintes passos:

# 1. Acesse a pasta da API
cd api

# 2. Crie e ative um ambiente virtual (recomendado)
python -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate

# 3. Instale as dependências Python
pip install -r ../requirements.txt

# 4. Inicie o servidor da API
uvicorn main:app --reload --port 8000

O servidor da API estará em execução em http://127.0.0.1:8000.

### 3. Rodando o Frontend

Em outro terminal, execute os seguintes passos:

```bash
# 1. Acesse a pasta do frontend
cd frontend

# 2. Instale as dependências do Node.js
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação frontend estará acessível em http://localhost:5173.

### 4. API Endpoints

A API FastAPI expõe os seguintes endpoints principais:

GET /resumo/{file_name}: Retorna o conteúdo de um arquivo JSON da pasta /data (ex: saldo_cdas).

GET /cda/search: Permite a busca e filtragem de CDAs com base em parâmetros de query como ano, situação, saldo_min, etc.

GET /cda/{cda_number}/dashboard: Retorna os dados agregados para a construção do painel de uma única CDA.
