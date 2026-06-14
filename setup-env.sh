#!/bin/bash
# Gera o arquivo .env a partir do .env.example
# Uso: ./setup-env.sh

set -e

if [ -f .env ]; then
    echo ".env já existe. Nada a fazer."
    echo "Para recriar, remova o arquivo .env e rode este script novamente."
    exit 0
fi

cp .env.example .env

# Gera senha aleatória para o postgres
RANDOM_PASSWORD=$(openssl rand -base64 18 | tr -dc 'a-zA-Z0-9' | head -c 24)

sed -i.bak "s/POSTGRES_PASSWORD=postgres/POSTGRES_PASSWORD=${RANDOM_PASSWORD}/" .env
sed -i.bak "s/DB_PASSWORD=postgres/DB_PASSWORD=${RANDOM_PASSWORD}/" .env
rm -f .env.bak

echo ".env criado com sucesso!"
echo ""
echo "IMPORTANTE: edite o .env e preencha as credenciais do Cloudinary:"
echo "  CLOUDINARY_CLOUD_NAME"
echo "  CLOUDINARY_API_KEY"
echo "  CLOUDINARY_API_SECRET"
echo ""
echo "Depois rode: docker compose up -d --build"