# Autoflex Frontend

Professional React frontend for inventory management and production suggestion.

## Stack

- React (stable)
- Vite
- TypeScript
- Redux Toolkit
- Axios
- ESLint + Prettier

## Environment

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Example:

```env
VITE_API_BASE_URL=http://localhost:8081/api
```

## Scripts

```bash
npm install
npm run dev
npm run lint
npm run build
npm run format
```

## Validação Rápida (5 minutos)

1. Suba o backend em `http://localhost:8081`.
2. Rode o frontend com `npm run dev`.
3. Acesse a aplicação e valide os fluxos principais:

- Login com `admin / admin123`.
- Dashboard (`/dashboard`) com KPIs e tabela ordenada por valor total.
- Produção (`/production`) e atualização via botão "Atualizar".

4. Teste permissões:

- `ADMIN`: Produtos, Matérias-primas, Dashboard e Produção.
- `USER`: Dashboard e Produção.

Smoke test de API (opcional, pela raiz do workspace):

```powershell
powershell -ExecutionPolicy Bypass -File .\backend\scripts\smoke-test.ps1
```

## Pages

- `/login`:
  - autenticação JWT
  - redirecionamento por perfil
- `/products`:
  - product CRUD
  - raw material association in product modal
- `/raw-materials`:
  - raw material CRUD
  - stock updates
- `/production`:
  - production suggestion table
  - highest total value first
  - overall total value summary

## Authentication

- Token JWT persistido em `localStorage`
- `Authorization: Bearer <token>` enviado automaticamente via Axios interceptor
- `ADMIN`: acesso a produtos, matérias-primas e produção
- `USER`: acesso apenas à produção

Credenciais padrão (backend seed):

- `admin` / `admin123`
- `user` / `user123`

## Architecture

```text
src/
  app/
  pages/
  components/
  features/
  store/
  services/api/
  hooks/
  layouts/
```
