import { ROUTES } from '@/constants/routes'
import {
     GuideImageGalleryPlaceholder,
     GuideVideoPlaceholder,
} from '@/components/guide/app-onboarding-media-placeholders'
import {
     AppWindow,
     CheckCircle2,
     ChevronRight,
     DoorOpen,
     Download,
     House,
     KeyRound,
     Smartphone,
     Wifi,
} from 'lucide-react'
import Link from 'next/link'
import { type ReactNode } from 'react'

type GuideStep = {
     icon: ReactNode
     title: string
     description: string
}

const STEPS: GuideStep[] = [
     {
          icon: <Download className='h-5 w-5 text-sky-600' />,
          title: 'Tải ứng dụng HomeIQ',
          description: 'Tải app trên điện thoại để bắt đầu quản lý căn hộ thông minh.',
     },
     {
          icon: <Smartphone className='h-5 w-5 text-indigo-600' />,
          title: 'Đăng nhập bằng tài khoản hiện tại',
          description: 'Dùng cùng tài khoản bạn đã đặt thuê nhà trên web, không cần đăng ký lại.',
     },
     {
          icon: <Wifi className='h-5 w-5 text-emerald-600' />,
          title: 'Config Wi-Fi với mạch',
          description: 'Vào mục Wi-Fi setup trong app và kết nối mạch điều khiển với mạng trong nhà.',
     },
     {
          icon: <DoorOpen className='h-5 w-5 text-amber-600' />,
          title: 'Mở cửa theo cách thuận tiện',
          description: 'Bạn có thể mở bằng app hoặc nhập mật khẩu trên keypad gắn ở cửa.',
     },
     {
          icon: <AppWindow className='h-5 w-5 text-blue-600' />,
          title: 'Điều khiển thiết bị IoT',
          description: 'Điều khiển đèn, quạt, cửa cuốn và các thiết bị thông minh trực tiếp trên app.',
     },
]

export default function AppGuidePage() {
     return (
          <div className='mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8'>
               <section className='relative overflow-hidden rounded-3xl border border-sky-100 bg-white p-6 shadow-sm sm:p-8'>
                    <div className='pointer-events-none absolute -left-14 -top-14 h-44 w-44 rounded-full bg-sky-100/70 blur-2xl' />
                    <div className='pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-indigo-100/70 blur-3xl' />

                    <div className='relative'>
                         <div className='inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700'>
                              <CheckCircle2 className='h-4 w-4' />
                              Thanh toán thành công
                         </div>

                         <h1 className='mt-4 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl'>
                              Hướng dẫn bắt đầu sử dụng căn hộ thông minh HomeIQ
                         </h1>
                         <p className='mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base'>
                              Đây là trang hướng dẫn tổng hợp. Bạn có thể mở rộng thành tài liệu dài với video, ảnh minh họa,
                              lưu ý vận hành và FAQ theo nhu cầu sau này.
                         </p>

                         <div className='mt-5 flex flex-wrap items-center gap-2 text-xs text-slate-600'>
                              <span className='inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1'>
                                   <House className='h-3.5 w-3.5' />
                                   Thuê nhà
                              </span>
                              <ChevronRight className='h-3.5 w-3.5 text-slate-400' />
                              <span className='inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1'>
                                   <Smartphone className='h-3.5 w-3.5' />
                                   Dùng app
                              </span>
                              <ChevronRight className='h-3.5 w-3.5 text-slate-400' />
                              <span className='inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1'>
                                   <KeyRound className='h-3.5 w-3.5' />
                                   Mở cửa & IoT
                              </span>
                         </div>
                    </div>
               </section>

               <section className='mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
                    <h2 className='text-lg font-semibold text-slate-900'>Các bước nhanh</h2>
                    <div className='mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'>
                         {STEPS.map((step, index) => (
                              <div key={step.title} className='rounded-xl border border-slate-200 bg-slate-50 p-4'>
                                   <div className='mb-2 flex items-center gap-2'>
                                        {step.icon}
                                        <span className='text-xs font-semibold uppercase tracking-wide text-slate-500'>Bước {index + 1}</span>
                                   </div>
                                   <h3 className='text-sm font-semibold text-slate-900'>{step.title}</h3>
                                   <p className='mt-1 text-sm leading-5 text-slate-600'>{step.description}</p>
                              </div>
                         ))}
                    </div>
               </section>

               <div className='mt-6 space-y-6'>
                    <GuideVideoPlaceholder
                         title='Video hướng dẫn tổng quan'
                         description='Bạn sẽ thêm video giới thiệu quy trình tải app, đăng nhập và config mạch ở đây.'
                    />

                    <GuideImageGalleryPlaceholder
                         title='Ảnh minh họa thao tác'
                         description='Bạn sẽ thêm ảnh chụp màn hình app, ảnh mạch và keypad để user làm theo trực quan.'
                    />
               </div>

               <section className='mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4'>
                    <p className='text-sm leading-6 text-amber-800'>
                         Mẹo: Khi chưa thao tác được trên app, bạn vẫn có thể dùng mật khẩu keypad để mở cửa thủ công.
                    </p>
               </section>

               <div className='mt-6 flex flex-wrap gap-2'>
                    <Link
                         href={ROUTES.MY_APARTMENT}
                         className='inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700'
                    >
                         Đi đến căn hộ của tôi
                    </Link>
                    <Link
                         href={ROUTES.HOME}
                         className='inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50'
                    >
                         Quay về trang chủ
                    </Link>
               </div>
          </div>
     )
}
