import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { productionApi } from '../../services/api/productionApi'
import type { ProductionSuggestionSummary } from '../../services/api/types'

interface ProductionState {
  suggestions: ProductionSuggestionSummary['suggestions']
  totalProductionValue: number
  loading: boolean
  error: string | null
}

const initialState: ProductionState = {
  suggestions: [],
  totalProductionValue: 0,
  loading: false,
  error: null,
}

export const fetchProductionSuggestions = createAsyncThunk(
  'production/fetchProductionSuggestions',
  async () => productionApi.getSuggestions(),
)

const productionSlice = createSlice({
  name: 'production',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductionSuggestions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProductionSuggestions.fulfilled, (state, action) => {
        state.loading = false
        state.suggestions = [...action.payload.suggestions].sort(
          (left, right) => right.totalValue - left.totalValue,
        )
        state.totalProductionValue = action.payload.totalProductionValue
      })
      .addCase(fetchProductionSuggestions.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to load production suggestions'
      })
  },
})

export default productionSlice.reducer
