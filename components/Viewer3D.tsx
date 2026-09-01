'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import {
  RotateCw, ZoomIn, ZoomOut, Sparkles, Compass, Eye,
  ShieldCheck, Layers, Info, Maximize2, Minimize2, Move, RefreshCw, ShoppingBag,
  Play, Pause
} from 'lucide-react'
import { getModelGallery, IMAGE_CATALOG } from '@/lib/imageCatalog'
import { PRODUCTS } from '@/lib/products'
import { useCart } from '@/context/CartContext'

export const FRAME_COLORS = [
  { label: 'Havana', hex: '#7A3B20', letter: 'C' },
  { label: 'Negro',  hex: '#1a1a1a', letter: 'B' },
  { label: 'Azul',   hex: '#0D2147', letter: 'A' },
  { label: 'Gris',   hex: '#4A4A4A', letter: 'D' },
]

export const VIEW_PRESETS: Record<string, { frameRatio: number; label: string; desc: string }> = {
  Frontal:  { frameRatio: 0.0,  label: 'Frontal',         desc: 'Vista directa simétrica y lentes UV400' },
  '3/4':    { frameRatio: 0.25, label: '3/4 Ángulo',       desc: 'Biselado frontal y curvatura del puente' },
  Lateral:  { frameRatio: 0.5,  label: 'Lateral Varilla', desc: 'Perfil completo, patilla y logotipo grabado' },
  Atrás:    { frameRatio: 0.75, label: 'Interior',        desc: 'Bisagras de 5 dientes y ajuste de almohadillas' },
}

interface Hotspot {
  id: string
  frameRange: [number, number] // normalized 0 to 1
  x: number // percentage 0-100
  y: number // percentage 0-100
  title: string
  desc: string
  tag: string
}

// DEFAULT_HOTSPOTS removed from module scope, now dynamically generated inside the component

export interface Viewer3DProps {
  activeColor?: string
  activeView?: string
  images?: string[]
  letter?: string
  hideControls?: boolean
  autoRotateDefault?: boolean
  className?: string
  showHotspotsDefault?: boolean
  onFrameChange?: (index: number, total: number) => void
}

