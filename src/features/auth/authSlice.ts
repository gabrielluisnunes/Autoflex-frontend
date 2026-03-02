import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { authApi } from '../../services/api/authApi'
import { AUTH_STORAGE_KEY } from '../../services/api/authStorage'
import type { LoginRequest, LoginResponse, UserRole } from '../../services/api/types'

interface StoredAuth {
  token: string
  username: string
  role: UserRole
}

interface AuthState {
  token: string | null
  username: string | null
  role: UserRole | null
  loading: boolean
  error: string | null
}

const readStoredAuth = (): StoredAuth | null => {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY)

  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw) as StoredAuth
    if (parsed?.token && parsed?.username && parsed?.role) {
      return parsed
    }
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  return null
}

const persistAuth = (data: StoredAuth) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data))
}

const clearStoredAuth = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

const storedAuth = readStoredAuth()

const initialState: AuthState = {
  token: storedAuth?.token ?? null,
  username: storedAuth?.username ?? null,
  role: storedAuth?.role ?? null,
  loading: false,
  error: null,
}

export const login = createAsyncThunk<LoginResponse, LoginRequest>(
  'auth/login',
  async (payload) => authApi.login(payload),
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null
      state.username = null
      state.role = null
      state.error = null
      clearStoredAuth()
    },
    clearAuthError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        state.username = action.payload.username
        state.role = action.payload.role
        persistAuth({
          token: action.payload.token,
          username: action.payload.username,
          role: action.payload.role,
        })
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Falha ao realizar login'
      })
  },
})

export const { logout, clearAuthError } = authSlice.actions

export default authSlice.reducer
