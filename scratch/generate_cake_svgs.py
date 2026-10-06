import os
import urllib.parse

output_dir = r"c:\Users\prasa\OneDrive\Desktop\SF\own project\Oct\Bakery & Confectionery\assets\images\customizer"
os.makedirs(output_dir, exist_ok=True)

cake_configs = {
    "cake_chocolate.svg": {
        "bg_top": "#FFF9F2", "bg_bot": "#EFE0D0",
        "cake_main": "#3A2118", "cake_top": "#5C3828", "cake_dark": "#20130E",
        "drip": "#2B1A14", "accent": "#F0C059", "macaron": "#4A2C20", "macaron_top": "#613D2D",
        "text": "BELGIAN DARK TRUFFLE 70%", "text_color": "#F0C059",
        "shape": "round"
    },
    "cake_pistachio.svg": {
        "bg_top": "#F4FAF2", "bg_bot": "#DCEDD7",
        "cake_main": "#9DBF8B", "cake_top": "#B8DBA6", "cake_dark": "#7A9E69",
        "drip": "#FFFFFF", "accent": "#E8B04B", "macaron": "#8CAF79", "macaron_top": "#A5C793",
        "text": "SICILIAN PISTACHIO DREAM", "text_color": "#9DBF8B",
        "shape": "round"
    },
    "cake_tiered.svg": {
        "bg_top": "#FFFDF9", "bg_bot": "#F5ECE0",
        "cake_main": "#FAF5EC", "cake_top": "#FFFDF9", "cake_dark": "#E2D6C5",
        "drip": "#FFFFFF", "accent": "#C98B4B", "macaron": "#F2E6D8", "macaron_top": "#FAF3E8",
        "text": "ROYAL MULTI-TIER GRAND GÂTEAU", "text_color": "#C98B4B",
        "shape": "tiered"
    },
    "cake_lavender.svg": {
        "bg_top": "#FAF5FC", "bg_bot": "#EAE0F0",
        "cake_main": "#CBB5E2", "cake_top": "#D4C0E8", "cake_dark": "#9C7EB8",
        "drip": "#FAF4FF", "accent": "#F0C059", "macaron": "#B091D1", "macaron_top": "#C4A8E3",
        "text": "LAVENDER MIST ATELIER", "text_color": "#E2D6EB",
        "shape": "round"
    },
    "cake_navy.svg": {
        "bg_top": "#F2F5F9", "bg_bot": "#DCE3ED",
        "cake_main": "#253551", "cake_top": "#34486D", "cake_dark": "#162236",
        "drip": "#F8FAFC", "accent": "#FFD700", "macaron": "#2B3E60", "macaron_top": "#415A88",
        "text": "ROYAL NAVY & 24K GOLD", "text_color": "#FFD700",
        "shape": "round"
    },
    "cake_blush.svg": {
        "bg_top": "#FFF5F7", "bg_bot": "#FBE4E8",
        "cake_main": "#F4CCD4", "cake_top": "#F9E2E6", "cake_dark": "#E2A8B4",
        "drip": "#FFFFFF", "accent": "#E8B04B", "macaron": "#EEB2BC", "macaron_top": "#F7CAD2",
        "text": "BLUSH ROSE VELVET", "text_color": "#F4CCD4",
        "shape": "round"
    },
    "cake_ivory.svg": {
        "bg_top": "#FFFDF9", "bg_bot": "#F7F0E4",
        "cake_main": "#FAF5EC", "cake_top": "#FFFDF8", "cake_dark": "#E6DCCA",
        "drip": "#FFFFFF", "accent": "#C98B4B", "macaron": "#F2E6D8", "macaron_top": "#FAF3E8",
        "text": "IVORY SILK VANILLA BEAN", "text_color": "#C98B4B",
        "shape": "round"
    },
    "cake_redvelvet.svg": {
        "bg_top": "#FFF5F5", "bg_bot": "#FCE8E8",
        "cake_main": "#8B1E2D", "cake_top": "#A52A3A", "cake_dark": "#63121F",
        "drip": "#FFFDF9", "accent": "#F0C059", "macaron": "#9E2333", "macaron_top": "#B83244",
        "text": "CLASSIC RED VELVET", "text_color": "#E63946",
        "shape": "round"
    },
    "cake_butterscotch.svg": {
        "bg_top": "#FFFBF2", "bg_bot": "#F9EED9",
        "cake_main": "#D49445", "cake_top": "#E5A95C", "cake_dark": "#B0732A",
        "drip": "#7A431D", "accent": "#FFE599", "macaron": "#C98232", "macaron_top": "#DC9648",
        "text": "SALTED BUTTERSCOTCH PRALINE", "text_color": "#D49445",
        "shape": "round"
    },
    "cake_heart.svg": {
        "bg_top": "#FFF5F8", "bg_bot": "#FCE3EC",
        "cake_main": "#F2B8C6", "cake_top": "#F8D2DC", "cake_dark": "#D993A4",
        "drip": "#FFFFFF", "accent": "#E8B04B", "macaron": "#EA9FB2", "macaron_top": "#F5C2CE",
        "text": "ROMANTIC HEART LAMBETH", "text_color": "#E85D75",
        "shape": "heart"
    },
    "cake_square.svg": {
        "bg_top": "#F8FAF8", "bg_bot": "#E6EBE6",
        "cake_main": "#4A3B32", "cake_top": "#5C4B40", "cake_dark": "#362A23",
        "drip": "#FAF5EC", "accent": "#C98B4B", "macaron": "#7A685A", "macaron_top": "#948071",
        "text": "ARCHITECTURAL SQUARE", "text_color": "#C98B4B",
        "shape": "square"
    }
}

