# LocationIQ Pro

## 🌟 Visão Geral

**LocationIQ Pro** é uma plataforma inteligente de análise de localização que combina dados imobiliários, hoteleiros, ambientais, de segurança e infraestrutura urbana para fornecer insights abrangentes sobre qualquer localização.

Este é um projeto de portfólio completo de **Data Science e Engineering** que demonstra:
- **Backend moderno** com FastAPI e Python
- **Frontend responsivo** com Next.js 14 e TypeScript  
- **Machine Learning** integrado para análise preditiva
- **Arquitetura escalável** e modular
- **APIs RESTful** bem documentadas
- **Sistema centralizado de configuração de APIs**

## 🚀 Status do Projeto

✅ **Backend FastAPI** - Funcionando  
✅ **Frontend Next.js** - Funcionando  
✅ **Database SQLite** - Configurado  
✅ **APIs REST** - Implementadas  
✅ **Interface Web** - Implementada  
✅ **Sistema de Configuração de APIs** - Implementado  
🔄 **Machine Learning** - Em desenvolvimento  
🔄 **APIs Externas** - Integração em andamento  
🔄 **PostgreSQL** - Planejado para produção  

## 📋 Funcionalidades Atuais

### ✨ Interface Web
- **Busca de localização** inteligente
- **Mapa interativo** com Mapbox GL JS
- **Dashboard de análise** com scores visuais
- **Status de configuração de APIs** em tempo real
- **Design responsivo** com Tailwind CSS

### 🔧 Backend API
- **Busca de localizações** (`/api/v1/locations/search`)
- **Geocoding/Reverse geocoding** 
- **Análise completa** de localização (`/api/v1/locations/analyze/{id}`)
- **Gestão de localizações** (CRUD)
- **Status de APIs externas** (`/api/v1/api/config/apis/status`)
- **Documentação automática** (FastAPI Docs)

### 📊 Módulos de Análise
- **🏠 Imobiliário**: Análise de potencial de valorização
- **🏨 Hotelaria**: Score de atratividade turística  
- **🌿 Ambiental**: Qualidade ambiental e sustentibilidade
- **🛡️ Segurança**: Análise de segurança urbana
- **🚇 Infraestrutura**: Conectividade e serviços urbanos

## 🛠️ Stack Tecnológica

### Backend
- **FastAPI** (Python 3.11+)
- **SQLAlchemy** (ORM)
- **SQLite** (Development) / **PostgreSQL** (Production)
- **Pydantic** (Validation)
- **Uvicorn** (ASGI Server)

### Frontend  
- **Next.js 14** (React Framework)
- **TypeScript** (Type Safety)
- **Tailwind CSS** (Styling)
- **Mapbox GL JS** (Interactive Maps)
- **Lucide React** (Icons)
- **Axios** (HTTP Client)

### Machine Learning (Planejado)
- **Scikit-learn** 
- **XGBoost**
- **Pandas & NumPy**

## 🚀 Como Executar

### Pré-requisitos
- **Python 3.11+**
- **Node.js 18+** 
- **npm** ou **yarn**

### 1. Clone e Configure o Ambiente

```bash
git clone <repository-url>
cd CityLens

# Criar e ativar ambiente virtual Python
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# ou
.venv\\Scripts\\activate   # Windows

# Instalar dependências Python
pip install -r requirements.txt
```

### 2. Configurar Backend

```bash
# Configurar variáveis de ambiente
cp backend/.env.example backend/.env

# Inicializar banco de dados
cd backend
python init_db.py

# Testar conexão (opcional)
python test_db.py
```

### 3. 🔑 Configurar APIs Externas (IMPORTANTE)

O LocationIQ Pro usa diversas APIs externas para dados reais. Para configurá-las:

```bash
# 1. Edite o arquivo central de configuração
# Abra api_keys_config.env no editor e adicione suas chaves

# 2. Execute o script de configuração automática
python setup_api_keys.py

# 3. Verifique o status das APIs
python setup_api_keys.py --check
```

