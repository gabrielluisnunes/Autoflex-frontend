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

const formatCurrencyInput = (value: string) => {
  const digits = value.replace(/\D/g, '')

  if (!digits) {
    return ''
  }

  const numericValue = Number(digits) / 100

  return numericValue.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

const parseCurrencyInput = (value: string) => {
  if (!value) {
    return 0
  }

  const normalized = value.replace(/\./g, '').replace(',', '.')
  const parsedValue = Number(normalized)

  return Number.isNaN(parsedValue) ? 0 : parsedValue
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
    setPrice(
      product?.price
        ? product.price.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : '',
    )
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
        price: parseCurrencyInput(price),
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
      title={product ? `Editar Produto: ${product.name}` : 'Criar Produto'}
    >
      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          Código
          <input
            value={code}
            onChange={(event) => setCode(event.target.value)}
            maxLength={50}
            required
          />
        </label>
        <label>
          Nome
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={150}
            required
          />
        </label>
        <label>
          Preço Unitário (R$)
          <input
            type="text"
            inputMode="decimal"
            value={price}
            onChange={(event) => setPrice(formatCurrencyInput(event.target.value))}
            placeholder="0,00"
            required
          />
        </label>

        <div className="actions-row">
          <button type="button" className="button secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="button primary" disabled={submitting}>
            {product ? 'Salvar Alterações' : 'Criar Produto'}
          </button>
        </div>
      </form>

      <section className="association-section">
        <h4>Matérias-primas Associadas</h4>
        {!product && (
          <p className="caption">
            Salve o produto primeiro para gerenciar as matérias-primas.
          </p>
        )}

        {product && (
          <>
            {product.rawMaterials.length === 0 ? (
              <p className="caption">Nenhuma matéria-prima associada ainda.</p>
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
                      Remover
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
                <option value="">Selecione a matéria-prima</option>
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
                placeholder="Quantidade necessária"
                required
              />

              <button
                type="submit"
                className="button secondary"
                disabled={availableRawMaterials.length === 0}
              >
                Adicionar Matéria-prima
              </button>
            </form>
          </>
        )}
      </section>
    </Modal>
  )
}
