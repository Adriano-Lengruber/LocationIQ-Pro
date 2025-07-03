"""
API endpoints para administração e monitoramento
"""
from typing import Dict, Any, List
from fastapi import APIRouter, HTTPException, Query
from app.services.cache_service import cache_service
from app.services.ibge_service import ibge_service
from app.core.logger import logger


router = APIRouter()


@router.get("/cache/stats")
async def get_cache_stats() -> Dict[str, Any]:
    """
    Obtém estatísticas do cache Redis
    
    Returns:
        Estatísticas do cache
    """
    try:
        stats = await cache_service.get_cache_stats()
        return stats
        
    except Exception as e:
        logger.error(f"Erro ao obter estatísticas do cache: {e}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")


@router.post("/cache/clear/{municipality_id}")
async def clear_municipality_cache(municipality_id: int) -> Dict[str, Any]:
    """
    Limpa o cache de um município específico
    
    Args:
        municipality_id: Código IBGE do município
        
    Returns:
        Resultado da operação
    """
    try:
        deleted_count = await cache_service.clear_municipality_cache(municipality_id)
        
        return {
            "municipality_id": municipality_id,
            "deleted_keys": deleted_count,
            "status": "success",
            "message": f"Cache limpo para município {municipality_id}"
        }
        
    except Exception as e:
        logger.error(f"Erro ao limpar cache do município {municipality_id}: {e}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")


@router.post("/cache/warm-up")
async def warm_up_cache(
    municipality_ids: List[int] = Query(..., description="Lista de códigos IBGE para pré-carregar")
) -> Dict[str, Any]:
    """
    Pré-aquece o cache com dados de municípios específicos
    
    Args:
        municipality_ids: Lista de códigos IBGE
        
    Returns:
        Estatísticas do warm-up
    """
    try:
        stats = {"processed": 0, "cached": 0, "errors": 0}
        
        for municipality_id in municipality_ids[:50]:  # Limitar a 50 municípios por operação
            try:
                # Carregar dados completos para o cache
                await ibge_service.get_complete_municipality_data(municipality_id)
                stats["processed"] += 1
                stats["cached"] += 1
                
            except Exception as e:
                logger.error(f"Erro ao carregar dados do município {municipality_id}: {e}")
                stats["errors"] += 1
        
        return {
            "status": "completed",
            "statistics": stats,
            "message": f"Warm-up concluído para {len(municipality_ids)} municípios"
        }
        
    except Exception as e:
        logger.error(f"Erro no warm-up do cache: {e}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")


@router.get("/system/health")
async def system_health() -> Dict[str, Any]:
    """
    Verifica a saúde geral do sistema
    
    Returns:
        Status de saúde dos componentes
    """
    try:
        # Verificar cache
        cache_stats = await cache_service.get_cache_stats()
        
        # Verificar IBGE APIs (usar município padrão)
        from app.core.config import settings
        ibge_test = await ibge_service.get_municipality_info(settings.DEFAULT_MUNICIPALITY_ID)
        
        return {
            "status": "healthy",
            "timestamp": "2024-07-03T00:00:00Z",
            "components": {
                "cache": {
                    "status": "healthy" if cache_stats.get("enabled", False) else "disabled",
                    "details": cache_stats
                },
                "ibge_api": {
                    "status": "healthy" if ibge_test else "error",
                    "test_municipality": settings.DEFAULT_MUNICIPALITY_ID,
                    "available": ibge_test is not None
                },
                "database": {
                    "status": "not_implemented",
                    "note": "Verificação de BD será implementada quando necessário"
                }
            }
        }
        
    except Exception as e:
        logger.error(f"Erro na verificação de saúde do sistema: {e}")
        return {
            "status": "error",
            "error": str(e),
            "timestamp": "2024-07-03T00:00:00Z"
        }


@router.get("/system/info")
async def system_info() -> Dict[str, Any]:
    """
    Informações gerais do sistema LocationIQ Pro
    
    Returns:
        Informações do sistema
    """
    return {
        "name": "LocationIQ Pro API",
        "version": "1.0.0",
        "description": "API inteligente para análise de localização urbana",
        "modules": {
            "ibge": {
                "status": "active",
                "description": "Integração com dados oficiais do IBGE",
                "indicators": list(ibge_service.INDICADORES.keys()),
                "default_municipality": "Itaperuna, RJ"
            },
            "cache": {
                "status": "active" if cache_service.enabled else "disabled",
                "description": "Cache Redis para otimização de performance",
                "ttl_settings": cache_service.TTL_SETTINGS if cache_service.enabled else None
            }
        },
        "endpoints": {
            "ibge": "/api/v1/ibge/",
            "admin": "/api/v1/admin/",
            "docs": "/docs",
            "health": "/api/v1/admin/system/health"
        }
    }
