import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Scroll3DViewer from '@/components/Scroll3DViewer'
import Link from 'next/link'

export default function Prototipo3DPage() {
  // Generate a sequence of frames for the 3D scroll effect.
  // We use the classic-blue model which has 11 distinct angles.
  // To make a smooth back-and-forth rotation, we can go 1 -> 11, then 10 -> 2
  
  const forwardFrames = Array.from({ length: 11 }, (_, i) => `/images/gafas/classic-blue-${i + 1}.png`)
  const backwardFrames = Array.from({ length: 9 }, (_, i) => `/images/gafas/classic-blue-${10 - i}.png`)
  
  const frames = [...forwardFrames, ...backwardFrames]

  return (
    <div className="bg-black min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 w-full relative">
        {/* Intro Section to encourage scrolling */}
        <section className="h-screen w-full flex flex-col items-center justify-center text-center px-6 relative z-10 bg-black">
          <p className="font-code text-[10px] tracking-[0.4em] text-[#C4822A] uppercase mb-4">
            Laboratorio Experimental
          </p>
          <h1 className="font-bebas text-6xl md:text-8xl text-white tracking-wider uppercase mb-6 leading-none">
            EXPERIENCIA INMERSIVA
          </h1>
          <p className="font-code text-xs md:text-sm text-white/50 max-w-md mx-auto mb-12 leading-relaxed">
            Descubre nuestro sistema de renderizado en tiempo real basado en scroll.
            Un vídeo construido a partir de fotografías de alta resolución sin la sobrecarga de un modelo 3D WebGL.
          </p>
          
          <div className="animate-bounce flex flex-col items-center gap-2 opacity-70">
            <span className="font-code text-[9px] tracking-[0.3em] text-white uppercase">Sigue Bajando</span>
            <div className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent" />
          </div>
        </section>

        {/* The 3D Scroll Component */}
        <Scroll3DViewer frames={frames} />

        {/* Outro Section */}
        <section className="h-screen w-full flex flex-col items-center justify-center text-center px-6 bg-[#050505] relative z-10 border-t border-white/10">
          <h2 className="font-bebas text-5xl md:text-7xl text-white tracking-wide uppercase mb-6">
            Rendimiento Perfecto
          </h2>
          <p className="font-code text-xs text-white/50 max-w-md mx-auto mb-10 leading-relaxed">
            Cero dependencias pesadas. Cero WebGL. 100% fotográfico.
            ¿Te gustaría implementar esto en toda la tienda para cada producto?
          </p>
          <Link href="/tienda" className="font-code text-[10px] tracking-widest text-black bg-white px-8 py-4 hover:bg-[#C4822A] hover:text-white transition-all uppercase font-bold">
            VOLVER A LA TIENDA
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  )
}
