'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { PRODUCTS } from '@/lib/products'
import { GlassesModel } from '@/types'
import { Search, X, SlidersHorizontal } from 'lucide-react'

function TiendaContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const genderParam = searchParams.get('gender') // 'men', 'women'

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGender, setSelectedGender] = useState<'all' | 'men' | 'women'>(
    genderParam === 'men' ? 'men' : genderParam === 'women' ? 'women' : 'all'
  )
  const [selectedModel, setSelectedModel] = useState<GlassesModel | 'all'>('all')
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Sync state if URL query param changes
  useEffect(() => {
    if (genderParam === 'men') {
      setSelectedGender('men')
    } else if (genderParam === 'women') {
      setSelectedGender('women')
    } else {
      setSelectedGender('all')
    }
  }, [genderParam])

  const handleGenderChange = (gender: 'all' | 'men' | 'women') => {
    setSelectedGender(gender)
    // Update URL query parameters
    const params = new URLSearchParams(window.location.search)
    if (gender === 'all') {
      params.delete('gender')
    } else {
      params.set('gender', gender)
    }
    router.push(`/tienda?${params.toString()}`, { scroll: false })
  }

  // Filter products
  const filteredProducts = PRODUCTS.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesGender =
      selectedGender === 'all' ||
      p.gender === selectedGender ||
      p.gender === 'unisex'

    const matchesModel = selectedModel === 'all' || p.model === selectedModel

    return matchesSearch && matchesGender && matchesModel
  })

  const modelsList: { value: GlassesModel | 'all'; label: string }[] = [
    { value: 'all', label: 'TODOS LOS MODELOS' },
    { value: 'wayfarer', label: 'WAYFARER' },
    { value: 'round', label: 'ROUND' },
    { value: 'shield', label: 'SHIELD' },
    { value: 'aviator', label: 'AVIATOR' },
    { value: 'cat-eye', label: 'CAT-EYE' },
    { value: 'sport', label: 'SPORT' },
  ]

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-16 px-6 lg:px-10 max-w-[1400px] mx-auto w-full">
        {/* Editorial Header */}
        <div className="border-b border-white/[0.07] pb-8 mb-10 text-left">
          <p className="font-code text-[9px] tracking-[0.35em] text-white/30 uppercase mb-3">
            CATÁLOGO OFICIAL S2
          </p>
          <h1 className="font-bebas text-[48px] md:text-[64px] tracking-wide leading-none text-white uppercase">
            {selectedGender === 'men' ? 'COLECCIÓN HOMBRE' : selectedGender === 'women' ? 'COLECCIÓN MUJER' : 'TODAS LAS GAFAS'}
          </h1>
          <p className="font-code text-[11px] text-white/40 max-w-xl mt-3 leading-relaxed">
            Diseñadas bajo los estándares de la cultura urbana y el streetwear premium. Lentes polarizadas de protección total UV400, monturas de acetato pulido a mano y polímeros flexibles.
          </p>
        </div>

        {/* Filters and Search Bar Row */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center mb-8 w-full">
          {/* Desktop Filter Tabs */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex border border-white/10 p-0.5 rounded-sm bg-white/[0.02]">
              {(['all', 'men', 'women'] as const).map((gender) => (
                <button
                  key={gender}
                  onClick={() => handleGenderChange(gender)}
                  className={`font-code text-[9px] tracking-[0.2em] px-5 py-2.5 rounded-sm transition-all uppercase ${
                    selectedGender === gender
                      ? 'bg-white text-black font-semibold'
                      : 'text-white/40 hover:text-white'
                  }`}
                >
                  {gender === 'all' ? 'TODOS' : gender === 'men' ? 'HOMBRE' : 'MUJER'}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {modelsList.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setSelectedModel(m.value)}
                  className={`font-code text-[8px] tracking-[0.15em] px-4 py-2 border rounded-full transition-all uppercase ${
                    selectedModel === m.value
                      ? 'border-white text-white bg-white/10'
                      : 'border-white/10 text-white/30 hover:text-white hover:border-white/20'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Filter Toggle & Gender Buttons */}
          <div className="flex lg:hidden w-full gap-2 items-center">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex items-center justify-center gap-2 border border-white/15 px-4 py-2.5 text-white/60 font-code text-[10px] tracking-wider uppercase bg-white/[0.02]"
            >
              <SlidersHorizontal size={12} />
              FILTRAR
            </button>
            <div className="flex border border-white/10 p-0.5 rounded-sm bg-white/[0.02] flex-1 justify-between">
              {(['all', 'men', 'women'] as const).map((gender) => (
                <button
                  key={gender}
                  onClick={() => handleGenderChange(gender)}
                  className={`font-code text-[8px] tracking-[0.15em] py-2 px-3 rounded-sm flex-1 transition-all uppercase ${
                    selectedGender === gender
                      ? 'bg-white text-black font-semibold'
                      : 'text-white/40'
                  }`}
                >
                  {gender === 'all' ? 'TODOS' : gender === 'men' ? 'HOMBRE' : 'MUJER'}
                </button>
              ))}
            </div>
          </div>

          {/* Search bar */}
          <div className="relative w-full lg:w-[280px]">
            <input
              type="text"
              placeholder="BUSCAR MODELO O CÓDIGO..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/15 text-white font-code text-[10px] tracking-widest pl-9 pr-8 py-3 focus:outline-none focus:border-white/30 transition-all uppercase rounded-sm"
            />
            <Search size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Filters Expanded Box */}
        {showMobileFilters && (
          <div className="lg:hidden border border-white/10 p-4 mb-6 bg-white/[0.01] rounded-sm">
            <p className="font-code text-[8px] tracking-[0.2em] text-white/30 uppercase mb-2">MODELOS DE GAFAS</p>
            <div className="flex flex-wrap gap-1.5">
              {modelsList.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setSelectedModel(m.value)}
                  className={`font-code text-[8px] tracking-[0.1em] px-3 py-1.5 border rounded-full transition-all uppercase ${
                    selectedModel === m.value
                      ? 'border-white text-white bg-white/10'
                      : 'border-white/10 text-white/40'
                  }`}
                >
                  {m.label.replace('TODOS LOS ', '')}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Catalog Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((p) => (
              <div key={p.id} className="h-[360px] border border-white/[0.052] rounded-xl overflow-hidden hover:border-white/15 transition-all">
                <ProductCard
                  code={p.code}
                  name={p.name}
                  price={p.price.toFixed(2)}
                  gender={p.gender.toUpperCase() as 'MEN' | 'WOMEN' | 'UNISEX'}
                  model={p.model}
                  slug={p.slug}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border border-dashed border-white/10 rounded-xl">
            <p className="font-code text-[11px] tracking-widest text-white/30 uppercase">
              NO SE ENCONTRARON PRODUCTOS QUE COINCIDAN CON TU BÚSQUEDA
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedGender('all')
                setSelectedModel('all')
                router.push('/tienda', { scroll: false })
              }}
              className="mt-4 font-code text-[9px] tracking-widest border border-white/20 px-6 py-2.5 text-white/50 hover:text-white hover:border-white/50 transition-colors uppercase"
            >
              LIMPIAR FILTROS
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default function TiendaPage() {
  return (
    <Suspense fallback={
      <div className="bg-black min-h-screen text-white flex items-center justify-center font-code text-[10px] tracking-[0.25em] uppercase">
        CARGANDO CATÁLOGO...
      </div>
    }>
      <TiendaContent />
    </Suspense>
  )
}
