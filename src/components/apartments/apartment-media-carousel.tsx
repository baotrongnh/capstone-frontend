"use client"

import { LeftOutlined, RightOutlined } from "@ant-design/icons"
import { Button, Carousel, Image } from "antd"
import type { CarouselRef } from "antd/es/carousel"
import { PlayCircle } from "lucide-react"
import { useMemo, useRef } from "react"

type ApartmentMediaCarouselProps = {
     images: string[]
     videoTourUrl?: string
     morePhotosText: (count: number) => string
     imageAltText: (index: number) => string
     videoSlideTitle: string
     onOpenVideo: () => void
}

export default function ApartmentMediaCarousel({
     images,
     videoTourUrl,
     morePhotosText,
     imageAltText,
     videoSlideTitle,
     onOpenVideo,
}: ApartmentMediaCarouselProps) {
     const carouselRef = useRef<CarouselRef>(null)
     const hasVideoSlide = !!videoTourUrl
     const totalSlides = images.length + (hasVideoSlide ? 1 : 0)

     const canNavigate = totalSlides > 1
     const morePhotoCount = Math.max(images.length - 1, 0)

     const slides = useMemo(() => {
          return images.map((src, index) => ({
               key: `img-${index}`,
               src,
               index,
          }))
     }, [images])

     if (totalSlides === 0) {
          return null
     }

     return (
          <div className="mt-5 w-full">
               <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
                    {canNavigate ? (
                         <>
                              <Button
                                   shape="circle"
                                   icon={<LeftOutlined />}
                                   onClick={() => carouselRef.current?.prev()}
                                   className="absolute! left-3 top-1/2 z-20 -translate-y-1/2!"
                                   aria-label="Previous media"
                              />
                              <Button
                                   shape="circle"
                                   type="primary"
                                   icon={<RightOutlined />}
                                   onClick={() => carouselRef.current?.next()}
                                   className="absolute! right-3 top-1/2 z-20 -translate-y-1/2!"
                                   aria-label="Next media"
                              />
                         </>
                    ) : null}

                    <Carousel
                         ref={carouselRef}
                         dots={canNavigate}
                         draggable
                         adaptiveHeight={false}
                         className="media-carousel"
                    >
                         {slides.map((item) => (
                              <div key={item.key} className="mb-0!">
                                   <div className="relative h-64 w-full md:h-96 lg:h-112">
                                        <Image
                                             alt={imageAltText(item.index)}
                                             src={item.src}
                                             width="100%"
                                             height="100%"
                                             preview={{ mask: "Xem ảnh" }}
                                             style={{ objectFit: "cover" }}
                                             className="h-full w-full"
                                        />
                                        {item.index === 0 && morePhotoCount > 0 ? (
                                             <div className="absolute bottom-4 right-4 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white">
                                                  {morePhotosText(morePhotoCount)}
                                             </div>
                                        ) : null}
                                   </div>
                              </div>
                         ))}

                         {hasVideoSlide ? (
                              <div className="mb-0!">
                                   <button
                                        type="button"
                                        onClick={onOpenVideo}
                                        className="relative h-64 w-full overflow-hidden bg-black md:h-96 lg:h-112"
                                   >
                                        <video
                                             src={videoTourUrl}
                                             muted
                                             playsInline
                                             preload="metadata"
                                             className="h-full w-full object-cover opacity-75"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/35 to-transparent" />
                                        <PlayCircle className="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 text-white" />
                                        <p className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-black/45 px-4 py-1.5 text-sm font-medium text-white">
                                             {videoSlideTitle}
                                        </p>
                                   </button>
                              </div>
                         ) : null}
                    </Carousel>
               </div>
          </div>
     )
}
