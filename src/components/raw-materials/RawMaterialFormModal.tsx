import { useEffect, useState } from 'react'
import { Modal } from '../ui/Modal'
import type { RawMaterial, RawMaterialPayload } from '../../services/api/types'

interface RawMaterialFormModalProps {
  open: boolean
  rawMaterial?: RawMaterial | null
  submitting: boolean
  onClose: () => void
  onSubmit: (payload: RawMaterialPayload, id?: number) => Promise<void>
}

export const RawMaterialFormModal = ({
  open,
  rawMaterial,
  submitting,
  onClose,
  onSubmit,
}: RawMaterialFormModalProps) => {
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [stockQuantity, setStockQuantity] = useState('')

  useEffect(() => {
    setCode(rawMaterial?.code || '')
    setName(rawMaterial?.name || '')
    setStockQuantity(rawMaterial?.stockQuantity ? String(rawMaterial.stockQuantity) : '')
  }, [rawMaterial, open])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    await onSubmit(
      {
        code: code.trim(),
        name: name.trim(),
        stockQuantity: Number(stockQuantity),
      },
      rawMaterial?.id,
    )
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        rawMaterial ? `Editar Matéria-prima: ${rawMaterial.name}` : 'Criar Matéria-prima'
      }
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
          Quantidade em Estoque
          <input
            type="number"
            min="0"
            step="0.001"
            value={stockQuantity}
            onChange={(event) => setStockQuantity(event.target.value)}
            required
          />
        </label>

        <div className="actions-row">
          <button type="button" className="button secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="button primary" disabled={submitting}>
            {rawMaterial ? 'Salvar Alterações' : 'Criar Matéria-prima'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
