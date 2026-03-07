'use client'

import { useApartment } from '@/hooks/query/useApartments'
import { formatPrice } from '@/constants/apartment'
import { Icon } from '@iconify/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export function ApartmentCardMessage({ apartmentId }: { apartmentId: string }) {
     const router = useRouter()
     const { data, isLoading } = useApartment(apartmentId)
     const apt = data?.data

     if (isLoading) return <div className="text-xs text-gray-400 italic">Đang tải...</div>
     if (!apt) return <div className="text-xs text-red-400">Không tìm thấy căn hộ</div>

     const thumb = apt.images?.[0] ?? null

     return (
          <button
               onClick={() => router.push(`/apartment/${apt.id}`)}
               className="flex gap-3 bg-white border border-gray-200 rounded-lg p-2.5 mt-1 w-64 hover:border-blue-400 hover:shadow-sm transition-all text-left"
          >
               {thumb
                    ? <Image src={thumb} alt="" width={64} height={64} className="w-16 h-16 object-cover rounded-md shrink-0" />
                    : <div className="w-16 h-16 bg-gray-100 rounded-md shrink-0 flex items-center justify-center">
                         <Icon icon="lucide:building-2" className="text-gray-400" width={20} />
                    </div>
               }
               <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 mb-0.5 truncate">{apt.buildingName}</p>
                    <p className="text-xs text-gray-500 mb-0.5">Phòng {apt.apartmentNumber}</p>
                    <p className="text-xs font-medium text-blue-600 mb-0">{formatPrice(apt.baseRentPrice)}/tháng</p>
                    <p className="text-xs text-gray-400 truncate">{[apt.district, apt.city].filter(Boolean).join(', ')}</p>
               </div>
          </button>
     )
}
