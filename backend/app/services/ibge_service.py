"""
Serviço para integração com APIs do IBGE
"""
from typing import Optional, Dict, Any, List
import httpx
import asyncio
from app.core.config import settings
from app.core.logger import logger
from app.services.cache_service import cache_service


class IBGEService:
    """Serviço para consultas às APIs do IBGE"""
    
    def __init__(self):
        self.base_url = settings.IBGE_BASE_URL
        self.localidades_url = settings.IBGE_LOCALIDADES_URL
        self.indicadores_url = settings.IBGE_INDICADORES_URL
        self.timeout = 30.0
        self.cache_enabled = True
        
        # IDs corretos dos indicadores IBGE (validados)
        self.INDICADORES = {
            "populacao_estimada": {
                "agregado": 6579,
                "variavel": 9324,
                "nome": "População residente estimada",
                "unidade": "Pessoas",
                "periodo_disponivel": "2001-2024"
            },
            "area_territorial": {
                "agregado": 1301,
                "variavel": 615,
                "nome": "Área total das unidades territoriais",
                "unidade": "Quilômetros quadrados",
                "periodo_disponivel": "2010"
            },
            "densidade_demografica": {
                "agregado": 1301,
                "variavel": 616,
                "nome": "Densidade demográfica da unidade territorial",
                "unidade": "Habitante por quilômetro quadrado",
                "periodo_disponivel": "2010"
            }
        }
    
    async def get_municipality_info(self, municipality_id: int) -> Optional[Dict[str, Any]]:
        """
        Obtém informações detalhadas de um município pelo código IBGE
        
        Args:
            municipality_id: Código IBGE do município
            
        Returns:
            Dados do município ou None se não encontrado
        """
        try:
            url = f"{self.localidades_url}/municipios/{municipality_id}"
            
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(url)
                response.raise_for_status()
                
                data = response.json()
                logger.info(f"Dados do município {municipality_id} obtidos com sucesso")
                
                return {
                    "id": data.get("id"),
                    "nome": data.get("nome"),
                    "microrregiao": data.get("microrregiao", {}).get("nome"),
                    "mesorregiao": data.get("mesorregiao", {}).get("nome"),
                    "uf": {
                        "id": data.get("UF", {}).get("id"),
                        "sigla": data.get("UF", {}).get("sigla"),
                        "nome": data.get("UF", {}).get("nome"),
                    },
                    "regiao": {
                        "id": data.get("UF", {}).get("regiao", {}).get("id"),
                        "sigla": data.get("UF", {}).get("regiao", {}).get("sigla"),
                        "nome": data.get("UF", {}).get("regiao", {}).get("nome"),
                    },
                    "regiao_imediata": {
                        "id": data.get("regiao-imediata", {}).get("id"),
                        "nome": data.get("regiao-imediata", {}).get("nome"),
                    },
                    "regiao_intermediaria": {
                        "id": data.get("regiao-intermediaria", {}).get("id"),
                        "nome": data.get("regiao-intermediaria", {}).get("nome"),
                    }
                }
                
        except httpx.HTTPError as e:
            logger.error(f"Erro HTTP ao buscar município {municipality_id}: {e}")
            return None
        except Exception as e:
            logger.error(f"Erro inesperado ao buscar município {municipality_id}: {e}")
            return None
    
    async def get_population_data(self, municipality_id: int) -> Optional[Dict[str, Any]]:
        """
        Obtém dados populacionais de um município usando indicador validado
        
        Args:
            municipality_id: Código IBGE do município
            
        Returns:
            Dicionário com dados populacionais ou None se não encontrado
        """
        # Verificar cache primeiro
        if self.cache_enabled:
            cached_data = await cache_service.get("population", municipality_id)
            if cached_data:
                return cached_data
        
        try:
            indicador = self.INDICADORES["populacao_estimada"]
            # Usar último período disponível (-1)
            url = f"{self.indicadores_url}/{indicador['agregado']}/periodos/-1/variaveis/{indicador['variavel']}"
            params = {"localidades": f"N6[{municipality_id}]"}
            
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(url, params=params)
                response.raise_for_status()
                
                data = response.json()
                
                if data and len(data) > 0:
                    resultado = data[0].get("resultados", [])
                    if resultado and len(resultado) > 0:
                        series = resultado[0].get("series", [])
                        if series and len(series) > 0:
                            serie_data = series[0].get("serie", {})
                            localidade = series[0].get("localidade", {})
                            
                            # Pegar o ano mais recente
                            if serie_data:
                                ano_mais_recente = max(serie_data.keys())
                                populacao = serie_data[ano_mais_recente]
                                
                                result = {
                                    "municipality_id": municipality_id,
                                    "municipality_name": localidade.get("nome", ""),
                                    "population": int(populacao) if populacao.isdigit() else None,
                                    "year": int(ano_mais_recente),
                                    "unit": indicador["unidade"],
                                    "source": "IBGE - Estimativas de População"
                                }
                                
                                # Armazenar no cache
                                if self.cache_enabled:
                                    await cache_service.set("population", municipality_id, result)
                                
                                return result
                
                return None
                
        except httpx.HTTPStatusError as e:
            logger.error(f"Erro HTTP ao buscar população de {municipality_id}: {e}")
            return None
        except Exception as e:
            logger.error(f"Erro inesperado ao buscar população de {municipality_id}: {e}")
            return None
    
    async def get_area_data(self, municipality_id: int) -> Optional[Dict[str, Any]]:
        """
        Obtém dados de área territorial de um município usando indicador validado
        
        Args:
            municipality_id: Código IBGE do município
            
        Returns:
            Dicionário com dados de área ou None se não encontrado
        """
        # Verificar cache primeiro
        if self.cache_enabled:
            cached_data = await cache_service.get("area", municipality_id)
            if cached_data:
                return cached_data
        
        try:
            indicador = self.INDICADORES["area_territorial"]
            # Usar dados do censo 2010
            url = f"{self.indicadores_url}/{indicador['agregado']}/periodos/2010/variaveis/{indicador['variavel']}"
            params = {"localidades": f"N6[{municipality_id}]"}
            
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(url, params=params)
                response.raise_for_status()
                
                data = response.json()
                
                if data and len(data) > 0:
                    resultado = data[0].get("resultados", [])
                    if resultado and len(resultado) > 0:
                        series = resultado[0].get("series", [])
                        if series and len(series) > 0:
                            serie_data = series[0].get("serie", {})
                            localidade = series[0].get("localidade", {})
                            
                            if serie_data and "2010" in serie_data:
                                area = serie_data["2010"]
                                
                                result = {
                                    "municipality_id": municipality_id,
                                    "municipality_name": localidade.get("nome", ""),
                                    "area_km2": float(area) if area and area != "..." else None,
                                    "year": 2010,
                                    "unit": indicador["unidade"],
                                    "source": "IBGE - Censo Demográfico 2010"
                                }
                                
                                # Armazenar no cache (dados do censo são estáveis)
                                if self.cache_enabled:
                                    await cache_service.set("area", municipality_id, result)
                                
                                return result
                
                return None
                
        except httpx.HTTPStatusError as e:
            logger.error(f"Erro HTTP ao buscar área de {municipality_id}: {e}")
            return None
        except Exception as e:
            logger.error(f"Erro inesperado ao buscar área de {municipality_id}: {e}")
            return None

    async def get_density_data(self, municipality_id: int) -> Optional[Dict[str, Any]]:
        """
        Obtém dados de densidade demográfica de um município
        
        Args:
            municipality_id: Código IBGE do município
            
        Returns:
            Dicionário com dados de densidade ou None se não encontrado
        """
        # Verificar cache primeiro
        if self.cache_enabled:
            cached_data = await cache_service.get("density", municipality_id)
            if cached_data:
                return cached_data
        
        try:
            indicador = self.INDICADORES["densidade_demografica"]
            url = f"{self.indicadores_url}/{indicador['agregado']}/periodos/2010/variaveis/{indicador['variavel']}"
            params = {"localidades": f"N6[{municipality_id}]"}
            
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(url, params=params)
                response.raise_for_status()
                
                data = response.json()
                
                if data and len(data) > 0:
                    resultado = data[0].get("resultados", [])
                    if resultado and len(resultado) > 0:
                        series = resultado[0].get("series", [])
                        if series and len(series) > 0:
                            serie_data = series[0].get("serie", {})
                            localidade = series[0].get("localidade", {})
                            
                            if serie_data and "2010" in serie_data:
                                densidade = serie_data["2010"]
                                
                                result = {
                                    "municipality_id": municipality_id,
                                    "municipality_name": localidade.get("nome", ""),
                                    "density": float(densidade) if densidade and densidade != "..." else None,
                                    "year": 2010,
                                    "unit": indicador["unidade"],
                                    "source": "IBGE - Censo Demográfico 2010"
                                }
                                
                                # Armazenar no cache (dados do censo são estáveis)
                                if self.cache_enabled:
                                    await cache_service.set("density", municipality_id, result)
                                
                                return result
                
                return None
                
        except httpx.HTTPStatusError as e:
            logger.error(f"Erro HTTP ao buscar densidade de {municipality_id}: {e}")
            return None
        except Exception as e:
            logger.error(f"Erro inesperado ao buscar densidade de {municipality_id}: {e}")
            return None
    
    async def get_economic_indicators(self, municipality_id: int) -> Dict[str, Any]:
        """
        Obtém indicadores econômicos disponíveis para um município
        Esta função pode ser expandida com novos indicadores conforme necessário
        
        Args:
            municipality_id: Código IBGE do município
            
        Returns:
            Dicionário com indicadores disponíveis
        """
        try:
            indicators = {}
            
            # Por enquanto, retorna estrutura vazia mas pode ser expandida
            # com indicadores como PIB, emprego, etc.
            
            return {
                "municipality_id": municipality_id,
                "indicators": indicators,
                "available_indicators": list(self.INDICADORES.keys()),
                "note": "Indicadores econômicos específicos podem ser adicionados conforme demanda"
            }
            
        except Exception as e:
            logger.error(f"Erro ao buscar indicadores econômicos: {e}")
            return {}

    async def search_municipalities(self, name: str, uf: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Busca municípios por nome
        
        Args:
            name: Nome do município para buscar
            uf: Sigla do estado (opcional)
            
        Returns:
            Lista de municípios encontrados
        """
        try:
            url = f"{self.localidades_url}/municipios"
            
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(url)
                response.raise_for_status()
                
                municipalities = response.json()
                
                # Filtrar por nome
                filtered = []
                for municipality in municipalities:
                    municipality_name = municipality.get("nome", "").lower()
                    if name.lower() in municipality_name:
                        # Se UF foi especificada, filtrar também por estado
                        if uf:
                            municipality_uf = municipality.get("UF", {}).get("sigla", "")
                            if municipality_uf.upper() != uf.upper():
                                continue
                        
                        filtered.append({
                            "id": municipality.get("id"),
                            "nome": municipality.get("nome"),
                            "uf": municipality.get("UF", {}).get("sigla"),
                            "microrregiao": municipality.get("microrregiao", {}).get("nome"),
                            "mesorregiao": municipality.get("mesorregiao", {}).get("nome")
                        })
                
                logger.info(f"Encontrados {len(filtered)} municípios para '{name}'")
                return filtered[:10]  # Limitar a 10 resultados
                
        except httpx.HTTPError as e:
            logger.error(f"Erro HTTP ao buscar municípios: {e}")
            return []
        except Exception as e:
            logger.error(f"Erro inesperado ao buscar municípios: {e}")
            return []
    
    async def get_complete_municipality_data(self, municipality_id: int) -> Dict[str, Any]:
        """
        Obtém dados completos de um município (informações básicas + população + área + densidade + indicadores)
        
        Args:
            municipality_id: Código IBGE do município
            
        Returns:
            Dicionário com todos os dados disponíveis
        """
        try:
            # Executar todas as consultas em paralelo para melhor performance
            basic_info_task = self.get_municipality_info(municipality_id)
            population_task = self.get_population_data(municipality_id)
            area_task = self.get_area_data(municipality_id)
            density_task = self.get_density_data(municipality_id)
            economic_task = self.get_economic_indicators(municipality_id)
            
            # Aguardar todas as consultas
            basic_info, population, area, density, economic_indicators = await asyncio.gather(
                basic_info_task,
                population_task,
                area_task,
                density_task,
                economic_task,
                return_exceptions=True
            )
            
            # Estruturar resposta final
            result = {
                "municipality_id": municipality_id,
                "basic_info": basic_info if not isinstance(basic_info, Exception) else None,
                "population": population if not isinstance(population, Exception) else None,
                "area": area if not isinstance(area, Exception) else None,
                "density": density if not isinstance(density, Exception) else None,
                "economic_indicators": economic_indicators if not isinstance(economic_indicators, Exception) else {},
                "last_updated": "2024-07-03",
                "data_sources": [
                    "IBGE - Localidades",
                    "IBGE - Estimativas de População",
                    "IBGE - Censo Demográfico 2010"
                ]
            }
            
            logger.info(f"Dados completos de {municipality_id} obtidos com sucesso")
            return result
            
        except Exception as e:
            logger.error(f"Erro ao obter dados completos de {municipality_id}: {e}")
            return {"error": str(e), "municipality_id": municipality_id}


# Instância global do serviço
ibge_service = IBGEService()
