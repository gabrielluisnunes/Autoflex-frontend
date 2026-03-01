import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { productsApi } from '../../services/api/productsApi'
import type {
  PageResponse,
  Product,
  ProductPayload,
  ProductRawMaterialPayload,
} from '../../services/api/types'

interface ProductsState {
  items: Product[]
  pageNumber: number
  pageSize: number
  totalElements: number
  totalPages: number
  loading: boolean
  error: string | null
}

const initialState: ProductsState = {
  items: [],
  pageNumber: 0,
  pageSize: 10,
  totalElements: 0,
  totalPages: 0,
  loading: false,
  error: null,
}

export const fetchProducts = createAsyncThunk<
  PageResponse<Product>,
  { page?: number; size?: number } | void
>('products/fetchProducts', async (params) => {
  const page = params?.page ?? 0
  const size = params?.size ?? 10

  return productsApi.findAll(page, size)
})

export const createProduct = createAsyncThunk<Product, ProductPayload>(
  'products/createProduct',
  async (payload) => productsApi.create(payload),
)

export const updateProduct = createAsyncThunk<
  Product,
  { id: number; payload: ProductPayload }
>('products/updateProduct', async ({ id, payload }) => productsApi.update(id, payload))

export const deleteProduct = createAsyncThunk<number, number>(
  'products/deleteProduct',
  async (id) => {
    await productsApi.remove(id)
    return id
  },
)

export const addProductRawMaterial = createAsyncThunk<
  Product,
  { productId: number; payload: ProductRawMaterialPayload }
>('products/addProductRawMaterial', async ({ productId, payload }) =>
  productsApi.addRawMaterial(productId, payload),
)

export const removeProductRawMaterial = createAsyncThunk<
  Product,
  { productId: number; rawMaterialId: number }
>('products/removeProductRawMaterial', async ({ productId, rawMaterialId }) =>
  productsApi.removeRawMaterial(productId, rawMaterialId),
)

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductsError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.content
        state.pageNumber = action.payload.page.number
        state.pageSize = action.payload.page.size
        state.totalElements = action.payload.page.totalElements
        state.totalPages = action.payload.page.totalPages
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch products'
      })
      .addCase(createProduct.pending, (state) => {
        state.error = null
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create product'
      })
      .addCase(updateProduct.pending, (state) => {
        state.error = null
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item,
        )
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update product'
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload)
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete product'
      })
      .addCase(addProductRawMaterial.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item,
        )
      })
      .addCase(addProductRawMaterial.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to add raw material to product'
      })
      .addCase(removeProductRawMaterial.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item,
        )
      })
      .addCase(removeProductRawMaterial.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to remove raw material from product'
      })
  },
})

export const { clearProductsError } = productsSlice.actions
export default productsSlice.reducer