def generate_svg(filename, cfg):
    is_heart = cfg["shape"] == "heart"
    is_square = cfg["shape"] == "square"
    is_tiered = cfg["shape"] == "tiered"
    
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="40%" r="65%">
      <stop offset="0%" stop-color="{cfg['bg_top']}"/>
      <stop offset="100%" stop-color="{cfg['bg_bot']}"/>
    </radialGradient>
    <linearGradient id="cakeStand" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#F2E6D8"/>
      <stop offset="50%" stop-color="#D8C2AC"/>
      <stop offset="100%" stop-color="#B89F88"/>
    </linearGradient>
    <linearGradient id="cakeBody" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="{cfg['cake_top']}"/>
      <stop offset="50%" stop-color="{cfg['cake_main']}"/>
      <stop offset="100%" stop-color="{cfg['cake_dark']}"/>
    </linearGradient>
    <filter id="softDrop" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="14" stdDeviation="18" flood-color="#2B1A14" flood-opacity="0.25"/>
    </filter>
  </defs>

  <!-- Studio Background -->
  <rect width="600" height="600" fill="url(#bgGrad)"/>

  <!-- Cake Stand Base & Plate -->
  <g filter="url(#softDrop)">
    <ellipse cx="300" cy="495" rx="145" ry="24" fill="#B89F88" opacity="0.35"/>
    <path d="M260 470 L340 470 L350 515 L250 515 Z" fill="url(#cakeStand)"/>
    <ellipse cx="300" cy="470" rx="205" ry="32" fill="url(#cakeStand)"/>
    <ellipse cx="300" cy="466" rx="196" ry="28" fill="#FFFDF9"/>
  </g>
'''

    if is_tiered:
        svg += f'''
  <!-- Royal 3-Tier Grand Cake -->
  <g filter="url(#softDrop)">
    <!-- Bottom Tier -->
    <path d="M160 350 L160 440 C160 470, 440 470, 440 440 L440 350 Z" fill="url(#cakeBody)"/>
    <ellipse cx="300" cy="350" rx="140" ry="32" fill="{cfg['cake_top']}"/>
    
    <!-- Middle Tier -->
    <path d="M200 270 L200 350 C200 375, 400 375, 400 350 L400 270 Z" fill="url(#cakeBody)"/>
    <ellipse cx="300" cy="270" rx="100" ry="24" fill="{cfg['cake_top']}"/>
    
    <!-- Top Tier -->
    <path d="M240 200 L240 270 C240 290, 360 290, 360 270 L360 200 Z" fill="url(#cakeBody)"/>
    <ellipse cx="300" cy="200" rx="60" ry="16" fill="{cfg['cake_top']}"/>

    <!-- Shell Piping Garland Ribbons -->
    <path d="M240 220 Q 300 240 360 220" stroke="{cfg['accent']}" stroke-width="4" fill="none"/>
    <path d="M200 290 Q 300 320 400 290" stroke="{cfg['accent']}" stroke-width="5" fill="none"/>
    <path d="M160 370 Q 300 410 440 370" stroke="{cfg['accent']}" stroke-width="6" fill="none"/>
  </g>
