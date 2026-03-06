import { Skeleton } from 'antd'

export default function ApartmentItemSkeleton() {
     return (
          <div className='flex flex-col md:flex-row shadow-sm rounded-md overflow-hidden bg-white'>
               {/* Image */}
               <div className='w-full md:w-33 aspect-square bg-gray-200 animate-pulse' />

               {/* Content */}
               <div className='p-3 flex-1 space-y-3'>
                    <Skeleton active paragraph={{ rows: 4 }} />
               </div>

               {/* Price */}
               <div className='flex md:flex-col justify-between md:justify-center items-center md:items-end p-3 md:p-4 bg-gray-50 md:bg-transparent'>
                    <Skeleton.Button active style={{ width: 100 }} />
               </div>
          </div>
     )
}
