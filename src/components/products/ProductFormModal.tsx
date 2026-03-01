import { useEffect, useMemo, useState } from 'react'
import { Modal } from '../ui/Modal'
import type { Product, ProductPayload, RawMaterial } from '../../services/api/types'

interface ProductFormModalProps {
  open: boolean
  product?: Product | null
  rawMaterials: RawMaterial[]
  submitting: boolean
  onClose: () => void
  onSubmit: (payload: ProductPayload, productId?: number) => Promise<void>
  onAddRawMaterial: (
    productId: number,
    rawMaterialId: number,
    requiredQuantity: number,
  ) => Promise<void>
  onRemoveRawMaterial: (productId: number, rawMaterialId: number) => Promise<void>
}

export const ProductFormModal = ({
  open,
  product,
  rawMaterials,
  submitting,
  onClose,
  onSubmit,
  onAddRawMaterial,
  onRemoveRawMaterial,
}: ProductFormModalProps) => {
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [associationRawMaterialId, setAssociationRawMaterialId] = useState<number | ''>(
    '',
  )
  const [requiredQuantity, setRequiredQuantity] = useState('')

  useEffect(() => {
    setCode(product?.code || '')
    setName(product?.name || '')
    setPrice(product?.price ? String(product.price) : '')
    setAssociationRawMaterialId('')
    setRequiredQuantity('')
  }, [product, open])

  const availableRawMaterials = useMemo(() => {
    if (!product) {
      return rawMaterials
    }

    const alreadyAssociatedIds = new Set(
      product.rawMaterials.map((item) => item.rawMaterialId),
    )
    return rawMaterials.filter((item) => !alreadyAssociatedIds.has(item.id))
  }, [product, rawMaterials])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    await onSubmit(
      {
        code: code.trim(),
        name: name.trim(),
        price: Number(price),
      },
      product?.id,
    )
  }

  const handleAssociate = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!product || associationRawMaterialId === '') {
      return
    }

    await onAddRawMaterial(product.id, associationRawMaterialId, Number(requiredQuantity))
    setAssociationRawMaterialId('')
    setRequiredQuantity('')
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={product ? `Edit Product: ${product.name}` : 'Create Product'}
    >
      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          Code
          <input
            value={code}
            onChange={(event) => setCode(event.target.value)}
            maxLength={50}
            required
          />
        </label>
        <label>
          Name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={150}
            required
          />
        </label>
        <label>
          Unit Price
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            required
          />
        </label>

        <div className="actions-row">
          <button type="button" className="button secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="button primary" disabled={submitting}>
            {product ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </form>

      <section className="association-section">
        <h4>Associated Raw Materials</h4>
        {!product && (
          <p className="caption">Save the product first to manage its raw materials.</p>
        )}

        {product && (
          <>
            {product.rawMaterials.length === 0 ? (
              <p className="caption">No associated raw materials yet.</p>
            ) : (
              <div className="chips-list">
                {product.rawMaterials.map((item) => (
                  <div key={item.id} className="chip-item">
                    <span>
                      {item.rawMaterialCode} - {item.rawMaterialName} (
                      {item.requiredQuantity})
                    </span>
                    <button
                      type="button"
                      className="link-danger"
                      onClick={() => onRemoveRawMaterial(product.id, item.rawMaterialId)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            <form className="association-form" onSubmit={handleAssociate}>
              <select
                required
                value={associationRawMaterialId}
                onChange={(event) =>
                  setAssociationRawMaterialId(
                    event.target.value ? Number(event.target.value) : '',
                  )
                }
              >
                <option value="">Select raw material</option>
                {availableRawMaterials.map((rawMaterial) => (
                  <option key={rawMaterial.id} value={rawMaterial.id}>
                    {rawMaterial.code} - {rawMaterial.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="0.0001"
                step="0.0001"
                value={requiredQuantity}
                onChange={(event) => setRequiredQuantity(event.target.value)}
                placeholder="Required quantity"
                required
              />

              <button
                type="submit"
                className="button secondary"
                disabled={availableRawMaterials.length === 0}
              >
                Add Material
              </button>
            </form>
          </>
        )}
      </section>
    </Modal>
  )
}
