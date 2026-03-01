import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { rawMaterialsApi } from '../../services/api/rawMaterialsApi'
import type {
  PageResponse,
  RawMaterial,
  RawMaterialPayload,
} from '../../services/api/types'

interface RawMaterialsState {
  items: RawMaterial[]
  pageNumber: number
  pageSize: number
  totalElements: number
  totalPages: number
  loading: boolean
  error: string | null
}

const initialState: RawMaterialsState = {
  items: [],
  pageNumber: 0,
  pageSize: 10,
  totalElements: 0,
  totalPages: 0,
  loading: false,
  error: null,
}

export const fetchRawMaterials = createAsyncThunk<
  PageResponse<RawMaterial>,
  { page?: number; size?: number } | void
>('rawMaterials/fetchRawMaterials', async (params) => {
  const page = params?.page ?? 0
  const size = params?.size ?? 10
  return rawMaterialsApi.findAll(page, size)
})

export const createRawMaterial = createAsyncThunk<RawMaterial, RawMaterialPayload>(
  'rawMaterials/createRawMaterial',
  async (payload) => rawMaterialsApi.create(payload),
)

export const updateRawMaterial = createAsyncThunk<
  RawMaterial,
  { id: number; payload: RawMaterialPayload }
>('rawMaterials/updateRawMaterial', async ({ id, payload }) =>
  rawMaterialsApi.update(id, payload),
)

export const deleteRawMaterial = createAsyncThunk<number, number>(
  'rawMaterials/deleteRawMaterial',
  async (id) => {
    await rawMaterialsApi.remove(id)
    return id
  },
)

const rawMaterialsSlice = createSlice({
  name: 'rawMaterials',
  initialState,
  reducers: {
    clearRawMaterialsError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRawMaterials.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRawMaterials.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.content
        state.pageNumber = action.payload.page.number
        state.pageSize = action.payload.page.size
        state.totalElements = action.payload.page.totalElements
        state.totalPages = action.payload.page.totalPages
      })
      .addCase(fetchRawMaterials.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch raw materials'
      })
      .addCase(createRawMaterial.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create raw material'
      })
      .addCase(updateRawMaterial.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item,
        )
      })
      .addCase(updateRawMaterial.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update raw material'
      })
      .addCase(deleteRawMaterial.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload)
      })
      .addCase(deleteRawMaterial.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete raw material'
      })
  },
})

export const { clearRawMaterialsError } = rawMaterialsSlice.actions
export default rawMaterialsSlice.reducer
