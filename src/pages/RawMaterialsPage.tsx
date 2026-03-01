import { useEffect, useState } from 'react'
import {
  createRawMaterial,
  deleteRawMaterial,
  fetchRawMaterials,
  updateRawMaterial,
} from '../features/raw-materials/rawMaterialsSlice'
import { RawMaterialFormModal } from '../components/raw-materials/RawMaterialFormModal'
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks'
import { ErrorBanner } from '../components/ui/ErrorBanner'
import { LoadingState } from '../components/ui/LoadingState'
import { Pagination } from '../components/ui/Pagination'
import type { RawMaterial, RawMaterialPayload } from '../services/api/types'

export const RawMaterialsPage = () => {
  const dispatch = useAppDispatch()
  const rawMaterialsState = useAppSelector((state) => state.rawMaterials)

  const [page, setPage] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRawMaterial, setSelectedRawMaterial] = useState<RawMaterial | null>(null)

  useEffect(() => {
    void dispatch(fetchRawMaterials({ page, size: 10 }))
  }, [dispatch, page])

  const openCreateModal = () => {
    setSelectedRawMaterial(null)
    setIsModalOpen(true)
  }

  const openEditModal = (rawMaterial: RawMaterial) => {
    setSelectedRawMaterial(rawMaterial)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedRawMaterial(null)
  }

  const handleSubmit = async (payload: RawMaterialPayload, id?: number) => {
    if (id) {
      await dispatch(updateRawMaterial({ id, payload }))
    } else {
      await dispatch(createRawMaterial(payload))
    }

    await dispatch(fetchRawMaterials({ page, size: 10 }))
    closeModal()
  }

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('Deseja realmente excluir esta matéria-prima?')
    if (!confirmed) {
      return
    }

    await dispatch(deleteRawMaterial(id))
    await dispatch(fetchRawMaterials({ page, size: 10 }))
  }

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h2>Matérias-primas</h2>
          <p>Mantenha o estoque atualizado e os registros organizados.</p>
        </div>
        <button className="button primary" onClick={openCreateModal}>
          Nova Matéria-prima
        </button>
      </header>

      <ErrorBanner message={rawMaterialsState.error} />
      {rawMaterialsState.loading ? (
        <LoadingState label="Carregando matérias-primas..." />
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>Quantidade em Estoque</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {rawMaterialsState.items.map((rawMaterial) => (
                <tr key={rawMaterial.id}>
                  <td>{rawMaterial.code}</td>
                  <td>{rawMaterial.name}</td>
                  <td>{rawMaterial.stockQuantity.toFixed(3)}</td>
                  <td className="table-actions">
                    <button
                      className="button secondary"
                      onClick={() => openEditModal(rawMaterial)}
                    >
                      Editar
                    </button>
                    <button
                      className="button danger"
                      onClick={() => handleDelete(rawMaterial.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
              {rawMaterialsState.items.length === 0 && (
                <tr>
                  <td colSpan={4} className="empty-row">
                    Nenhuma matéria-prima encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        page={rawMaterialsState.pageNumber}
        totalPages={rawMaterialsState.totalPages}
        onPrev={() => setPage((prev) => Math.max(prev - 1, 0))}
        onNext={() => setPage((prev) => prev + 1)}
      />

      <RawMaterialFormModal
        open={isModalOpen}
        rawMaterial={selectedRawMaterial}
        submitting={rawMaterialsState.loading}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </section>
  )
}
