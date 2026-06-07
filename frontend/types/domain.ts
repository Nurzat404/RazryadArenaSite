export type UserRole = 'guest' | 'player' | 'captain' | 'tournament_manager' | 'admin'

export type SportKey = 'cs2' | 'football' | 'basketball' | 'volleyball'

export type TournamentStatus = 'draft' | 'registration_open' | 'registration_closed' | 'active' | 'finished'

export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'excluded'

export interface User {
  id: string
  name: string
  email: string
  city?: string
  age?: number
  role: UserRole
  favoriteSports: SportKey[]
  emailVerified: boolean
  steamId?: string
}

export interface Team {
  id: string
  name: string
  sport: SportKey
  city: string
  captainId: string
  memberIds: string[]
  maxMembers: number
  isOpenForRequests: boolean
  rating: number
}

export interface Tournament {
  id: string
  name: string
  sport: SportKey
  city: string
  status: TournamentStatus
  registrationStartDate: string
  registrationEndDate: string
  eventStartDate: string
  eventEndDate?: string
  maxTeams: number
  requiredTeamSize: number
  description: string
}

export interface Match {
  id: string
  tournamentId: string
  sport: SportKey
  team1Id: string
  team2Id: string
  scheduledAt: string
  location: string
  status: 'scheduled' | 'active' | 'finished'
  score1?: number
  score2?: number
  winnerId?: string
}

export interface RatingRow {
  id: string
  entityId: string
  entityName: string
  entityType: 'player' | 'team'
  sport: SportKey
  points: number
  position: number
}
