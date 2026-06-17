'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function PrivacidadPage() {
  return (
    <div className="bg-black min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-6 lg:px-10 max-w-3xl mx-auto w-full text-left">
        <div className="border-b border-white/[0.07] pb-6 mb-10">
          <p className="font-code text-[9px] tracking-[0.35em] text-white/30 uppercase mb-2">LEGAL</p>
          <h1 className="font-bebas text-[42px] tracking-wide text-white uppercase leading-none">POLÍTICA DE PRIVACIDAD</h1>
        </div>

        <div className="space-y-6 font-code uppercase text-white/50 text-[10px] leading-relaxed">
          <p>1. RESPONSABLE DEL TRATAMIENTO: LOS DATOS DE CARÁCTER PERSONAL QUE NOS FACILITES SERÁN TRATADOS CONFORME A LA LEY ORGÁNICA DE PROTECCIÓN DE DATOS POR PARTE DE STENCIL2.</p>
          <p>2. FINALIDAD: RECOPILAMOS TUS DATOS ÚNICAMENTE PARA LA GESTIÓN DE ENVÍO DE TUS COMPRAS Y LA PRESTACIÓN DE NUESTRO PROGRAMA DE LEALTAD.</p>
          <p>3. DERECHOS: TIENES DERECHO A ACCEDER, RECTIFICAR, LIMITAR O ELIMINAR TUS DATOS PERSONALES EN CUALQUIER MOMENTO ENVIANDO UN CORREO A SUPPORT@STENCIL2.COM.</p>
          <p>4. SEGURIDAD: TODA LA INFORMACIÓN DE PAGO VIAJA DE FORMA ENCRIPTADA DIRECTAMENTE A NUESTRO PROVEEDOR DE PAGOS HOMOLOGADO (STRIPE).</p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
