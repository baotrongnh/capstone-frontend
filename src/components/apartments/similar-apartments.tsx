'use client'

import { Button } from 'antd'
import { ChevronLeft, ChevronRight } from 'lucide-react'
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
     const scrollContainerRef = useRef<HTMLDivElement>(null)

     const scroll = (direction: 'left' | 'right') => {
          if (scrollContainerRef.current) {
               const scrollAmount = 320
               scrollContainerRef.current.scrollBy({
                    left: direction === 'left' ? - scrollAmount : scrollAmount,
                    behavior: 'smooth'
               })
          }
     }

     return (
          <div className='container py-8'>
               <div className='flex items-center justify-between mb-6'>
                    <h2 className='text-2xl font-bold'>
                         Các căn hộ tương tự
                    </h2>

                    <div className='flex gap-2'>
                         <Button
                              shape='circle'
                              onClick={() => scroll('left')}
                              size='large'
                         >
                              <ChevronLeft />
                         </Button>
                         <Button
                              type='primary'
                              shape='circle'
                              onClick={() => scroll('right')}
                              size='large'
                         >
                              <ChevronRight />
                         </Button>
                    </div>
               </div>

               <div
                    ref={scrollContainerRef}
                    className='flex gap-4 overflow-x-auto scroll-smooth'
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
               >
                    <style jsx>{`
                         div::-webkit-scrollbar {
                              display: none;
                         }
                    `}</style>
                    {apartments.map((apartment, index) => (
                         <div key={index} className='flex-none w-72'>
                              <ApartmentCard apartment={apartment} />
                         </div>
                    ))}
               </div>
          </div>
     )
}
