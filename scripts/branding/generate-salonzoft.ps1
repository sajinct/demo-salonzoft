# Rebuild self-contained SVG artwork on Windows. Delivered SVGs need no fonts.
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$brandRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../..'))
$brandCulture = [Globalization.CultureInfo]::InvariantCulture
function Number([double]$Value) { return $Value.ToString('0.###', $brandCulture) }

function Outline([string]$Text, [string]$Family, [single]$Size, [single]$Tracking = 0) {
  $fontFamily = [Drawing.FontFamily]::new($Family)
  $font = [Drawing.Font]::new($fontFamily, $Size, [Drawing.FontStyle]::Regular, [Drawing.GraphicsUnit]::Pixel)
  $format = [Drawing.StringFormat]::GenericTypographic.Clone()
  $format.FormatFlags = $format.FormatFlags -bor [Drawing.StringFormatFlags]::MeasureTrailingSpaces
  $geometry = [Drawing.Drawing2D.GraphicsPath]::new()
  $bitmap = [Drawing.Bitmap]::new(1, 1)
  $graphics = [Drawing.Graphics]::FromImage($bitmap)
  if ($Tracking -eq 0) {
    $geometry.AddString($Text, $fontFamily, 0, $Size, [Drawing.PointF]::new(0, 0), $format)
  } else {
    [single]$offset = 0
    foreach ($character in $Text.ToCharArray()) {
      $geometry.AddString([string]$character, $fontFamily, 0, $Size, [Drawing.PointF]::new($offset, 0), $format)
      $offset += $graphics.MeasureString([string]$character, $font, [int]::MaxValue, $format).Width + $Tracking
    }
  }
  $bounds = $geometry.GetBounds()
  $points = $geometry.PathPoints
  $types = $geometry.PathTypes
  $data = [Text.StringBuilder]::new()
  for ($i = 0; $i -lt $points.Length; $i++) {
    $kind = [int]$types[$i] -band 7
    if ($kind -eq 0) { [void]$data.Append("M$(Number $points[$i].X) $(Number $points[$i].Y)") }
    elseif ($kind -eq 1) { [void]$data.Append("L$(Number $points[$i].X) $(Number $points[$i].Y)") }
    elseif ($kind -eq 3) {
      [void]$data.Append("C$(Number $points[$i].X) $(Number $points[$i].Y) $(Number $points[$i+1].X) $(Number $points[$i+1].Y) $(Number $points[$i+2].X) $(Number $points[$i+2].Y)")
      $i += 2
    }
    if (([int]$types[$i] -band 128) -ne 0) { [void]$data.Append('Z') }
  }
  $result = @{ Data = $data.ToString(); X = $bounds.X; Y = $bounds.Y; Width = $bounds.Width; Height = $bounds.Height }
  $geometry.Dispose(); $graphics.Dispose(); $bitmap.Dispose(); $font.Dispose(); $fontFamily.Dispose(); $format.Dispose()
  return $result
}

function Lettering($Outline, [double]$CenterX, [double]$Top, [double]$Height, [string]$Fill) {
  $scale = $Height / $Outline.Height
  $left = $CenterX - $Outline.Width * $scale / 2
  return "<g fill=`"$Fill`" transform=`"translate($(Number $left) $(Number $Top)) scale($(Number $scale)) translate($(Number (-$Outline.X)) $(Number (-$Outline.Y)))`"><path d=`"$($Outline.Data)`"/></g>"
}

# High-contrast luxury display serif wordmark & spaced tagline
$word = Outline 'Salonzoft' 'Georgia' 100 0.8
$tagline = Outline 'SALON & SPA MANAGEMENT' 'Arial' 18 3.2

$defs = @'
<defs>
  <radialGradient id="szIvory" cx="0.46" cy="0.35" r="0.76">
    <stop stop-color="#FFFDFA"/>
    <stop offset="0.58" stop-color="#FBF8F1"/>
    <stop offset="1" stop-color="#F1E2CA"/>
  </radialGradient>
  <linearGradient id="szEmerald" x1="48" y1="54" x2="152" y2="200" gradientUnits="userSpaceOnUse">
    <stop stop-color="#056843"/>
    <stop offset="0.45" stop-color="#005A38"/>
    <stop offset="1" stop-color="#003B26"/>
  </linearGradient>
  <linearGradient id="szWordEmerald" x1="160" y1="380" x2="640" y2="480" gradientUnits="userSpaceOnUse">
    <stop stop-color="#005A38"/>
    <stop offset="0.55" stop-color="#00442B"/>
    <stop offset="1" stop-color="#005234"/>
  </linearGradient>
  <linearGradient id="salonzoftGold" x1="38" y1="196" x2="178" y2="54" gradientUnits="userSpaceOnUse">
    <stop stop-color="#A8741E"/>
    <stop offset="0.24" stop-color="#D9A840"/>
    <stop offset="0.48" stop-color="#F8DE8C"/>
    <stop offset="0.68" stop-color="#D4A138"/>
    <stop offset="0.86" stop-color="#FCEAA8"/>
    <stop offset="1" stop-color="#B98528"/>
  </linearGradient>
  <linearGradient id="szRim" x1="12" y1="12" x2="244" y2="244" gradientUnits="userSpaceOnUse">
    <stop stop-color="#A66D19"/>
    <stop offset="0.18" stop-color="#F4D788"/>
    <stop offset="0.38" stop-color="#A56E1B"/>
    <stop offset="0.56" stop-color="#F9E7B2"/>
    <stop offset="0.78" stop-color="#C28D2E"/>
    <stop offset="1" stop-color="#E5BF6E"/>
  </linearGradient>
  <radialGradient id="szStar" cx="0.5" cy="0.5" r="0.56">
    <stop stop-color="#FFFFF2"/>
    <stop offset="0.22" stop-color="#FFF4B8"/>
    <stop offset="0.55" stop-color="#E8BE54"/>
    <stop offset="1" stop-color="#A87119"/>
  </radialGradient>
