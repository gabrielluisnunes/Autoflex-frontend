import { configureStore } from '@reduxjs/toolkit'
import productsReducer from '../features/products/productsSlice'
import rawMaterialsReducer from '../features/raw-materials/rawMaterialsSlice'
import productionReducer from '../features/production/productionSlice'
import authReducer from '../features/auth/authSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    rawMaterials: rawMaterialsReducer,
    production: productionReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
