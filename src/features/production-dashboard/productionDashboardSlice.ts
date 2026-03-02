import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  productionDashboardApi,
  type ProductionDashboardItem,
} from '../../services/api/productionDashboardApi'

interface ProductionDashboardState {
  data: ProductionDashboardItem[]
  totalPotentialRevenue: number
  totalUnitsPossible: number
  producibleProducts: number
  loading: boolean
  error: string | null
}

const initialState: ProductionDashboardState = {
  data: [],
  totalPotentialRevenue: 0,
  totalUnitsPossible: 0,
  producibleProducts: 0,
  loading: false,
  error: null,
}

export const fetchProductionDashboard = createAsyncThunk(
  'productionDashboard/fetchProductionDashboard',
  async () => productionDashboardApi.getSuggestions(),
)

const productionDashboardSlice = createSlice({
  name: 'productionDashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductionDashboard.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProductionDashboard.fulfilled, (state, action) => {
        state.loading = false
        state.data = [...action.payload].sort(
          (left, right) => right.totalValue - left.totalValue,
        )
        state.totalPotentialRevenue = state.data.reduce(
          (total, item) => total + item.totalValue,
          0,
        )
        state.totalUnitsPossible = state.data.reduce(
          (total, item) => total + item.possibleQuantity,
          0,
        )
        state.producibleProducts = state.data.filter(
          (item) => item.possibleQuantity > 0,
        ).length
      })
      .addCase(fetchProductionDashboard.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Falha ao carregar dashboard de produção'
      })
  },
})

export default productionDashboardSlice.reducer
