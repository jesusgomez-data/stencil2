'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function TerminosPage() {
  return (
    <div className="bg-black min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-6 lg:px-10 max-w-3xl mx-auto w-full text-left">
        <div className="border-b border-white/[0.07] pb-6 mb-10">
          <p className="font-code text-[9px] tracking-[0.35em] text-white/30 uppercase mb-2">LEGAL</p>
          <h1 className="font-bebas text-[42px] tracking-wide text-white uppercase leading-none">TÉRMINOS Y CONDICIONES</h1>
        </div>

        <div className="space-y-6 font-code uppercase text-white/50 text-[10px] leading-relaxed">
          <p>1. OBJETO: ESTE DOCUMENTO ESTABLECE LAS CONDICIONES QUE REGULAN EL USO DE ESTA PÁGINA WEB Y LA COMPRA DE PRODUCTOS EN LA MISMA.</p>
          <p>2. PROPIEDAD INTELECTUAL: TODOS LOS DISEÑOS, NOMBRES DE PRODUCTOS, IMÁGENES Y LOGOTIPOS PERTENECEN EN EXCLUSIVA A STENCIL2.</p>
          <p>3. COMPRAS: AL REALIZAR UN PEDIDO, TE COMPROMETES A FACILITAR DATOS VERÍDICOS DE ENVÍO Y CONTACTO. EL CONTRATO DE COMPRA SE PERFECCIONA EN EL MOMENTO EN QUE SE PROCESA EL PAGO CON ÉXITO.</p>
          <p>4. PRECIOS: TODOS LOS PRECIOS EXPRESADOS EN LA WEB TIENEN EL IVA DEL 21% INCLUIDO Y SE FACTURAN EN EUROS (EUR).</p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
