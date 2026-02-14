import { Button } from 'antd'
import { Map } from 'lucide-react'

export default function ApartmentLocation() {
  return (
    <div className='mt-10 mb-10'>
      <div className='flex items-center gap-2 mb-4'>
        <Map className='text-gray-700' size={24} />
        <h2 className='font-semibold text-xl'>Tìm Đường Đi</h2>
      </div>
      <div className='relative w-full h-100 bg-gray-200 rounded-lg overflow-hidden'>
        {/* Placeholder for map - replace with actual map component */}
        <div className='absolute inset-0 flex items-center justify-center bg-gray-300'>
          <div className='text-center'>
            <Map size={48} className='mx-auto mb-2 text-gray-500' />
            <p className='text-gray-600'>Map Component Here</p>
          </div>
        </div>
        {/* Map Button Overlay */}
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
          <Button
            type='primary'
            size='large'
            icon={<Map size={18} />}
            className='bg-blue-600 hover:bg-blue-700 px-8'
          >
            Tìm Đường Đi
          </Button>
        </div>
      </div>
    </div>
  )
}
