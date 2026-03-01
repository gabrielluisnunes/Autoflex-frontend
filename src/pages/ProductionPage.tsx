import { useEffect } from 'react'
import { fetchProductionSuggestions } from '../features/production/productionSlice'
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks'
import { ErrorBanner } from '../components/ui/ErrorBanner'
import { LoadingState } from '../components/ui/LoadingState'

export const ProductionPage = () => {
  const dispatch = useAppDispatch()
  const productionState = useAppSelector((state) => state.production)

  useEffect(() => {
    void dispatch(fetchProductionSuggestions())
  }, [dispatch])

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h2>Production Suggestions</h2>
          <p>Products are sorted by highest total production value.</p>
        </div>
        <button
          className="button secondary"
          onClick={() => void dispatch(fetchProductionSuggestions())}
        >
          Refresh
        </button>
      </header>

      <ErrorBanner message={productionState.error} />
      {productionState.loading ? (
        <LoadingState label="Calculating production suggestions..." />
      ) : (
        <>
          <div className="summary-card">
            <h3>Total Production Value</h3>
            <p>${productionState.totalProductionValue.toFixed(2)}</p>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Possible Quantity</th>
                  <th>Unit Value</th>
                  <th>Total Value</th>
                </tr>
              </thead>
              <tbody>
                {productionState.suggestions.map((suggestion, index) => (
                  <tr
                    key={suggestion.productId}
                    className={index < 3 ? 'highlight-row' : ''}
                  >
                    <td>{suggestion.productName}</td>
                    <td>{suggestion.possibleQuantity}</td>
                    <td>${suggestion.unitPrice.toFixed(2)}</td>
                    <td>${suggestion.totalValue.toFixed(2)}</td>
                  </tr>
                ))}
                {productionState.suggestions.length === 0 && (
                  <tr>
                    <td colSpan={4} className="empty-row">
                      No production suggestions available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  )
}
