# 🚀 Guia de Início Rápido - APIs para LocationIQ Pro

## 🎯 Objetivo
Este guia te mostra como configurar rapidamente as APIs necessárias para testar o LocationIQ Pro com dados reais.

## ⚡ Configuração Rápida (15 minutos)

### 1. APIs Gratuitas - Cadastro Necessário

#### 🗺️ Google Places API (OBRIGATÓRIA)
1. Acesse: https://console.cloud.google.com/
2. Crie um projeto ou selecione um existente
3. Ative as APIs:
   - Places API
   - Maps JavaScript API  
   - Geocoding API
4. Crie uma chave API em "Credenciais"
5. **Restrinja o uso** para maior segurança (opcional)

**Cota gratuita**: 1,000 requests/mês por API

#### 🌤️ OpenWeather API (OBRIGATÓRIA)
1. Acesse: https://openweathermap.org/api
2. Crie uma conta gratuita
3. Confirme o email
4. Vá em "My API Keys" e copie sua chave
5. Aguarde até 2 horas para ativação

**Cota gratuita**: 1,000 calls/dia

#### 🗺️ Mapbox API (OBRIGATÓRIA)
1. Acesse: https://account.mapbox.com/
2. Crie uma conta gratuita
3. Vá em "Access Tokens"
4. Use o token público padrão ou crie um novo

**Cota gratuita**: 50,000 map loads/mês

### 2. APIs Opcionais (Recomendadas)

#### 🌬️ AirVisual API (Melhora dados de qualidade do ar)
1. Acesse: https://www.iqair.com/air-pollution-data-api
2. Crie uma conta
3. Confirme email e obtenha sua chave

**Cota gratuita**: 10,000 calls/mês

#### 🤖 OpenAI API (Para descrições inteligentes)
1. Acesse: https://platform.openai.com/
2. Crie uma conta
3. Adicione crédito ($5-10 recomendado para testes)
4. Crie uma API key

**Custo**: ~$0.002 por request (muito baixo para testes)

## 🔧 Configuração do Projeto

### Passo 1: Editar as Chaves
```bash
# Abra o arquivo de configuração
code api_keys_config.env

# Ou use qualquer editor de texto
notepad api_keys_config.env
```

### Passo 2: Adicionar suas Chaves
Substitua os valores de exemplo pelas suas chaves reais:

```env
# APIs Obrigatórias
GOOGLE_PLACES_API_KEY=AIza...sua-chave-aqui
MAPBOX_API_KEY=pk.eyJ1...sua-chave-aqui  
OPENWEATHER_API_KEY=abc123...sua-chave-aqui

# APIs Opcionais (deixe comentado se não tiver)
# AIRVISUAL_API_KEY=sua-chave-aqui
# OPENAI_API_KEY=sk-...sua-chave-aqui
```

### Passo 3: Aplicar Configuração
```bash
# Execute o script de configuração
python setup_api_keys.py

# Verifique se tudo está correto
python setup_api_keys.py --check
```

### Passo 4: Iniciar a Aplicação
```bash
# Backend
cd backend
uvicorn app.main:app --reload

# Frontend (novo terminal)
cd frontend  
npm run dev
```

## ✅ Verificação

Acesse http://localhost:3000 e:

1. **Teste a busca** - Digite "São Paulo, SP"
2. **Verifique o mapa** - Deve aparecer corretamente
3. **Veja os dados** - Weather, análises, etc.
4. **Status das APIs** - Acesse http://localhost:8000/api/v1/api/config/apis/health

## 🚨 Troubleshooting

### Erro "API Key not configured"
- Verifique se executou `python setup_api_keys.py`
- Confirme que as chaves estão corretas no `api_keys_config.env`
- Reinicie o backend após mudanças

### Maps não carregam
- Verifique o token do Mapbox
- Confirme que as APIs estão ativadas no Google Cloud
- Veja o console do navegador para erros

### Weather não funciona
- Aguarde até 2 horas após criar a chave OpenWeather
- Verifique se a chave está ativa no painel deles

## 💡 Dicas de Economia

1. **Use restrições de API** no Google Cloud
2. **Monitore uso** nos painéis das APIs
3. **Cache local** - O app já faz isso automaticamente
4. **Teste com moderação** durante desenvolvimento

## 🎯 Próximos Passos

Com as APIs básicas funcionando, você pode:

1. **Explorar todas as funcionalidades** do LocationIQ Pro
2. **Adicionar APIs opcionais** conforme necessário
3. **Testar diferentes localizações** ao redor do mundo
4. **Verificar dados reais** vs dados simulados

## 📞 Suporte

Se encontrar problemas:

1. Execute `python setup_api_keys.py --check`
2. Verifique logs do backend no terminal
3. Consulte `api_keys_setup_guide.md` para detalhes completos
4. Veja a documentação da API em http://localhost:8000/docs

---

**Tempo estimado**: ⏱️ 15-30 minutos (incluindo espera de ativação das APIs)

**Custo**: 🆓 Completamente gratuito para uso básico e testes!
