'use client'

import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'

// Evita la transicion en la primera carga (solo entre paginas)
let firstLoad = true

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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="w-full flex-1 flex flex-col min-h-screen"
    >
      {children}
    </motion.div>
  )
}
