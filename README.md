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
VITE_API_BASE_URL=http://localhost:8080/api
```

## Scripts

```bash
npm install
npm run dev
npm run lint
npm run build
npm run format
```

## Pages

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