</defs>
'@

# Sculpted S-curve emerald hair locks + luminous gold ribbon + calligraphic accent strand + glow star (centered at x=128)
$hair = '<path d="M167 61C129 44 93 64 81 101C69 138 76 165 39 190C76 193 111 175 127 144C144 112 132 83 167 61Z" fill="url(#szEmerald)"/><path d="M161 63C131 53 102 71 91 103C80 135 84 159 54 182C79 180 103 165 116 140C131 112 128 84 161 63Z" fill="#0A754C" opacity="0.42"/>'
$ribbon = '<path d="M165 62C136 83 139 117 119 151C100 182 69 198 37 196C72 186 94 163 104 133C116 99 120 75 165 62Z" fill="url(#salonzoftGold)"/><path d="M163 65C131 86 131 122 111 155C94 182 68 196 42 198" fill="none" stroke="#DFB85C" stroke-width="1.2" stroke-linecap="round" opacity="0.85"/>'
$sparkle = '<path d="M183 29C185 43 189 47 203 49C189 51 185 55 183 69C181 55 177 51 163 49C177 47 181 43 183 29Z" fill="url(#szStar)" stroke="#B58225" stroke-width="0.5"/><path d="M183 39C184 46 185 48 192 49C185 50 184 52 183 59C182 52 181 50 174 49C181 48 182 46 183 39Z" fill="#FFFDF0" opacity="0.8"/>'

$symbol = '<g transform="translate(8 14)">' + $hair + $ribbon + $sparkle + '</g>'

# Compact icon geometry for 16px-64px legibility: bold silhouette, clean flat contrast
$smallSymbol = '<g transform="translate(8 14)"><path d="M167 61C129 44 93 64 81 101C69 138 76 165 39 190C76 193 111 175 127 144C144 112 132 83 167 61Z" fill="#005A38"/><path d="M165 62C136 83 139 117 119 151C100 182 69 198 37 196C72 186 94 163 104 133C116 99 120 75 165 62Z" fill="#C89A3B"/><path d="M183 29C185 43 189 47 203 49C189 51 185 55 183 69C181 55 177 51 163 49C177 47 181 43 183 29Z" fill="#C89A3B"/></g>'

# Warm Ivory tile with polished multi-layer gold rim
$tile = '<rect width="256" height="256" rx="57" fill="url(#szIvory)"/>'
$rim = '<rect x="4" y="4" width="248" height="248" rx="54" fill="none" stroke="url(#szRim)" stroke-width="2.5"/><rect x="8" y="8" width="240" height="240" rx="50" fill="none" stroke="#E6CA82" stroke-width="0.9" opacity="0.75"/>'
$mark = $tile + $rim + $symbol

function Svg([string]$Name, [string]$Dimensions, [string]$Content) {
  return "<svg xmlns=`"http://www.w3.org/2000/svg`" $Dimensions fill=`"none`" role=`"img`" aria-labelledby=`"title desc`"><title id=`"title`">$Name</title><desc id=`"desc`">Salonzoft salon and spa management. Sculpted emerald and champagne-gold hair flow, four-point beauty glow and luxury serif wordmark.</desc>$defs$Content</svg>`n"
}
function Save([string]$Name, [string]$Content) {
  [IO.File]::WriteAllText((Join-Path $brandRoot $Name), $Content, [Text.UTF8Encoding]::new($false))
}

