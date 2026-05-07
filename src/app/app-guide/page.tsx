import { ROUTES } from '@/constants/routes'
import { Wifi } from 'lucide-react'
import { Be_Vietnam_Pro } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import { type ReactNode } from 'react'

const beVietnamPro = Be_Vietnam_Pro({
     subsets: ['vietnamese'],
     weight: ['400', '500', '600', '700'],
})

const DOWNLOAD_APP_URL =
     process.env.NEXT_PUBLIC_HOMEIQ_APP_DOWNLOAD_URL ||
     'https://drive.google.com/uc?export=download&id=14O2oqNqU1Q6VfSH_95VVrrWJTnTY0EoE'

type GuideStep = {
     title: string
     description: string
     imageSrc: string
     imageAlt: string
     badgeClass: string
     glowClass: string
     note?: ReactNode
}

const STEPS: GuideStep[] = [
     {
          title: 'Kết nối vào Wi-Fi của Hub',
          description:
               'Bật Wi-Fi trên điện thoại, chọn mạng HOME_IQ_HUB và nhập mật khẩu mặc định (123456789).',
          imageSrc: '/img/guide/step1.PNG',
          imageAlt: 'Bước 1: Kết nối Wi-Fi HOME_IQ_HUB',
          badgeClass: 'bg-sky-100 text-sky-700',
          glowClass: 'bg-sky-200/40',
     },
     {
          title: 'Mở app và vào cấu hình Wi-Fi',
          description:
               'Mở ứng dụng HomeIQ, vào tab Căn hộ và chọn mục cấu hình mạng Wi-Fi cho thiết bị.',
          imageSrc: '/img/guide/step2.PNG',
          imageAlt: 'Bước 2: Vào tab Căn hộ và cấu hình Wi-Fi',
          badgeClass: 'bg-indigo-100 text-indigo-700',
          glowClass: 'bg-indigo-200/40',
          note: (
               <a
                    className='inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800'
                    href={DOWNLOAD_APP_URL}
                    target='_blank'
                    rel='noreferrer'
               >
                    Chưa có ứng dụng, tải ứng dụng ngay
               </a>
          ),
     },
     {
          title: 'Kiểm tra điện thoại đang nối vào Hub',
          description:
               'Đảm bảo điện thoại vẫn đang kết nối đúng Wi-Fi của HomeIQ Hub trước khi gửi cấu hình.',
          imageSrc: '/img/guide/step3.PNG',
          imageAlt: 'Bước 3: Kiểm tra kết nối tới Hub',
          badgeClass: 'bg-emerald-100 text-emerald-700',
          glowClass: 'bg-emerald-200/40',
     },
     {
          title: 'Nhập Wi-Fi nhà và gửi cấu hình',
          description:
               'Nhập tên Wi-Fi và mật khẩu (để trống nếu không có), nhấn Gửi cấu hình và chờ thông báo kết nối thành công.',
          imageSrc: '/img/guide/step4.PNG',
          imageAlt: 'Bước 4: Gửi cấu hình Wi-Fi',
          badgeClass: 'bg-amber-100 text-amber-700',
          glowClass: 'bg-amber-200/40',
     },
]

export default function AppGuidePage() {
     return (
          <div className={`mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8 ${beVietnamPro.className}`}>
               <section className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10'>

                    <div className='grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end'>
                         <div>
                              <div className='inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700'>
                                   <Wifi className='h-4 w-4' />
                                   Kết nối Wi-Fi HomeIQ Hub
                              </div>
                              <h1 className='mt-4 text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl'>
                                   Hướng dẫn cấu hình Wi-Fi cho thiết bị HomeIQ
                              </h1>
                              <p className='mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base'>
                                   Bạn hãy làm đủ các bước dưới đây để thiết lập kết nối lần đầu cho HUB HOME IQ nhé.
                              </p>

                              <div className='mt-5 flex flex-wrap gap-2 text-xs font-semibold text-slate-700'>
                                   <span className='rounded-full bg-blue-600 px-3 py-1 text-white'>WIFI: HOME_IQ_HUB</span>
                                   <span className='rounded-full bg-white px-3 py-1 font-semibold shadow-sm ring-1 ring-slate-200'>Mật khẩu: <span className='text-slate-900'>123456789</span></span>
                              </div>
                         </div>

                         <div className='w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
                              <p className='text-xs font-semibold uppercase tracking-wide text-slate-500'>Tải ứng dụng</p>
                              <p className='mt-2 text-sm text-slate-600'>Tải app để cấu hình Wi-Fi cho hub và quản lý căn hộ.</p>
                              <a
                                   className='mt-4 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700'
                                   href={DOWNLOAD_APP_URL}
                                   target='_blank'
                                   rel='noreferrer'
                              >
                                   Chưa có ứng dụng, tải ứng dụng ngay
                              </a>
                         </div>
                    </div>
               </section>

               <section className='mt-10'>
                    <div className='mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
                         <div>
                              <h2 className='text-lg font-semibold text-slate-900'>4 bước kết nối</h2>
                              <p className='text-sm text-slate-500'>Bạn vui lòng làm đủ các bước để thực hiện kết nối nhé.</p>
                         </div>
                         <span className='inline-flex w-fit items-center rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200'>
                              Chỉ mất chưa đầy 2 phút để thực hiện
                         </span>
                    </div>

                    <ol className='grid grid-cols-1 gap-5'>
                         {STEPS.map((step, index) => (
                              <li key={step.title}>
                                   <article className='group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-[0_22px_60px_-48px_rgba(15,23,42,0.55)]'>
                                        <span
                                             className={`pointer-events-none absolute top-4 z-10 text-4xl font-semibold text-slate-900/15 ${index % 2 === 1 ? 'left-5' : 'right-5'
                                                  }`}
                                        >
                                             {`0${index + 1}`}
                                        </span>
                                        <div
                                             className={`flex flex-col gap-5 ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'
                                                  } md:items-center`}
                                        >
                                             <div className='relative w-full md:w-[300px]'>
                                                  <div className={`pointer-events-none absolute -inset-4 rounded-[28px] ${step.glowClass} blur-2xl`} />
                                                  <div className='relative overflow-hidden rounded-2xl border border-white/80 bg-white shadow-sm'>
                                                       <Image
                                                            src={step.imageSrc}
                                                            alt={step.imageAlt}
                                                            width={560}
                                                            height={420}
                                                            className='h-auto w-full object-cover transition duration-500 group-hover:scale-[1.02]'
                                                            priority={index === 0}
                                                       />
                                                  </div>
                                             </div>

                                             <div className='flex-1'>
                                                  <span
                                                       className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${step.badgeClass}`}
                                                  >
                                                       Bước {index + 1}
                                                  </span>
                                                  <h2 className='mt-3 text-lg font-semibold text-slate-900'>{step.title}</h2>
                                                  <p className='mt-2 text-sm leading-6 text-slate-600'>{step.description}</p>
                                                  {step.note ? <div className='mt-4'>{step.note}</div> : null}
                                             </div>
                                        </div>
                                   </article>
                              </li>
                         ))}
                    </ol>
               </section>

               <div className='mt-8 flex flex-wrap gap-3'>
                    <Link
                         href={ROUTES.MY_APARTMENT}
                         className='inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700'
                    >
                         Đi đến căn hộ của tôi
                    </Link>
               </div>
          </div>
     )
}
