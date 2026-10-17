'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { Shield, Lock, FileText, CheckCircle2 } from 'lucide-react'

export default function PrivacidadPage() {
  return (
    <div className="bg-black min-h-screen flex flex-col text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-6 lg:px-10 max-w-4xl mx-auto w-full text-left">
        {/* Header */}
        <div className="border-b border-white/[0.08] pb-6 mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-code text-[9px] tracking-[0.35em] text-[#C4822A] uppercase font-bold">
              PROTECCIÓN DE DATOS · RGPD (UE 2016/679) & LOPDGDD
            </span>
            <span className="font-code text-[9px] text-white/30 uppercase">
              · ESPAÑA
            </span>
          </div>
          <h1 className="font-bebas text-4xl sm:text-5xl tracking-wide text-white uppercase leading-none">
            POLÍTICA DE PRIVACIDAD
          </h1>
          <p className="font-code text-xs text-white/50 mt-3 uppercase tracking-wider">
            Compromiso de transparencia, seguridad y estricta confidencialidad en el tratamiento de tus datos personales
          </p>
        </div>

        {/* Quick Summary Pill Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
          <div className="border border-white/[0.08] bg-white/[0.02] p-4 rounded-xl flex items-center gap-3">
            <Shield size={18} className="text-[#C4822A] flex-shrink-0" />
            <div className="space-y-0.5 font-code uppercase text-[10px]">
              <span className="text-white font-bold block">TUS DATOS SEGUROS</span>
              <span className="text-white/40 block text-[9px]">Cifrado SSL de 256 bits</span>
            </div>
          </div>
          <div className="border border-white/[0.08] bg-white/[0.02] p-4 rounded-xl flex items-center gap-3">
            <Lock size={18} className="text-[#C4822A] flex-shrink-0" />
            <div className="space-y-0.5 font-code uppercase text-[10px]">
              <span className="text-white font-bold block">PAGOS PCI-DSS</span>
              <span className="text-white/40 block text-[9px]">Tokenizados por Stripe</span>
            </div>
          </div>
          <div className="border border-white/[0.08] bg-white/[0.02] p-4 rounded-xl flex items-center gap-3">
            <CheckCircle2 size={18} className="text-[#C4822A] flex-shrink-0" />
            <div className="space-y-0.5 font-code uppercase text-[10px]">
              <span className="text-white font-bold block">DERECHOS RGPD</span>
              <span className="text-white/40 block text-[9px]">Control total de tus datos</span>
            </div>
          </div>
        </div>

        {/* Legal Sections */}
        <div className="space-y-8 font-code text-xs text-white/70 leading-relaxed uppercase">

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-bebas text-2xl text-white tracking-wide border-b border-white/[0.06] pb-2">
              1. RESPONSABLE DEL TRATAMIENTO DE LOS DATOS
            </h2>
            <p>
              El responsable del tratamiento de los datos personales recopilados a través de este portal web es:
            </p>
            <div className="border border-white/[0.08] bg-white/[0.02] p-5 rounded-xl space-y-1.5 text-[11px]">
              <p><strong className="text-white">RESPONSABLE:</strong> STENCIL2</p>
              <p><strong className="text-white">DOMICILIO:</strong> MADRID, ESPAÑA</p>
              <p><strong className="text-white">CORREO ELECTRÓNICO PARA EJERCICIO DE DERECHOS:</strong> SUPPORT@STENCIL2.COM</p>
              <p><strong className="text-white">FINALIDAD PRINCIPAL:</strong> GESTIÓN DE COMPRAS, ENVÍOS Y ATENCIÓN AL CLIENTE</p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="font-bebas text-2xl text-white tracking-wide border-b border-white/[0.06] pb-2">
              2. DATOS QUE RECOPILAMOS Y PROCEDENCIA
            </h2>
            <p>
              Recopilamos únicamente los datos imprescindibles para gestionar tus pedidos y ofrecerte la mejor experiencia de servicio:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-white/60">
              <li><strong className="text-white">DATOS IDENTIFICATIVOS Y DE CONTACTO:</strong> Nombre, apellidos, dirección postal de entrega, dirección de correo electrónico y número de teléfono proporcionados durante el proceso de compra o consulta.</li>
              <li><strong className="text-white">DATOS TRANSACCIONALES:</strong> Historial de pedidos realizados, productos adquiridos, importes, método de envío y código promocional utilizado.</li>
              <li><strong className="text-white">DATOS DE PAGO:</strong> Gestionados directamente a través de pasarelas de pago homologadas seguras (Stripe). STENCIL2 nunca almacena el número íntegro de tu tarjeta de crédito ni tu código CVC.</li>
              <li><strong className="text-white">DATOS DE NAVEGACIÓN:</strong> Dirección IP anonimizada, identificadores de dispositivo y cookies técnicas necesarias para el carrito (consulta nuestra <Link href="/cookies" className="text-white underline">Política de Cookies</Link>).</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="font-bebas text-2xl text-white tracking-wide border-b border-white/[0.06] pb-2">
              3. FINALIDADES DEL TRATAMIENTO Y BASE JURÍDICA (LEGITIMACIÓN)
            </h2>
            <p>
              En virtud del artículo 6 del RGPD, tratamos tus datos bajo las siguientes bases legales:
            </p>
            <div className="space-y-3 pt-1">
              <div className="border border-white/[0.05] p-3 rounded-lg bg-white/[0.01]">
                <p className="text-white font-bold mb-1">A) EJECUCIÓN DEL CONTRATO DE COMPRAVENTA (ART. 6.1.B RGPD):</p>
                <p className="text-white/50 text-[10px]">
                  Gestionar la tramitación, cobro, preparación de almacén, facturación y envío a tu domicilio de los artículos adquiridos en STENCIL2.
                </p>
              </div>

              <div className="border border-white/[0.05] p-3 rounded-lg bg-white/[0.01]">
                <p className="text-white font-bold mb-1">B) CUMPLIMIENTO DE OBLIGACIONES LEGALES (ART. 6.1.C RGPD):</p>
                <p className="text-white/50 text-[10px]">
                  Emisión de facturas y cumplimiento de normativas fiscales, contables (Código de Comercio y Ley General Tributaria de España) y de protección de los derechos de los consumidores.
                </p>
              </div>

              <div className="border border-white/[0.05] p-3 rounded-lg bg-white/[0.01]">
                <p className="text-white font-bold mb-1">C) CONSENTIMIENTO EXPRESO DEL USUARIO (ART. 6.1.A RGPD):</p>
                <p className="text-white/50 text-[10px]">
                  Suscripción a nuestra newsletter con descuentos exclusivos y novedades de drops de producto, así como la resolución de consultas remitidas mediante formularios de contacto. Puedes revocar tu consentimiento en cualquier momento.
                </p>
              </div>

              <div className="border border-white/[0.05] p-3 rounded-lg bg-white/[0.01]">
                <p className="text-white font-bold mb-1">D) INTERÉS LEGÍTIMO (ART. 6.1.F RGPD):</p>
                <p className="text-white/50 text-[10px]">
                  Prevención de fraudes en medios de pago, control de seguridad informática del sitio web y optimización técnica del servicio.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="font-bebas text-2xl text-white tracking-wide border-b border-white/[0.06] pb-2">
              4. DESTINATARIOS Y CESIÓN DE DATOS A TERCEROS
            </h2>
            <p>
              Tus datos personales no serán vendidos ni cedidos a terceras empresas bajo ningún concepto. Solo tendrán acceso aquellos prestadores de servicios indispensables para cumplir el contrato:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-white/60">
              <li><strong className="text-white">EMPRESAS DE TRANSPORTE Y MENSAJERÍA:</strong> Empresas de logística para posibilitar la entrega física del paquete en tu dirección.</li>
              <li><strong className="text-white">PASARELAS DE PAGO Y BANCOS:</strong> Stripe Inc. y entidades financieras para el procesamiento del cobro encriptado seguro.</li>
              <li><strong className="text-white">PROVEEDORES TECNOLÓGICOS Y DE ALOJAMIENTO:</strong> Proveedores de infraestructura web en la nube (Vercel, Supabase) que actúan como encargados del tratamiento bajo Cláusulas Contractuales Tipo avaladas por la Comisión Europea.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="font-bebas text-2xl text-white tracking-wide border-b border-white/[0.06] pb-2">
              5. PLAZO DE CONSERVACIÓN DE LOS DATOS
            </h2>
            <p>
              Conservaremos tus datos durante el tiempo estrictamente necesario para cumplir las finalidades descritas:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-white/60">
              <li><strong className="text-white">DATOS DE COMPRA Y FACTURACIÓN:</strong> Mínimo 5 años en cumplimiento de las obligaciones fiscales y tributarias españolas (Ley General Tributaria y Código de Comercio).</li>
              <li><strong className="text-white">DATOS DE MARKETING Y NEWSLETTER:</strong> Hasta que solicites la baja o retires tu consentimiento haciendo clic en el enlace de baja o escribiéndonos.</li>
              <li><strong className="text-white">DATOS DE CONSULTAS:</strong> Durante el tiempo necesario para resolver y dar respuesta adecuada a tu solicitud de soporte.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="font-bebas text-2xl text-white tracking-wide border-b border-white/[0.06] pb-2">
              6. TUS DERECHOS BAJO EL RGPD Y CÓMO EJERCERLOS
            </h2>
            <p>
              Como usuario y titular de tus datos, dispones de los siguientes derechos reconocidos por el Reglamento Europeo de Protección de Datos:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-[10px]">
              <div className="border border-white/[0.06] p-3 rounded">
                <strong className="text-white block mb-0.5">DERECHO DE ACCESO:</strong>
                Saber qué datos personales tuyos estamos tratando.
              </div>
              <div className="border border-white/[0.06] p-3 rounded">
                <strong className="text-white block mb-0.5">DERECHO DE RECTIFICACIÓN:</strong>
                Solicitar la corrección de datos inexactos o incompletos.
              </div>
              <div className="border border-white/[0.06] p-3 rounded">
                <strong className="text-white block mb-0.5">DERECHO DE SUPRESIÓN («AL OLVIDO»):</strong>
                Pedir la eliminación de tus datos cuando ya no sean necesarios.
              </div>
              <div className="border border-white/[0.06] p-3 rounded">
                <strong className="text-white block mb-0.5">DERECHO DE OPOSICIÓN:</strong>
                Oponerte al tratamiento de tus datos para fines promocionales.
              </div>
              <div className="border border-white/[0.06] p-3 rounded">
                <strong className="text-white block mb-0.5">LIMITACIÓN DEL TRATAMIENTO:</strong>
                Solicitar la suspensión temporal del tratamiento de tus datos.
              </div>
              <div className="border border-white/[0.06] p-3 rounded">
                <strong className="text-white block mb-0.5">PORTABILIDAD:</strong>
                Recibir tus datos en un formato digital estructurado y de uso común.
              </div>
            </div>

            <p className="pt-2">
              Para ejercer cualquiera de estos derechos, basta con enviar un correo electrónico a: <span className="text-[#C4822A] font-bold">SUPPORT@STENCIL2.COM</span> indicando en el asunto «PROTECCIÓN DE DATOS» y adjuntando una copia de tu documento de identidad para verificar tu titularidad.
            </p>
            <p className="text-white/50 text-[10px]">
              Asimismo, si consideras que tus derechos han sido vulnerados, tienes derecho a presentar una reclamación ante la <strong className="text-white">AGENCIA ESPAÑOLA DE PROTECCIÓN DE DATOS (AEPD)</strong> a través de su sede electrónica en <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-[#C4822A] underline">WWW.AEPD.ES</a> o por escrito en Calle Jorge Juan 6, 28001 Madrid.
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  )
}
