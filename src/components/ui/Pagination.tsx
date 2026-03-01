interface PaginationProps {
  page: number
  totalPages: number
  onPrev: () => void
  onNext: () => void
}

export const Pagination = ({ page, totalPages, onPrev, onNext }: PaginationProps) => {
  return (
    <div className="pagination">
      <button type="button" onClick={onPrev} disabled={page <= 0}>
        Previous
      </button>
      <span>
        Page {totalPages === 0 ? 0 : page + 1} of {totalPages}
      </span>
      <button type="button" onClick={onNext} disabled={page + 1 >= totalPages}>
        Next
      </button>
    </div>
  )
}
