# PGM-Rio - Painel de Dívida Ativa

Um painel interativo desenvolvido para a **Procuradoria Geral do Município do Rio de Janeiro (PGM-Rio)** para visualização e análise de **Certidões de Dívida Ativa (CDAs)**.  
A plataforma permite explorar dados agregados por meio de gráficos dinâmicos e oferece funcionalidades de busca e detalhamento para CDAs individuais.

---

## Funcionalidades

### Dashboard Principal
- Visão geral e agregada da Dívida Ativa.
- **KPIs**: saldo total e quantidade de CDAs.
- **Gráficos dinâmicos**:
  - Saldo e quantidade de dívidas por tipo (IPTU, ISS, etc.).
  - Histórico de inscrições de dívidas ao longo dos anos (gráfico de linha).
  - Distribuição percentual dos status de dívida (Quitada, Em Cobrança, Cancelada) por tipo de imposto.

### Busca e Análise de CDAs
- **Busca por CDA individual**: painel detalhado para análise de uma única CDA.
- **Busca dinâmica**: tabela interativa com filtros por **idade** e **situação**, atualizada em tempo real.

### Interface Customizável
- Barra lateral para seleção dos widgets de análise a serem exibidos.

---

## Estrutura do Projeto

O projeto é organizado em **monorepo**, com responsabilidades separadas:

/frontend → Aplicação React (interface)
/api → API em FastAPI (backend)
/data → Arquivos .json usados como fonte de dados


---

## Tecnologias Utilizadas

### Frontend
- **[React.js](https://reactjs.org/)** + **[Vite](https://vitejs.dev/)**
- UI: **[Material-UI](https://mui.com/)**
- Estilização: **[Emotion](https://emotion.sh/)** e CSS Modules
- Gráficos: **[Recharts](https://recharts.org/)**
- HTTP Client: **[Axios](https://axios-http.com/)**
- Lint: **[ESLint](https://eslint.org/)**

### Backend
- **[FastAPI](https://fastapi.tiangolo.com/)** (Python)
- Servidor: **[Uvicorn](https://www.uvicorn.org/)**
- Validação de dados: **[Pydantic](https://pydantic-docs.helpmanual.io/)**

---

## Como Rodar Localmente

O projeto requer execução simultânea do **backend** e **frontend**.

### Pré-requisitos
- [Node.js](https://nodejs.org/en/) (>= 18)
- [Python](https://www.python.org/) (>= 3.9) com `pip`

---

### Clonar o Repositório
```bash
git clone https://github.com/F-Mattar/DT-FRONT
```
cd DT-FRONT

### Rodar o Backend

# Entrar na pasta da API
cd api

# Criar e ativar ambiente virtual
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Instalar dependências
pip install -r ../requirements.txt

# Iniciar servidor
uvicorn main:app --reload --port 8000
# Disponível em http://127.0.0.1:8000

### Rodar o Frontend

Em outro terminal, a partir da raiz do projeto DT-FRONT:

cd frontend
npm install
npm run dev
# Disponível em http://localhost:5173

### API Endpoints

A API FastAPI expõe os seguintes endpoints principais:

GET /resumo/{file_name}: Retorna o conteúdo de um arquivo JSON da pasta /data (ex: saldo_cdas). 

GET /cda/search: Permite a busca e filtragem de CDAs com base em parâmetros de query como ano, situacao, saldo_min, etc. 

GET /cda/{cda_number}/dashboard: Retorna os dados agregados para a construção do painel de uma única CDA.