export default function Viewer3D({
  activeColor: extColor,
  activeView: extView,
  images: extImages,
  letter: extLetter,
  hideControls = false,
  autoRotateDefault = false,
  className = '',
  showHotspotsDefault = true,
  onFrameChange,
}: Viewer3DProps) {
  const { addToCart, setIsCartOpen } = useCart()
  const [internalColor, setInternalColor] = useState(FRAME_COLORS[0].hex)
  const [internalView, setInternalView] = useState('Frontal')
  const [isAutoRotating, setIsAutoRotating] = useState(autoRotateDefault)
  
  // High-precision Zoom & Pan state
  const [zoomScale, setZoomScale] = useState(1.0)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [showHotspots, setShowHotspots] = useState(showHotspotsDefault)
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadedCount, setLoadedCount] = useState(0)

  const activeColor = extColor ?? internalColor
  const activeView = extView ?? internalView

  // Determine current image sequence
  const resolvedLetter = extLetter || FRAME_COLORS.find(c => c.hex.toLowerCase() === activeColor.toLowerCase())?.letter || 'C'
  const allRawImages = extImages && extImages.length > 0 
    ? extImages 
    : getModelGallery(resolvedLetter).length > 0 
      ? getModelGallery(resolvedLetter) 
      : (IMAGE_CATALOG['C'] || IMAGE_CATALOG['B'] || ['/images/c01.png', '/images/c02.png', '/images/c03.png', '/images/c04.png', '/images/c05.png'])

  // Excluir fotos "lifestyle" (modelos) del visor 3D.
  // Asumimos que las tomas 1 a 5 son la secuencia 360, y cualquier toma extra (6 en adelante) es lifestyle.
  const rawImages = allRawImages.slice(0, 5)

  // Fetch product data for dynamic hotspots
  const product = PRODUCTS.find((p) => p.letter === resolvedLetter) || PRODUCTS[0]
  
  const dynamicHotspots: Hotspot[] = [
    {
      id: 'acetate',
      frameRange: [0.0, 0.45],
      x: 48,
      y: 38,
      title: `Montura ${product.material || 'Acetato'}`,
      desc: `Montura pulida a mano. Dimensiones: Frontal ${product.sizes?.frontal || '47mm'}, Altura ${product.sizes?.altura || '45mm'}.`,
      tag: 'MATERIAL'
    },
    {
      id: 'lens',
      frameRange: [0.0, 0.45],
      x: 62,
      y: 52,
      title: `Lentes ${product.lens || 'Polarizados'}`,
      desc: `Filtro UV400 categoría 3 con tratamiento de alta fidelidad.`,
      tag: 'ÓPTICA'
    },
    {
      id: 'hinge',
      frameRange: [0.15, 0.85],
      x: 32,
      y: 48,
      title: 'Bisagra de 5 Dientes',
      desc: `Estructura reforzada. Puente de ${product.sizes?.puente || '20mm'} para un ajuste óptimo.`,
      tag: 'INGENIERÍA'
    },
    {
      id: 'logo',
      frameRange: [0.15, 0.85],
      x: 68,
      y: 49,
      title: `Insignia ${product.logo || 'Dorado'}`,
      desc: `Emblema grabado en las varillas de ${product.sizes?.varillas || '145mm'}.`,
      tag: 'IDENTIDAD'
    },
  ]

  // Expand small sequences seamlessly for smooth 360° rotation
  const framesList = useRef<string[]>([])
  if (rawImages.length > 0) {
    if (rawImages.length >= 12) {
      framesList.current = rawImages
    } else {
      const forward = [...rawImages]
      const backward = [...rawImages].slice(1, -1).reverse()
      framesList.current = [...forward, ...backward]
    }
  }

  const totalFrames = framesList.current.length || 1

  // Canvas & Physics state
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const loadedImagesRef = useRef<HTMLImageElement[]>([])
  const currentFrameRef = useRef<number>(0)
  const targetFrameRef = useRef<number>(0)
  
  // Drag / Pan interaction refs
  const isInteractingRef = useRef<boolean>(false)
  const isPanningRef = useRef<boolean>(false)
  const startPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const startFrameRef = useRef<number>(0)
  const startPanRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  
  // Kinetic velocity for ultra-smooth drag release
  const velocityRef = useRef<number>(0)
  const lastPointerXRef = useRef<number>(0)
  const lastPointerTimeRef = useRef<number>(0)

  const animationFrameRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)
  
  // React state for UI overlays that need to know the current frame (updates only on integer change)
  const [currentIntFrame, setCurrentIntFrame] = useState(0)
  const lastReportedFrameRef = useRef<number>(0)

  // Target Zoom & Pan with smooth lerp
  const currentZoomRef = useRef<number>(1.0)
  const targetZoomRef = useRef<number>(1.0)
  const currentPanRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const targetPanRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  // Keep target refs synced with react state
  useEffect(() => {
    targetZoomRef.current = zoomScale
    if (zoomScale <= 1.0) {
      targetPanRef.current = { x: 0, y: 0 }
      setPanOffset({ x: 0, y: 0 })
    }
  }, [zoomScale])

  // Preload all frames
  useEffect(() => {
    let isMounted = true
    setIsLoading(true)
    setLoadedCount(0)

    const imagesToLoad = framesList.current
    if (!imagesToLoad.length) return

    loadedImagesRef.current = []
    let loaded = 0

    imagesToLoad.forEach((src, idx) => {
      const img = new window.Image()
      img.crossOrigin = 'anonymous'
      img.src = src
      img.onload = () => {
        if (!isMounted) return
        loaded++
        setLoadedCount(loaded)
        if (loaded >= imagesToLoad.length) {
          setIsLoading(false)
        }
      }
      img.onerror = () => {
        if (!isMounted) return
        loaded++
        setLoadedCount(loaded)
        if (loaded >= imagesToLoad.length) {
          setIsLoading(false)
        }
      }
      loadedImagesRef.current[idx] = img
    })

    return () => {
      isMounted = false
    }
  }, [resolvedLetter, extImages])

  // High-performance canvas drawing with sub-frame alpha crossfading & zoom
  const drawFrame = useCallback((frameFloat: number, zoom: number, pan: { x: number; y: number }) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const total = loadedImagesRef.current.length
    if (total === 0) return

    // Normalizing frameFloat into positive modulo range
    let norm = (frameFloat % total + total) % total
    let indexA = Math.floor(norm) % total
    let indexB = (indexA + 1) % total
    let blendRatio = norm - Math.floor(norm) // fraction between 0.0 and 1.0

    const imgA = loadedImagesRef.current[indexA]
    const imgB = loadedImagesRef.current[indexB]

    if (!imgA || !imgA.complete || imgA.naturalWidth === 0) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
    }

    ctx.save()
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Base geometry calculation
    const imgAspect = imgA.naturalWidth / imgA.naturalHeight
    const canvasAspect = rect.width / rect.height
    let drawW: number, drawH: number

    if (canvasAspect > imgAspect) {
      drawH = rect.height * 0.86
      drawW = drawH * imgAspect
    } else {
      drawW = rect.width * 0.88
      drawH = drawW / imgAspect
    }

    // Apply Zoom & Pan transforms from center
    ctx.save()
    ctx.translate(rect.width / 2 + pan.x, rect.height / 2 + pan.y)
    ctx.scale(zoom, zoom)
    ctx.translate(-rect.width / 2, -rect.height / 2)

    const drawX = (rect.width - drawW) / 2
    const drawY = (rect.height - drawH) / 2

    // Luxury soft drop-shadow beneath glasses on dark floor
    const shadowGrad = ctx.createRadialGradient(
      rect.width / 2,
      rect.height / 2 + drawH * 0.44,
      10,
      rect.width / 2,
      rect.height / 2 + drawH * 0.44,
      drawW * 0.55 // Wider spread
    )
    shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.45)') // Softer center
    shadowGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.15)')
    shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')

    ctx.fillStyle = shadowGrad
    ctx.fillRect(drawX - 80, rect.height / 2, drawW + 160, rect.height / 2)

    // Draw primary frame (imgA)
    ctx.globalAlpha = 1.0
    ctx.drawImage(imgA, drawX, drawY, drawW, drawH)

    // Motion Blur / Transition Crossfade (only active during movement now)
    // Because targetFrameRef is discrete, this blend only happens while moving and cleanly resolves to 0 (no ghosting)
    if (blendRatio > 0.05 && imgB && imgB.complete && imgB.naturalWidth > 0) {
      ctx.globalAlpha = blendRatio * 0.8 // 80% max opacity for softer blur
      ctx.drawImage(imgB, drawX, drawY, drawW, drawH)
    }

    ctx.restore()
    ctx.restore()

    if (onFrameChange) {
      onFrameChange(indexA, total)
    }
  }, [onFrameChange])

  // Physics animation loop with weighted inertia (lerp + dampening)
  useEffect(() => {
    const loop = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp
      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.1)
      lastTimeRef.current = timestamp

      // Auto rotation with gentle constant angular speed
      if (isAutoRotating && !isInteractingRef.current && zoomScale <= 1.05) {
        targetFrameRef.current += dt * 1.8 // Gentle, elegant speed
      }

      // Smooth frame interpolation (Slower lerp factor 0.06 for buttery smooth transitions)
      const frameDiff = targetFrameRef.current - currentFrameRef.current
      if (Math.abs(frameDiff) > 0.0001) {
        currentFrameRef.current += frameDiff * 0.06
      }

      // Smooth zoom interpolation
      const zoomDiff = targetZoomRef.current - currentZoomRef.current
      if (Math.abs(zoomDiff) > 0.001) {
        currentZoomRef.current += zoomDiff * 0.15
      }

      // Smooth pan interpolation
      const panXDiff = targetPanRef.current.x - currentPanRef.current.x
      const panYDiff = targetPanRef.current.y - currentPanRef.current.y
      if (Math.abs(panXDiff) > 0.1 || Math.abs(panYDiff) > 0.1) {
        currentPanRef.current.x += panXDiff * 0.20
        currentPanRef.current.y += panYDiff * 0.20
      }

      // Update React state for UI overlays if the integer frame has changed
      const currentInt = Math.round((currentFrameRef.current % totalFrames + totalFrames) % totalFrames)
      if (lastReportedFrameRef.current !== currentInt) {
        lastReportedFrameRef.current = currentInt
        setCurrentIntFrame(currentInt)
      }

      // Render frame
      drawFrame(currentFrameRef.current, currentZoomRef.current, currentPanRef.current)

      animationFrameRef.current = requestAnimationFrame(loop)
    }

    animationFrameRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animationFrameRef.current)
  }, [drawFrame, isAutoRotating, zoomScale])

  // React to view preset changes with cinematic ease
  useEffect(() => {
    const preset = VIEW_PRESETS[activeView]
    if (!preset) return
    const target = preset.frameRatio * totalFrames
    targetFrameRef.current = target
    setIsAutoRotating(false)
  }, [activeView, totalFrames])

  // Senior Precision Pointer & Drag Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isInteractingRef.current = true
    startPointerRef.current = { x: e.clientX, y: e.clientY }
    lastPointerXRef.current = e.clientX
    lastPointerTimeRef.current = performance.now()
    setIsAutoRotating(false)

    if (zoomScale > 1.05) {
      // Pan mode when zoomed
      isPanningRef.current = true
      startPanRef.current = { ...targetPanRef.current }
    } else {
      // Rotation mode when normal
      isPanningRef.current = false
      startFrameRef.current = targetFrameRef.current
    }

    if (containerRef.current) {
      containerRef.current.setPointerCapture(e.pointerId)
    }
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isInteractingRef.current) return

    const now = performance.now()
    const dt = Math.max(1, now - lastPointerTimeRef.current)
    const deltaX = e.clientX - startPointerRef.current.x
    const deltaY = e.clientY - startPointerRef.current.y

    if (isPanningRef.current) {
      // Pan constraints according to zoom scale
      const maxPanX = (zoomScale - 1) * 350
      const maxPanY = (zoomScale - 1) * 220
      const newPanX = Math.max(-maxPanX, Math.min(maxPanX, startPanRef.current.x + deltaX))
      const newPanY = Math.max(-maxPanY, Math.min(maxPanY, startPanRef.current.y + deltaY))

      targetPanRef.current = { x: newPanX, y: newPanY }
      setPanOffset({ x: newPanX, y: newPanY })
    } else {
      // Rotation with calibrated luxury drag sensitivity
      const sensitivity = totalFrames / 800
      targetFrameRef.current = startFrameRef.current - deltaX * sensitivity
      velocityRef.current = (e.clientX - lastPointerXRef.current) / dt
    }

    lastPointerXRef.current = e.clientX
    lastPointerTimeRef.current = now
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    isInteractingRef.current = false
    isPanningRef.current = false
    if (containerRef.current && containerRef.current.hasPointerCapture(e.pointerId)) {
      containerRef.current.releasePointerCapture(e.pointerId)
    }
  }

  // Accumulator for discrete scroll steps
  const scrollAccumulatorRef = useRef<number>(0)

  // ULTRA-SLOW, CONTROLLED SCROLL & ZOOM WHEEL
  // Using native event listener to guarantee e.preventDefault() works and stops the page from scrolling
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleNativeWheel = (e: WheelEvent) => {
      e.preventDefault() // Absolutely prevent page scroll
      setIsAutoRotating(false)

      // Pinch-to-zoom or Ctrl+Wheel to Zoom
      if (e.ctrlKey || e.metaKey || currentZoomRef.current > 1.05) {
        const zoomDelta = -e.deltaY * 0.003
        setZoomScale((prev) => {
          const next = Math.max(1.0, Math.min(3.5, prev + zoomDelta))
          return parseFloat(next.toFixed(2))
        })
        return
      }

      // Discrete rotation: Snap target to integers to avoid resting on ghosted frames
      scrollAccumulatorRef.current += (e.deltaY || e.deltaX)
      const threshold = 120 // Increased threshold so you have to scroll more to change frames

      if (Math.abs(scrollAccumulatorRef.current) >= threshold) {
        const direction = Math.sign(scrollAccumulatorRef.current)
        // Move target by 1 frame cleanly
        targetFrameRef.current += direction
        scrollAccumulatorRef.current = 0
      }
    }

    container.addEventListener('wheel', handleNativeWheel, { passive: false })
    return () => {
      container.removeEventListener('wheel', handleNativeWheel)
    }
  }, [])

  // Double Click to Smart Zoom on Click Position
  const handleDoubleClick = (e: React.MouseEvent) => {
    if (zoomScale > 1.1) {
      // Reset zoom
      setZoomScale(1.0)
      targetPanRef.current = { x: 0, y: 0 }
      setPanOffset({ x: 0, y: 0 })
    } else {
      // Zoom in to 2.4x towards click position
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const clickX = e.clientX - rect.left - rect.width / 2
        const clickY = e.clientY - rect.top - rect.height / 2
        targetPanRef.current = { x: -clickX * 0.9, y: -clickY * 0.9 }
        setPanOffset(targetPanRef.current)
      }
      setZoomScale(2.4)
    }
  }

  // Quick zoom level setter
  const handleSetZoom = (level: number) => {
    setZoomScale(level)
    if (level === 1.0) {
      targetPanRef.current = { x: 0, y: 0 }
      setPanOffset({ x: 0, y: 0 })
    }
  }

  // Normalized progress (0.0 to 1.0) based on the React state frame
  const normalizedProgress = currentIntFrame / totalFrames
  const currentAngleDeg = Math.round(normalizedProgress * 360)

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onDoubleClick={handleDoubleClick}
      className={`relative w-full h-full select-none overflow-hidden touch-none flex items-center justify-center bg-gradient-to-b from-[#0e0e0e] via-[#070707] to-[#040404] ${className}`}
      style={{
        cursor: zoomScale > 1.05
          ? isInteractingRef.current ? 'grabbing' : 'grab'
          : isInteractingRef.current ? 'ew-resize' : 'grab',
      }}
    >
      {/* Cinematic Studio Backdrop & Pedestal Illumination */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(196,130,42,0.14)_0%,_rgba(0,0,0,0)_68%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_72%,_rgba(255,255,255,0.035)_0%,_rgba(0,0,0,0)_45%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/60" />
      </div>

      {/* Loading state overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/85 backdrop-blur-md gap-3">
          <div className="w-9 h-9 border-2 border-[#C4822A]/25 border-t-[#C4822A] rounded-full animate-spin" />
          <span className="font-code text-[9px] tracking-[0.35em] text-white/60 uppercase">
            CALIBRANDO SECUENCIA 360° ({loadedCount}/{totalFrames})
          </span>
        </div>
      )}

      {/* High-DPI Canvas Viewport */}
      <div className="w-full h-full flex items-center justify-center relative z-10 pointer-events-none">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain"
        />
      </div>

      {/* CTA On Last Frame */}
      {currentIntFrame === rawImages.length - 1 && zoomScale <= 1.05 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-30 animate-fade-in pointer-events-auto">
          <h3 className="font-bebas text-5xl text-white tracking-widest mb-2 uppercase">{product.name}</h3>
          <p className="font-code text-xs text-white/50 tracking-widest mb-6 uppercase">
            {product.frameColor} - {product.colors.find(c => c.hex.toLowerCase() === activeColor.toLowerCase())?.label || 'Color'}
          </p>
          <button 
            onClick={(e) => {
              e.stopPropagation()
              const colorObj = product.colors.find(c => c.hex.toLowerCase() === activeColor.toLowerCase())
              const colorLabel = colorObj ? colorObj.label : 'Classic'
              addToCart({
                id: product.id,
                code: product.code,
                name: product.name,
                slug: product.slug,
                price: product.price,
                image: product.image,
                model: product.model,
                color: activeColor,
                colorLabel: colorLabel
              })
              setIsCartOpen(true)
            }}
            className="flex items-center gap-3 bg-white text-black px-10 py-4 font-code text-[10px] tracking-widest font-bold hover:bg-[#C4822A] hover:text-white transition-colors"
          >
            <ShoppingBag size={14} />
            AÑADIR AL CARRITO
          </button>
        </div>
      )}

      {/* Interactive Feature Hotspots */}
      {showHotspots && zoomScale <= 1.2 && !isLoading && (
        <div className="absolute inset-0 pointer-events-none z-20">
          {dynamicHotspots.map((spot) => {
            // Check if current progress falls within hotspot's visible frame range
            const [min, max] = spot.frameRange
            let isVisible = false
            if (min <= max) {
              isVisible = normalizedProgress >= min && normalizedProgress <= max
            } else {
              // Handle wrap-around (e.g. [0.8, 0.2])
              isVisible = normalizedProgress >= min || normalizedProgress <= max
            }

            if (!isVisible) return null

            const isSelected = activeHotspot?.id === spot.id

            return (
              <div
                key={spot.id}
                style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto transition-all duration-300 animate-fade-in"
              >
                <button
                  onPointerDown={(e) => {
                    // Prevent container from capturing the pointer so onClick works!
                    e.stopPropagation()
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    setActiveHotspot(isSelected ? null : spot)
                  }}
                  className="relative group flex items-center justify-center focus:outline-none"
                >
                  <span className="absolute w-8 h-8 rounded-full bg-[#C4822A]/40 animate-ping" />
                  <span className="relative w-6 h-6 rounded-full bg-black/90 border border-[#C4822A] text-white flex items-center justify-center shadow-[0_0_14px_rgba(196,130,42,0.9)] group-hover:scale-125 transition-transform">
                    <Sparkles size={11} className="text-[#C4822A]" />
                  </span>
                </button>

                {/* Hotspot Info Panel */}
                {isSelected && (
                  <div className="absolute left-1/2 -translate-x-1/2 md:translate-x-4 bottom-10 md:bottom-auto md:-top-4 w-[260px] md:w-[280px] p-5 bg-black/95 border border-[#C4822A]/40 backdrop-blur-xl rounded-sm shadow-[0_10px_30px_rgba(0,0,0,0.9)] z-50 text-left animate-slide-up">
                    <div className="flex items-center justify-between mb-2 border-b border-white/10 pb-2">
                      <span className="font-code text-[9px] tracking-[0.25em] text-[#C4822A] uppercase font-bold">
                        {spot.tag}
                      </span>
                      <button
                        onPointerDown={(e) => {
                          e.stopPropagation()
                        }}
                        onClick={(e) => {
                          e.stopPropagation()
                          e.preventDefault()
                          setActiveHotspot(null)
                        }}
                        className="text-white/40 hover:text-white p-1 leading-none"
                      >
                        ✕
                      </button>
                    </div>
                    <h4 className="font-code text-[12px] md:text-[14px] text-white font-bold tracking-wide uppercase mb-2">
                      {spot.title}
                    </h4>
                    <p className="font-code text-[10px] md:text-[11px] text-white/80 leading-relaxed">
                      {spot.desc}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* TOP LEFT: Professional Studio HUD Badge */}
      <div className="absolute top-4 left-4 z-30 flex items-center gap-2.5 pointer-events-auto">
        <div className="flex items-center gap-2 bg-black/70 border border-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full">
          <div className="w-2 h-2 rounded-full bg-[#C4822A] shadow-[0_0_8px_#C4822A] animate-pulse" />
          <span className="font-code text-[8px] tracking-[0.3em] text-white/80 uppercase">
            360° SECUENCIA HD · {currentAngleDeg}°
          </span>
        </div>

        {zoomScale > 1.05 && (
          <div className="flex items-center gap-1.5 bg-[#C4822A]/20 border border-[#C4822A]/40 backdrop-blur-md px-3 py-1.5 rounded-full animate-fade-in">
            <Move size={10} className="text-[#C4822A]" />
            <span className="font-code text-[8px] tracking-[0.25em] text-[#C4822A] uppercase font-bold">
              MODO LUPA ({Math.round(zoomScale * 100)}%) · ARRASTRA PARA EXPLORAR
            </span>
          </div>
        )}
      </div>

      {/* TOP RIGHT: Luxury Tool Control Bar */}
      <div className="absolute top-4 right-4 z-30 flex items-center gap-2 pointer-events-auto">
        {/* Toggle Hotspots */}
        <button
          onClick={() => setShowHotspots(!showHotspots)}
          title={showHotspots ? 'Ocultar puntos de interés' : 'Mostrar detalles y materiales'}
          className={`p-2.5 border rounded-sm backdrop-blur-md transition-all ${
            showHotspots
              ? 'bg-white text-black border-white'
              : 'bg-black/60 text-white/50 border-white/10 hover:border-white/40 hover:text-white'
          }`}
        >
          <Sparkles size={14} />
        </button>

        {/* Reset View Button */}
        {(zoomScale > 1.05 || Math.abs(panOffset.x) > 5) && (
          <button
            onClick={() => handleSetZoom(1.0)}
            title="Restablecer zoom 1:1"
            className="p-2.5 bg-black/60 text-white/70 border border-white/20 hover:border-white/60 hover:text-white rounded-sm backdrop-blur-md transition-all"
          >
            <RefreshCw size={14} />
          </button>
        )}
      </div>

      {/* PROFESSIONAL MULTI-LEVEL ZOOM CONTROLLER (Right Float Dock) */}
      <div className="absolute right-4 bottom-16 z-30 flex flex-col items-center gap-1.5 bg-black/80 border border-white/15 backdrop-blur-xl p-1.5 rounded-lg shadow-2xl pointer-events-auto">
        {/* Zoom In Button */}
        <button
          onClick={() => handleSetZoom(Math.min(3.5, zoomScale + 0.5))}
          title="Acercar (Zoom +)"
          className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded transition-all focus:outline-none"
        >
          <ZoomIn size={15} />
        </button>

        {/* Quick Zoom Multiplier Badges */}
        <div className="flex flex-col gap-1 py-1 border-y border-white/10 my-0.5">
          {[
            { label: '3.0x', val: 3.0 },
            { label: '2.0x', val: 2.0 },
            { label: '1.0x', val: 1.0 },
          ].map((z) => (
            <button
              key={z.label}
              onClick={() => handleSetZoom(z.val)}
              className={`font-code text-[8px] tracking-wider px-1.5 py-1 rounded transition-all ${
                Math.abs(zoomScale - z.val) < 0.25
                  ? 'bg-[#C4822A] text-black font-bold'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              {z.label}
            </button>
          ))}
        </div>

        {/* Zoom Out Button */}
        <button
          onClick={() => handleSetZoom(Math.max(1.0, zoomScale - 0.5))}
          title="Alejar (Zoom -)"
          className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded transition-all focus:outline-none"
        >
          <ZoomOut size={15} />
        </button>
      </div>

      {/* Internal Controls Overlay if not hidden */}
      {!hideControls && (
        <>
          {/* Preset Buttons */}
          <div className="absolute top-16 right-4 flex flex-col gap-1.5 z-20 pointer-events-auto">
            {Object.entries(VIEW_PRESETS).map(([key, info]) => (
              <button
                key={key}
                onClick={() => setInternalView(key)}
                className={`font-code text-[9px] tracking-widest px-3.5 py-2 border transition-all uppercase rounded-sm ${
                  activeView === key
                    ? 'bg-white text-black border-white font-bold'
                    : 'bg-black/60 text-white/40 border-white/10 hover:border-white/40 hover:text-white'
                }`}
              >
                {key}
              </button>
            ))}
          </div>

          {/* Color Selector */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20 pointer-events-auto bg-black/70 border border-white/15 backdrop-blur-md px-4 py-2.5 rounded-full">
            {FRAME_COLORS.map((c) => (
              <button
                key={c.label}
                title={c.label}
                onClick={() => setInternalColor(c.hex)}
                style={{ backgroundColor: c.hex }}
                className={`w-5 h-5 rounded-full border-2 transition-all ${
                  activeColor === c.hex
                    ? 'border-white scale-125 shadow-[0_0_12px_rgba(255,255,255,0.7)]'
                    : 'border-white/20 hover:border-white/60'
                }`}
              />
            ))}
          </div>
        </>
      )}

      {/* BOTTOM SCRUBBER & DUAL-MODE INTERACTION FOOTER */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-20 select-none">
        {/* Precision Progress Track */}
        <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden relative backdrop-blur-md border border-white/5">
          <div
            className="absolute top-0 bottom-0 bg-[#C4822A] rounded-full shadow-[0_0_8px_#C4822A] transition-all duration-75"
            style={{
              left: `${normalizedProgress * 100}%`,
              width: '14%',
              transform: 'translateX(-50%)',
            }}
          />
        </div>

        <div className="flex items-center gap-2">
          <p className="font-code text-[8px] tracking-[0.32em] text-white/40 uppercase whitespace-nowrap">
            {zoomScale > 1.05
              ? 'ARRASTRA PARA DESPLAZAR · DOBLE CLIC PARA REAJUSTAR'
              : 'SCROLL LENTO O ARRASTRA PARA GIRAR 360° · DOBLE CLIC PARA ZOOM'}
          </p>
        </div>
      </div>
    </div>
  )
}


