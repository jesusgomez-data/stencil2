'use client'

import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'

// Evita la transicion en la primera carga (solo entre paginas)
let firstLoad = true

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function Template({ children }: { children: React.ReactNode }) {
  // El inicializador no debe mutar el flag (Strict Mode lo ejecuta dos veces)
  const [animate] = useState(() => !firstLoad)
  useEffect(() => {
    firstLoad = false
  }, [])

  if (!animate) {
    return <div className="w-full flex-1 flex flex-col min-h-screen">{children}</div>
  }

  return (
    <>
      {/* Barra de progreso fina arriba */}
      <motion.div
        aria-hidden
        className="fixed top-0 left-0 right-0 h-[2px] z-[9999] bg-white origin-left pointer-events-none"
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{ scaleX: 1, opacity: [1, 1, 0] }}
        transition={{ duration: 0.8, ease: EASE, times: [0, 0.7, 1] }}
      />
      {/* Contenido: blur + escala + fundido */}
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.985, filter: 'blur(14px)' }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.75, ease: EASE }}
        className="w-full flex-1 flex flex-col min-h-screen"
      >
        {children}
      </motion.div>
    </>
  )
}
