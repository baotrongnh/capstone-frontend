import { ROUTES } from '@/constants/routes'
import { Image } from 'antd'
import Link from 'next/link'

interface ApartmentGalleryProps {
  images: string[]
}

export default function ApartmentGallery({ images }: ApartmentGalleryProps) {
  return (
    <div className='w-full h-auto grid grid-cols-2 md:grid-cols-4 grid-rows-2 md:grid-rows-2 gap-2 md:gap-4 mt-5'>
      <div className='col-span-2 md:col-span-3 row-span-1 md:row-span-2 overflow-hidden rounded-lg h-62.5 md:h-100'>
        <Image
          height='100%'
          width="100%"
          alt="basic"
          src={images[0] || "/img/auth/phongtro.jpg"}
          className="object-cover"
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className='overflow-hidden rounded-lg h-30 md:h-48.75'>
        <Image
          height='100%'
          width="100%"
          alt="basic"
          src={images[1] || "/img/auth/phongtro.jpg"}
          className="object-cover"
          style={{ objectFit: 'cover' }}
        />
      </div>

      <div className='relative overflow-hidden rounded-lg h-30 md:h-48.75'>
        <Image
          height='100%'
          width="100%"
          alt="basic"
          src={images[2] || "/img/auth/phongtro.jpg"}
          className="object-cover"
          style={{ objectFit: 'cover' }}
        />
        <div className='bg-primary text-center p-3 absolute bottom-0 w-full'>
          <Link href={ROUTES.HOME} className='underline font-semibold text-white'>Xem thêm</Link>
        </div>
      </div>
    </div>
  )
}
