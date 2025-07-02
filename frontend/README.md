# LocationIQ Pro - Data Science Portfolio

![LocationIQ Pro](https://img.shields.io/badge/Status-100%25%20Functional-green)
![APIs](https://img.shields.io/badge/APIs-100%25%20Free-brightgreen)
![Cost](https://img.shields.io/badge/Cost-R%24%200-success)

> **Plataforma inteligente de análise urbana 100% gratuita**  
> Demonstra o poder das APIs gratuitas e tecnologias open-source para análise de dados geoespaciais.

## 🚀 Demonstração Live

- **Landing Page**: [http://localhost:3000](http://localhost:3000)
- **Dashboard Principal**: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
- **Status das APIs**: [http://localhost:3000/api-status](http://localhost:3000/api-status)

## 📋 Funcionalidades Principais

### 🏠 **Módulo Imobiliário**
- Análise de preços e valorização
- Predição de potencial de investimento
- Comparação regional de mercado
- **Rota**: `/modules/real-estate`

### 🛡️ **Módulo de Segurança**
- Análise de criminalidade por região
- Scoring de segurança
- Mapeamento de incidentes
- **Rota**: `/modules/security`

### 🏢 **Módulo de Infraestrutura**
- Avaliação de conectividade urbana
- Análise de transporte público
- Pontuação de amenidades
- **Rota**: `/modules/infrastructure`

### 🏨 **Módulo de Hospitalidade**
- Análise do mercado hoteleiro
- Previsão de ocupação
- Scoring de localização turística
- **Rota**: `/modules/hospitality`

### 🌿 **Módulo Ambiental**
- Qualidade do ar em tempo real
- Análise de risco climático
- Índices de sustentabilidade
- **Rota**: `/modules/environmental`

## 💚 Tecnologias 100% Gratuitas

### Mapas & Geocodificação
- **OpenStreetMap**: Mapas base gratuitos
- **Leaflet**: Biblioteca JavaScript open-source
- **React-Leaflet**: Integração com React

### APIs de Dados
- **IBGE API**: Dados socioeconômicos do Brasil
- **OpenWeatherMap** (Free Tier): Dados climáticos
- **dados.gov.br**: Dados públicos governamentais
- **Mock Data**: Sistema próprio para demonstração

### Frontend
- **Next.js 14**: Framework React de última geração
- **Tailwind CSS**: Framework CSS utility-first
- **TypeScript**: Tipagem estática
- **Recharts**: Gráficos interativos

## 🛠️ Como Executar

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone <url-do-repositorio>

# Navegue para o diretório
cd CityLens/frontend

# Instale as dependências
npm install

# Execute em modo de desenvolvimento
npm run dev
```

### Comandos Disponíveis
```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de produção
npm run start    # Servidor de produção
npm run lint     # Verificação de código
```

## 🌟 Destaques do Projeto

### ✅ **100% Gratuito**
- Nenhuma API paga necessária
- Sem custos ocultos ou limitações
- Todas as funcionalidades disponíveis

### ✅ **Responsivo & Moderno**
- Design adaptável para mobile
- Interface limpa e profissional
- Experiência de usuário otimizada

### ✅ **Dados Realistas**
- 15 cidades brasileiras com perfis únicos
- Métricas baseadas em dados reais
- Sistema de busca inteligente

### ✅ **Arquitetura Escalável**
- Componentes reutilizáveis
- Código bem documentado
- Estrutura modular

## 📊 Dados Mock Inclusos

O projeto inclui dados realistas para **15 cidades brasileiras**:

- São Paulo, SP
- Rio de Janeiro, RJ
- Brasília, DF
- Salvador, BA
- Fortaleza, CE
- Belo Horizonte, MG
- Manaus, AM
- Curitiba, PR
- Recife, PE
- Goiânia, GO
- Belém, PA
- Porto Alegre, RS
- São Luís, MA
- Maceió, AL
- Campo Grande, MS

Cada cidade possui:
- Coordenadas GPS precisas
- Perfil demográfico específico
- Métricas realistas por módulo
- Características únicas regionais

## 🗂️ Estrutura do Projeto

```
frontend/
├── src/
│   ├── app/                 # Páginas Next.js 14 (App Router)
│   │   ├── dashboard/       # Dashboard principal
│   │   ├── modules/         # Páginas dos módulos
│   │   ├── api-status/      # Status das APIs
│   │   └── page.tsx         # Landing page
│   ├── components/          # Componentes reutilizáveis
│   │   ├── ui/              # Componentes base (Radix UI)
│   │   ├── LocationSearch.tsx
│   │   ├── LeafletMap.tsx
│   │   └── ...
│   ├── services/            # Serviços e APIs
│   ├── stores/              # Estado global (Zustand)
│   └── styles/              # Estilos CSS
├── package.json
└── README.md
```

## 🎯 Objetivos Alcançados

- ✅ Dashboard 100% funcional sem APIs pagas
- ✅ Sistema de busca otimizado
- ✅ Navegação modular clara
- ✅ Dropdown de busca com z-index corrigido
- ✅ 15 cidades brasileiras com dados realistas
- ✅ Responsividade completa
- ✅ Remoção de dependências pagas
- ✅ Integração com OpenStreetMap/Leaflet
- ✅ Página de status das APIs
- ✅ Landing page enriquecida

## 📈 Próximos Passos (Opcional)

- [ ] Integração real com APIs gratuitas
- [ ] Mais cidades brasileiras
- [ ] Funcionalidades de exportação de dados
- [ ] Modo offline
- [ ] PWA (Progressive Web App)

## 🤝 Contribuindo

Este é um projeto de portfólio que demonstra habilidades em:
- Desenvolvimento Frontend moderno
- Integração com APIs gratuitas
- Análise de dados geoespaciais
- Design responsivo
- Arquitetura escalável

## 📄 Licença

Projeto desenvolvido para fins de portfólio e demonstração.

---

**LocationIQ Pro** - Democratizando o acesso à análise de dados urbanos 🏙️
