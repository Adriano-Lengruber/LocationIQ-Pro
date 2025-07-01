# 📖 API Keys Setup Guide - LocationIQ Pro

Este guia detalha como obter todas as API keys necessárias para o LocationIQ Pro.

## 🚀 QUICK START - APIs Essenciais

Para começar a usar o sistema com dados reais, você precisa das **3 APIs críticas**:

### 1. Google Places API (OBRIGATÓRIA)
**Para que serve**: Busca de localizações, lugares próximos, geocoding

**Como obter**:
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative as seguintes APIs:
   - **Places API**
   - **Maps JavaScript API** 
   - **Geocoding API**
4. Vá em "Credenciais" → "Criar credenciais" → "Chave de API"
5. Configure restrições (opcional mas recomendado):
   - Restrição de API: Selecione as 3 APIs acima
   - Restrição de HTTP: Adicione seus domínios

**Custo**: Grátis até 28.000 requests/mês, depois $17/1000 requests

### 2. Mapbox Access Token (OBRIGATÓRIA)
**Para que serve**: Visualização de mapas no frontend

**Como obter**:
1. Crie conta em [Mapbox](https://account.mapbox.com/)
2. Vá em "Access tokens"
3. Use o token público padrão ou crie um novo
4. Configure escopos se necessário

**Custo**: Grátis até 50.000 map loads/mês, depois $5/1000 loads

### 3. OpenWeatherMap API (OBRIGATÓRIA)
**Para que serve**: Dados meteorológicos e qualidade do ar

**Como obter**:
1. Crie conta em [OpenWeatherMap](https://openweathermap.org/api)
2. Vá em "API keys" no dashboard
3. Copie sua chave padrão ou crie uma nova
4. Aguarde até 2 horas para ativação

**Custo**: Grátis até 60 calls/minuto, depois planos a partir de $40/mês

---

## ⭐ APIs RECOMENDADAS - Funcionalidades Avançadas

### 4. AirVisual API (Recomendada)
**Para que serve**: Dados avançados de qualidade do ar

**Como obter**:
1. Registre-se em [IQAir](https://www.iqair.com/air-pollution-data-api)
2. Acesse "API Access" no dashboard
3. Gere uma nova API key

**Custo**: Grátis até 10.000 calls/mês

### 5. OpenAI API (Recomendada)
**Para que serve**: Descrições inteligentes e insights avançados

**Como obter**:
1. Crie conta em [OpenAI Platform](https://platform.openai.com/)
2. Vá em "API keys"
3. Clique "Create new secret key"
4. Adicione créditos para uso (mínimo $5)

**Custo**: Pay-per-use, ~$0.002/1000 tokens

### 6. Booking.com API (Recomendada)
**Para que serve**: Preços de hotéis e dados de hospitalidade

**Como obter**:
1. Inscreva-se no [Booking.com Partner Hub](https://developers.booking.com/)
2. Solicite acesso à API (processo de aprovação)
3. Receba credenciais após aprovação

**Custo**: Geralmente gratuita para parceiros aprovados

---

## 🔧 CONFIGURAÇÃO NO SISTEMA

### Método 1: Arquivo de Configuração (Recomendado para desenvolvimento)

1. Abra o arquivo `api_keys_config.env`
2. Substitua os valores `your-*-api-key-here` pelas suas chaves reais
3. Execute o comando de setup:

```bash
# No diretório raiz do projeto
python setup_api_keys.py
```

### Método 2: Variáveis de Ambiente (Recomendado para produção)

```bash
# Linux/Mac
export GOOGLE_PLACES_API_KEY="sua-chave-aqui"
export MAPBOX_API_KEY="sua-chave-aqui"
export OPENWEATHER_API_KEY="sua-chave-aqui"

# Windows
set GOOGLE_PLACES_API_KEY=sua-chave-aqui
set MAPBOX_API_KEY=sua-chave-aqui
set OPENWEATHER_API_KEY=sua-chave-aqui
```

---

## 🛡️ SEGURANÇA E BOAS PRÁTICAS

### ✅ DO's
- Mantenha as API keys em arquivo separado não versionado
- Use restrições de domínio/IP quando possível
- Monitore o uso para evitar cobranças inesperadas
- Rotate as chaves periodicamente em produção
- Use diferentes chaves para dev/staging/prod

### ❌ DON'Ts  
- Nunca commite chaves reais no Git
- Não exponha chaves no frontend (exceto tokens públicos do Mapbox)
- Não compartilhe chaves entre ambientes
- Não use chaves com permissões excessivas

---

## 📊 MONITORAMENTO DE CUSTOS

### Configuração de Alertas

**Google Cloud**:
1. Vá em "Billing" → "Budgets & alerts"
2. Crie orçamento para APIs do Maps
3. Configure alertas em 50%, 80% e 100%

**OpenWeatherMap**:
1. Dashboard → "Statistics"
2. Monitore calls por dia
3. Configure notificações por email

**Mapbox**:
1. Account → "Usage"
2. Veja map loads mensais
3. Configure billing alerts

---

## 🚨 TROUBLESHOOTING

### Erro: "API key not valid"
- Verifique se a chave foi copiada corretamente
- Confirme que a API está ativada no console
- Aguarde até 2 horas para propagação

### Erro: "Quota exceeded"
- Verifique usage no dashboard da API
- Upgrade para plano pago se necessário
- Implemente cache para reduzir calls

### Erro: "Access denied"
- Verifique restrições de domínio/IP
- Confirme permissões da chave
- Teste com chave sem restrições primeiro

---

## 📞 SUPORTE

- **Google APIs**: [Support Center](https://developers.google.com/support)
- **Mapbox**: [Help Center](https://docs.mapbox.com/help/)
- **OpenWeatherMap**: [FAQ](https://openweathermap.org/faq)

Para problemas específicos do LocationIQ Pro, abra uma issue no repositório do projeto.
