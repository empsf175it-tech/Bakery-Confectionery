import os
import urllib.parse
import re

customizer_dir = r"c:\Users\prasa\OneDrive\Desktop\SF\own project\Oct\Bakery & Confectionery\assets\images\customizer"
js_file = r"c:\Users\prasa\OneDrive\Desktop\SF\own project\Oct\Bakery & Confectionery\assets\js\customizer.js"

svg_files = [
    "cake_chocolate.svg",
    "cake_pistachio.svg",
    "cake_tiered.svg",
    "cake_lavender.svg",
    "cake_navy.svg",
    "cake_blush.svg",
    "cake_ivory.svg",
    "cake_redvelvet.svg",
    "cake_butterscotch.svg",
    "cake_heart.svg",
    "cake_square.svg"
]

data_uris = {}

for fname in svg_files:
    fpath = os.path.join(customizer_dir, fname)
    if os.path.exists(fpath):
        with open(fpath, "r", encoding="utf-8") as f:
            svg_text = f.read()
            encoded = urllib.parse.quote(svg_text)
            key = fname.replace(".svg", "").replace("cake_", "")
            data_uris[key] = f"data:image/svg+xml;charset=utf-8,{encoded}"

print("Compiled Data URIs keys:", list(data_uris.keys()))

# Read JS file
with open(js_file, "r", encoding="utf-8") as f:
    js_content = f.read()

# Build JS dictionary
js_dict_str = "  cakeDataUris: {\n"
for k, uri in data_uris.items():
    js_dict_str += f"    '{k}': '{uri}',\n"
js_dict_str += "  },\n"

# Replace updatePreviewVisuals in customizer.js with robust Data URI + fallback switcher
new_update_preview = js_dict_str + '''  updatePreviewVisuals: function() {
    const realImg = document.getElementById('cakeRealImage');
    const dietaryTag = document.getElementById('liveDietaryTag');

    if (realImg) {
      const colorName = (this.state.colorName || '').toLowerCase();
      const flavorKey = (this.state.flavor || '').toLowerCase();
      const shapeKey = (this.state.shape || '').toLowerCase();

      let targetKey = 'chocolate';

      // 1:1 Option-to-Image distinct mapping matrix
      if (colorName.includes('lavender')) {
        targetKey = 'lavender';
      } else if (colorName.includes('navy') || colorName.includes('blue')) {
        targetKey = 'navy';
      } else if (colorName.includes('blush') || colorName.includes('rose')) {
        targetKey = 'blush';
      } else if (colorName.includes('ivory') || colorName.includes('silk')) {
        targetKey = 'ivory';
      } else if (colorName.includes('pistachio') || flavorKey.includes('pistachio')) {
        targetKey = 'pistachio';
      } else if (flavorKey.includes('redvelvet')) {
        targetKey = 'redvelvet';
      } else if (flavorKey.includes('butterscotch')) {
        targetKey = 'butterscotch';
      } else if (shapeKey === 'heart') {
        targetKey = 'heart';
      } else if (shapeKey === 'square') {
        targetKey = 'square';
      } else if (shapeKey === 'tiered' || this.state.size === '5.0' || this.state.size === '3.0') {
        targetKey = 'tiered';
      } else {
        targetKey = 'chocolate';
      }

      const targetUri = this.cakeDataUris[targetKey] || this.cakeDataUris['chocolate'];

      if (realImg.src !== targetUri) {
        realImg.style.opacity = '0.3';
        setTimeout(() => {
          realImg.src = targetUri;
          realImg.style.opacity = '1';
        }, 120);
      }
    }

    // Dietary tag label
    if (dietaryTag) {
      if (this.state.dietary.length > 0) {
        dietaryTag.textContent = this.state.dietary.map(d => this.pricingMatrix.dietary[d].label).join(' • ');
        dietaryTag.style.display = 'inline-block';
      } else {
        dietaryTag.style.display = 'none';
      }
    }

    // Specs summary update
    const specFlavor = document.getElementById('specFlavor');
    const specSize = document.getElementById('specSize');
    const specFrosting = document.getElementById('specFrosting');
    if (specFlavor) specFlavor.textContent = this.state.flavorLabel;
    if (specSize) specSize.textContent = this.state.sizeLabel;
    if (specFrosting) specFrosting.textContent = `${this.state.colorName} (${this.state.frostingLabel})`;
  },'''

# Replace in js_content
pattern = r"  updatePreviewVisuals: function\(\) \{[\s\S]*?\n  \},"
if re.search(pattern, js_content):
    js_content = re.sub(pattern, new_update_preview, js_content)
    with open(js_file, "w", encoding="utf-8") as f:
        f.write(js_content)
    print("Successfully updated customizer.js with compiled Data URIs!")
else:
    print("Could not find pattern in customizer.js!")
