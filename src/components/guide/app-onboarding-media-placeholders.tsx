import { ImageIcon, PlayCircle } from 'lucide-react'

type SectionProps = {
     title: string
     description: string
}

export function GuideVideoPlaceholder({ title, description }: SectionProps) {
     return (
          <section className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
               <div className='mb-3'>
                    <h3 className='text-lg font-semibold text-slate-900'>{title}</h3>
                    <p className='mt-1 text-sm text-slate-600'>{description}</p>
               </div>

               <div className='flex aspect-video items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50'>
                    <div className='text-center'>
                         <PlayCircle className='mx-auto h-9 w-9 text-slate-500' />
                         <p className='mt-2 text-sm font-medium text-slate-700'>Cho component video tại đây</p>
                         <p className='text-xs text-slate-500'>VD: YouTube embed, player nội bộ, hoặc playlist hướng dẫn</p>
                    </div>
               </div>
          </section>
     )
}

export function GuideImageGalleryPlaceholder({ title, description }: SectionProps) {
     return (
          <section className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
               <div className='mb-3'>
                    <h3 className='text-lg font-semibold text-slate-900'>{title}</h3>
                    <p className='mt-1 text-sm text-slate-600'>{description}</p>
               </div>

               <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
                    {Array.from({ length: 3 }).map((_, index) => (
                         <div
                              key={index}
                              className='flex aspect-4/3 items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50'
                         >
                              <div className='text-center'>
                                   <ImageIcon className='mx-auto h-7 w-7 text-slate-500' />
                                   <p className='mt-1 text-xs font-medium text-slate-700'>Ảnh minh họa {index + 1}</p>
                              </div>
                         </div>
                    ))}
               </div>
          </section>
     )
}
