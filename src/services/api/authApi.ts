import { httpClient } from './httpClient'
import type { LoginRequest, LoginResponse } from './types'

export const authApi = {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const response = await httpClient.post<LoginResponse>('/auth/login', payload)
    return response.data
  },
}
