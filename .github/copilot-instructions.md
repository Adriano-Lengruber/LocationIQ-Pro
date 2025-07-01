<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# LocationIQ Pro - Copilot Instructions

## Project Context
This is a data science portfolio project called LocationIQ Pro - an intelligent location analysis platform that combines real estate, hospitality, environmental, and security data to provide comprehensive insights about urban locations.

## Tech Stack
- **Backend**: FastAPI (Python 3.11+), PostgreSQL, Redis, SQLAlchemy
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Mapbox GL JS
- **ML**: Scikit-learn, XGBoost, Pandas, NumPy
- **DevOps**: Docker, GitHub Actions

## Project Structure
- `backend/`: FastAPI application with ML models
- `frontend/`: Next.js React application
- `data/`: Data collection and processing scripts
- `docs/`: Project documentation

## Code Style Guidelines
- Use Python type hints for all backend code
- Follow PEP 8 for Python code formatting
- Use async/await for FastAPI endpoints
- Implement proper error handling and logging
- Use TypeScript strictly for frontend
- Follow React hooks patterns and functional components

## Key Features
1. **Real Estate Module**: Property price prediction and valuation analysis
2. **Hospitality Module**: Hotel price forecasting and location scoring
3. **Environmental Module**: Air quality, climate, and environmental risk analysis
4. **Security Module**: Crime data analysis and safety scoring
5. **Infrastructure Module**: Urban amenities and connectivity analysis

## ML Models
- XGBoost for price prediction (real estate and hotels)
- Random Forest for security scoring
- Content-based and collaborative filtering for recommendations

## Data Sources
- Public APIs (IBGE, OpenWeather, Google Places)
- Web scraping (ethical, respecting robots.txt)
- Government datasets (dados.gov.br)

## Development Priorities
1. Focus on clean, production-ready code
2. Implement comprehensive error handling
3. Add proper logging and monitoring
4. Create responsive and accessible UI
5. Optimize for performance and scalability

## Testing
- Use pytest for backend testing
- Use Jest/React Testing Library for frontend
- Aim for >80% test coverage
- Include integration tests for API endpoints

## Documentation
- Add docstrings to all Python functions
- Use JSDoc for TypeScript functions
- Keep README.md updated with setup instructions
- Document API endpoints with FastAPI automatic docs
