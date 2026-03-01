import type { ReactNode } from 'react'

interface ModalProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

export const Modal = ({ open, title, onClose, children }: ModalProps) => {
  if (!open) {
    return null
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="modal-header">
          <h3>{title}</h3>
          <button
            className="icon-button"
            onClick={onClose}
            type="button"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}
