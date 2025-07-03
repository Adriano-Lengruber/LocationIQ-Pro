import asyncio
from app.services.cache_service import cache_service

async def test_cache():
    # Inicializar o cache
    await cache_service.initialize()
    
    # Obter estatísticas
    stats = await cache_service.get_cache_stats()
    print("Cache Stats:", stats)

if __name__ == "__main__":
    asyncio.run(test_cache())
