import { httpClient } from './httpClient'
import type {
  PageResponse,
  Product,
  ProductPayload,
  ProductRawMaterialPayload,
} from './types'

export const productsApi = {
  findAll: async (page = 0, size = 10) => {
    const response = await httpClient.get<PageResponse<Product>>('/products', {
      params: { page, size, sort: 'name,asc' },
    })

    return response.data
  },

  create: async (payload: ProductPayload) => {
    const response = await httpClient.post<Product>('/products', payload)
    return response.data
  },

  update: async (id: number, payload: ProductPayload) => {
    const response = await httpClient.put<Product>(`/products/${id}`, payload)
    return response.data
  },

  remove: async (id: number) => {
    await httpClient.delete(`/products/${id}`)
  },

  addRawMaterial: async (productId: number, payload: ProductRawMaterialPayload) => {
    const response = await httpClient.post<Product>(
      `/products/${productId}/raw-materials`,
      payload,
    )

    return response.data
  },

  removeRawMaterial: async (productId: number, rawMaterialId: number) => {
    const response = await httpClient.delete<Product>(
      `/products/${productId}/raw-materials/${rawMaterialId}`,
    )

    return response.data
  },
}
