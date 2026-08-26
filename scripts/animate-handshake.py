"""Turn the static handshake visual into a looping GIF."""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "visuals" / "handshake.png"
OUT = ROOT / "public" / "visuals" / "handshake.gif"

FRAMES = 40
DURATION_MS = 80
OUT_WIDTH = 480
SIGNAL = (46, 168, 255)
EMBER = (255, 106, 26)
FLARE = (255, 59, 107)


def make_glow(radius: int, color: tuple[int, int, int], peak: int = 170) -> Image.Image:
    size = radius * 2
    glow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(glow)
    r, g, b = color
    for i in range(radius, 0, -2):
        t = 1 - i / radius
        alpha = int(peak * (t**2))
        draw.ellipse(
            (radius - i, radius - i, radius + i, radius + i),
            fill=(r, g, b, alpha),
        )
    return glow.filter(ImageFilter.GaussianBlur(radius=6))


def paste_glow(
    layer: Image.Image,
    glow: Image.Image,
    cx: float,
    cy: float,
    scale: float,
) -> None:
    if scale <= 0.05:
        return
    w = max(8, int(glow.width * scale))
    h = max(8, int(glow.height * scale))
    sprite = glow.resize((w, h), Image.Resampling.LANCZOS)
    x = int(cx - w / 2)
    y = int(cy - h / 2)
    layer.alpha_composite(sprite, (x, y))


def ken_burns(img: Image.Image, t: float) -> Image.Image:
    w, h = img.size
    zoom = 1.045 + 0.03 * math.sin(t)
    angle = 2.4 * math.sin(2 * t)
    pan_x = 6 * math.sin(t + 0.6)
    pan_y = 11 * math.sin(2 * t)

    pad = 48
    canvas_w = int(w * zoom) + pad * 2
    canvas_h = int(h * zoom) + pad * 2
    scaled = img.resize(
        (int(w * zoom), int(h * zoom)),
        Image.Resampling.LANCZOS,
    )
    canvas = Image.new("RGB", (canvas_w, canvas_h), (0, 0, 0))
    canvas.paste(
        scaled,
        ((canvas_w - scaled.width) // 2, (canvas_h - scaled.height) // 2),
    )
    rocked = canvas.rotate(
        angle,
        resample=Image.Resampling.BICUBIC,
        fillcolor=(0, 0, 0),
    )
    cx = rocked.width / 2 + pan_x
    cy = rocked.height / 2 + pan_y
    left = int(cx - w / 2)
    top = int(cy - h / 2)
    return rocked.crop((left, top, left + w, top + h))


def main() -> None:
    source = Image.open(SRC).convert("RGB")
    ratio = OUT_WIDTH / source.width
    source = source.resize(
        (OUT_WIDTH, int(source.height * ratio)),
        Image.Resampling.LANCZOS,
    )
    width, height = source.size

    blue = make_glow(int(width * 0.42), SIGNAL, 200)
    orange = make_glow(int(width * 0.42), EMBER, 190)
    magenta = make_glow(int(width * 0.28), FLARE, 150)
    core = make_glow(int(width * 0.16), (255, 255, 255), 120)

    frames: list[Image.Image] = []
    for i in range(FRAMES):
        t = (i / FRAMES) * math.tau
        base = ken_burns(source, t)
        overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))

        left_pulse = 0.72 + 0.28 * math.sin(t)
        right_pulse = 0.72 + 0.28 * math.sin(t + math.pi)
        grip = 0.55 + 0.45 * (0.5 + 0.5 * math.sin(2 * t + 0.3))

        paste_glow(
            overlay,
            blue,
            width * (0.22 + 0.05 * math.sin(t)),
            height * (0.52 + 0.025 * math.cos(t)),
            left_pulse,
        )
        paste_glow(
            overlay,
            orange,
            width * (0.78 + 0.05 * math.sin(t + math.pi)),
            height * (0.50 + 0.025 * math.sin(t + 0.8)),
            right_pulse,
        )
        paste_glow(overlay, magenta, width * 0.50, height * 0.48, grip)
        paste_glow(overlay, core, width * 0.50, height * 0.48, grip * 0.85)

        lit = ImageChops.screen(base, overlay.convert("RGB"))
        brightness = 0.94 + 0.08 * (0.5 + 0.5 * math.sin(2 * t))
        frame = ImageEnhance.Brightness(lit).enhance(brightness)
        frames.append(frame)

    palette = frames[len(frames) // 4].quantize(
        colors=128,
        method=Image.Quantize.MEDIANCUT,
        dither=Image.Dither.NONE,
    )
    gif_frames = [
        frame.quantize(palette=palette, dither=Image.Dither.NONE)
        for frame in frames
    ]
    gif_frames[0].save(
        OUT,
        save_all=True,
        append_images=gif_frames[1:],
        duration=DURATION_MS,
        loop=0,
        disposal=2,
        optimize=False,
    )
    print(f"Wrote {OUT} ({OUT.stat().st_size} bytes, {FRAMES} frames)")


if __name__ == "__main__":
    main()
