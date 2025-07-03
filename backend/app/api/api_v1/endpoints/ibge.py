"""
API endpoints para dados do IBGE
"""
from typing import Optional, Dict, Any, List
from fastapi import APIRouter, HTTPException, Query
from app.services.ibge_service import ibge_service
from app.core.config import settings
from app.core.logger import logger


router = APIRouter()


@router.get("/municipality/default")
async def get_default_municipality() -> Dict[str, Any]:
    """
    Obtém dados do município padrão configurado (Itaperuna)
    
    Returns:
        Dados completos do município padrão
    """
    try:
        municipality_id = settings.DEFAULT_MUNICIPALITY_ID
        data = await ibge_service.get_complete_municipality_data(municipality_id)
        
        # Adicionar coordenadas padrão
        data["coordinates"] = {
            "latitude": settings.DEFAULT_LATITUDE,
            "longitude": settings.DEFAULT_LONGITUDE,
            "mapbox_center": {
                "lat": settings.MAPBOX_CENTER_LAT,
                "lng": settings.MAPBOX_CENTER_LNG,
                "zoom": settings.MAPBOX_ZOOM
            }
        }
        
        return data
        
    except Exception as e:
        logger.error(f"Erro ao buscar município padrão: {e}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")


@router.get("/municipality/search")
async def search_municipalities(
    name: str = Query(..., description="Nome do município para buscar"),
    uf: Optional[str] = Query(None, description="Sigla do estado (RJ, SP, etc.)")
) -> List[Dict[str, Any]]:
    """
    Busca municípios por nome
    
    Args:
        name: Nome do município
        uf: Sigla do estado (opcional)
        
    Returns:
        Lista de municípios encontrados
    """
    try:
        municipalities = await ibge_service.search_municipalities(name, uf)
        return municipalities
        
    except Exception as e:
        logger.error(f"Erro ao buscar municípios: {e}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")


@router.get("/municipality/{municipality_id}")
async def get_municipality_data(
    municipality_id: int,
    include_indicators: bool = Query(True, description="Incluir indicadores econômicos")
) -> Dict[str, Any]:
    """
    Obtém dados completos de um município pelo código IBGE
    
    Args:
        municipality_id: Código IBGE do município
        include_indicators: Se deve incluir indicadores econômicos (pode ser mais lento)
        
    Returns:
        Dados completos do município
    """
    try:
        if include_indicators:
            data = await ibge_service.get_complete_municipality_data(municipality_id)
        else:
            # Só dados básicos, população e área
            basic_info = await ibge_service.get_municipality_info(municipality_id)
            population = await ibge_service.get_population_data(municipality_id)
            area = await ibge_service.get_area_data(municipality_id)
            
            data = {
                "municipality_id": municipality_id,
                "basic_info": basic_info,
                "population": population,
                "area": area,
                "economic_indicators": {},
                "last_updated": "2024-01-01"
            }
        
        if not data.get("basic_info"):
            raise HTTPException(status_code=404, detail=f"Município {municipality_id} não encontrado")
        
        return data
        
    except Exception as e:
        logger.error(f"Erro ao buscar dados do município {municipality_id}: {e}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")


@router.get("/population/{municipality_id}")
async def get_population(municipality_id: int) -> Dict[str, Any]:
    """
    Obtém dados populacionais específicos de um município
    
    Args:
        municipality_id: Código IBGE do município
        
    Returns:
        Dados populacionais
    """
    try:
        population_data = await ibge_service.get_population_data(municipality_id)
        
        if not population_data:
            raise HTTPException(status_code=404, detail="Dados populacionais não encontrados")
        
        return population_data
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao buscar população do município {municipality_id}: {e}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")


@router.get("/area/{municipality_id}")
async def get_area(municipality_id: int) -> Dict[str, Any]:
    """
    Obtém dados de área territorial de um município
    
    Args:
        municipality_id: Código IBGE do município
        
    Returns:
        Dados de área territorial
    """
    try:
        area_data = await ibge_service.get_area_data(municipality_id)
        
        if not area_data:
            raise HTTPException(status_code=404, detail="Dados de área não encontrados")
        
        return area_data
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao buscar área do município {municipality_id}: {e}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")


@router.get("/density/{municipality_id}")
async def get_density(municipality_id: int) -> Dict[str, Any]:
    """
    Obtém dados de densidade demográfica de um município
    
    Args:
        municipality_id: Código IBGE do município
        
    Returns:
        Dados de densidade demográfica
    """
    try:
        density_data = await ibge_service.get_density_data(municipality_id)
        
        if not density_data:
            raise HTTPException(status_code=404, detail="Dados de densidade demográfica não encontrados")
        
        return density_data
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao buscar densidade do município {municipality_id}: {e}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")


@router.get("/economic-indicators/{municipality_id}")
async def get_economic_indicators(municipality_id: int) -> Dict[str, Any]:
    """
    Obtém indicadores econômicos de um município
    
    Args:
        municipality_id: Código IBGE do município
        
    Returns:
        Indicadores econômicos disponíveis
    """
    try:
        indicators = await ibge_service.get_economic_indicators(municipality_id)
        
        return {
            "municipality_id": municipality_id,
            "indicators": indicators,
            "available_count": len(indicators),
            "last_updated": "2024-01-01"
        }
        
    except Exception as e:
        logger.error(f"Erro ao buscar indicadores econômicos do município {municipality_id}: {e}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")


@router.get("/health")
async def ibge_health_check() -> Dict[str, Any]:
    """
    Verifica a saúde da integração com APIs do IBGE
    
    Returns:
        Status das APIs do IBGE
    """
    try:
        # Testa com o município padrão
        municipality_id = settings.DEFAULT_MUNICIPALITY_ID
        basic_info = await ibge_service.get_municipality_info(municipality_id)
        
        status = {
            "ibge_localidades_api": "ok" if basic_info else "error",
            "default_municipality": {
                "id": municipality_id,
                "name": settings.DEFAULT_CITY_NAME,
                "state": settings.DEFAULT_STATE,
                "available": basic_info is not None
            },
            "endpoints": {
                "base_url": settings.IBGE_BASE_URL,
                "localidades": settings.IBGE_LOCALIDADES_URL,
                "indicadores": settings.IBGE_INDICADORES_URL
            }
        }
        
        return status
        
    except Exception as e:
        logger.error(f"Erro no health check do IBGE: {e}")
        return {
            "ibge_localidades_api": "error",
            "error": str(e),
            "default_municipality": {
                "id": settings.DEFAULT_MUNICIPALITY_ID,
                "name": settings.DEFAULT_CITY_NAME,
                "state": settings.DEFAULT_STATE,
                "available": False
            }
        }
