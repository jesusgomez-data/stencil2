'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function FAQPage() {
  const faqs = [
    {
      q: '¿CUÁNTO TARDA EN LLEGAR MI PEDIDO?',
      a: 'LOS ENVÍOS ESTÁNDAR TARDAN ENTRE 3 Y 5 DÍAS LABORABLES EN ESPAÑA PENINSULAR. LOS ENVÍOS EXPRESS SE ENTREGAN EN 24-48 HORAS.'
    },
    {
      q: '¿CÓMO PUEDO DEVOLVER UN ARTÍCULO?',
      a: 'DISPONES DE 14 DÍAS NATURALES DESDE LA RECEPCIÓN. EL PRODUCTO DEBE ESTAR SIN USAR Y EN SU EMBALAJE ORIGINAL. LAS DEVOLUCIONES SON GRATUITAS EN PENÍNSULA.'
    },
    {
      q: '¿DE QUÉ MATERIALES ESTÁN HECHAS LAS GAFAS?',
      a: 'NUESTRAS GAFAS ESTÁN FABRICADAS CON ACETATO ORGÁNICO ITALIANO CORTADO Y PULIDO A MANO, O BIEN CON TR90 FLEXIBLE EN NUESTRA GAMA DEPORTIVA.'
    },
    {
      q: '¿LAS LENTES TIENEN PROTECCIÓN UV?',
      a: 'SÍ, TODAS NUESTRAS LENTES TIENEN HOMOLOGACIÓN UV400 DE CATEGORÍA 3 Y SON POLARIZADAS PARA REDUCIR LOS DESTELLOS Y LA FATIGA OCULAR.'
    }
  ]

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-6 lg:px-10 max-w-3xl mx-auto w-full text-left">
        <div className="border-b border-white/[0.07] pb-6 mb-10">
          <p className="font-code text-[9px] tracking-[0.35em] text-white/30 uppercase mb-2">SOPORTE</p>
          <h1 className="font-bebas text-[42px] tracking-wide text-white uppercase leading-none">PREGUNTAS FRECUENTES</h1>
        </div>

        <div className="space-y-8 font-code uppercase text-white/50 text-[11px] leading-relaxed">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border-b border-white/[0.05] pb-6 last:border-0">
              <h3 className="font-bold text-white mb-2 tracking-wider">{faq.q}</h3>
              <p className="text-white/40 leading-normal">{faq.a}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
