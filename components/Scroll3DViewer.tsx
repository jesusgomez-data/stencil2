'use client'

import { useEffect, useRef, useState } from 'react'
import { Sparkles } from 'lucide-react'

interface Scroll3DViewerProps {
  frames: string[]
}

interface Hotspot {
  id: string
  progressRange: [number, number] // when to show (scroll progress 0 to 1)
  x: number // percentage 0-100
  y: number // percentage 0-100
  title: string
  desc: string
  tag: string
}

// Defined hotspots for specific parts of the scroll
const HOTSPOTS: Hotspot[] = [
  {
    id: 'material',
    progressRange: [0.15, 0.35],
    x: 45,
    y: 35,
    title: 'Acetato Premium',
    desc: 'Bloques de acetato de alta resistencia con acabado brillante artesanal.',
    tag: 'MATERIAL'
  },
  {
    id: 'lenses',
    progressRange: [0.05, 0.25],
    x: 60,
    y: 50,
    title: 'Lentes Polarizadas',
    desc: 'Filtro UV400 categoría 3 con tratamiento antirreflejante y antirrayado.',
    tag: 'ÓPTICA'
  },
  {
    id: 'hinge',
    progressRange: [0.45, 0.65],
    x: 35,
    y: 45,
    title: 'Bisagra Reforzada',
    desc: 'Estructura interna de acero inoxidable de alta resistencia.',
    tag: 'INGENIERÍA'
  },
  {
    id: 'logo',
    progressRange: [0.60, 0.85],
    x: 65,
    y: 48,
    title: 'Insignia Grabada',
    desc: 'Emblema grabado en latón pulido con resistencia a la abrasión.',
    tag: 'DETALLES'
  },
]

