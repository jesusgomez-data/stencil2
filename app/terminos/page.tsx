'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { ShieldCheck, Truck, RefreshCw, Scale } from 'lucide-react'

export default function TerminosPage() {
  return (
    <div className="bg-black min-h-screen flex flex-col text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-6 lg:px-10 max-w-4xl mx-auto w-full text-left">
        {/* Header */}
        <div className="border-b border-white/[0.08] pb-6 mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-code text-[9px] tracking-[0.35em] text-[#C4822A] uppercase font-bold">
              CONDICIONES GENERALES DE CONTRATACIÓN Y VENTA
            </span>
            <span className="font-code text-[9px] text-white/30 uppercase">
              · RDL 1/2007 DE CONSUMIDORES
            </span>
          </div>
          <h1 className="font-bebas text-4xl sm:text-5xl tracking-wide text-white uppercase leading-none">
            TÉRMINOS Y CONDICIONES
          </h1>
          <p className="font-code text-xs text-white/50 mt-3 uppercase tracking-wider">
            Regulación contractual de compraventa, envíos, derecho de desistimiento de 14 días y 3 años de garantía legal
          </p>
        </div>

        {/* Highlights banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
          <div className="border border-white/[0.08] bg-white/[0.02] p-4 rounded-xl flex items-center gap-3">
            <RefreshCw size={18} className="text-[#C4822A] flex-shrink-0" />
            <div className="space-y-0.5 font-code uppercase text-[10px]">
              <span className="text-white font-bold block">14 DÍAS DE DESISTIMIENTO</span>
              <span className="text-white/40 block text-[9px]">Devolución garantizada por ley</span>
            </div>
          </div>
          <div className="border border-white/[0.08] bg-white/[0.02] p-4 rounded-xl flex items-center gap-3">
            <ShieldCheck size={18} className="text-[#C4822A] flex-shrink-0" />
            <div className="space-y-0.5 font-code uppercase text-[10px]">
              <span className="text-white font-bold block">3 AÑOS DE GARANTÍA LEGAL</span>
              <span className="text-white/40 block text-[9px]">Conforme al RD-Ley 7/2021</span>
            </div>
          </div>
          <div className="border border-white/[0.08] bg-white/[0.02] p-4 rounded-xl flex items-center gap-3">
            <Scale size={18} className="text-[#C4822A] flex-shrink-0" />
            <div className="space-y-0.5 font-code uppercase text-[10px]">
              <span className="text-white font-bold block">RESOLUCIÓN DE LITIGIOS</span>
              <span className="text-white/40 block text-[9px]">Plataforma ODR Europea</span>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8 font-code text-xs text-white/70 leading-relaxed uppercase">

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-bebas text-2xl text-white tracking-wide border-b border-white/[0.06] pb-2">
              1. OBJETO Y TITULARIDAD DEL SERVICIO
            </h2>
            <p>
              Las presentes Condiciones Generales de Contratación regulan expresamente las relaciones de compraventa de productos ofertados en el sitio web STENCIL2 (en adelante, la «Tienda Online») por parte de los usuarios (en adelante, el «Cliente»).
            </p>
            <p>
              La realización de cualquier pedido a través de la web implica la lectura, conocimiento y aceptación plena y sin reservas de las presentes condiciones, así como de nuestra <Link href="/privacidad" className="text-white underline">Política de Privacidad</Link> y <Link href="/cookies" className="text-white underline">Política de Cookies</Link>.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="font-bebas text-2xl text-white tracking-wide border-b border-white/[0.06] pb-2">
              2. PROCESO DE COMPRA ELECTRÓNICA
            </h2>
            <p>
              Para adquirir productos en STENCIL2, el usuario seleccionará los modelos y colores deseados, los añadirá a su carrito de compras y completará el formulario de checkout con sus datos de envío y pago.
            </p>
            <p>
              El contrato quedará formalizado y perfeccionado en el momento en que el Cliente reciba en la dirección de correo electrónico facilitada una confirmación formal de pedido con el desglose del producto, importe total satisfecho y número identificador de orden.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="font-bebas text-2xl text-white tracking-wide border-b border-white/[0.06] pb-2">
              3. PRECIOS, IMPUESTOS (IVA) Y FACTURACIÓN
            </h2>
            <p>
              Todos los precios de venta al público indicados en la web están expresados en Euros (€ / EUR) e incluyen expresamente el Impuesto sobre el Valor Añadido (IVA del 21% aplicable en España peninsular y Baleares).
            </p>
            <p>
              Los precios aplicables a cada producto serán los publicados en la web en el momento de realización del pedido. STENCIL2 se reserva el derecho de modificar sus precios en cualquier momento, pero los productos se facturarán sobre la base de las tarifas en vigor en el momento en que se registró el pedido.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="font-bebas text-2xl text-white tracking-wide border-b border-white/[0.06] pb-2">
              4. MÉTODOS DE PAGO Y SEGURIDAD
            </h2>
            <p>
              STENCIL2 pone a disposición del Cliente medios de pago 100% seguros y auditados mediante pasarela de pagos internacional Stripe Inc., homologada con la máxima certificación bancaria PCI-DSS Level 1. Se admiten tarjetas de débito y crédito principales (Visa, Mastercard, American Express) y Apple Pay / Google Pay.
            </p>
            <p>
              La transmisión de datos se realiza bajo protocolo criptográfico seguro TLS/SSL de 256 bits, garantizando que nadie pueda interceptar o visualizar tus datos bancarios.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="font-bebas text-2xl text-white tracking-wide border-b border-white/[0.06] pb-2">
              5. POLÍTICA DE ENVÍOS Y PLAZOS DE ENTREGA
            </h2>
            <p>
              Los envíos se realizan desde nuestro centro de distribución logístico en España a través de agencias de mensajería líderes:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-white/60">
              <li><strong className="text-white">ENVÍO ESTÁNDAR PENINSULAR (3-5 DÍAS HÁBILES):</strong> 4.95 EUR (Gratuito en pedidos iguales o superiores a 50 EUR).</li>
              <li><strong className="text-white">ENVÍO EXPRESS (24-48 HORAS):</strong> 7.95 EUR para entregas urgentes.</li>
            </ul>
            <p className="text-white/50 text-[10px]">
              El cliente recibirá un número de seguimiento interactivo en cuanto el paquete sea despachado del centro de preparación.
            </p>
          </section>

          {/* Section 6 - RIGHT OF WITHDRAWAL (Obligatory by EU law) */}
          <section className="space-y-4">
            <h2 className="font-bebas text-2xl text-white tracking-wide border-b border-white/[0.06] pb-2">
              6. DERECHO LEGAL DE DESISTIMIENTO (14 DÍAS NATURALES)
            </h2>
            <p>
              De conformidad con el Real Decreto Legislativo 1/2007, de 16 de noviembre, por el que se aprueba el texto refundido de la Ley General para la Defensa de los Consumidores y Usuarios, el Cliente tiene derecho a desistir del contrato de compraventa en un plazo de <strong className="text-white">14 días naturales</strong> sin necesidad de justificación alguna.
            </p>
            <p>
              El plazo de desistimiento expirará a los 14 días naturales a contar desde el día en que tú o un tercero por ti indicado, distinto del transportista, adquiera la posesión material de los bienes.
            </p>
            <div className="border border-white/[0.08] bg-white/[0.02] p-4 rounded-lg space-y-2 text-[10px]">
              <strong className="text-[#C4822A] block uppercase">CONSECUENCIAS DEL DESISTIMIENTO:</strong>
              <p>
                En caso de desistimiento, devolveremos al Cliente todos los pagos recibidos, incluidos los gastos de entrega estándar, sin ninguna demora indebida y, en todo caso, a más tardar 14 días naturales a partir de la fecha en la que se nos informe de la decisión de desistir. Procederemos a efectuar dicho reembolso utilizando el mismo medio de pago empleado en la transacción inicial.
              </p>
              <p>
                El producto debe devolverse en perfecto estado, con sus fundas, estuches, gamuzas y etiquetas originales.
              </p>
            </div>

            {/* Model withdrawal form */}
            <div className="border border-white/[0.08] p-4 rounded-lg bg-black space-y-2">
              <strong className="text-white block text-[10px]">MODELO DE FORMULARIO DE DESISTIMIENTO:</strong>
              <p className="text-white/40 text-[9px] leading-relaxed">
                (Solo debes copiar y remitirnos este texto por correo electrónico a support@stencil2.com si deseas desistir del contrato):<br />
                — A la atención de STENCIL2 (support@stencil2.com):<br />
                — Por la presente le comunico que desisto de mi contrato de compraventa del siguiente bien: [Modelo de gafas de sol]<br />
                — Número de pedido: [Indicar número]<br />
                — Recibido el día: [Fecha]<br />
                — Nombre y apellidos del consumidor: [Nombre]<br />
                — Domicilio del consumidor: [Dirección]<br />
                — Fecha de la notificación: [Fecha actual]
              </p>
            </div>
          </section>

          {/* Section 7 - LEGAL WARRANTY (3 Years in Spain) */}
          <section className="space-y-3">
            <h2 className="font-bebas text-2xl text-white tracking-wide border-b border-white/[0.06] pb-2">
              7. GARANTÍA LEGAL DE CONFORMIDAD (3 AÑOS)
            </h2>
            <p>
              Conforme a la normativa española de consumidores y usuarios (Real Decreto-ley 7/2021, que modificó el TRLGDCU), todos los productos vendidos por STENCIL2 cuentan con una <strong className="text-white">garantía legal de 3 años</strong> frente a cualquier falta de conformidad o defecto de fabricación existente en el momento de la entrega.
            </p>
            <p>
              Durante los dos primeros años desde la entrega, cualquier falta de conformidad se presumirá que ya existía de origen salvo prueba en contrario. Ante cualquier defecto cubierto por garantía, el Cliente tendrá derecho a la reparación, sustitución, rebaja del precio o resolución del contrato de forma totalmente gratuita.
            </p>
            <p className="text-white/50 text-[10px]">
              La garantía no cubre daños causados por uso indebido, caídas, golpes o desgaste natural de lentes por manipulación inadecuada contraria a las instrucciones de cuidado óptico.
            </p>
          </section>

          {/* Section 8 - ODR PLATFORM */}
          <section className="space-y-3">
            <h2 className="font-bebas text-2xl text-white tracking-wide border-b border-white/[0.06] pb-2">
              8. RESOLUCIÓN DE LITIGIOS EN LÍNEA (ODR)
            </h2>
            <p>
              Conforme al artículo 14.1 del Reglamento (UE) 524/2013, la Comisión Europea facilita una plataforma de resolución de litigios en línea para consumidores comunitarios, a la cual se puede acceder a través del siguiente enlace oficial:
            </p>
            <div className="pt-1">
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#C4822A] hover:text-[#d8943f] underline text-xs font-bold"
              >
                PLATAFORMA EUROPEA DE RESOLUCIÓN DE LITIGIOS (EC.EUROPA.EU/CONSUMERS/ODR)
              </a>
            </div>
          </section>

          {/* Section 9 */}
          <section className="space-y-3">
            <h2 className="font-bebas text-2xl text-white tracking-wide border-b border-white/[0.06] pb-2">
              9. LEY APLICABLE Y JURISDICCIÓN
            </h2>
            <p>
              Estas condiciones generales se rigen por la legislación española. En caso de litigio entre STENCIL2 y un consumidor final, serán competentes los Juzgados y Tribunales del lugar de residencia habitual del consumidor.
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  )
}
