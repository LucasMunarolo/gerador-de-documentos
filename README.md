# Gerador de Documentos — Setup com Docker

Este projeto tem dois fluxos de execução: **desenvolvimento** e **produção (local)**.

## Estrutura

```
gerador-documentos/
├── geradordocumentos/        # Spring Boot
├── gerador-documentos-ui/    # React/Vite
├── docker-compose.yml        # Setup completo (prod-like): postgres + backend + frontend
├── docker-compose.dev.yml    # Apenas postgres, para desenvolvimento local
├── .env.example
└── setup-env.sh
```

## 1. Primeira vez: gerar o .env

```bash
chmod +x setup-env.sh
./setup-env.sh
```

Isso cria o `.env` a partir do `.env.example`, com uma senha aleatória para o Postgres.
Edite o `.env` e preencha as credenciais do Cloudinary.

---

## 2. Fluxo de Desenvolvimento (recomendado no dia a dia)

Sobe **apenas o Postgres**. Backend e frontend rodam localmente, com hot-reload.

```bash
docker compose -f docker-compose.dev.yml up -d
```

Backend (em outro terminal, dentro de `geradordocumentos/`):
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

Frontend (em outro terminal, dentro de `gerador-documentos-ui/`):
```bash
npm run dev
```

Mudanças no código refletem automaticamente (hot-reload do Vite e DevTools/restart do Spring Boot).

Para derrubar o Postgres:
```bash
docker compose -f docker-compose.dev.yml down
```

---

## 3. Fluxo de Produção (local) — simula o ambiente real

Sobe **tudo**: Postgres + Backend (compilado) + Frontend (build estático servido por nginx).

```bash
docker compose up -d --build
```

- Backend disponível em `http://localhost:8080`
- Frontend disponível em `http://localhost:5173`

**Importante:** mudanças no código NÃO refletem automaticamente aqui. As imagens são construídas uma vez com o código no momento do build. Para ver mudanças, rode novamente:

```bash
docker compose up -d --build
```

O Docker usa cache de camadas, então só reconstrói o que mudou.

Para derrubar tudo:
```bash
docker compose down
```

Para derrubar e remover os dados do Postgres também:
```bash
docker compose down -v
```

---

## Resumo

| Cenário | Comando | Hot-reload? |
|---|---|---|
| Desenvolvimento diário | `docker compose -f docker-compose.dev.yml up -d` + rodar back/front localmente | Sim |
| Testar build de produção localmente | `docker compose up -d --build` | Não (precisa rebuild) |