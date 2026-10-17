'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { Cookie, Shield, Settings2, ExternalLink } from 'lucide-react'

export default function CookiesPage() {
  const handleOpenCookieSettings = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('stencil2_open_cookie_settings'))
    }
  }

  return (
    <div className="bg-black min-h-screen flex flex-col text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-6 lg:px-10 max-w-4xl mx-auto w-full text-left">
        {/* Header */}
        <div className="border-b border-white/[0.08] pb-6 mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-code text-[9px] tracking-[0.35em] text-[#C4822A] uppercase font-bold">
              CUMPLIMIENTO NORMATIVO · AEPD & LSSI-CE
            </span>
            <span className="font-code text-[9px] text-white/30 uppercase">
              · ÚLTIMA ACTUALIZACIÓN: ENERO 2026
            </span>
          </div>
          <h1 className="font-bebas text-4xl sm:text-5xl tracking-wide text-white uppercase leading-none">
            POLÍTICA DE COOKIES
          </h1>
          <p className="font-code text-xs text-white/50 mt-3 uppercase tracking-wider">
            Información transparente sobre el uso de cookies y tecnologías de almacenamiento local en STENCIL2
          </p>
        </div>

        {/* Interactive Preferences Banner */}
        <div className="mb-10 p-6 rounded-xl border border-[#C4822A]/30 bg-gradient-to-r from-[#C4822A]/10 via-transparent to-transparent flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#C4822A]">
              <Settings2 size={16} />
              <h3 className="font-code text-xs font-bold uppercase tracking-wider">
                GESTIONAR TUS PREFERENCIAS
              </h3>
            </div>
            <p className="font-code text-[10px] text-white/60 uppercase leading-relaxed">
              Puedes modificar o revocar tu consentimiento sobre el uso de cookies en cualquier momento.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenCookieSettings}
            className="flex-shrink-0 bg-white hover:bg-white/90 text-black font-code text-[10px] tracking-wider py-3 px-5 rounded-md font-bold uppercase transition-all flex items-center gap-2"
          >
            CONFIGURAR COOKIES
          </button>
        </div>

        {/* Content Sections */}
        <div className="space-y-10 font-code text-xs text-white/70 leading-relaxed uppercase">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-bebas text-2xl text-white tracking-wide border-b border-white/[0.06] pb-2">
              1. ¿QUÉ SON LAS COOKIES Y TECNOLOGÍAS SIMILARES?
            </h2>
            <p>
              Una cookie es un pequeño fichero de texto que se almacena en tu navegador web o dispositivo cuando visitas un sitio de internet. Las tecnologías similares (tales como el almacenamiento local o <span className="text-white">localStorage</span>) permiten almacenar información sobre tu visita, permitiendo que la web recuerde tus preferencias de idioma, artículos en tu cesta de la compra y garantice la seguridad de las transacciones.
            </p>
            <p>
              Esta política se ha redactado conforme a las directrices de la Agencia Española de Protección de Datos (AEPD), el Reglamento General de Protección de Datos (RGPD UE 2016/679) y el artículo 22.2 de la Ley 34/2002 de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE).
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="font-bebas text-2xl text-white tracking-wide border-b border-white/[0.06] pb-2">
              2. TIPOS DE COOKIES QUE UTILIZAMOS
            </h2>
            <p>
              En STENCIL2 clasificamos las cookies según su finalidad y procedencia:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="border border-white/[0.08] bg-white/[0.02] p-4 rounded-lg space-y-2">
                <span className="text-[#C4822A] font-bold text-[11px] block">A) COOKIES TÉCNICAS (ESTRICTAMENTE NECESARIAS)</span>
                <p className="text-white/50 text-[10px]">
                  Imprescindibles para que la tienda online funcione correctamente. Permiten recordar los productos añadidos a tu carrito, mantener sesiones seguras y tramitar el pago mediante la pasarela encriptada Stripe. Están exceptuadas del requisito de consentimiento según el art. 22.2 de la LSSI.
                </p>
              </div>

              <div className="border border-white/[0.08] bg-white/[0.02] p-4 rounded-lg space-y-2">
                <span className="text-white font-bold text-[11px] block">B) COOKIES ANALÍTICAS Y DE MEDICIÓN</span>
                <p className="text-white/50 text-[10px]">
                  Permiten realizar mediciones estadísticas anónimas sobre el volumen de tráfico y los tiempos de carga en la web mediante herramientas como Vercel Analytics. Solo se activan si nos das tu consentimiento expreso.
                </p>
              </div>

              <div className="border border-white/[0.08] bg-white/[0.02] p-4 rounded-lg space-y-2">
                <span className="text-white font-bold text-[11px] block">C) COOKIES DE PREFERENCIAS Y PERSONALIZACIÓN</span>
                <p className="text-white/50 text-[10px]">
                  Permiten recordar las preferencias del usuario (por ejemplo, moneda, idioma o filtros de visualización de colecciones) para mejorar tu experiencia de compra.
                </p>
              </div>

              <div className="border border-white/[0.08] bg-white/[0.02] p-4 rounded-lg space-y-2">
                <span className="text-white font-bold text-[11px] block">D) COOKIES DE SEGURIDAD Y PREVENCIÓN DE FRAUDE</span>
                <p className="text-white/50 text-[10px]">
                  Utilizadas por nuestro proveedor de pagos Stripe Inc. para verificar la autenticidad de las transacciones y prevenir pagos fraudulentos con tarjetas de crédito.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Detailed Table */}
          <section className="space-y-4">
            <h2 className="font-bebas text-2xl text-white tracking-wide border-b border-white/[0.06] pb-2">
              3. TABLA DETALLADA DE COOKIES EN STENCIL2
            </h2>
            <div className="overflow-x-auto border border-white/[0.08] rounded-xl">
              <table className="w-full text-left text-[10px] font-code">
                <thead className="bg-white/[0.05] border-b border-white/[0.08] text-white">
                  <tr>
                    <th className="p-3 uppercase">NOMBRE</th>
                    <th className="p-3 uppercase">PROVEEDOR</th>
                    <th className="p-3 uppercase">FINALIDAD</th>
                    <th className="p-3 uppercase">DURACIÓN</th>
                    <th className="p-3 uppercase">TIPO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05] text-white/60">
                  <tr>
                    <td className="p-3 font-bold text-white">stencil2_cookie_consent_v1</td>
                    <td className="p-3">STENCIL2 (Propia)</td>
                    <td className="p-3">Guarda las preferencias del usuario respecto a la aceptación o rechazo de cookies.</td>
                    <td className="p-3">12 meses</td>
                    <td className="p-3 text-[#C4822A]">Técnica / Necesaria</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">stencil_cart_items</td>
                    <td className="p-3">STENCIL2 (Propia)</td>
                    <td className="p-3">Mantiene la lista de artículos, cantidades y modelos seleccionados en el carrito de compras.</td>
                    <td className="p-3">Persistente (LocalStorage)</td>
                    <td className="p-3 text-[#C4822A]">Técnica / Necesaria</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">__stripe_mid, __stripe_sid</td>
                    <td className="p-3">Stripe Inc. (Tercero)</td>
                    <td className="p-3">Prevención de fraudes en pagos online y tokenización segura de transacciones PCI-DSS.</td>
                    <td className="p-3">1 año / 30 min</td>
                    <td className="p-3 text-[#C4822A]">Seguridad / Necesaria</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">va_* / vercel-analytics</td>
                    <td className="p-3">Vercel Inc. (Tercero)</td>
                    <td className="p-3">Telemetría de rendimiento y estadísticas anónimas de navegación en la plataforma.</td>
                    <td className="p-3">Sesión / 1 año</td>
                    <td className="p-3 text-white">Analítica (Consentimiento)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">proyectos_visitas</td>
                    <td className="p-3">Supabase (Tercero)</td>
                    <td className="p-3">Conteo anónimo de visitas agregadas para medición de concurrencia.</td>
                    <td className="p-3">Sesión</td>
                    <td className="p-3 text-white">Analítica (Consentimiento)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 4: How to disable from browser */}
          <section className="space-y-3">
            <h2 className="font-bebas text-2xl text-white tracking-wide border-b border-white/[0.06] pb-2">
              4. CÓMO CONFIGURAR O BLOQUEAR COOKIES DESDE TU NAVEGADOR
            </h2>
            <p>
              Además del panel de configuración de STENCIL2, puedes permitir, bloquear o eliminar las cookies instaladas en tu equipo mediante la configuración de las opciones del navegador que utilices:
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-white/50 text-[10px]">
              <li className="border border-white/[0.05] p-3 rounded bg-white/[0.01]">
                <strong className="text-white block mb-1">GOOGLE CHROME:</strong>
                Configuración &gt; Privacidad y seguridad &gt; Cookies y otros datos de sitios.
              </li>
              <li className="border border-white/[0.05] p-3 rounded bg-white/[0.01]">
                <strong className="text-white block mb-1">MOZILLA FIREFOX:</strong>
                Ajustes &gt; Privacidad &amp; Seguridad &gt; Cookies y datos del sitio.
              </li>
              <li className="border border-white/[0.05] p-3 rounded bg-white/[0.01]">
                <strong className="text-white block mb-1">APPLE SAFARI:</strong>
                Preferencias &gt; Privacidad &gt; Bloquear todas las cookies o gestionar datos del sitio.
              </li>
              <li className="border border-white/[0.05] p-3 rounded bg-white/[0.01]">
                <strong className="text-white block mb-1">MICROSOFT EDGE:</strong>
                Configuración &gt; Cookies y permisos del sitio &gt; Administrar y eliminar cookies.
              </li>
            </ul>

            <p className="text-white/40 text-[9px] pt-2">
              Ten en cuenta que si deshabilitas o bloqueas completamente las cookies técnicas en tu navegador, es posible que algunas funciones esenciales de la tienda online (como el carrito de compras o la finalización del pedido) no operen adecuadamente.
            </p>
          </section>

          {/* Section 5: Updates */}
          <section className="space-y-3 border-t border-white/[0.06] pt-6">
            <h2 className="font-bebas text-2xl text-white tracking-wide">
              5. ACTUALIZACIONES Y CONTACTO
            </h2>
            <p>
              STENCIL2 puede modificar esta Política de Cookies en función de nuevas exigencias legislativas, reglamentarias o con la finalidad de adaptar dicha política a las instrucciones dictadas por la Agencia Española de Protección de Datos.
            </p>
            <p>
              Si tienes cualquier consulta sobre nuestra política de cookies, puedes ponerte en contacto con nosotros en: <span className="text-[#C4822A] font-bold">SUPPORT@STENCIL2.COM</span>.
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  )
}
