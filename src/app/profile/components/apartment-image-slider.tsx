import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Image } from 'antd'
import { useEffect, useState } from 'react'
import { ApartmentImageSliderProps } from '@/types/userApartment'
import { normalizeApartmentImages } from '@/utils/userApartment'

export function ApartmentImageSlider({ buildingName, images }: ApartmentImageSliderProps) {
    const APARTMENT_PLACEHOLDER = '/img/apartment-placeholder.png'
    const normalizedImages = normalizeApartmentImages(images)
    const hasMultipleImages = normalizedImages.length > 1
    const totalImages = normalizedImages.length
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isPreviewOpen, setIsPreviewOpen] = useState(false)

    useEffect(() => {
        if (currentSlide >= totalImages) {
            setCurrentSlide(0)
        }
    }, [currentSlide, totalImages])

    const currentImage = normalizedImages[currentSlide] ?? APARTMENT_PLACEHOLDER

    const goToSlide = (targetIndex: number) => {
        if (totalImages <= 0) {
            return
        }

        const normalizedIndex = ((targetIndex % totalImages) + totalImages) % totalImages
        setCurrentSlide(normalizedIndex)
    }

    return (
        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white">
            <Image.PreviewGroup
                items={normalizedImages}
                preview={{
                    open: isPreviewOpen,
                    current: currentSlide,
                    onOpenChange: (open) => setIsPreviewOpen(open),
                    onChange: (index) => setCurrentSlide(index),
                }}
            >
                <div className="relative h-64 w-full md:h-105">
                    <button
                        type="button"
                        className="relative block h-full w-full cursor-zoom-in overflow-hidden bg-slate-100"
                        onClick={() => setIsPreviewOpen(true)}
                        aria-label={`${buildingName} image ${currentSlide + 1}`}
                    >
                        <img
                            src={currentImage}
                            alt={`${buildingName} image ${currentSlide + 1}`}
                            className="h-full w-full object-cover"
                            onError={(event) => {
                                event.currentTarget.src = APARTMENT_PLACEHOLDER
                            }}
                        />
                    </button>

                    {hasMultipleImages ? (
                        <>
                            <Button
                                shape="circle"
                                icon={<LeftOutlined />}
                                onClick={() => goToSlide(currentSlide - 1)}
                                className="absolute! left-3 top-1/2 z-20 -translate-y-1/2!"
                                aria-label="Previous image"
                            />
                            <Button
                                shape="circle"
                                type="primary"
                                icon={<RightOutlined />}
                                onClick={() => goToSlide(currentSlide + 1)}
                                className="absolute! right-3 top-1/2 z-20 -translate-y-1/2!"
                                aria-label="Next image"
                            />
                        </>
                    ) : null}

                    {hasMultipleImages ? (
                        <div className="pointer-events-none absolute right-3 top-3 z-20 rounded-lg bg-black/55 px-3 py-1 text-xs font-medium text-white">
                            {currentSlide + 1}/{normalizedImages.length}
                        </div>
                    ) : null}
                </div>
            </Image.PreviewGroup>

            {hasMultipleImages ? (
                <div className="flex gap-2 overflow-x-auto border-t border-slate-200 bg-white p-2 scrollbar-hide">
                    {normalizedImages.map((image, index) => (
                        <button
                            key={`thumb-${image}-${index}`}
                            type="button"
                            onClick={() => goToSlide(index)}
                            className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-md border ${index === currentSlide ? 'border-blue-500 ring-1 ring-blue-200' : 'border-slate-200'
                                }`}
                            aria-label={`${buildingName} thumbnail ${index + 1}`}
                        >
                            <img
                                src={image}
                                alt={`${buildingName} thumbnail ${index + 1}`}
                                className="h-full w-full object-cover"
                                onError={(event) => {
                                    event.currentTarget.src = APARTMENT_PLACEHOLDER
                                }}
                            />
                        </button>
                    ))}
                </div>
            ) : null}
        </div>
    )
}