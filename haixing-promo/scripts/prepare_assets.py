"""
Extracts and cleans the brochure images into public/img/ (run once).

  pdfimages -png brochure.pdf x   (into SRC, merged with their alpha masks first)
  python3 scripts/prepare_assets.py <merged-dir>
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image

SRC = Path(sys.argv[1])
OUT = Path(__file__).resolve().parent.parent / 'public' / 'img'
OUT.mkdir(parents=True, exist_ok=True)


def main_run(alpha, axis, first=False):
    """Largest (or first) contiguous run of non-empty rows/cols — drops label tags separated by a transparent gap."""
    filled = (alpha > 24).sum(axis=axis) > 2
    runs, start = [], None
    for i, f in enumerate(list(filled) + [False]):
        if f and start is None:
            start = i
        elif not f and start is not None:
            runs.append((start, i))
            start = None
    runs = [r for r in runs if r[1] - r[0] > 8]
    return runs[0] if first else max(runs, key=lambda r: r[1] - r[0])


def cut_out(name, src, split=None, pad=12, max_side=1000, first=False):
    im = Image.open(SRC / src).convert('RGBA')
    if split is not None:  # take the n-th horizontal object
        a = np.array(im)[:, :, 3]
        cols = (a > 24).sum(axis=0) > 2
        runs, start = [], None
        for i, f in enumerate(list(cols) + [False]):
            if f and start is None:
                start = i
            elif not f and start is not None:
                runs.append((start, i))
                start = None
        runs = [r for r in runs if r[1] - r[0] > 40]
        x0, x1 = runs[split]
        im = im.crop((x0, 0, x1, im.height))
    a = np.array(im)[:, :, 3]
    y0, y1 = main_run(a, 1, first)
    im = im.crop((0, y0, im.width, y1))
    a = np.array(im)[:, :, 3]
    x0, x1 = main_run(a, 0)
    im = im.crop((max(0, x0 - pad), 0, min(im.width, x1 + pad), im.height))
    im.thumbnail((max_side, max_side))
    im.save(OUT / f'{name}.png', optimize=True)


def photo(name, src, max_side=1920):
    im = Image.open(SRC / src).convert('RGB')
    im.thumbnail((max_side, max_side))
    im.save(OUT / f'{name}.jpg', quality=88)


# Factory & equipment photos
for name, src in {
    'factory-floor': 'p01_o14.png',
    'factory-blue': 'p02_o53.png',
    'cnc-center': 'p03_o101.png',
    'machine-hall': 'p07_o305.png',
    'sparks': 'p14_o642.png',
    'eq-height-gauge': 'p08_o402.png',
    'eq-projector': 'p08_o403.png',
    'eq-cmm': 'p08_o404.png',
    'eq-cmm-2': 'p08_o405.png',
    'eq-5axis': 'p08_o406.png',
    'eq-turning': 'p08_o407.png',
    'eq-lathe': 'p08_o408.png',
}.items():
    photo(name, src)

# Logo (star mark only)
cut_out('logo', 'p01_o23.png', max_side=600, first=True)

# Products (transparent cut-outs)
for name, src, split in [
    ('lead-screw', 'p09_o482.png', None),
    ('long-lead-screw', 'p09_o483.png', None),
    ('slender-shaft', 'p09_o484.png', None),
    ('long-shaft', 'p09_o485.png', None),
    ('pin-shafts', 'p09_o486.png', None),
    ('flange-housing', 'p11_o554.png', None),
    ('red-flange-assembly', 'p11_o555.png', None),
    ('sprocket-flange', 'p11_o556.png', None),
    ('cylindrical-housing', 'p11_o557.png', None),
    ('black-housing', 'p11_o558.png', None),
    ('flange-shaft', 'p11_o559.png', None),
    ('valve-body', 'p12_o593.png', None),
    ('black-valve-body', 'p12_o594.png', None),
    ('valve-core', 'p12_o595.png', None),
    ('titanium-worm', 'p12_o596.png', None),
    ('impeller-3d', 'p13_o624.png', 0),
    ('impeller-top', 'p13_o624.png', 1),
]:
    cut_out(name, src, split)
print('done', len(list(OUT.iterdir())), 'files')
