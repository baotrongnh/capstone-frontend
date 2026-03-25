export const normalizeText = (value: unknown) => {
    if (typeof value === 'string') {
        const trimmed = value.trim()
        return trimmed.length > 0 ? trimmed : '-'
    }
    if (typeof value === 'number') return String(value)
    return '-'
}

export const normalizeObjectToRows = (value: unknown): Array<{ key: string; value: string }> => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return []

    return Object.entries(value as Record<string, unknown>).map(([key, rowValue]) => ({
        key,
        value: normalizeText(rowValue),
    }))
}

export const getObjectText = (value: unknown, key: string) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return '-'

    const fieldValue = (value as Record<string, unknown>)[key]
    return normalizeText(fieldValue)
}

export const normalizeVietnamese = (str: string) =>
    str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLowerCase();
