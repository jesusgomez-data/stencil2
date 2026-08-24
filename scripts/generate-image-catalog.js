/**
 * STENCIL2 — Genera automáticamente el catálogo de imágenes de gafas.
 *
 * Escanea la carpeta public/images/ y detecta la nomenclatura LETRA+NÚMERO:
 *   - A1.png, A2.png, A10.png  -> modelo A, tomas 1, 2, 10
 *   - b3.png, x.png            -> case-insensitive
 *
 * Genera public/images/image-catalog.json con las galerías agrupadas por
 * modelo y ordenadas de forma NATURAL (A1 → A2 → A10 → A11, nunca A10 antes de A2).
 *
 * Uso: node scripts/generate-image-catalog.js
 */
const fs = require('fs')
const path = require('path')

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images')
const OUTPUT = path.join(IMAGES_DIR, 'image-catalog.json')

// Nomenclatura: letra (1) + número OPCIONAL (2) + extensión
//   A1.png, A2.png, A10.png  -> tomas numeradas
//   x.png                     -> toma única (letra sin número) → se trata como número 0/1
const FILE_RE = /^([a-zA-Z])(\d*)\.(png|jpe?g|webp)$/i

/**
 * Orden natural: compara el número de la toma como entero, no como texto.
 * A1 < A2 < A10 < A11  (NUNCA A10 antes de A2)
 */
function naturalCompare(a, b) {
  const numA = a.num === '' ? 0 : parseInt(a.num, 10)
  const numB = b.num === '' ? 0 : parseInt(b.num, 10)
  if (numA !== numB) return numA - numB
  return a.file.localeCompare(b.file)
}

function main() {
  const files = fs.readdirSync(IMAGES_DIR).filter((f) => FILE_RE.test(f))

  // Agrupar por letra (mayúscula)
  const groups = new Map()
  for (const file of files) {
    const m = file.match(FILE_RE)
    const letter = m[1].toUpperCase()
    const num = m[2]
    if (!groups.has(letter)) groups.set(letter, [])
    groups.get(letter).push({ file, num })
  }

  // Ordenar cada galería de forma natural y construir el catálogo.
  // Las rutas incluyen el prefijo /images/ porque los archivos viven en public/images/.
  const catalog = {}
  const letters = [...groups.keys()].sort()
  for (const letter of letters) {
    const shots = groups.get(letter).sort(naturalCompare)
    catalog[letter] = shots.map((s) => `/images/${s.file}`)
  }

  fs.writeFileSync(OUTPUT, JSON.stringify(catalog, null, 2) + '\n', 'utf8')

  console.log(`✓ Catálogo generado: ${OUTPUT}`)
  for (const letter of letters) {
    console.log(`  Modelo ${letter}: ${catalog[letter].length} tomas → ${catalog[letter].join(', ')}`)
  }
}

main()
