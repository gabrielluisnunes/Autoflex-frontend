import { httpClient } from './httpClient'
import type { PageResponse, RawMaterial, RawMaterialPayload } from './types'

export const rawMaterialsApi = {
  findAll: async (page = 0, size = 10) => {
    const response = await httpClient.get<PageResponse<RawMaterial>>('/raw-materials', {
      params: { page, size, sort: 'name,asc' },
    })

    return response.data
  },

  create: async (payload: RawMaterialPayload) => {
    const response = await httpClient.post<RawMaterial>('/raw-materials', payload)
    return response.data
  },

  update: async (id: number, payload: RawMaterialPayload) => {
    const response = await httpClient.put<RawMaterial>(`/raw-materials/${id}`, payload)
    return response.data
  },

  remove: async (id: number) => {
    await httpClient.delete(`/raw-materials/${id}`)
  },
}
