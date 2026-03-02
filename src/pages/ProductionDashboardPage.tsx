import { useEffect } from 'react'
import { ErrorBanner } from '../components/ui/ErrorBanner'
import { LoadingState } from '../components/ui/LoadingState'
import { fetchProductionDashboard } from '../features/production-dashboard/productionDashboardSlice'
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks'

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export const ProductionDashboardPage = () => {
  const dispatch = useAppDispatch()
  const dashboardState = useAppSelector((state) => state.productionDashboard)

  useEffect(() => {
    void dispatch(fetchProductionDashboard())
  }, [dispatch])

  const isEmpty =
    dashboardState.data.length === 0 || dashboardState.producibleProducts === 0

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h2>Dashboard de Produção</h2>
          <p>Visão consolidada de potencial de produção com o estoque atual.</p>
        </div>
        <button
          className="button secondary"
          onClick={() => void dispatch(fetchProductionDashboard())}
        >
          Atualizar
        </button>
      </header>

      <ErrorBanner message={dashboardState.error} />

      {dashboardState.loading ? (
        <LoadingState label="Carregando dashboard de produção..." />
      ) : (
        <>
          <div className="dashboard-kpi-grid">
            <article className="summary-card">
              <h3>Receita Potencial Total</h3>
              <p>{currencyFormatter.format(dashboardState.totalPotentialRevenue)}</p>
            </article>

            <article className="summary-card">
              <h3>Total de Unidades Possíveis</h3>
              <p>{dashboardState.totalUnitsPossible}</p>
            </article>

            <article className="summary-card">
              <h3>Produtos com Produção Possível</h3>
              <p>{dashboardState.producibleProducts}</p>
            </article>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Quantidade Possível</th>
                  <th>Preço Unitário</th>
                  <th>Valor Total</th>
                </tr>
              </thead>
              <tbody>
                {isEmpty ? (
                  <tr>
                    <td colSpan={4} className="empty-row">
                      Nenhuma produção possível com o estoque atual.
                    </td>
                  </tr>
                ) : (
                  dashboardState.data.map((item) => (
                    <tr key={item.product}>
                      <td>{item.product}</td>
                      <td>{item.possibleQuantity}</td>
                      <td>{currencyFormatter.format(item.unitPrice)}</td>
                      <td>{currencyFormatter.format(item.totalValue)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  )
}
