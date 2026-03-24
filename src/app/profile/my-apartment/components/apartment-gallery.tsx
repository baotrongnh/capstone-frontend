import Image from 'next/image'
import { useEffect, useState } from 'react'

type ApartmentGalleryProps = {
    buildingName: string
    images: string[] | null
}

type ApartmentImageProps = {
    src?: string
    alt: string
    priority?: boolean
    className?: string
}

const APARTMENT_PLACEHOLDER = '/img/apartment-placeholder.png'

function ApartmentImage({ src, alt, priority, className }: ApartmentImageProps) {
    const safeSource = typeof src === 'string' && src.trim().length > 0 ? src : APARTMENT_PLACEHOLDER
    const [resolvedSource, setResolvedSource] = useState(safeSource)

    useEffect(() => {
        setResolvedSource(safeSource)
    }, [safeSource])

    return (
        <Image
            src={resolvedSource}
            alt={alt}
            fill
            className={className}
            priority={priority}
            onError={() => {
                if (resolvedSource !== APARTMENT_PLACEHOLDER) {
                    setResolvedSource(APARTMENT_PLACEHOLDER)
                }
            }}
        />
    )
}

export function ApartmentGallery({ buildingName, images }: ApartmentGalleryProps) {
    const apartmentImages = images ?? []
    const imageSlots = [apartmentImages[0], apartmentImages[1], apartmentImages[2]]

    return (
        <div className="grid grid-cols-1 gap-2 bg-slate-100 p-2 lg:grid-cols-3">
            <div className="relative h-72 overflow-hidden rounded-lg bg-slate-50 lg:col-span-2">
                <ApartmentImage
                    src={imageSlots[0]}
                    alt={`${buildingName} - main`}
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    priority
                />
            </div>
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
                <div className="relative h-36 overflow-hidden rounded-lg bg-slate-50">
                    <ApartmentImage
                        src={imageSlots[1]}
                        alt={`${buildingName} - side 1`}
                        className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                </div>
                <div className="relative h-36 overflow-hidden rounded-lg bg-slate-50">
                    <ApartmentImage
                        src={imageSlots[2]}
                        alt={`${buildingName} - side 2`}
                        className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                </div>
            </div>
        </div>
    )
}
