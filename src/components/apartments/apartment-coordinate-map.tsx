"use client"

import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet"
import { useEffect, useRef } from "react"
import "leaflet/dist/leaflet.css"

type ApartmentCoordinateMapProps = {
  latitude?: number
  longitude?: number
}

// Trung tâm TP HCM
const DEFAULT_LAT = 10.7769
const DEFAULT_LNG = 106.7009

const normalizeLeafletLayering = (map: LeafletMap) => {
  // Keep Leaflet internal layers under form overlays (select/popover/dialog).
  map.getContainer().style.zIndex = "0"

  const panes = map.getPanes()
  if (panes.tilePane) panes.tilePane.style.zIndex = "1"
  if (panes.overlayPane) panes.overlayPane.style.zIndex = "2"
  if (panes.shadowPane) panes.shadowPane.style.zIndex = "3"
  if (panes.markerPane) panes.markerPane.style.zIndex = "4"
  if (panes.tooltipPane) panes.tooltipPane.style.zIndex = "5"
  if (panes.popupPane) panes.popupPane.style.zIndex = "6"

  const controls = map.getContainer().querySelectorAll(".leaflet-top, .leaflet-bottom")
  controls.forEach((control) => {
    (control as HTMLElement).style.zIndex = "7"
  })
}

const MAP_INTERACTIONS = ["dragging", "scrollWheelZoom", "doubleClickZoom", "boxZoom", "keyboard", "touchZoom"] as const

export function ApartmentCoordinateMap({
  latitude,
  longitude,
}: ApartmentCoordinateMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<LeafletMap | null>(null)
  const markerRef = useRef<LeafletMarker | null>(null)

  const lat = latitude || DEFAULT_LAT
  const lng = longitude || DEFAULT_LNG

  // Track latest coords for async init to read
  const coordRef = useRef({ lat, lng })
  useEffect(() => {
    coordRef.current = { lat, lng }
  }, [lat, lng])

  // Initialize map once
  useEffect(() => {
    let disposed = false

    const init = async () => {
      if (!mapContainerRef.current || mapRef.current) return

      const L = await import("leaflet")
      if (disposed || !mapContainerRef.current || mapRef.current) return

      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: true,
      }).setView([coordRef.current.lat, coordRef.current.lng], 15)

      normalizeLeafletLayering(map)

      L.tileLayer("https://maps.vietmap.vn/api/tm/{z}/{x}/{y}.png?apikey=b089c6fc2b6ae481ffcf9c8400f519ab86fcf9cd63610e44", {
        maxZoom: 19,
      }).addTo(map)

      const marker = L.marker([coordRef.current.lat, coordRef.current.lng], {
        draggable: false, // Disabled marker dragging
        icon: L.icon({
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        }),
      }).addTo(map)

      mapRef.current = map
      markerRef.current = marker

      // Ensure tiles render correctly
      setTimeout(() => map.invalidateSize(), 250)

      // Auto-resize when container changes
      const observer = new ResizeObserver(() => map.invalidateSize())
      observer.observe(mapContainerRef.current!)

      // Extend cleanup to include observer
      const originalCleanup = () => observer.disconnect()
      ;(map as unknown as { _resizeCleanup: () => void })._resizeCleanup = originalCleanup
    }

    void init()

    return () => {
      disposed = true
      const map = mapRef.current
      if (map) {
        ;(map as unknown as { _resizeCleanup?: () => void })._resizeCleanup?.()
        map.remove()
      }
      mapRef.current = null
      markerRef.current = null
    }
  }, [])

  // Sync marker + view when coordinates change
  useEffect(() => {
    const marker = markerRef.current
    const map = mapRef.current
    if (!marker || !map) return

    const next: [number, number] = [lat, lng]
    marker.setLatLng(next)

    if (!map.getBounds().pad(-0.25).contains(next)) {
      map.panTo(next)
    }
  }, [lat, lng])

  // Toggle map interactions (Always disable map interaction here to achieve what user wants)
  useEffect(() => {
    const marker = markerRef.current
    const map = mapRef.current
    if (!marker || !map) return

    marker.dragging?.disable()

    for (const interaction of MAP_INTERACTIONS) {
      map[interaction]?.disable()
    }
  }, [])

  return (
    <div className="relative z-0 isolate overflow-hidden rounded-lg border w-full h-full">
      <div
        ref={mapContainerRef}
        className="h-full w-full"
        aria-label="Bản đồ vị trí căn hộ"
      />
    </div>
  )
}
