export interface PageResponse<T> {
  content: T[]
  page: {
    size: number
    number: number
    totalElements: number
    totalPages: number
  }
}

export interface ProductRawMaterial {
  id: number
  rawMaterialId: number
  rawMaterialCode: string
  rawMaterialName: string
  requiredQuantity: number
}

export interface Product {
  id: number
  code: string
  name: string
  price: number
  rawMaterials: ProductRawMaterial[]
}

export interface ProductPayload {
  code: string
  name: string
  price: number
}

export interface ProductRawMaterialPayload {
  rawMaterialId: number
  requiredQuantity: number
}

export interface RawMaterial {
  id: number
  code: string
  name: string
  stockQuantity: number
}

export interface RawMaterialPayload {
  code: string
  name: string
  stockQuantity: number
}

export interface ProductionSuggestion {
  productId: number
  productCode: string
  productName: string
  possibleQuantity: number
  unitPrice: number
  totalValue: number
}

export interface ProductionSuggestionSummary {
  suggestions: ProductionSuggestion[]
  totalProductionValue: number
}

export type UserRole = 'ADMIN' | 'USER'

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  tokenType: string
  expiresIn: number
  username: string
  role: UserRole
}
