import { ActorType } from '@/types/auth'

/**
 * Role priority order (highest to lowest).
 * Used to resolve the effective role from a user's availableRoles list.
 */
export const ROLE_PRIORITY: ActorType[] = [
    ActorType.ADMIN,
    ActorType.OPERATOR,
    ActorType.STAFF,
    ActorType.PARTNER,
    ActorType.USER,
]