export default function Scroll3DViewer({ frames }: Scroll3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  const [images, setImages] = useState<HTMLImageElement[]>([])
  const [loadedCount, setLoadedCount] = useState(0)
  const [progress, setProgress] = useState(0)
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null)
  
  const totalFrames = frames.length

  // Pre-load all images
  useEffect(() => {
    let loaded = 0
    const loadedImages: HTMLImageElement[] = []
    
    frames.forEach((src, idx) => {
      const img = new window.Image()
      img.src = src
      img.onload = () => {
        loaded++
        setLoadedCount(loaded)
        if (loaded === totalFrames) {
          setImages(loadedImages)
          drawFrame(0, loadedImages) // Draw initial frame
        }
      }
      loadedImages[idx] = img
    })
  }, [frames])

  // Scroll tracking and Canvas drawing
  const drawFrame = (scrollProgress: number, imgs: HTMLImageElement[] = images) => {
    if (imgs.length === 0) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Smoothing the frame selection
    const rawFrame = scrollProgress * (imgs.length - 1)
    const frameIndex = Math.min(imgs.length - 1, Math.max(0, Math.floor(rawFrame)))
    
    // We can crossfade to the next frame for ultra smoothness
    const nextFrameIndex = Math.min(imgs.length - 1, frameIndex + 1)
    const blendRatio = rawFrame - frameIndex
    
    const currentImage = imgs[frameIndex]
    const nextImage = imgs[nextFrameIndex]
    
    if (!currentImage || currentImage.naturalWidth === 0) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
    }

    ctx.save()
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Calculate dimensions to fit nicely in canvas
    const imgAspect = currentImage.naturalWidth / currentImage.naturalHeight
    const canvasAspect = rect.width / rect.height
    let drawW, drawH
    
    // Make responsive: use more space on mobile
    const isMobile = window.innerWidth < 768
    const scaleFactor = isMobile ? 1.0 : 0.8
    const widthFactor = isMobile ? 1.0 : 0.9

    if (canvasAspect > imgAspect) {
      drawH = rect.height * scaleFactor
      drawW = drawH * imgAspect
    } else {
      drawW = rect.width * widthFactor
      drawH = drawW / imgAspect
    }

    // Camera movements based on scrollProgress
    let scale = 1.0
    let offsetY = 0
    let offsetX = 0
    
    // Zoom sequence in the middle of the scroll (40% to 60%)
    if (scrollProgress > 0.35 && scrollProgress <= 0.65) {
      const zoomProgress = (scrollProgress - 0.35) / 0.30 // normalized 0 to 1 over this segment
      // Sine wave for smooth in and out zoom
      scale = 1.0 + Math.sin(zoomProgress * Math.PI) * (isMobile ? 0.3 : 0.6) 
      offsetY = Math.sin(zoomProgress * Math.PI) * (isMobile ? 20 : 40)
      offsetX = Math.sin(zoomProgress * Math.PI) * (isMobile ? -10 : -20)
    }

    ctx.translate(rect.width / 2 + offsetX, rect.height / 2 + offsetY)
    ctx.scale(scale, scale)
    ctx.translate(-rect.width / 2, -rect.height / 2)

    const drawX = (rect.width - drawW) / 2
    const drawY = (rect.height - drawH) / 2

    // Shadow
    const shadowGrad = ctx.createRadialGradient(
      rect.width / 2, rect.height / 2 + drawH * 0.45, 10,
      rect.width / 2, rect.height / 2 + drawH * 0.45, drawW * 0.55
    )
    shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.5)')
    shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = shadowGrad
    ctx.fillRect(drawX - 50, rect.height / 2, drawW + 100, rect.height / 2 + 100)

    // Draw the glasses (current frame)
    ctx.globalAlpha = 1.0
    ctx.drawImage(currentImage, drawX, drawY, drawW, drawH)
    
    // Blend the next frame for absolute smoothness
    if (blendRatio > 0.05 && nextImage && nextImage.complete && nextImage.naturalWidth > 0) {
      ctx.globalAlpha = blendRatio
      ctx.drawImage(nextImage, drawX, drawY, drawW, drawH)
    }

    ctx.restore()
  }

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      
      const rect = containerRef.current.getBoundingClientRect()
      
      const scrollableDistance = rect.height - window.innerHeight
      let p = -rect.top / scrollableDistance
      p = Math.min(1, Math.max(0, p))
      
      setProgress(p)
      
      requestAnimationFrame(() => {
        drawFrame(p)
      })
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', () => drawFrame(progress))
    handleScroll()
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', () => drawFrame(progress))
    }
  }, [images, progress])

  // Determine which text to show based on progress
  let activeTextIndex = 0
  if (progress > 0.15 && progress <= 0.45) activeTextIndex = 1
  else if (progress > 0.45 && progress <= 0.75) activeTextIndex = 2
  else if (progress > 0.75) activeTextIndex = 3

  return (
    // Increased height to 1200vh for a much slower, longer, and appreciable scroll experience
    <section ref={containerRef} className="relative w-full h-[1200vh] bg-black">
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
        
        {loadedCount < totalFrames && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black gap-4">
            <div className="w-8 h-8 border-2 border-[#C4822A]/30 border-t-[#C4822A] rounded-full animate-spin" />
            <p className="font-code text-white/50 tracking-widest text-xs uppercase">
              Cargando Secuencia HD ({loadedCount}/{totalFrames})...
            </p>
          </div>
        )}

        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain pointer-events-none z-10"
        />

        {/* Hotspots Overlay */}
        <div className="absolute inset-0 z-30 pointer-events-none">
          {HOTSPOTS.map((spot) => {
            const isVisible = progress >= spot.progressRange[0] && progress <= spot.progressRange[1]
            if (!isVisible) return null

            const isSelected = activeHotspot?.id === spot.id

            return (
              <div
                key={spot.id}
                style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto transition-all duration-500 animate-fade-in"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveHotspot(isSelected ? null : spot)
                  }}
                  className="relative group flex items-center justify-center focus:outline-none"
                >
                  <span className="absolute w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#C4822A]/30 animate-ping" />
                  <span className="relative w-5 h-5 md:w-6 md:h-6 rounded-full bg-black/90 border-2 border-[#C4822A] text-white flex items-center justify-center shadow-[0_0_15px_rgba(196,130,42,0.8)] group-hover:scale-110 transition-transform">
                    <Sparkles size={12} className="text-[#C4822A]" />
                  </span>
                </button>

                {/* Hotspot Popup Tooltip */}
                {isSelected && (
                  <div className="absolute left-1/2 -translate-x-1/2 md:translate-x-4 top-10 md:-top-4 w-[240px] md:w-[280px] p-4 bg-black/95 border border-white/20 backdrop-blur-xl rounded-sm shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-40 text-left animate-slide-up">
                    <div className="flex items-center justify-between mb-2 border-b border-white/10 pb-2">
                      <span className="font-code text-[9px] tracking-[0.25em] text-[#C4822A] uppercase font-bold">
                        {spot.tag}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setActiveHotspot(null)
                        }}
                        className="text-white/40 hover:text-white p-1"
                      >
                        ✕
                      </button>
                    </div>
                    <h4 className="font-code text-xs md:text-sm text-white font-bold tracking-wide uppercase mb-1.5">
                      {spot.title}
                    </h4>
                    <p className="font-code text-[10px] md:text-xs text-white/70 leading-relaxed">
                      {spot.desc}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Dynamic Storytelling Text Overlay */}
        <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-center px-6 md:px-32">
          
          <div className={`transition-opacity duration-700 absolute top-[15%] md:top-auto md:left-32 ${activeTextIndex === 0 ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
            <span className="font-code text-[9px] md:text-[10px] tracking-[0.4em] text-[#C4822A] uppercase drop-shadow-md">Vista 360°</span>
            <h2 className="font-bebas text-4xl md:text-7xl text-white tracking-wide mt-2 drop-shadow-lg">KSO-KC CLASSIC</h2>
            <p className="font-code text-[10px] md:text-xs text-white/70 max-w-[280px] md:max-w-sm mt-3 md:mt-4 leading-relaxed drop-shadow-md">
              Desliza suavemente para explorar cada ángulo. Diseñado en acetato premium con núcleo reforzado.
            </p>
          </div>

          <div className={`transition-opacity duration-700 absolute bottom-[15%] md:bottom-auto md:right-32 md:text-right ${activeTextIndex === 1 ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
            <span className="font-code text-[9px] md:text-[10px] tracking-[0.4em] text-white/60 uppercase drop-shadow-md">Ergonomía</span>
            <h2 className="font-bebas text-4xl md:text-6xl text-white tracking-wide mt-2 drop-shadow-lg">ÁNGULO PERFECTO</h2>
            <p className="font-code text-[10px] md:text-xs text-white/70 max-w-[280px] md:max-w-sm mt-3 md:mt-4 leading-relaxed md:ml-auto drop-shadow-md">
              Curvatura meticulosamente diseñada para ajustarse al contorno facial y bloquear reflejos periféricos.
            </p>
          </div>

          <div className={`transition-opacity duration-700 absolute top-[15%] md:top-auto md:left-32 ${activeTextIndex === 2 ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
            <span className="font-code text-[9px] md:text-[10px] tracking-[0.4em] text-[#C4822A] uppercase drop-shadow-md">Estructura</span>
            <h2 className="font-bebas text-4xl md:text-6xl text-white tracking-wide mt-2 drop-shadow-lg">5 DIENTES DE ACERO</h2>
            <p className="font-code text-[10px] md:text-xs text-white/70 max-w-[280px] md:max-w-sm mt-3 md:mt-4 leading-relaxed drop-shadow-md">
              Bisagras embutidas directamente en el acetato para garantizar años de apertura sin desgaste.
            </p>
          </div>

          <div className={`transition-opacity duration-700 absolute bottom-[15%] md:bottom-auto md:right-32 md:text-right ${activeTextIndex === 3 ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
            <span className="font-code text-[9px] md:text-[10px] tracking-[0.4em] text-white/60 uppercase drop-shadow-md">Siguiente Paso</span>
            <h2 className="font-bebas text-4xl md:text-6xl text-white tracking-wide mt-2 drop-shadow-lg">CATÁLOGO COMPLETO</h2>
            <p className="font-code text-[10px] md:text-xs text-white/70 max-w-[280px] md:max-w-sm mt-3 md:mt-4 leading-relaxed md:ml-auto drop-shadow-md">
              Continúa bajando para descubrir más detalles, colores disponibles y opciones de lente.
            </p>
          </div>
        </div>

        {/* Global scroll indicator at the very bottom */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60 z-20 pointer-events-none">
          <span className="font-code text-[7px] md:text-[8px] tracking-[0.3em] text-white uppercase">Sigue Bajando</span>
          <div className="w-[1px] h-8 md:h-12 bg-gradient-to-b from-white to-transparent" />
        </div>
      </div>
    </section>
  )
}
