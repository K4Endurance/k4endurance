"""Erzeugt WebP-Varianten für responsive Bilder (srcset).

assets/images/blog/foo.jpg -> assets/images/resized/blog/foo-640.webp, -1024, -1600, -1920
Es wird nie hochskaliert; ist das Original schmaler als eine Stufe,
wird es in Originalgröße unter der nächsthöheren Stufe gespeichert.
Bereits vorhandene Varianten werden übersprungen.
"""
from pathlib import Path
from PIL import Image, ImageOps

SOURCE_DIRS = [Path("assets/images/blog")]
OUT_ROOT = Path("assets/images/resized")
WIDTHS = [640, 1024, 1600, 1920]
EXTS = {".jpg", ".jpeg", ".png", ".webp"}
QUALITY = 78

created = 0
for src_dir in SOURCE_DIRS:
    if not src_dir.exists():
        continue
    for src in sorted(src_dir.rglob("*")):
        if src.suffix.lower() not in EXTS or not src.is_file():
            continue
        rel = src.relative_to("assets/images").with_suffix("")
        with Image.open(src) as im:
            im = ImageOps.exif_transpose(im)
            if im.mode not in ("RGB", "RGBA"):
                im = im.convert("RGBA" if "A" in im.getbands() else "RGB")
            for w in WIDTHS:
                # Ist das Original schmaler als diese Stufe, wird es einmal in
                # Originalgröße unter diesem Namen gespeichert (nie hochskaliert).
                if w > im.width and (w == WIDTHS[0] or WIDTHS[WIDTHS.index(w) - 1] >= im.width):
                    break
                target_w = min(w, im.width)
                out = OUT_ROOT / f"{rel}-{w}.webp"
                if out.exists() and out.stat().st_mtime >= src.stat().st_mtime:
                    continue
                out.parent.mkdir(parents=True, exist_ok=True)
                h = round(im.height * target_w / im.width)
                im.resize((target_w, h), Image.LANCZOS).save(out, "WEBP", quality=QUALITY, method=6)
                created += 1
                print(f"created {out}")
print(f"{created} Varianten erzeugt")
