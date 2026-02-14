import { Map } from 'lucide-react'
import React from 'react'

export default function ApartmentActivities() {
  const activities = [
    'Dhanmondi là một khu vực cư trú thượng hạng tại 8 Dhaka, Bangladesh.',
    'Dhanmondi cũng là trung tâm văn hóa của thành phố Dhaka.',
    'Hồ Dhanmondi và Rabindra Sarobor những địa điểm không gian xanh rất thư giãn gần với nhau nằm ở phần nam của khu vực.',
    'Khu đây cũng nổi tiếng với nhiều nhà hàng, trường học và cửa hàng phù hợp với phong cách sống hiện đại.',
    'Một số đô thị Hồi giáo Dhanmondi sẵn gần quanh sành cho các công việc và các công hoạt động của những phú trưởng sống.'
  ]

  return (
    <div className='mt-10'>
      <div className='flex items-center gap-2 mb-4'>
        <Map className='text-gray-700' size={24} />
        <h2 className='font-semibold text-xl'>Hoạt Động</h2>
      </div>
      <div className='bg-white rounded-lg p-6'>
        <p className='font-medium mb-3'>Bạn Có Thể Làm Gì?</p>
        <ul className='space-y-2 text-sm text-gray-700'>
          {activities.map((activity, index) => (
            <li key={index} className='flex gap-2'>
              <span>•</span>
              <span>{activity}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
