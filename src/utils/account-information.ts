import dayjs from 'dayjs'
import { UserDetail, UserIdentity } from '@/types/user'
import { AccountEditableValues } from '@/types/profile'

const EMPTY_DISPLAY = '—'

export const toText = (value: unknown): string => String(value ?? '').trim()
export const displayText = (value: unknown): string => toText(value) || EMPTY_DISPLAY
export const hasValue = (value: unknown): boolean => toText(value).length > 0

export const formatDate = (value: unknown): string => {
    const text = toText(value)
    if (!text) {
        return EMPTY_DISPLAY
    }

    return dayjs(text).format('DD/MM/YYYY')
}

export const formatDateTime = (value: unknown): string => {
    const text = toText(value)
    if (!text) {
        return EMPTY_DISPLAY
    }

    return dayjs(text).format('DD/MM/YYYY HH:mm')
}

export const getAvatarUrl = (profile: UserDetail): string | undefined => {
    const text = toText(profile.profileImageUrl)
    return text || undefined
}

export const getUserEditableValues = (user: UserDetail): AccountEditableValues => {
    return {
        fullName: user.fullName,
        phone: user.phone,
        emergencyContactName: user.emergencyContactName,
        emergencyContactPhone: user.emergencyContactPhone,
    }
}

export type IdentityField = {
    key: string
    label: string
    value: unknown
}

export const getIdentityFields = (identity: UserIdentity | null | undefined, t: (key: string) => string): IdentityField[] => [
    { key: 'nationalId', label: t('nationalId'), value: identity?.nationalId },
    { key: 'name', label: t('idName'), value: identity?.name },
    { key: 'dob', label: t('idDob'), value: identity?.dob },
    { key: 'sex', label: t('idSex'), value: identity?.sex },
    { key: 'nationality', label: t('idNationality'), value: identity?.nationality },
    { key: 'ethnicity', label: t('idEthnicity'), value: identity?.ethnicity },
    { key: 'home', label: t('idHome'), value: identity?.home },
    { key: 'address', label: t('idAddress'), value: identity?.address },
    { key: 'features', label: t('idFeatures'), value: identity?.features },
    { key: 'issueDate', label: t('idIssueDate'), value: identity?.issueDate },
    { key: 'doe', label: t('idExpiry'), value: identity?.doe },
]
