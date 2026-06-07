import type { SportKey } from '~/types/domain'

const sportLabels: Record<SportKey, string> = {
  cs2: 'CS2',
  football: 'Футбол',
  basketball: 'Баскетбол',
  volleyball: 'Волейбол'
}

export function useSport() {
  const getSportLabel = (sport: SportKey) => sportLabels[sport] ?? sport

  return {
    getSportLabel
  }
}
