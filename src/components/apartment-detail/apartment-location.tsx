import { Button } from 'antd'
import { Map } from 'lucide-react'

interface ApartmentLocationProps {
  address?: string
  city?: string
  district?: string
  ward?: string
  latitude?: string
  longitude?: string
}

export default function ApartmentLocation({
  address,
  city,
  district,
  ward,
  latitude,
  longitude
}: ApartmentLocationProps) {

  const fullAddress = [address, ward, district, city].filter(Boolean).join(', ')

  const handleFindDirection = () => {
    if (latitude && longitude) {
      // Open Google Maps with coordinates
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`, '_blank')
    } else if (fullAddress) {
      // Open Google Maps with address
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`, '_blank')
    }
  }

  return (
    <div className='mt-8 md:mt-10 mb-8 md:mb-10'>
      <div className='flex items-center gap-2 mb-3 md:mb-4'>
        <Map className='text-gray-700 shrink-0' size={20} />
        <h2 className='font-semibold text-lg md:text-xl'>Tìm Đường Đi</h2>
      </div>

      {fullAddress && (
        <p className='text-sm md:text-base text-gray-600 mb-3'>
          <strong>Địa chỉ:</strong> {fullAddress}
        </p>
      )}

      <div className='relative w-full h-75 md:h-100 lg:h-125 bg-gray-200 rounded-lg overflow-hidden'>
        {/* Placeholder for map - replace with actual map component */}
        <div className='absolute inset-0 flex items-center justify-center bg-gray-300'>
          <div className='text-center'>
            <Map size={48} className='mx-auto mb-2 text-gray-500' />
            <p className='text-gray-600'>Map Component Here</p>
            {latitude && longitude && (
              <p className='text-xs text-gray-500 mt-2'>
                Lat: {latitude}, Long: {longitude}
              </p>
            )}
          </div>
        </div>
        {/* Map Button Overlay */}
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
          <Button
            type='primary'
            size='large'
            icon={<Map size={16} className='md:w-4.5 md:h-4.5' />}
            className='bg-blue-600 hover:bg-blue-700 px-4 md:px-8 text-sm md:text-base'
            onClick={handleFindDirection}
          >
            Tìm Đường Đi
          </Button>
        </div>
      </div>
    </div>
  )
}
