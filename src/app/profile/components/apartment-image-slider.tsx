import { Carousel, Image } from 'antd'
import { useState } from 'react'
import { ApartmentImageSliderProps } from '@/types/userApartment'
import { normalizeApartmentImages } from '@/utils/userApartment'

export function ApartmentImageSlider({ buildingName, images }: ApartmentImageSliderProps) {
    const APARTMENT_PLACEHOLDER = '/img/apartment-placeholder.png'
    const normalizedImages = normalizeApartmentImages(images)
    const hasMultipleImages = normalizedImages.length > 1
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isPreviewOpen, setIsPreviewOpen] = useState(false)
    const [previewIndex, setPreviewIndex] = useState(0)

    return (
        <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <Image.PreviewGroup
                items={normalizedImages}
                preview={{
                    open: isPreviewOpen,
                    current: previewIndex,
                    onOpenChange: (open) => setIsPreviewOpen(open),
                    onChange: (current) => setPreviewIndex(current),
                }}
            >
                <Carousel arrows dots draggable infinite={true} afterChange={setCurrentSlide}>
                    {normalizedImages.map((image, index) => (
                        <div key={`${image}-${index}`}>
                            <div className="relative h-64 w-full md:h-105">
                                <Image
                                    width="100%"
                                    height="100%"
                                    preview={false}
                                    fallback={APARTMENT_PLACEHOLDER}
                                    src={image}
                                    alt={`${buildingName} image ${index + 1}`}
                                    className="h-full w-full"
                                    style={{ cursor: 'zoom-in', objectFit: 'cover' }}
                                    onClick={() => {
                                        setPreviewIndex(index)
                                        setIsPreviewOpen(true)
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </Carousel>
            </Image.PreviewGroup>

            {hasMultipleImages ? (
                <div className="pointer-events-none absolute right-3 top-3 z-20 rounded-lg bg-black/55 px-3 py-1 text-xs font-medium text-white">
                    {currentSlide + 1}/{normalizedImages.length}
                </div>
            ) : null}
        </div>
    )
}