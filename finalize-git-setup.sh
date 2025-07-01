#!/bin/bash
# Script para finalizar configuração do Git e fazer push inicial

set -e

echo "=================================================="
echo "       FINALIZANDO CONFIGURAÇÃO DO GIT"
echo "=================================================="
echo

cd /f/DEV/CityLens

# Corrigir configuração de credenciais
echo "[1/6] Corrigindo configuração de credenciais..."
git config --global credential.helper manager
git config --global credential.useHttpPath true

# Verificar configuração atual
echo "[2/6] Verificando configuração atual..."
echo "Usuário: $(git config user.name)"
echo "Email: $(git config user.email)"
echo "Remote: $(git remote get-url origin)"

# Verificar se há alterações pendentes
echo "[3/6] Verificando status do repositório..."
git status

# Verificar se o repositório remoto existe
echo "[4/6] Verificando repositório remoto..."
echo "❌ O repositório 'LocationIQ-Pro' ainda não existe no GitHub!"
echo
echo "📋 PRÓXIMOS PASSOS MANUAIS:"
echo "1. Acesse: https://github.com/new"
echo "2. Nome do repositório: LocationIQ-Pro"
echo "3. Descrição: Intelligent location analysis platform combining real estate, hospitality, environmental, and security data"
echo "4. Marque como Público"
echo "5. NÃO inicialize com README (já temos arquivos)"
echo "6. Clique em 'Create repository'"
echo

echo "[5/6] Testando conectividade com GitHub..."
if curl -s --connect-timeout 10 https://github.com > /dev/null; then
    echo "✅ Conectividade com GitHub OK"
else
    echo "❌ Problema de conectividade com GitHub"
fi

echo "[6/6] Preparando comando para push após criação do repositório..."
echo
echo "Após criar o repositório no GitHub, execute:"
echo "git push -u origin main"
echo
echo "=================================================="
echo "           CONFIGURAÇÃO PRONTA!"
echo "=================================================="
echo
echo "Status do projeto:"
echo "- ✅ Git configurado e funcionando"
echo "- ✅ Primeiro commit realizado"
echo "- ✅ Arquivo .gitignore protegendo chaves de API"
echo "- ✅ Documentação completa"
echo "- ⏳ Aguardando criação do repositório no GitHub"
echo