'''
    elif is_heart:
        svg += f'''
  <!-- Heart Shaped Cake Body -->
  <g filter="url(#softDrop)">
    <path d="M300 240 
             C240 170, 130 230, 130 320 
             C130 400, 240 440, 300 460 
             C360 440, 470 400, 470 320 
             C470 230, 360 170, 300 240 Z" fill="url(#cakeBody)"/>
    <path d="M300 240 
             C250 185, 145 235, 145 315 
             C145 385, 245 425, 300 445 
             C355 425, 455 385, 455 315 
             C455 235, 350 185, 300 240 Z" fill="{cfg['cake_top']}"/>
    <!-- Shell Piping along Heart Edge -->
    <path d="M300 245 C252 190, 150 240, 150 318 C150 380, 248 420, 300 440 C352 420, 450 380, 450 318 C450 240, 348 190, 300 245 Z" 
          fill="none" stroke="{cfg['drip']}" stroke-width="12" stroke-dasharray="14 8" stroke-linecap="round"/>
  </g>
'''
    elif is_square:
        svg += f'''
  <!-- Architectural Square Cake Body -->
  <g filter="url(#softDrop)">
    <path d="M160 270 L440 270 L440 430 L160 430 Z" fill="url(#cakeBody)"/>
    <polygon points="160,270 300,220 440,270 300,320" fill="{cfg['cake_top']}"/>
    <polygon points="440,270 440,430 300,470 300,320" fill="{cfg['cake_dark']}"/>
    <polygon points="160,270 300,320 300,470 160,430" fill="{cfg['cake_main']}"/>
  </g>
'''
    else:
        svg += f'''
  <!-- Classic Round Cake Body -->
  <g filter="url(#softDrop)">
    <path d="M140 270 L140 430 C140 468, 460 468, 460 430 L460 270 Z" fill="url(#cakeBody)"/>
    <ellipse cx="300" cy="270" rx="160" ry="42" fill="url(#cakeBody)"/>
    <ellipse cx="300" cy="266" rx="156" ry="40" fill="{cfg['cake_top']}"/>
    
    <!-- Smooth Cream Drips -->
    <path d="M140 270 
             Q 165 325 185 280 
             Q 215 345 235 278 
             Q 265 355 295 282 
             Q 335 365 365 278 
             Q 395 335 425 282 
             Q 445 320 460 270 
             C 460 305, 140 305, 140 270 Z" fill="{cfg['drip']}" opacity="0.92"/>
  </g>
'''

    # Topping garnishes (Macarons, Gold Leaf & Berries)
    svg += f'''
  <!-- Decadent Toppings -->
  <g transform="translate(300, {185 if is_tiered else 255})">
    <!-- French Macarons -->
    <g transform="translate(-45, -20)">
      <ellipse cx="0" cy="0" rx="26" ry="13" fill="{cfg['macaron']}"/>
      <rect x="-24" y="-2" width="48" height="5" rx="2.5" fill="{cfg['drip']}"/>
      <ellipse cx="0" cy="-5" rx="25" ry="12" fill="{cfg['macaron_top']}"/>
    </g>
    <g transform="translate(45, -15)">
      <ellipse cx="0" cy="0" rx="26" ry="13" fill="{cfg['macaron']}"/>
      <rect x="-24" y="-2" width="48" height="5" rx="2.5" fill="{cfg['drip']}"/>
      <ellipse cx="0" cy="-5" rx="25" ry="12" fill="{cfg['macaron_top']}"/>
    </g>

    <!-- 24K Gold Flakes -->
    <path d="M-85 10 L-72 -5 L-65 12 Z" fill="{cfg['accent']}"/>
    <path d="M-10 -38 L8 -32 L0 -18 Z" fill="{cfg['accent']}"/>
    <path d="M75 5 L90 18 L78 26 Z" fill="{cfg['accent']}"/>

    <!-- Fresh Raspberries -->
    <circle cx="-15" cy="-15" r="14" fill="#C72C41"/>
    <circle cx="12" cy="-22" r="15" fill="#9E1B32"/>
    <circle cx="0" cy="-5" r="16" fill="#D9384E"/>
  </g>

  <!-- Studio Identity Label Badge -->
  <g transform="translate(300, 545)">
    <rect x="-140" y="-18" width="280" height="36" rx="18" fill="rgba(43,26,20,0.88)" stroke="{cfg['accent']}" stroke-width="1.5"/>
    <text x="0" y="5" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="800" fill="{cfg['text_color']}" text-anchor="middle" letter-spacing="1.8">{cfg['text']}</text>
  </g>
</svg>
'''
    filepath = os.path.join(output_dir, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(svg)
    print(f"Generated {filepath}")

for fname, config in cake_configs.items():
    generate_svg(fname, config)
