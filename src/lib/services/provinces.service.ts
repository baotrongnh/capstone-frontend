import axios from 'axios'

const BASE = process.env.NEXT_PUBLIC_PROVINCES_API_URL! // https://provinces.open-api.vn/api

export interface Province {
     code: number
     name: string
}

export interface District {
     code: number
     name: string
}

export const provincesService = {
     getAll: (afterMerge: boolean): Promise<Province[]> => {
          const url = afterMerge ? `${BASE}/v2/p/` : `${BASE}/v1/p/`
          return axios.get<Province[]>(url).then(r => r.data)
     },

     getDistricts: (provinceCode: number, afterMerge: boolean): Promise<District[]> => {
          const url = afterMerge
               ? `${BASE}/v2/p/${provinceCode}?depth=2`
               : `${BASE}/v1/p/${provinceCode}?depth=2`
          return axios
               .get<{ districts: District[] }>(url)
               .then(r => r.data.districts ?? [])
     },
}
