import sys
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
import math
import random

def create_gold_tier_wedding_cake(path):
    width, height = 800, 800
    img = Image.new('RGB', (width, height), (253, 250, 245))
    draw = ImageDraw.Draw(img)
    
    # Elegant studio marble-style gradient background
    for y in range(height):
        r = int(255 - (y / height) * 15)
        g = int(248 - (y / height) * 20)
        b = int(240 - (y / height) * 25)
        draw.line([(0, y), (width, y)], fill=(r, g, b))
        
    # Table surface
    table_y = 620
    draw.rectangle([0, table_y, width, height], fill=(235, 222, 208))
    draw.line([0, table_y, width, table_y], fill=(210, 192, 172), width=3)
    
    # Shadow under cake stand
    draw.ellipse([220, 610, 580, 640], fill=(180, 160, 140))
    
    # Gold Cake Stand
    draw.polygon([(260, 590), (540, 590), (560, 620), (240, 620)], fill=(212, 175, 55))
    draw.ellipse([230, 580, 570, 600], fill=(235, 200, 85))
    draw.ellipse([235, 582, 565, 598], fill=(250, 220, 110))
    
    # 4 Tiers of Wedding Cake (Bottom to Top)
    tiers = [
        {'y_bottom': 580, 'height': 110, 'w_bottom': 260, 'w_top': 250, 'color': (255, 252, 248)}, # Tier 1 (bottom)
        {'y_bottom': 470, 'height': 100, 'w_bottom': 210, 'w_top': 200, 'color': (255, 252, 248)}, # Tier 2
        {'y_bottom': 370, 'height': 90,  'w_bottom': 160, 'w_top': 150, 'color': (255, 252, 248)}, # Tier 3
        {'y_bottom': 280, 'height': 80,  'w_bottom': 110, 'w_top': 100, 'color': (255, 252, 248)}  # Tier 4 (top)
    ]
    
    for t in tiers:
        yb = t['y_bottom']
        yt = yb - t['height']
        wb = t['w_bottom']
        wt = t['w_top']
        cx = 400
        
        # Tier Shadow
        draw.ellipse([cx - wb - 5, yb - 15, cx + wb + 5, yb + 15], fill=(230, 215, 200))
        # Body
        draw.polygon([
            (cx - wb, yb), (cx + wb, yb),
            (cx + wt, yt), (cx - wt, yt)
        ], fill=t['color'])
        # Side shading for 3D cylinder depth
        for i in range(wb):
            alpha = int((i / wb) * 35)
            draw.line([(cx + i, yt), (cx + i, yb)], fill=(240 - alpha, 230 - alpha, 220 - alpha))
            draw.line([(cx - i, yt), (cx - i, yb)], fill=(255, 252, 248))
        # Ellipse tops
        draw.ellipse([cx - wb, yb - 12, cx + wb, yb + 12], fill=t['color'])
        draw.ellipse([cx - wt, yt - 10, cx + wt, yt + 10], fill=(255, 255, 250))
        
        # Gold Leaf Accents on each tier
        random.seed(yb)
        for _ in range(12):
            gx = cx + random.randint(-wt + 10, wt - 10)
            gy = yt + random.randint(10, t['height'] - 10)
            gr = random.randint(4, 12)
            draw.ellipse([gx - gr, gy - gr//2, gx + gr, gy + gr//2], fill=(225, 185, 60))
            draw.ellipse([gx - gr//2, gy - gr//3, gx + gr//2, gy + gr//3], fill=(255, 225, 110))
            
    # Topper - Sugar Roses & Botanicals
    # Top flowers
    flowers = [(400, 185, 22), (375, 195, 18), (425, 195, 18), (390, 280, 16), (410, 370, 16)]
    for fx, fy, fr in flowers:
        draw.ellipse([fx - fr, fy - fr, fx + fr, fy + fr], fill=(248, 220, 225))
        draw.ellipse([fx - fr*0.7, fy - fr*0.7, fx + fr*0.7, fy + fr*0.7], fill=(240, 180, 195))
        draw.ellipse([fx - fr*0.4, fy - fr*0.4, fx + fr*0.4, fy + fr*0.4], fill=(225, 140, 165))
        
    img.save(path, 'WEBP', quality=95)
    print(f"Generated {path}")

create_gold_tier_wedding_cake("assets/images/gallery/wedding_golden_tier.webp")