# Stacked presentation logos (with decorative gold rules flanking the tagline, echoing Miznora)
$taglineRules = '<line x1="168" y1="511" x2="232" y2="511" stroke="#B8892E" stroke-width="1.4" stroke-linecap="round" opacity="0.75"/><line x1="568" y1="511" x2="632" y2="511" stroke="#B8892E" stroke-width="1.4" stroke-linecap="round" opacity="0.75"/>'
$stacked = "<g transform=`"translate(192 22) scale(1.65)`">$symbol</g>" + (Lettering $word 400 388 78 'url(#szWordEmerald)') + $taglineRules + (Lettering $tagline 400 504 12.5 '#8A6321')
Save 'logo-transparent.svg' (Svg 'Salonzoft — Salon &amp; Spa Management' 'width="800" height="640" viewBox="0 0 800 640"' $stacked)
Save 'logo.svg' (Svg 'Salonzoft — Salon &amp; Spa Management' 'width="800" height="640" viewBox="0 0 800 640"' ('<rect width="800" height="640" rx="24" fill="url(#szIvory)"/>' + $stacked))

# Horizontal header logos (light, dark reversed, monochrome) — compact gap after removing face
$wordWidth = $word.Width * 66 / $word.Height
$horizontalWidth = [Math]::Ceiling(172 + $wordWidth)
$horizontalDimensions = "width=`"$horizontalWidth`" height=`"160`" viewBox=`"0 0 $horizontalWidth 160`""
$headerSymbol = '<g transform="translate(8 14)"><path d="M167 61C129 44 93 64 81 101C69 138 76 165 39 190C76 193 111 175 127 144C144 112 132 83 167 61Z" fill="url(#szEmerald)"/><path d="M165 62C136 83 139 117 119 151C100 182 69 198 37 196C72 186 94 163 104 133C116 99 120 75 165 62Z" fill="url(#salonzoftGold)"/>' + $sparkle + '</g>'
$horizontalIcon = "<g transform=`"translate(-4 -4) scale(.66)`">$headerSymbol</g>"
$horizontal = $horizontalIcon + (Lettering $word (150 + $wordWidth / 2) 47 66 '#005A38')
Save 'logo-horizontal.svg' (Svg 'Salonzoft' $horizontalDimensions $horizontal)

# Reversed dark horizontal logo
$darkSymbol = '<g transform="translate(8 14)"><path d="M167 61C129 44 93 64 81 101C69 138 76 165 39 190C76 193 111 175 127 144C144 112 132 83 167 61Z" fill="#FBF8F1"/><path d="M165 62C136 83 139 117 119 151C100 182 69 198 37 196C72 186 94 163 104 133C116 99 120 75 165 62Z" fill="url(#salonzoftGold)"/>' + $sparkle + '</g>'
$darkHorizontalIcon = "<g transform=`"translate(-4 -4) scale(.66)`">$darkSymbol</g>"
Save 'logo-horizontal-dark.svg' (Svg 'Salonzoft — reversed' $horizontalDimensions ($darkHorizontalIcon + (Lettering $word (150 + $wordWidth / 2) 47 66 '#FBF8F1')))

# Monochrome one-colour logo
$monoSymbol = '<g transform="translate(8 14)"><path d="M167 61C129 44 93 64 81 101C69 138 76 165 39 190C76 193 111 175 127 144C144 112 132 83 167 61Z" fill="#005A38"/><path d="M165 62C136 83 139 117 119 151C100 182 69 198 37 196C72 186 94 163 104 133C116 99 120 75 165 62Z" fill="#005A38" opacity="0.72"/><path d="M183 29C185 43 189 47 203 49C189 51 185 55 183 69C181 55 177 51 163 49C177 47 181 43 183 29Z" fill="#005A38"/></g>'
$monoHorizontalIcon = "<g transform=`"translate(-4 -4) scale(.66)`">$monoSymbol</g>"
Save 'logo-monochrome.svg' (Svg 'Salonzoft — one colour' $horizontalDimensions ($monoHorizontalIcon + (Lettering $word (150 + $wordWidth / 2) 47 66 '#005A38')))

# Standalone mark, wordmark, and app icons
Save 'brand-mark.svg' (Svg 'Salonzoft salon emblem' 'width="256" height="256" viewBox="0 0 256 256"' $symbol)
Save 'wordmark.svg' (Svg 'Salonzoft wordmark' 'width="640" height="160" viewBox="0 0 640 160"' (Lettering $word 320 37 86 '#005A38'))
$icon = '<g transform="scale(4)">' + $mark + '</g>'
Save 'app-icon.svg' (Svg 'Salonzoft app icon' 'width="1024" height="1024" viewBox="0 0 1024 1024"' $icon)
$smallTile = '<rect width="256" height="256" rx="57" fill="#FBF8F1"/><rect x="5" y="5" width="246" height="246" rx="53" fill="none" stroke="#D8B76C" stroke-width="2"/>'
Save 'app-icon-simplified.svg' (Svg 'Salonzoft small app icon' 'width="1024" height="1024" viewBox="0 0 1024 1024"' ('<g transform="scale(4)">' + $smallTile + $smallSymbol + '</g>'))
Write-Output 'Generated finalized Salonzoft emerald and gold hair-and-glow identity as nine self-contained SVGs.'
