import axios from 'axios'

const BASE = process.env.NEXT_PUBLIC_PROVINCES_API_URL

export interface Province {
     code: number
     name: string
}

export interface Division {
     code: number
     name: string
}

type ProvinceResponse = {
     wards?: Division[]
}

export const provincesService = {
     getAll: (): Promise<Province[]> => {
          return axios.get<Province[]>(`${BASE}/v2/p/`).then(r => r.data)
     },

     getWards: (provinceCode: number): Promise<Division[]> => {
          const url = `${BASE}/v2/p/${provinceCode}?depth=2`
          return axios
               .get<ProvinceResponse>(url)
               .then(r => r.data.wards ?? [])
     }
}
