"""
Serviço de cache Redis para dados do IBGE
"""
import json
import asyncio
from typing import Optional, Dict, Any, Union
from datetime import datetime, timedelta

try:
    import redis.asyncio as redis
    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False

from app.core.config import settings
from app.core.logger import logger


class CacheService:
    """Serviço de cache Redis para otimizar consultas ao IBGE"""
    
    def __init__(self):
        self.redis_client: Optional[redis.Redis] = None
        self.enabled = REDIS_AVAILABLE
        
        # TTL (Time To Live) para diferentes tipos de dados
        self.TTL_SETTINGS = {
            "municipality_info": 24 * 60 * 60,      # 24 horas (dados básicos mudam raramente)
            "population": 30 * 24 * 60 * 60,        # 30 dias (estimativas anuais)
            "area": 365 * 24 * 60 * 60,             # 1 ano (dados do censo são fixos)
            "density": 365 * 24 * 60 * 60,          # 1 ano (dados do censo são fixos)
            "search_results": 7 * 24 * 60 * 60,     # 7 dias (busca de municípios)
            "complete_data": 24 * 60 * 60,          # 24 horas (dados completos)
        }
    
    async def initialize(self):
        """Inicializa a conexão com Redis"""
        if not self.enabled:
            logger.warning("Redis não está disponível. Cache desabilitado.")
            return
        
        try:
            self.redis_client = redis.from_url(
                settings.REDIS_URL,
                encoding="utf-8",
                decode_responses=True,
                socket_timeout=5.0,
                socket_connect_timeout=5.0
            )
            
            # Testa a conexão
            await self.redis_client.ping()
            logger.info("Cache Redis inicializado com sucesso")
            
        except Exception as e:
            logger.error(f"Erro ao conectar ao Redis: {e}")
            self.enabled = False
            self.redis_client = None
    
    async def close(self):
        """Fecha a conexão com Redis"""
        if self.redis_client:
            await self.redis_client.close()
    
    def _generate_key(self, prefix: str, municipality_id: int, additional: str = "") -> str:
        """Gera chave padronizada para cache"""
        key = f"ibge:{prefix}:{municipality_id}"
        if additional:
            key += f":{additional}"
        return key
    
    async def get(self, key_type: str, municipality_id: int, additional: str = "") -> Optional[Dict[str, Any]]:
        """
        Recupera dados do cache
        
        Args:
            key_type: Tipo de dados (municipality_info, population, etc.)
            municipality_id: Código IBGE do município
            additional: Parâmetro adicional para a chave (opcional)
            
        Returns:
            Dados do cache ou None se não encontrado
        """
        if not self.enabled or not self.redis_client:
            return None
        
        try:
            key = self._generate_key(key_type, municipality_id, additional)
            cached_data = await self.redis_client.get(key)
            
            if cached_data:
                data = json.loads(cached_data)
                logger.debug(f"Cache HIT para chave: {key}")
                return data
            
            logger.debug(f"Cache MISS para chave: {key}")
            return None
            
        except Exception as e:
            logger.error(f"Erro ao recuperar do cache: {e}")
            return None
    
    async def set(
        self, 
        key_type: str, 
        municipality_id: int, 
        data: Dict[str, Any], 
        additional: str = "",
        custom_ttl: Optional[int] = None
    ) -> bool:
        """
        Armazena dados no cache
        
        Args:
            key_type: Tipo de dados
            municipality_id: Código IBGE do município
            data: Dados para armazenar
            additional: Parâmetro adicional para a chave
            custom_ttl: TTL customizado em segundos
            
        Returns:
            True se armazenado com sucesso, False caso contrário
        """
        if not self.enabled or not self.redis_client:
            return False
        
        try:
            key = self._generate_key(key_type, municipality_id, additional)
            ttl = custom_ttl or self.TTL_SETTINGS.get(key_type, settings.CACHE_TTL)
            
            # Adiciona timestamp de cache
            data_with_metadata = {
                **data,
                "_cached_at": datetime.utcnow().isoformat(),
                "_cache_ttl": ttl
            }
            
            serialized_data = json.dumps(data_with_metadata, ensure_ascii=False)
            
            await self.redis_client.setex(key, ttl, serialized_data)
            logger.debug(f"Cache SET para chave: {key} (TTL: {ttl}s)")
            return True
            
        except Exception as e:
            logger.error(f"Erro ao armazenar no cache: {e}")
            return False
    
    async def delete(self, key_type: str, municipality_id: int, additional: str = "") -> bool:
        """Remove dados específicos do cache"""
        if not self.enabled or not self.redis_client:
            return False
        
        try:
            key = self._generate_key(key_type, municipality_id, additional)
            result = await self.redis_client.delete(key)
            logger.debug(f"Cache DELETE para chave: {key}")
            return bool(result)
            
        except Exception as e:
            logger.error(f"Erro ao deletar do cache: {e}")
            return False
    
    async def clear_municipality_cache(self, municipality_id: int) -> int:
        """Remove todos os dados de cache para um município específico"""
        if not self.enabled or not self.redis_client:
            return 0
        
        try:
            pattern = f"ibge:*:{municipality_id}*"
            keys = await self.redis_client.keys(pattern)
            
            if keys:
                deleted_count = await self.redis_client.delete(*keys)
                logger.info(f"Cache limpo para município {municipality_id}: {deleted_count} chaves removidas")
                return deleted_count
            
            return 0
            
        except Exception as e:
            logger.error(f"Erro ao limpar cache do município {municipality_id}: {e}")
            return 0
    
    async def get_cache_stats(self) -> Dict[str, Any]:
        """Retorna estatísticas do cache"""
        if not self.enabled or not self.redis_client:
            return {"enabled": False, "error": "Redis não disponível"}
        
        try:
            info = await self.redis_client.info()
            
            # Contar chaves do IBGE
            ibge_keys = await self.redis_client.keys("ibge:*")
            
            return {
                "enabled": True,
                "connected": True,
                "total_keys": info.get("db0", {}).get("keys", 0) if "db0" in info else 0,
                "ibge_keys": len(ibge_keys),
                "memory_usage": info.get("used_memory_human", "N/A"),
                "uptime_seconds": info.get("uptime_in_seconds", 0),
                "last_check": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Erro ao obter estatísticas do cache: {e}")
            return {"enabled": True, "connected": False, "error": str(e)}
    
    async def warm_up_cache(self, municipality_ids: list) -> Dict[str, int]:
        """
        Pré-aquece o cache com dados de municípios específicos
        
        Args:
            municipality_ids: Lista de códigos IBGE para pré-carregar
            
        Returns:
            Estatísticas do warm-up
        """
        if not self.enabled:
            return {"error": "Cache não habilitado"}
        
        stats = {"processed": 0, "cached": 0, "errors": 0}
        
        # Esta função será implementada quando integrarmos com o IBGEService
        logger.info(f"Iniciando warm-up do cache para {len(municipality_ids)} municípios")
        
        return stats


# Instância global do serviço de cache
cache_service = CacheService()
