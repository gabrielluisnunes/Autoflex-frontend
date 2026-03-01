import { useEffect } from 'react'
import { fetchProductionSuggestions } from '../features/production/productionSlice'
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks'
import { ErrorBanner } from '../components/ui/ErrorBanner'
import { LoadingState } from '../components/ui/LoadingState'

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

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
          <h2>Sugestões de Produção</h2>
          <p>Produtos ordenados pelo maior valor total de produção.</p>
        </div>
        <button
          className="button secondary"
          onClick={() => void dispatch(fetchProductionSuggestions())}
        >
          Atualizar
        </button>
      </header>

      <ErrorBanner message={productionState.error} />
      {productionState.loading ? (
        <LoadingState label="Calculando sugestões de produção..." />
      ) : (
        <>
          <div className="summary-card">
            <h3>Valor Total da Produção</h3>
            <p>{currencyFormatter.format(productionState.totalProductionValue)}</p>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Nome do Produto</th>
                  <th>Quantidade Possível</th>
                  <th>Valor Unitário</th>
                  <th>Valor Total</th>
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
                    <td>{currencyFormatter.format(suggestion.unitPrice)}</td>
                    <td>{currencyFormatter.format(suggestion.totalValue)}</td>
                  </tr>
                ))}
                {productionState.suggestions.length === 0 && (
                  <tr>
                    <td colSpan={4} className="empty-row">
                      Nenhuma sugestão de produção disponível.
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
