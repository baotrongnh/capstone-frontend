import { paths } from './api'

export type PartnerDetail = NonNullable<paths['/api/v1/partners/profile']['get']['responses']['200']['content']['application/json']['data']>
export type UpdatePartnerDto = Partial<paths['/api/v1/partners/profile']['patch']['requestBody']['content']['application/json']>
