# Functional Requirements Checklist

## RF005 - Products CRUD

- [x] List products with pagination on Products page
- [x] Create product via modal form
- [x] Edit product via modal form
- [x] Delete product with confirmation

## RF006 - Raw Materials CRUD

- [x] List raw materials with pagination
- [x] Create raw material via modal form
- [x] Edit raw material and stock quantity via modal form
- [x] Delete raw material with confirmation

## RF007 - Associate Raw Materials in Product Form

- [x] Product modal shows associated raw materials
- [x] Add raw material association from product modal
- [x] Remove raw material association from product modal
- [x] No separate association page required

## RF008 - Production Suggestion Screen

- [x] Calls backend `GET /production/suggestions`
- [x] Displays product name
- [x] Displays possible quantity
- [x] Displays unit value
- [x] Displays total value per product
- [x] Displays total value sum of all production
- [x] Highlights top valuable products
- [x] Sorted by highest total value

## Technical Quality Requirements

- [x] Redux Toolkit slices implemented
- [x] Central Axios configuration implemented
- [x] Environment variable support implemented (`VITE_API_BASE_URL`)
- [x] Loading states implemented
- [x] Error handling implemented
- [x] Responsive dashboard UI with sidebar navigation
- [x] Modal forms implemented
- [x] Clean architecture folder structure implemented
- [x] ESLint + Prettier configured
