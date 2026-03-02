import { httpClient } from './httpClient'

export interface ProductionDashboardItem {
  product: string
  possibleQuantity: number
  unitPrice: number
  totalValue: number
}

interface SuggestionPayload {
  product?: string
  productName?: string
  productCode?: string
  possibleQuantity: number
  unitPrice: number
  totalValue: number
}

interface SuggestionSummaryPayload {
  suggestions: SuggestionPayload[]
}

const normalizeSuggestion = (item: SuggestionPayload): ProductionDashboardItem => ({
  product: item.product || item.productName || item.productCode || 'Produto sem nome',
  possibleQuantity: Number(item.possibleQuantity || 0),
  unitPrice: Number(item.unitPrice || 0),
  totalValue: Number(item.totalValue || 0),
})

export const productionDashboardApi = {
  getSuggestions: async (): Promise<ProductionDashboardItem[]> => {
    const response = await httpClient.get<SuggestionSummaryPayload | SuggestionPayload[]>(
      '/production/suggestions',
    )

    const payload = response.data
    if (Array.isArray(payload)) {
      return payload.map(normalizeSuggestion)
    }

    return (payload.suggestions || []).map(normalizeSuggestion)
  },
}
