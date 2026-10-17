'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function AvisoLegalPage() {
  return (
    <div className="bg-black min-h-screen flex flex-col text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-6 lg:px-10 max-w-4xl mx-auto w-full text-left">
        {/* Header */}
        <div className="border-b border-white/[0.08] pb-6 mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-code text-[9px] tracking-[0.35em] text-[#C4822A] uppercase font-bold">
              INFORMACIÓN REGULATORIA · LSSI-CE ART. 10
            </span>
            <span className="font-code text-[9px] text-white/30 uppercase">
              · ESPAÑA
            </span>
          </div>
          <h1 className="font-bebas text-4xl sm:text-5xl tracking-wide text-white uppercase leading-none">
            AVISO LEGAL
          </h1>
          <p className="font-code text-xs text-white/50 mt-3 uppercase tracking-wider">
            Información legal general del titular del sitio web y condiciones de uso del portal
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 font-code text-xs text-white/70 leading-relaxed uppercase">

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-bebas text-2xl text-white tracking-wide border-b border-white/[0.06] pb-2">
              1. DATOS IDENTIFICATIVOS DEL TITULAR
            </h2>
            <p>
              En cumplimiento con el deber de información estipulado en el artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSI-CE), se facilitan a continuación los datos del titular del sitio web:
            </p>

            <div className="border border-white/[0.08] bg-white/[0.02] p-5 rounded-xl space-y-2 text-[11px]">
              <p><strong className="text-white">DENOMINACIÓN COMERCIAL:</strong> STENCIL2</p>
              <p><strong className="text-white">ACTIVIDAD SOCIAL:</strong> COMERCIO ELECTRÓNICO MINORISTA DE GAFAS DE SOL, ÓPTICA DE MODA Y ACCESORIOS STREETWEAR</p>
              <p><strong className="text-white">DOMICILIO FISCAL Y DE GESTIÓN:</strong> MADRID, ESPAÑA</p>
              <p><strong className="text-white">CORREO ELECTRÓNICO DE CONTACTO:</strong> SUPPORT@STENCIL2.COM</p>
              <p><strong className="text-white">TELÉFONO DE ATENCIÓN AL CLIENTE:</strong> +34 900 123 456</p>
              <p><strong className="text-white">SITIO WEB PRINCIPAL:</strong> STENCIL2.COM</p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="font-bebas text-2xl text-white tracking-wide border-b border-white/[0.06] pb-2">
              2. CONDICIONES DE ACCESO Y USO
            </h2>
            <p>
              El acceso y navegación por el sitio web atribuye la condición de Usuario del mismo e implica la aceptación plena y sin reservas de todas y cada una de las disposiciones incluidas en este Aviso Legal, así como en la <Link href="/privacidad" className="text-white underline underline-offset-4">Política de Privacidad</Link>, la <Link href="/cookies" className="text-white underline underline-offset-4">Política de Cookies</Link> y las <Link href="/terminos" className="text-white underline underline-offset-4">Condiciones Generales de Contratación</Link>.
            </p>
            <p>
              El Usuario se compromete a hacer un uso adecuado de los contenidos y servicios que STENCIL2 ofrece a través de su portal y, con carácter enunciativo pero no limitativo, a no emplearlos para incurrir en actividades ilícitas, ilegales o contrarias a la buena fe y al orden público, ni para provocar daños en los sistemas físicos y lógicos de STENCIL2 o de terceras personas.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="font-bebas text-2xl text-white tracking-wide border-b border-white/[0.06] pb-2">
              3. PROPIEDAD INTELECTUAL E INDUSTRIAL
            </h2>
            <p>
              STENCIL2 por sí o como cesionaria, es titular de todos los derechos de propiedad intelectual e industrial de su página web, así como de los elementos contenidos en la misma (a título enunciativo: imágenes, sonido, audio, vídeo, software o textos; marcas o logotipos, combinaciones de colores, estructura y diseño, selección de materiales usados, programas de ordenador necesarios para su funcionamiento, modelos 3D y renderizados).
            </p>
            <p>
              En virtud de lo dispuesto en los artículos 8 y 32.1, párrafo segundo, de la Ley de Propiedad Intelectual española, quedan expresamente prohibidas la reproducción, la distribución y la comunicación pública, incluida su modalidad de puesta a disposición, de la totalidad o parte de los contenidos de esta página web, con fines comerciales, en cualquier soporte y por cualquier medio técnico, sin la autorización previa y por escrito de STENCIL2.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="font-bebas text-2xl text-white tracking-wide border-b border-white/[0.06] pb-2">
              4. EXCLUSIÓN DE GARANTÍAS Y RESPONSABILIDAD
            </h2>
            <p>
              STENCIL2 no se hace responsable, en ningún caso, de los daños y perjuicios de cualquier naturaleza que pudieran ocasionar, a título enunciativo: errores u omisiones en los contenidos, falta de disponibilidad temporal del portal por mantenimientos de servidor, o la transmisión de virus o programas maliciosos en los contenidos, a pesar de haber adoptado todas las medidas tecnológicas necesarias para evitarlo.
            </p>
            <p>
              En el caso de que en el sitio web se dispusiesen enlaces o hipervínculos hacía otros sitios de Internet, STENCIL2 no ejercerá ningún tipo de control sobre dichos sitios y contenidos ajenos, no asumiendo responsabilidad alguna por los contenidos de algún enlace perteneciente a un sitio web ajeno.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="font-bebas text-2xl text-white tracking-wide border-b border-white/[0.06] pb-2">
              5. LEGISLACIÓN APLICABLE Y JURISDICCIÓN
            </h2>
            <p>
              La relación entre STENCIL2 y el Usuario se regirá por la normativa española vigente. Para la resolución de cualquier controversia o litigio que pudiera derivarse del acceso o uso de este sitio web, las partes se someten a los Juzgados y Tribunales competentes de conformidad con la legislación en materia de consumidores y usuarios.
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  )
}
