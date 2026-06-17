'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function EnvioPage() {
  return (
    <div className="bg-black min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-6 lg:px-10 max-w-3xl mx-auto w-full text-left">
        <div className="border-b border-white/[0.07] pb-6 mb-10">
          <p className="font-code text-[9px] tracking-[0.35em] text-white/30 uppercase mb-2">POLÍTICA DE ENTREGAS</p>
          <h1 className="font-bebas text-[42px] tracking-wide text-white uppercase leading-none">ENVÍOS Y DEVOLUCIONES</h1>
        </div>

        <div className="space-y-8 font-code uppercase text-white/50 text-[11px] leading-relaxed">
          <div>
            <h3 className="font-bold text-white mb-2 tracking-wider">MÉTODOS Y COSTES DE ENVÍO</h3>
            <p className="text-white/40 mb-2">· ENVÍO ESTÁNDAR PENINSULAR (3-5 DÍAS): 4.95 EUR (GRATIS PARA PEDIDOS SUPERIORES A 50 EUR).</p>
            <p className="text-white/40">· ENVÍO EXPRESS PENINSULAR (24-48 HORAS): 7.95 EUR.</p>
          </div>

          <div>
            <h3 className="font-bold text-white mb-2 tracking-wider">SEGUIMIENTO DEL PEDIDO</h3>
            <p className="text-white/40">UNA VEZ REALIZADA LA COMPRA, SE TE ENVIARÁ UN ENLACE DE SEGUIMIENTO EN EL MOMENTO EN QUE EL PAQUETE SALGA DE NUESTRO ALMACÉN CENTRAL.</p>
          </div>

          <div>
            <h3 className="font-bold text-white mb-2 tracking-wider">DEVOLUCIONES</h3>
            <p className="text-white/40 mb-2">SI NO ESTÁS SATISFECHO CON TU COMPRA, PUEDES SOLICITAR UNA DEVOLUCIÓN DENTRO DE LOS 14 DÍAS NATURALES POSTERIORES A LA RECEPCIÓN.</p>
            <p className="text-white/40">EL PRODUCTO DEBE CONSERVARSE EN SU ESTADO ORIGINAL, SIN USAR Y EN SU CAJA ORIGINAL. LAS DEVOLUCIONES DE PENÍNSULA NO TIENEN NINGÚN COSTE PARA EL CLIENTE.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
