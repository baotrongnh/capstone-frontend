'use client'

import { Icon } from '@iconify/react'
import { useRef } from 'react'
import ApartmentCard from './apartment-card'

interface SimilarApartment {
     name: string
}

export default function SimilarApartments() {
     const scrollContainerRef = useRef<HTMLDivElement>(null)

     const scroll = (direction: 'left' | 'right') => {
          if (scrollContainerRef.current) {
               const scrollAmount = 300
               const newScrollLeft = scrollContainerRef.current.scrollLeft +
                    (direction === 'left' ? -scrollAmount : scrollAmount)

               scrollContainerRef.current.scrollTo({
                    left: newScrollLeft,
                    behavior: 'smooth'
               })
          }
     }

     const apartments: SimilarApartment[] = [
          { name: 'Dhanmondi: Hotel Grand Circle Inn Dhak Sài Gòn' },
          { name: 'Dhanmondi: Hotel Grand Circle Inn Dhak Sài Gòn' },
          { name: 'Dhanmondi: Hotel Grand Circle Inn Dhak Sài Gòn' },
          { name: 'Dhanmondi: Hotel Grand Circle Inn Dhak Sài Gòn' },
          { name: 'Dhanmondi: Hotel Grand Circle Inn Dhak Sài Gòn' },
          { name: 'Dhanmondi: Hotel Grand Circle Inn Dhak Sài Gòn' },
     ]

     return (
          <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-8'>
               {/* Header with Navigation */}
               <div className='flex items-center justify-between mb-6'>
                    <h2 className='text-2xl font-bold text-gray-900'>
                         Các căn hộ tương tự
                    </h2>

                    <div className='flex items-center gap-2'>
                         <button
                              onClick={() => scroll('left')}
                              className='w-10 h-10 flex items-center justify-center rounded-full border-2 border-gray-200 hover:bg-blue-50 transition-all duration-200 group cursor-pointer'
                              aria-label='Scroll left'
                         >
                              <Icon icon="lucide:chevron-left" width={20} className='text-gray-600 group-hover:text-blue-600' />
                         </button>
                         <button
                              onClick={() => scroll('right')}
                              className='w-10 h-10 flex items-center justify-center rounded-full bg-primary hover:bg-primary transition-all duration-200 shadow-md cursor-pointer'
                              aria-label='Scroll right'
                         >
                              <Icon icon="lucide:chevron-right" width={20} className='text-white' />
                         </button>
                    </div>
               </div>

               {/* Scrollable Cards Container */}
               <div
                    ref={scrollContainerRef}
                    className='flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4'
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
               >
                    {apartments.map((apartment, index) => (
                         <div key={index} className='shrink-0 w-70 sm:w-75'>
                              <ApartmentCard apartment={apartment} />
                         </div>
                    ))}
               </div>
          </div>
     )
}
