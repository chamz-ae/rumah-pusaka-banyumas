from PIL import Image, ImageDraw
import os

# Buat folder public jika belum ada
os.makedirs('public', exist_ok=True)

def create_pwa_icon(size, filename):
    # Latar Hitam Museum #0D0D0D
    img = Image.new('RGBA', (size, size), color=(13, 13, 13, 255))
    draw = ImageDraw.Draw(img)
    
    # Bingkai Luar Aksen Emas #D4AF37
    margin = int(size * 0.08)
    draw.rectangle(
        [margin, margin, size - margin, size - margin],
        outline=(212, 175, 55, 255),
        width=int(size * 0.03)
    )
    
    # Simbol Gedung Museum Emas
    center = size / 2
    
    # Segitiga Atap
    roof_top = (center, size * 0.25)
    roof_left = (size * 0.22, size * 0.40)
    roof_right = (size * 0.78, size * 0.40)
    draw.polygon([roof_top, roof_left, roof_right], fill=(212, 175, 55, 255))
    
    # Balok Atap
    draw.rectangle([size * 0.20, size * 0.42, size * 0.80, size * 0.46], fill=(212, 175, 55, 255))
    
    # 4 Pilar Museum
    pillar_width = size * 0.08
    pillar_top = size * 0.48
    pillar_bottom = size * 0.68
    for i in range(4):
        p_x = size * (0.24 + i * 0.16)
        draw.rectangle([p_x, pillar_top, p_x + pillar_width, pillar_bottom], fill=(212, 175, 55, 255))
        
    # Pondasi Bawah
    draw.rectangle([size * 0.18, size * 0.70, size * 0.82, size * 0.76], fill=(212, 175, 55, 255))
    
    img.save(f'public/{filename}')
    print(f"✓ Berhasil membuat public/{filename} ({size}x{size})")

create_pwa_icon(192, 'icon-192.png')
create_pwa_icon(512, 'icon-512.png')
create_pwa_icon(180, 'apple-touch-icon.png')