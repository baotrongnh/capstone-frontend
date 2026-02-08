'use client'

import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Carousel } from 'antd'
import { CarouselRef } from 'antd/es/carousel'
import { useRef } from 'react'
import ApartmentCard from './apartment-card'

interface SimilarApartment {
     name: string
}

const apartments: SimilarApartment[] = [
     { name: 'Dhanmondi: Hotel Grand Circle Inn Dhak Sài Gòn' },
     { name: 'Dhanmondi: Hotel Grand Circle Inn Dhak Sài Gòn' },
     { name: 'Dhanmondi: Hotel Grand Circle Inn Dhak Sài Gòn' },
     { name: 'Dhanmondi: Hotel Grand Circle Inn Dhak Sài Gòn' },
     { name: 'Dhanmondi: Hotel Grand Circle Inn Dhak Sài Gòn' },
     { name: 'Dhanmondi: Hotel Grand Circle Inn Dhak Sài Gòn' },
]

export default function SimilarApartments() {
     const carouselRef = useRef<CarouselRef>(null)

     return (
          <div className='container py-10'>
               <div className='flex items-center justify-between mb-5'>
                    <h2 className='text-2xl font-bold'>
                         Các căn hộ tương tự
                    </h2>

                    <div className='flex gap-2'>
                         <Button
                              shape='circle'
                              icon={<LeftOutlined />}
                              onClick={() => carouselRef.current?.prev()}
                         />
                         <Button
                              type='primary'
                              shape='circle'
                              icon={<RightOutlined />}
                              onClick={() => carouselRef.current?.next()}
                         />
                    </div>
               </div>

               <Carousel
                    ref={carouselRef}
                    slidesToShow={4}
                    slidesToScroll={2}
                    autoplay={{ dotDuration: true }}
                    responsive={[
                         {
                              breakpoint: 1280,
                              settings: { slidesToShow: 3 }
                         },
                         {
                              breakpoint: 1024,
                              settings: { slidesToShow: 2 }
                         },
                         {
                              breakpoint: 640,
                              settings: { slidesToShow: 1 }
                         }
                    ]}
               >
                    {apartments.map((apartment, index) => (
                         <div key={index} className='px-2 mb-10'>
                              <ApartmentCard apartment={apartment} />
                         </div>
                    ))}
               </Carousel>
          </div>
     )
}
