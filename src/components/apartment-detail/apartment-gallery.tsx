import { Image } from 'antd'
import Link from 'next/link'

interface ApartmentGalleryProps {
  images: string[]
}

export default function ApartmentGallery({ images }: ApartmentGalleryProps) {
  return (
    <div className='w-full h-100 grid grid-cols-4 grid-rows-2 gap-4 mt-5'>
      <div className='col-span-3 row-span-2 overflow-hidden'>
        <Image
          height='100%'
          width="100%"
          alt="basic"
          src={images[0] || "/img/auth/phongtro.jpg"}
          className="object-cover"
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className=''>
        <Image
          height='100%'
          width="100%"
          alt="basic"
          src={images[1] || "/img/auth/phongtro.jpg"}
          className="object-cover"
          style={{ objectFit: 'cover' }}
        />
      </div>

      <div className='relative'>
        <Image
          height='100%'
          width="100%"
          alt="basic"
          src={images[2] || "/img/auth/phongtro.jpg"}
          className="object-cover"
          style={{ objectFit: 'cover' }}
        />
        <div className='bg-primary text-center p-3 absolute bottom-0 w-full'>
          <Link href='/' className='underline font-semibold text-white'>Xem thêm</Link>
        </div>
      </div>
    </div>
  )
}
