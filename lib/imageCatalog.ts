/**
 * STENCIL2 — Catálogo automático de imágenes de gafas.
 *
 * Las imágenes se identifican con LETRA+NÚMERO (A1, A2, A10, B1...):
 *   - La LETRA identifica el modelo de gafa.
 *   - El NÚMERO identifica la toma/fotografía dentro de ese modelo.
 *
 * Este módulo lee el catálogo generado automáticamente (image-catalog.json,
 * producido por scripts/generate-image-catalog.js) y expone utilidades para:
 *   - Obtener la galería completa de un modelo.
 *   - Ordenar las tomas de forma NATURAL (A1 → A2 → A10 → A11, nunca A10 antes de A2).
 *   - Etiquetar cada toma (p. ej. "A1", "A4") a partir del nombre del archivo.
 *
 * Para añadir imágenes nuevas basta con colocarlas en public/images/ con la
 * nomenclatura LETRA+NÚMERO y regenerar el catálogo (npm run images:build).
 * No hay que configurar manualmente las galerías.
 */
import catalogJson from '@/public/images/image-catalog.json'

export type ImageCatalog = Record<string, string[]>

export const IMAGE_CATALOG: ImageCatalog = catalogJson as ImageCatalog

/** Devuelve todas las tomas de un modelo (letra), ordenadas de forma natural. */
export function getModelGallery(letter: string): string[] {
  const key = letter.toUpperCase()
  return IMAGE_CATALOG[key] ?? []
}

/** Devuelve la toma principal (la primera de la galería) de un modelo. */
export function getModelMainImage(letter: string): string {
  const gallery = getModelGallery(letter)
  return gallery[0] ?? ''
}

/** Devuelve la letra de un archivo de imagen (p. ej. "a01.png" → "A"). */
export function getLetterFromFile(file: string): string {
  const base = file.split('/').pop() ?? file
  const m = base.match(/^([a-zA-Z])/)
  return m ? m[1].toUpperCase() : ''
}

/** Devuelve el número de toma de un archivo (p. ej. "a02.png" → 2, "x.png" → 0). */
export function getShotNumberFromFile(file: string): number {
  const base = file.split('/').pop() ?? file
  const m = base.match(/^[a-zA-Z](\d*)\./i)
  if (!m) return 0
  return m[1] === '' ? 0 : parseInt(m[1], 10)
}

/** Etiqueta legible de una toma (p. ej. "/a01.png" → "A1", "/x.png" → "X"). */
export function getShotLabel(file: string): string {
  const letter = getLetterFromFile(file)
  const num = getShotNumberFromFile(file)
  return num === 0 ? letter : `${letter}${num}`
}

/**
 * Orden natural de tomas dentro de un modelo: compara por número entero.
 * A1 → A2 → A10 → A11 (NUNCA A10 antes de A2).
 */
export function sortShotsNatural(files: string[]): string[] {
  return [...files].sort((a, b) => {
    const numA = getShotNumberFromFile(a)
    const numB = getShotNumberFromFile(b)
    if (numA !== numB) return numA - numB
    return a.localeCompare(b)
  })
}

/** Modelos disponibles (letras) en orden alfabético. */
export function getAvailableModels(): string[] {
  return Object.keys(IMAGE_CATALOG).sort()
}