#### APIs Críticas (Obrigatórias)
- **Google Places API**: Busca de localizações e POIs
- **Mapbox API**: Mapas interativos  
- **OpenWeather API**: Dados climáticos e qualidade do ar

#### APIs Recomendadas (Melhoram a experiência)
- **AirVisual API**: Dados avançados de qualidade do ar
- **OpenAI API**: Descrições inteligentes das análises

📖 **Guia completo**: Veja `api_keys_setup_guide.md` para instruções detalhadas de cada API.

### 4. Configurar Frontend

```bash
cd frontend

# Instalar dependências Node.js
npm install

# As variáveis de ambiente são configuradas automaticamente pelo setup_api_keys.py
```

### 5. Executar a Aplicação

#### Opção 1: Manual
```bash
# Terminal 1 - Backend
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

#### Opção 2: VS Code Tasks
- Abra o projeto no VS Code
- `Ctrl+Shift+P` → "Tasks: Run Task"
- Selecione **"Start Full Stack"**

### 6. 🔧 Configurar Git (Controle de Versão)

Se o Git não está funcionando no VS Code, use nossa solução portable:

```bash
# Instalação guiada do Git portable
install-git.cmd

# Ou instalação manual rápida:
# 1. Baixe: https://git-scm.com/download/win (Portable)
# 2. Extraia para: .tools/git-portable/
# 3. Execute: git-init.cmd
```

#### Scripts Git Disponíveis:
- **`git-status.cmd`** - Ver status do repositório
- **`git-commit.cmd`** - Fazer commit das mudanças  
- **`git-push.cmd`** - Enviar para GitHub
- **`git-remote.cmd`** - Configurar repositório remoto

📖 **Guia completo**: Veja `GIT_PORTABLE_SETUP.md`

### 7. Acessar a Aplicação

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📱 Como Usar

1. **Acesse** http://localhost:3000
2. **Digite** uma localização na barra de busca (ex: "São Paulo, SP")
3. **Selecione** uma localização dos resultados
4. **Visualize** a análise completa com scores e insights
5. **Explore** o mapa interativo

## 🏗️ Arquitetura

```
CityLens/
├── backend/                 # FastAPI Application
│   ├── app/
│   │   ├── api/            # API Routes
│   │   ├── core/           # Configuration & Database
│   │   ├── models/         # SQLAlchemy Models
│   │   └── services/       # Business Logic
│   ├── init_db.py         # Database Setup
│   └── test_db.py         # Database Tests
├── frontend/               # Next.js Application  
│   ├── src/
│   │   ├── app/           # App Router (Next.js 14)
│   │   └── components/    # React Components
│   └── public/           # Static Assets
├── data/                  # Data Processing Scripts
├── docs/                  # Documentation
└── requirements.txt      # Python Dependencies
```

## 🔌 API Endpoints

### Localizações
- `GET /api/v1/locations/search` - Buscar localizações
- `GET /api/v1/locations/geocode` - Geocoding  
- `GET /api/v1/locations/reverse-geocode` - Reverse geocoding
- `GET /api/v1/locations/analyze/{id}` - Análise completa
- `POST /api/v1/locations/create` - Criar localização
- `GET /api/v1/locations/list` - Listar localizações

### Módulos Específicos
- `GET /api/v1/real-estate/*` - APIs imobiliárias
- `GET /api/v1/hotels/*` - APIs hoteleiras  
- `GET /api/v1/environmental/*` - APIs ambientais
- `GET /api/v1/security/*` - APIs de segurança
- `GET /api/v1/infrastructure/*` - APIs de infraestrutura

## 🧪 Testes

```bash
# Testar backend
cd backend
python test_db.py

# Testar APIs
curl http://localhost:8000/health
curl http://localhost:8000/api/v1/locations/search?query=Sao+Paulo

# Testar frontend  
cd frontend
npm run lint
npm run build
```

---

**Status**: 🚀 **Beta v1.0** - Em desenvolvimento ativo
