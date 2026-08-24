# STENCIL2 — Procesa TODAS las fotos oficiales (docs/Gafas) y las compone sobre
# fondo oscuro premium (glow radial + sombra de contacto) con recorte profesional.
param([int]$MaxWidth = 1400)

$ErrorActionPreference = 'Stop'
$root = Get-Location
$srcDir = Join-Path $root 'docs\Gafas'
$outDir = Join-Path $root 'public\images\gafas'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

Add-Type -Path (Join-Path $root 'scripts\GafasProcessor.cs') -ReferencedAssemblies 'System.Drawing'

# ratio = ancho/alto del lienzo. Principal = 4:5 (0.80). Detalle/editorial = 1:1 (1.0).
$jobs = @(
  # ---- CLASSIC BLUE (S2-001) ----
  @{ Src = '1.png';      Out = 'classic-blue.png';       Ratio = 0.80; Fill = 0.88 }
  @{ Src = '1.1.png';    Out = 'classic-blue-1.png';     Ratio = 1.0;  Fill = 0.86 }
  @{ Src = '1.2.png';    Out = 'classic-blue-2.png';     Ratio = 1.0;  Fill = 0.86 }
  @{ Src = '1.3.png';    Out = 'classic-blue-3.png';     Ratio = 1.0;  Fill = 0.86 }
  @{ Src = '1.4.png';    Out = 'classic-blue-4.png';     Ratio = 1.0;  Fill = 0.86 }
  @{ Src = '1.5.png';    Out = 'classic-blue-5.png';     Ratio = 1.0;  Fill = 0.86 }
  @{ Src = 'gafas1.jpg';    Out = 'classic-blue-6.png';  Ratio = 1.0;  Fill = 0.86 }
  @{ Src = 'gafas1-a.jpg';  Out = 'classic-blue-7.png';  Ratio = 1.0;  Fill = 0.86 }
  @{ Src = 'gafas1-b.jpg';  Out = 'classic-blue-8.png';  Ratio = 1.0;  Fill = 0.86 }
  @{ Src = 'gafas1-c.jpg';  Out = 'classic-blue-9.png';  Ratio = 1.0;  Fill = 0.86 }
  @{ Src = 'gafas-1d.jpg';  Out = 'classic-blue-10.png'; Ratio = 1.0;  Fill = 0.86 }
  @{ Src = 'gafas1-f.jpg';  Out = 'classic-blue-11.png'; Ratio = 1.0;  Fill = 0.86 }

  # ---- ONYX BLACK (S2-002) ----
  @{ Src = '2.png';   Out = 'onyx-black.png';     Ratio = 0.80; Fill = 0.88 }
  @{ Src = '2.1.png'; Out = 'onyx-black-1.png';   Ratio = 1.0;  Fill = 0.86 }
  @{ Src = '2.2.png'; Out = 'onyx-black-2.png';   Ratio = 1.0;  Fill = 0.86 }
  @{ Src = '2.3.png'; Out = 'onyx-black-3.png';   Ratio = 1.0;  Fill = 0.86 }
  @{ Src = '2.4.png'; Out = 'onyx-black-4.png';   Ratio = 1.0;  Fill = 0.86 }
  @{ Src = '2.5.png'; Out = 'onyx-black-5.png';   Ratio = 1.0;  Fill = 0.86 }

  # ---- OLIVE CRYSTAL (S2-003) ----
  @{ Src = '3.png';   Out = 'olive-crystal.png';   Ratio = 0.80; Fill = 0.88 }
  @{ Src = '3.1.png'; Out = 'olive-crystal-1.png'; Ratio = 1.0;  Fill = 0.86 }
  @{ Src = '3.2.png'; Out = 'olive-crystal-2.png'; Ratio = 1.0;  Fill = 0.86 }
  @{ Src = '3.3.png'; Out = 'olive-crystal-3.png'; Ratio = 1.0;  Fill = 0.86 }
  @{ Src = '3.4.png'; Out = 'olive-crystal-4.png'; Ratio = 1.0;  Fill = 0.86 }
  @{ Src = '3.5.png'; Out = 'olive-crystal-5.png'; Ratio = 1.0;  Fill = 0.86 }

  # ---- SMOKE GREY (S2-004) ----
  @{ Src = '4.png'; Out = 'smoke-grey.png'; Ratio = 0.80; Fill = 0.88 }

  # ---- AVIATOR GOLD (S2-005) ----
  @{ Src = '5.png'; Out = 'aviator-gold.png'; Ratio = 0.80; Fill = 0.88 }
)

foreach ($j in $jobs) {
  $src = Join-Path $srcDir $j.Src
  $out = Join-Path $outDir $j.Out
  if (-not (Test-Path $src)) { Write-Warning "No existe: $src"; continue }
  try {
    $info = [GafasProcessor]::Process($src, $out, $MaxWidth, $j.Ratio, $j.Fill)
    $kb = [math]::Round((Get-Item $out).Length / 1KB, 1)
    Write-Output "OK  $($j.Src) -> $($j.Out)  [$info]  ${kb} KB"
  } catch {
    Write-Warning "FALLO $($j.Src): $($_.Exception.Message)"
  }
}
