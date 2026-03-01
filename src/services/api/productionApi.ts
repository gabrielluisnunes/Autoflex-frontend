import { httpClient } from './httpClient'
import type { ProductionSuggestionSummary } from './types'

export const productionApi = {
  getSuggestions: async () => {
    const response = await httpClient.get<ProductionSuggestionSummary>(
      '/production/suggestions',
    )

    return response.data
  },
}
