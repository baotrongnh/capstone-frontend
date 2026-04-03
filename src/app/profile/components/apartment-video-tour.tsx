import { ApartmentVideoTourProps } from '@/types/userApartment'
import { isDirectVideoFileUrl, toVideoEmbedUrl } from '@/utils/userApartment'

export function ApartmentVideoTour({ videoTourUrl, title, unavailableText }: ApartmentVideoTourProps) {
    const videoEmbedUrl = toVideoEmbedUrl(videoTourUrl)
    const isDirectVideoSource = Boolean(videoEmbedUrl && isDirectVideoFileUrl(videoEmbedUrl))

    return (
        <div>
            <h3 className="mb-3 text-base font-semibold text-slate-900">{title}</h3>

            {videoEmbedUrl ? (
                <div
                    className="relative w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-950"
                    style={{ aspectRatio: '16 / 9' }}
                >
                    {isDirectVideoSource ? (
                        <video
                            src={videoEmbedUrl}
                            controls
                            playsInline
                            preload="metadata"
                            className="absolute inset-0 h-full w-full object-contain"
                        />
                    ) : (
                        <iframe
                            src={videoEmbedUrl}
                            title={title}
                            className="absolute inset-0 h-full w-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    )}
                </div>
            ) : (
                <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
                    {unavailableText}
                </div>
            )}
        </div>
    )
}