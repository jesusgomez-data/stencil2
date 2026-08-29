'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

interface IntroAnimationProps {
  onComplete?: () => void
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [stage, setStage] = useState<1 | 2>(1)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Stage 1: Grenade logo (0s to 1.3s)
    const timer1 = setTimeout(() => {
      setStage(2)
    }, 1300)

    // Stage 2: Script logo (1.3s to 2.8s)
    const timer2 = setTimeout(() => {
      setIsVisible(false)
      if (onComplete) onComplete()
    }, 2800)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [onComplete])

  const handleSkip = () => {
    setIsVisible(false)
    if (onComplete) onComplete()
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="intro-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center select-none overflow-hidden"
          onClick={handleSkip}
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-[500px] h-[500px] bg-white/[0.03] rounded-full blur-3xl animate-pulse" />
          </div>

          {/* Grid lines overlay */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />

          {/* Skip Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleSkip()
            }}
            className="absolute top-8 right-8 z-20 font-code text-[9px] tracking-[0.3em] text-white/30 hover:text-white border border-white/10 hover:border-white/30 px-4 py-2 rounded-full uppercase transition-all duration-300 bg-black/40 backdrop-blur-sm"
          >
            SALTAR →
          </button>

          {/* Center Stage Animation */}
          <div className="relative flex flex-col items-center justify-center min-h-[300px] w-full px-6">
            <AnimatePresence mode="wait">
              {stage === 1 && (
                <motion.div
                  key="stage-grenade"
                  initial={{ opacity: 0, scale: 0.85, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 1.15, filter: 'blur(6px)' }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center justify-center gap-6"
                >
                  <div className="relative w-28 h-44 sm:w-36 sm:h-56 drop-shadow-[0_0_25px_rgba(255,255,255,0.15)]">
                    <Image
                      src="/images/logo-grenade-white.png"
                      alt="STENCIL2 Grenade Logo"
                      fill
                      priority
                      className="object-contain"
                    />
                  </div>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="font-code text-[10px] tracking-[0.45em] text-white/40 uppercase"
                  >
                    STENCIL2
                  </motion.p>
                </motion.div>
              )}

              {stage === 2 && (
                <motion.div
                  key="stage-script"
                  initial={{ opacity: 0, scale: 0.9, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 1.08, filter: 'blur(10px)' }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center justify-center gap-6"
                >
                  <div className="relative w-72 h-36 sm:w-96 sm:h-48 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                    <Image
                      src="/images/logo-script-white.png"
                      alt="Stencil 2 Official Script Logo"
                      fill
                      priority
                      className="object-contain"
                    />
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.5 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <span className="font-code text-[9px] tracking-[0.4em] text-[#C4822A] uppercase">
                      JOINING CULTURE
                    </span>
                    <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#C4822A]/50 to-transparent" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Loading Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
            <div className="w-32 h-[1.5px] bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 3.2, ease: 'easeInOut' }}
                className="h-full bg-white rounded-full"
              />
            </div>
            <span className="font-code text-[8px] tracking-[0.3em] text-white/20 uppercase">
              EST. 2026
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
