import { useEffect, useState } from 'react'
import {
  addProductRawMaterial,
  createProduct,
  deleteProduct,
  fetchProducts,
  removeProductRawMaterial,
  updateProduct,
} from '../features/products/productsSlice'
import { fetchRawMaterials } from '../features/raw-materials/rawMaterialsSlice'
import { ProductFormModal } from '../components/products/ProductFormModal'
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks'
import { ErrorBanner } from '../components/ui/ErrorBanner'
import { LoadingState } from '../components/ui/LoadingState'
import { Pagination } from '../components/ui/Pagination'
import type { Product, ProductPayload } from '../services/api/types'

export const ProductsPage = () => {
  const dispatch = useAppDispatch()
  const productsState = useAppSelector((state) => state.products)
  const rawMaterialsState = useAppSelector((state) => state.rawMaterials)

  const [page, setPage] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => {
    void dispatch(fetchProducts({ page, size: 10 }))
    void dispatch(fetchRawMaterials({ page: 0, size: 100 }))
  }, [dispatch, page])

  const openCreateModal = () => {
    setSelectedProduct(null)
    setIsModalOpen(true)
  }

  const openEditModal = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  const handleSubmit = async (payload: ProductPayload, id?: number) => {
    if (id) {
      await dispatch(updateProduct({ id, payload }))
    } else {
      await dispatch(createProduct(payload))
    }

    await dispatch(fetchProducts({ page, size: 10 }))
    closeModal()
  }

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('Do you really want to delete this product?')
    if (!confirmed) {
      return
    }

    await dispatch(deleteProduct(id))
    await dispatch(fetchProducts({ page, size: 10 }))
  }

  const handleAddRawMaterial = async (
    productId: number,
    rawMaterialId: number,
    requiredQuantity: number,
  ) => {
    await dispatch(
      addProductRawMaterial({
        productId,
        payload: { rawMaterialId, requiredQuantity },
      }),
    )

    await dispatch(fetchProducts({ page, size: 10 }))
  }

  const handleRemoveRawMaterial = async (productId: number, rawMaterialId: number) => {
    await dispatch(removeProductRawMaterial({ productId, rawMaterialId }))
    await dispatch(fetchProducts({ page, size: 10 }))
  }

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h2>Products</h2>
          <p>Manage products and associate raw materials in the same flow.</p>
        </div>
        <button className="button primary" onClick={openCreateModal}>
          New Product
        </button>
      </header>

      <ErrorBanner message={productsState.error} />
      {productsState.loading ? (
        <LoadingState label="Loading products..." />
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Unit Price</th>
                <th>Raw Materials</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {productsState.items.map((product) => (
                <tr key={product.id}>
                  <td>{product.code}</td>
                  <td>{product.name}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.rawMaterials.length}</td>
                  <td className="table-actions">
                    <button
                      className="button secondary"
                      onClick={() => openEditModal(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="button danger"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {productsState.items.length === 0 && (
                <tr>
                  <td colSpan={5} className="empty-row">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        page={productsState.pageNumber}
        totalPages={productsState.totalPages}
        onPrev={() => setPage((prev) => Math.max(prev - 1, 0))}
        onNext={() => setPage((prev) => prev + 1)}
      />

      <ProductFormModal
        open={isModalOpen}
        product={selectedProduct}
        rawMaterials={rawMaterialsState.items}
        submitting={productsState.loading}
        onClose={closeModal}
        onSubmit={handleSubmit}
        onAddRawMaterial={handleAddRawMaterial}
        onRemoveRawMaterial={handleRemoveRawMaterial}
      />
    </section>
  )
}
