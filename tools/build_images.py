#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Build a reusable, kid-friendly SVG illustration library for 小队电台英语."""
from pathlib import Path

OUT = Path("/workspace/simba-english-web/images")

# Shared palette — warm, slightly soft, picture-book colors
SKY_TOP = "#A9D8F0"
SKY_MID = "#E7F4C8"
GRASS = "#8FCB6A"
GRASS_DARK = "#6FA84E"
SUN = "#FFE27A"
SUN_RING = "#FFF3B0"
LINE = "#2C3A32"
WOOD = "#C9844A"
WOOD_DARK = "#8B5A2B"
PAPER = "#FFF8E7"
CREAM = "#FFF6E4"

SIMBA = dict(hair="#E8B03A", shirt="#2D9A5B", skin="#F9D4B0", hair_style="tuft")
MEI = dict(hair="#2A2422", shirt="#E07A3A", skin="#E8B889", hair_style="bob")
LEO = dict(hair="#6B3F22", shirt="#3D7CC9", skin="#FFD9B8", hair_style="short")


def hdr(extra_defs=""):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
<defs>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="{SKY_TOP}"/>
    <stop offset="62%" stop-color="#F7F0D2"/>
    <stop offset="100%" stop-color="{SKY_MID}"/>
  </linearGradient>
  <linearGradient id="skynight" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#2C3E6B"/>
    <stop offset="70%" stop-color="#4A5F8A"/>
    <stop offset="100%" stop-color="#6B7A6A"/>
  </linearGradient>
  <linearGradient id="room" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#F3E2C4"/>
    <stop offset="100%" stop-color="#E7D0A4"/>
  </linearGradient>
  <clipPath id="card"><rect width="512" height="512" rx="48"/></clipPath>
  {extra_defs}
</defs>
<g clip-path="url(#card)">
'''


def ftr():
    return '''</g>
<rect x="2" y="2" width="508" height="508" rx="48" fill="none" stroke="#D5E3D9" stroke-width="4"/>
</svg>
'''


def outdoor(night=False):
    if night:
        s = '<rect width="512" height="512" fill="url(#skynight)"/>\n'
        for cx, cy, r in ((60, 50, 2), (120, 80, 1.6), (200, 40, 2.2), (280, 70, 1.5),
                          (340, 36, 2), (400, 90, 1.8), (450, 50, 2), (80, 130, 1.4),
                          (460, 140, 1.6), (240, 20, 1.8)):
            s += f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="#FFF8DC" opacity="0.9"/>\n'
        s += '<circle cx="420" cy="80" r="28" fill="#F5F0C8" opacity="0.95"/>\n'
        s += '<circle cx="420" cy="80" r="40" fill="#F5F0C8" opacity="0.15"/>\n'
    else:
        s = '<rect width="512" height="512" fill="url(#sky)"/>\n'
        s += f'<circle cx="420" cy="78" r="42" fill="{SUN_RING}" opacity="0.7"/>\n'
        s += f'<circle cx="420" cy="78" r="28" fill="{SUN}"/>\n'
        s += '<cloud 80 90 1"/><!--placeholder-->\n'
    s += f'<ellipse cx="160" cy="390" rx="260" ry="90" fill="{GRASS_DARK}"/>\n'
    s += f'<ellipse cx="380" cy="410" rx="280" ry="100" fill="{GRASS}"/>\n'
    s += f'<rect y="400" width="512" height="112" fill="{GRASS}"/>\n'
    return s.replace('<cloud 80 90 1"/><!--placeholder-->', cloud(90, 96, 1.0) + cloud(250, 70, 0.7))


def indoor():
    s = '<rect width="512" height="512" fill="url(#room)"/>\n'
    s += '<rect y="330" width="512" height="182" fill="#D2B48C"/>\n'
    s += '<rect y="330" width="512" height="14" fill="#B0895A"/>\n'
    # back wall trim
    s += '<rect y="0" width="512" height="330" fill="#F6E6C8"/>\n'
    s += '<rect y="318" width="512" height="16" fill="#E8C992"/>\n'
    return s


def cloud(x, y, sc=1):
    return (
        f'<g transform="translate({x},{y}) scale({sc})" fill="#fff" opacity="0.92">'
        f'<ellipse cx="0" cy="0" rx="28" ry="16"/>'
        f'<ellipse cx="22" cy="-6" rx="20" ry="14"/>'
        f'<ellipse cx="-20" cy="-4" rx="16" ry="12"/>'
        f'</g>\n'
    )


def tree(x, y, sc=1, fruit=False):
    s = f'<g transform="translate({x},{y}) scale({sc})">\n'
    s += f'<rect x="-8" y="-20" width="16" height="50" rx="4" fill="{WOOD_DARK}"/>\n'
    s += '<ellipse cx="0" cy="-48" rx="36" ry="32" fill="#4F9A3A"/>\n'
    s += '<ellipse cx="-16" cy="-36" rx="22" ry="18" fill="#5AAB44"/>\n'
    s += '<ellipse cx="18" cy="-38" rx="20" ry="16" fill="#3E8A2E"/>\n'
    if fruit:
        for fx, fy in ((-14, -44), (10, -52), (0, -30)):
            s += f'<circle cx="{fx}" cy="{fy}" r="4.5" fill="#E85D4C"/>\n'
    s += '</g>\n'
    return s


def bush(x, y, sc=1):
    return (
        f'<g transform="translate({x},{y}) scale({sc})" fill="#5AAB44">'
        f'<ellipse cx="-12" cy="0" rx="18" ry="12"/>'
        f'<ellipse cx="10" cy="2" rx="16" ry="11"/>'
        f'<ellipse cx="0" cy="-8" rx="14" ry="10"/>'
        f'</g>\n'
    )


def shadow(x, y, rx=40, ry=12):
    return f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="#2C3A32" opacity="0.16"/>\n'


def radio_prop(x=0, y=0, sc=1, color="#3D7CC9"):
    return f'''<g transform="translate({x},{y}) scale({sc})">
  <rect x="-16" y="-28" width="32" height="48" rx="8" fill="{color}" stroke="{LINE}" stroke-width="2"/>
  <rect x="-11" y="-21" width="22" height="12" rx="3" fill="#CFF5D6"/>
  <circle cx="-6" cy="2" r="4" fill="#F4D35E"/>
  <circle cx="6" cy="2" r="4" fill="#E85D4C"/>
  <rect x="-8" y="12" width="16" height="4" rx="2" fill="#2C3A32" opacity="0.35"/>
  <rect x="10" y="-40" width="4" height="14" rx="2" fill="#6B7280"/>
  <circle cx="12" cy="-42" r="4" fill="#F4D35E"/>
</g>
'''


def map_prop(x=0, y=0, sc=1, blue=False):
    paper = "#D7EBFA" if blue else "#F7E3A8"
    path = "#3D7CC9" if blue else "#C9844A"
    return f'''<g transform="translate({x},{y}) scale({sc})">
  <rect x="-28" y="-20" width="56" height="40" rx="4" fill="{paper}" stroke="{LINE}" stroke-width="2"/>
  <path d="M-18 6 C-8 -6, 4 10, 16 -4" fill="none" stroke="{path}" stroke-width="2.4" stroke-linecap="round"/>
  <circle cx="-18" cy="6" r="3" fill="#2D9A5B"/>
  <circle cx="16" cy="-4" r="3" fill="#E85D4C"/>
  <rect x="8" y="-14" width="10" height="8" rx="1" fill="#8FCB6A" opacity="0.8"/>
</g>
'''


def bag_prop(x=0, y=0, sc=1, color="#C45C2A"):
    return f'''<g transform="translate({x},{y}) scale({sc})">
  <rect x="-22" y="-18" width="44" height="40" rx="8" fill="{color}" stroke="{LINE}" stroke-width="2"/>
  <path d="M-14 -18 C-14 -32, 14 -32, 14 -18" fill="none" stroke="{LINE}" stroke-width="4" stroke-linecap="round"/>
  <rect x="-8" y="-4" width="16" height="10" rx="2" fill="#F4D35E"/>
  <circle cx="0" cy="1" r="2" fill="{LINE}"/>
</g>
'''


def flashlight_prop(x=0, y=0, sc=1, on=False):
    s = f'<g transform="translate({x},{y}) scale({sc})">\n'
    s += f'<rect x="-24" y="-8" width="36" height="16" rx="5" fill="#F4D35E" stroke="{LINE}" stroke-width="2"/>\n'
    s += f'<rect x="12" y="-12" width="12" height="24" rx="3" fill="#EEE8D0" stroke="{LINE}" stroke-width="2"/>\n'
    if on:
        s += '<polygon points="24,-10 70,-28 70,28 24,10" fill="#FFF4B0" opacity="0.55"/>\n'
    s += '</g>\n'
    return s


def bottle_prop(x=0, y=0, sc=1):
    return f'''<g transform="translate({x},{y}) scale({sc})">
  <rect x="-8" y="-16" width="16" height="32" rx="6" fill="#7EC8E3" stroke="{LINE}" stroke-width="2"/>
  <rect x="-5" y="-24" width="10" height="10" rx="2" fill="#3D7CC9"/>
  <rect x="-6" y="-6" width="12" height="6" rx="1" fill="#fff" opacity="0.5"/>
</g>
'''


def hair_of(style, color):
    if style == "tuft":
        return (
            f'<ellipse cx="0" cy="-18" rx="23" ry="16" fill="{color}"/>'
            f'<ellipse cx="-16" cy="-8" rx="8" ry="10" fill="{color}"/>'
            f'<ellipse cx="16" cy="-8" rx="8" ry="10" fill="{color}"/>'
            f'<path d="M-4 -28 Q0 -48 8 -30" fill="{color}"/>'
            f'<path d="M2 -28 Q12 -46 14 -26" fill="{color}"/>'
        )
    if style == "bob":
        return (
            f'<ellipse cx="0" cy="-12" rx="26" ry="20" fill="{color}"/>'
            f'<path d="M-26 -8 Q-28 16 -16 18 L-18 -2" fill="{color}"/>'
            f'<path d="M26 -8 Q28 16 16 18 L18 -2" fill="{color}"/>'
        )
    # short
    return (
        f'<ellipse cx="0" cy="-16" rx="22" ry="14" fill="{color}"/>'
        f'<ellipse cx="-18" cy="-6" rx="7" ry="8" fill="{color}"/>'
        f'<ellipse cx="18" cy="-6" rx="7" ry="8" fill="{color}"/>'
    )


def kid(x, y, s=1, *, pose="stand", flip=False, item=None, bag=False, **look):
    hair = look.get("hair", "#E8B03A")
    shirt = look.get("shirt", "#2D9A5B")
    skin = look.get("skin", "#F9D4B0")
    style = look.get("hair_style", "tuft")
    pants = look.get("pants", "#3A4A40")
    scx = -s if flip else s
    # arm / leg variants
    if pose == "wave":
        arms = (
            f'<g stroke="{skin}" stroke-width="10" stroke-linecap="round" fill="none">'
            f'<path d="M-18 8 Q-30 18 -26 32"/>'
            f'<path d="M18 6 Q28 -10 22 -28"/>'
            f'</g>'
            f'<circle cx="22" cy="-32" r="7" fill="{skin}"/>'
            f'<circle cx="-26" cy="36" r="7" fill="{skin}"/>'
        )
    elif pose == "ready":
        arms = (
            f'<g stroke="{skin}" stroke-width="10" stroke-linecap="round" fill="none">'
            f'<path d="M-18 8 Q-30 20 -24 34"/>'
            f'<path d="M16 4 L18 -34"/>'
            f'</g>'
            f'<circle cx="18" cy="-40" r="7" fill="{skin}"/>'
            f'<circle cx="-24" cy="38" r="7" fill="{skin}"/>'
        )
    elif pose == "wait":
        arms = (
            f'<g stroke="{skin}" stroke-width="10" stroke-linecap="round" fill="none">'
            f'<path d="M-18 8 Q-28 16 -22 30"/>'
            f'<path d="M18 6 L34 0"/>'
            f'</g>'
            f'<rect x="32" y="-10" width="10" height="16" rx="4" fill="{skin}"/>'
            f'<circle cx="-22" cy="34" r="7" fill="{skin}"/>'
        )
    elif pose == "point":
        arms = (
            f'<g stroke="{skin}" stroke-width="10" stroke-linecap="round" fill="none">'
            f'<path d="M-18 8 Q-28 18 -24 32"/>'
            f'<path d="M18 8 L42 -6"/>'
            f'</g>'
            f'<circle cx="46" cy="-8" r="6" fill="{skin}"/>'
            f'<circle cx="-24" cy="36" r="7" fill="{skin}"/>'
        )
    elif pose == "walk":
        arms = (
            f'<g stroke="{skin}" stroke-width="10" stroke-linecap="round" fill="none">'
            f'<path d="M-16 8 Q-30 4 -28 24"/>'
            f'<path d="M16 8 Q28 20 22 30"/>'
            f'</g>'
            f'<circle cx="-28" cy="28" r="7" fill="{skin}"/>'
            f'<circle cx="22" cy="34" r="7" fill="{skin}"/>'
        )
    elif pose == "come":
        arms = (
            f'<g stroke="{skin}" stroke-width="10" stroke-linecap="round" fill="none">'
            f'<path d="M-18 8 Q-8 -6 -20 -16"/>'
            f'<path d="M18 8 Q30 20 24 32"/>'
            f'</g>'
            f'<circle cx="-22" cy="-20" r="7" fill="{skin}"/>'
            f'<circle cx="24" cy="36" r="7" fill="{skin}"/>'
        )
    elif pose == "sit":
        arms = (
            f'<g stroke="{skin}" stroke-width="10" stroke-linecap="round" fill="none">'
            f'<path d="M-18 8 Q-30 16 -20 8"/>'
            f'<path d="M18 8 Q30 16 20 8"/>'
            f'</g>'
        )
    elif pose == "listen":
        arms = (
            f'<g stroke="{skin}" stroke-width="10" stroke-linecap="round" fill="none">'
            f'<path d="M18 6 Q30 16 24 30"/>'
            f'<path d="M-16 6 Q-28 -6 -22 -16"/>'
            f'</g>'
            f'<circle cx="-24" cy="-20" r="7" fill="{skin}"/>'
            f'<circle cx="24" cy="34" r="7" fill="{skin}"/>'
        )
    elif pose == "talk":
        arms = (
            f'<g stroke="{skin}" stroke-width="10" stroke-linecap="round" fill="none">'
            f'<path d="M-18 8 Q-28 18 -22 30"/>'
            f'<path d="M16 6 Q24 -4 10 -8"/>'
            f'</g>'
            f'<circle cx="8" cy="-10" r="6" fill="{skin}"/>'
            f'<circle cx="-22" cy="34" r="7" fill="{skin}"/>'
        )
    elif pose == "hips":
        arms = (
            f'<g stroke="{skin}" stroke-width="10" stroke-linecap="round" fill="none">'
            f'<path d="M-18 8 Q-30 14 -22 28"/>'
            f'<path d="M18 8 Q30 14 22 28"/>'
            f'</g>'
            f'<circle cx="-22" cy="32" r="7" fill="{skin}"/>'
            f'<circle cx="22" cy="32" r="7" fill="{skin}"/>'
        )
    else:  # stand
        arms = (
            f'<g stroke="{skin}" stroke-width="10" stroke-linecap="round" fill="none">'
            f'<path d="M-18 8 Q-28 20 -22 34"/>'
            f'<path d="M18 8 Q28 20 22 34"/>'
            f'</g>'
            f'<circle cx="-22" cy="38" r="7" fill="{skin}"/>'
            f'<circle cx="22" cy="38" r="7" fill="{skin}"/>'
        )

    if pose == "sit":
        legs = (
            f'<g stroke="{pants}" stroke-width="12" stroke-linecap="round" fill="none">'
            f'<path d="M-10 40 L-28 52"/>'
            f'<path d="M10 40 L32 50"/>'
            f'</g>'
            f'<ellipse cx="-32" cy="54" rx="10" ry="6" fill="#6B3F22"/>'
            f'<ellipse cx="36" cy="52" rx="10" ry="6" fill="#6B3F22"/>'
        )
        body_y = 18
    elif pose == "walk":
        legs = (
            f'<g stroke="{pants}" stroke-width="12" stroke-linecap="round" fill="none">'
            f'<path d="M-8 42 L-18 68"/>'
            f'<path d="M8 42 L20 64"/>'
            f'</g>'
            f'<ellipse cx="-20" cy="74" rx="10" ry="6" fill="#6B3F22"/>'
            f'<ellipse cx="24" cy="70" rx="10" ry="6" fill="#6B3F22"/>'
        )
        body_y = 14
    else:
        legs = (
            f'<g stroke="{pants}" stroke-width="12" stroke-linecap="round" fill="none">'
            f'<path d="M-8 42 L-12 70"/>'
            f'<path d="M8 42 L12 70"/>'
            f'</g>'
            f'<ellipse cx="-14" cy="76" rx="10" ry="6" fill="#6B3F22"/>'
            f'<ellipse cx="16" cy="76" rx="10" ry="6" fill="#6B3F22"/>'
        )
        body_y = 14

    held = ""
    if item == "radio":
        held = radio_prop(32, -6, 0.7)
    elif item == "map":
        held = map_prop(34, 8, 0.85)
    elif item == "flashlight":
        held = flashlight_prop(36, 4, 0.8, on=True)
    elif item == "bottle":
        held = bottle_prop(30, 8, 0.9)
    elif item == "flag":
        held = (
            f'<g transform="translate(30,-10)">'
            f'<rect x="0" y="-40" width="4" height="62" rx="2" fill="{WOOD_DARK}"/>'
            f'<polygon points="4,-40 34,-30 4,-18" fill="#2D9A5B" stroke="{LINE}" stroke-width="1.5"/>'
            f'<circle cx="14" cy="-30" r="3" fill="#F4D35E"/>'
            f'</g>'
        )
    elif item == "notebook":
        held = (
            f'<g transform="translate(32,8)">'
            f'<rect x="-16" y="-14" width="32" height="24" rx="3" fill="#FFF8E7" stroke="{LINE}" stroke-width="2"/>'
            f'<path d="M-8 0 L8 -6" stroke="#3D7CC9" stroke-width="2" fill="none"/>'
            f'</g>'
        )

    pack = ""
    if bag:
        pack = f'<rect x="-20" y="8" width="16" height="22" rx="4" fill="#C45C2A" stroke="{LINE}" stroke-width="1.5"/>'

    head = (
        hair_of(style, hair)
        + f'<circle cx="0" cy="-6" r="22" fill="{skin}" stroke="{LINE}" stroke-width="2"/>'
        f'<circle cx="-8" cy="-8" r="3.2" fill="{LINE}"/>'
        f'<circle cx="8" cy="-8" r="3.2" fill="{LINE}"/>'
        f'<circle cx="-7" cy="-9" r="1.1" fill="#fff"/>'
        f'<circle cx="9" cy="-9" r="1.1" fill="#fff"/>'
        f'<ellipse cx="-12" cy="0" rx="5" ry="3" fill="#F4A8A0" opacity="0.7"/>'
        f'<ellipse cx="12" cy="0" rx="5" ry="3" fill="#F4A8A0" opacity="0.7"/>'
        f'<path d="M-6 6 Q0 12 6 6" fill="none" stroke="{LINE}" stroke-width="2.2" stroke-linecap="round"/>'
    )
    if style == "bob":
        head += (
            f'<path d="M-22 -16 Q-4 -32 22 -16 Q12 -2 0 -6 Q-12 -2 -22 -16" fill="{hair}"/>'
            f'<path d="M-24 -4 Q-28 16 -14 18 L-18 0" fill="{hair}"/>'
            f'<path d="M24 -4 Q28 16 14 18 L18 0" fill="{hair}"/>'
        )
    elif style == "tuft":
        head += (
            f'<ellipse cx="0" cy="-22" rx="20" ry="11" fill="{hair}"/>'
            f'<ellipse cx="-19" cy="-8" rx="8" ry="11" fill="{hair}"/>'
            f'<ellipse cx="19" cy="-8" rx="8" ry="11" fill="{hair}"/>'
            f'<path d="M-8 -26 Q-4 -54 4 -28" fill="{hair}"/>'
            f'<path d="M0 -26 Q12 -58 14 -26" fill="{hair}"/>'
            f'<path d="M8 -24 Q20 -48 18 -22" fill="{hair}"/>'
        )
    else:
        head += (
            f'<ellipse cx="0" cy="-20" rx="20" ry="10" fill="{hair}"/>'
            f'<ellipse cx="-19" cy="-8" rx="7" ry="10" fill="{hair}"/>'
            f'<ellipse cx="19" cy="-8" rx="7" ry="10" fill="{hair}"/>'
        )

    body = f'<rect x="-20" y="{body_y-8}" width="40" height="36" rx="14" fill="{shirt}" stroke="{LINE}" stroke-width="2"/>'

    return (
        f'<g transform="translate({x},{y}) scale({scx},{s})">'
        + pack + legs + body + arms + held + head
        + '</g>\n'
    )


def house(x, y, sc=1):
    return f'''<g transform="translate({x},{y}) scale({sc})">
  <rect x="-50" y="-20" width="100" height="70" rx="4" fill="#F3C98B" stroke="{LINE}" stroke-width="2"/>
  <polygon points="-60,-20 0,-70 60,-20" fill="#E07A3A" stroke="{LINE}" stroke-width="2"/>
  <rect x="-14" y="10" width="28" height="40" rx="3" fill="#C9844A" stroke="{LINE}" stroke-width="2"/>
  <circle cx="8" cy="30" r="3" fill="#F4D35E"/>
  <rect x="-38" y="-2" width="22" height="18" rx="3" fill="#A8D8F0" stroke="{LINE}" stroke-width="2"/>
</g>
'''


def fence(y=390):
    s = ""
    for x in range(20, 500, 36):
        s += f'<rect x="{x}" y="{y}" width="8" height="36" rx="2" fill="#E6C38A"/>\n'
    s += f'<rect x="10" y="{y+8}" width="492" height="6" rx="2" fill="#D2A56A"/>\n'
    return s


def start_marker(x, y, sc=1):
    return f'''<g transform="translate({x},{y}) scale({sc})">
  <circle cx="0" cy="0" r="22" fill="#F4D35E" stroke="{LINE}" stroke-width="3"/>
  <circle cx="0" cy="0" r="12" fill="#2D9A5B"/>
</g>
'''


def arrow_sign(x, y, direction="left"):
    if direction == "left":
        pts = "40,20 8,36 40,52"
        box = (40, 18, 36, 36)
    elif direction == "right":
        pts = "8,20 40,36 8,52"
        box = (0, 18, 36, 36)
    elif direction == "up":
        pts = "24,8 8,36 40,36"
        box = (8, 36, 32, 22)
    else:
        pts = "8,20 40,20 24,48"
        box = (8, 0, 32, 22)
    return f'''<g transform="translate({x},{y})">
  <rect x="20" y="54" width="8" height="50" rx="2" fill="{WOOD_DARK}"/>
  <rect x="{box[0]}" y="{box[1]}" width="{box[2]}" height="{box[3]}" rx="4" fill="#F4D35E" stroke="{LINE}" stroke-width="2"/>
  <polygon points="{pts}" fill="#2D9A5B" stroke="{LINE}" stroke-width="1.5"/>
</g>
'''


def wrap(body):
    return hdr() + body + ftr()


# ---------- scenes ----------
def sc_hello():
    return wrap(outdoor() + tree(80, 360, 1.1, True) + bush(140, 400) + fence()
                + shadow(260, 430, 70, 14)
                + kid(260, 350, 1.15, pose="wave", **SIMBA))

def sc_name():
    badge = f'''<g transform="translate(330,300)">
      <rect x="-36" y="-16" width="72" height="28" rx="8" fill="#FFF8E7" stroke="{LINE}" stroke-width="2"/>
      <text x="0" y="5" text-anchor="middle" font-size="12" font-family="Verdana, sans-serif" fill="#2C3A32" font-weight="700">SIMBA</text>
    </g>'''
    return wrap(outdoor() + tree(70, 350, 0.9) + shadow(240, 430, 60)
                + kid(240, 350, 1.15, pose="hips", **SIMBA) + badge)

def sc_ready():
    return wrap(outdoor() + tree(420, 350, 1.0, True) + bush(60, 410)
                + shadow(250, 430, 60)
                + kid(250, 348, 1.15, pose="ready", **SIMBA))

def sc_team():
    return wrap(outdoor() + tree(60, 340, 1.0, True) + tree(460, 350, 0.85)
                + flagpole()
                + shadow(255, 440, 120, 16)
                + kid(170, 350, 1.0, pose="stand", **MEI)
                + kid(255, 345, 1.08, pose="wave", **SIMBA)
                + kid(340, 352, 1.0, pose="stand", flip=True, **LEO))

def flagpole(x=255, y=250):
    return f'''<g transform="translate({x},{y})">
  <rect x="-3" y="-80" width="6" height="120" rx="2" fill="{WOOD_DARK}"/>
  <polygon points="3,-80 54,-64 3,-48" fill="#2D9A5B" stroke="{LINE}" stroke-width="2"/>
  <circle cx="18" cy="-64" r="5" fill="#F4D35E"/>
</g>
'''

def sc_meet():
    return wrap(outdoor() + bush(80, 400) + tree(430, 350, 1)
                + shadow(190, 430, 50) + shadow(320, 430, 50)
                + kid(190, 350, 1.05, pose="wave", **SIMBA)
                + kid(330, 352, 1.05, pose="wave", flip=True, **MEI))

def sc_go():
    return wrap(outdoor() + tree(60, 330, 0.9) + path_road()
                + shadow(160, 430, 40) + shadow(250, 428, 40) + shadow(340, 432, 40)
                + kid(150, 348, 0.95, pose="walk", bag=True, **MEI)
                + kid(250, 342, 1.02, pose="walk", item="map", **SIMBA)
                + kid(350, 350, 0.95, pose="walk", item="radio", **LEO))

def path_road():
    return '''<path d="M40 500 C140 420, 240 460, 320 400 C380 360, 450 380, 520 340"
      fill="none" stroke="#E6C38A" stroke-width="42"/>
    <path d="M40 500 C140 420, 240 460, 320 400 C380 360, 450 380, 520 340"
      fill="none" stroke="#F4E1B5" stroke-width="10" stroke-dasharray="12 16"/>
    '''

def sc_wait():
    return wrap(outdoor() + tree(80, 340, 1) + path_road()
                + shadow(200, 430, 50) + shadow(340, 430, 70)
                + kid(200, 348, 1.1, pose="wait", **SIMBA)
                + kid(320, 360, 0.9, pose="stand", **MEI)
                + kid(385, 365, 0.9, pose="stand", **LEO))

def sc_stop():
    sign = f'''<g transform="translate(330,250)">
      <rect x="-6" y="20" width="12" height="80" fill="{WOOD_DARK}"/>
      <rect x="-40" y="-20" width="80" height="50" rx="10" fill="#E07A3A" stroke="{LINE}" stroke-width="3"/>
      <rect x="-20" y="0" width="40" height="10" rx="3" fill="#FFF8E7"/>
    </g>'''
    return wrap(outdoor() + path_road() + sign
                + shadow(200, 430, 55)
                + kid(200, 348, 1.1, pose="wait", **SIMBA))

def sc_come():
    return wrap(outdoor() + tree(430, 340, 1) + path_road()
                + shadow(230, 430, 50) + shadow(370, 440, 40)
                + kid(230, 348, 1.1, pose="come", flip=True, **SIMBA)
                + kid(380, 365, 0.9, pose="walk", **LEO))

def sc_help():
    return wrap(outdoor() + tree(80, 340, 1, True) + bush(450, 410)
                + shadow(210, 440, 50) + shadow(300, 430, 50)
                + kid(200, 370, 0.95, pose="sit", **MEI)
                + kid(310, 345, 1.1, pose="stand", item="bag" if False else None, **SIMBA)
                + bag_prop(248, 400, 0.9))

def sc_thank():
    return wrap(outdoor() + tree(80, 350, 0.9, True) + bush(430, 410)
                + shadow(200, 430, 50) + shadow(330, 430, 50)
                + kid(200, 350, 1.05, pose="hips", **SIMBA)
                + kid(330, 350, 1.05, pose="wave", flip=True, **LEO))

def sc_listen():
    return wrap(outdoor() + tree(70, 340, 1)
                + shadow(260, 430, 60)
                + kid(260, 348, 1.15, pose="listen", **SIMBA)
                + radio_prop(360, 300, 1.1))

def sc_speak():
    return wrap(outdoor() + bush(80, 410) + tree(450, 350, 0.9)
                + shadow(250, 430, 60)
                + kid(250, 348, 1.15, pose="talk", item="radio", **SIMBA))

def sc_look():
    return wrap(outdoor() + tree(80, 330, 1) + landmark_tree(400, 300, 1.1)
                + shadow(200, 430, 55)
                + kid(200, 350, 1.1, pose="point", **SIMBA))

def landmark_tree(x, y, sc=1):
    return f'''<g transform="translate({x},{y}) scale({sc})">
  <rect x="-12" y="20" width="24" height="80" rx="6" fill="{WOOD_DARK}"/>
  <ellipse cx="0" cy="-10" rx="70" ry="60" fill="#3E8A2E"/>
  <ellipse cx="-30" cy="10" rx="40" ry="30" fill="#4F9A3A"/>
  <ellipse cx="32" cy="6" rx="36" ry="28" fill="#5AAB44"/>
  <rect x="10" y="30" width="18" height="14" rx="2" fill="#E07A3A"/>
</g>
'''

def sc_found():
    return wrap(outdoor() + bush(80, 410)
                + shadow(240, 430, 60)
                + kid(240, 348, 1.1, pose="ready", item="map", **SIMBA)
                + star_burst(340, 250))

def star_burst(x, y):
    return f'''<g transform="translate({x},{y})">
      <polygon points="0,-22 6,-6 22,-6 9,4 14,20 0,10 -14,20 -9,4 -22,-6 -6,-6" fill="#F4D35E" stroke="#E07A3A" stroke-width="2"/>
    </g>'''

def sc_rest():
    blanket = f'<ellipse cx="260" cy="420" rx="120" ry="28" fill="#F4E1B5"/>'
    return wrap(outdoor() + tree(80, 330, 1.1, True) + tree(440, 340, 0.9)
                + blanket
                + kid(200, 360, 1.0, pose="sit", **SIMBA)
                + kid(310, 365, 0.95, pose="sit", **MEI)
                + bottle_prop(260, 400, 1.1))

def sc_count():
    return wrap(outdoor() + bush(50, 410)
                + shadow(140, 430, 30) + shadow(220, 430, 30)
                + shadow(300, 430, 30) + shadow(380, 430, 30)
                + kid(140, 355, 0.9, pose="stand", **MEI)
                + kid(220, 350, 0.95, pose="ready", **SIMBA)
                + kid(300, 355, 0.9, pose="stand", **LEO)
                + kid(380, 358, 0.88, pose="wave", hair="#4A2C17", shirt="#8B5CF6", skin="#C88E62", hair_style="short"))

def sc_idea():
    bulb = f'''<g transform="translate(330,230)">
      <circle cx="0" cy="0" r="22" fill="#FFE27A" stroke="{LINE}" stroke-width="2"/>
      <rect x="-8" y="18" width="16" height="10" rx="2" fill="#D2A56A"/>
      <circle cx="0" cy="0" r="30" fill="#FFF3B0" opacity="0.4"/>
    </g>'''
    return wrap(outdoor() + tree(70, 340, 0.9)
                + shadow(230, 430, 55)
                + kid(230, 348, 1.15, pose="ready", **SIMBA) + bulb)

def sc_ask():
    q = f'''<g transform="translate(350,240)">
      <circle cx="0" cy="0" r="28" fill="#FFF8E7" stroke="{LINE}" stroke-width="3"/>
      <text x="0" y="12" text-anchor="middle" font-size="36" font-family="Verdana, sans-serif" fill="#2D9A5B" font-weight="700">?</text>
    </g>'''
    return wrap(outdoor() + bush(80, 410)
                + shadow(230, 430, 55)
                + kid(230, 348, 1.15, pose="ask" if False else "hips", **SIMBA) + q)

def sc_agree():
    return wrap(outdoor() + tree(80, 340, 1, True)
                + shadow(200, 430, 50) + shadow(320, 430, 50)
                + kid(200, 348, 1.08, pose="ready", **SIMBA)
                + kid(330, 350, 1.08, pose="ready", flip=True, **LEO))

def sc_door():
    return wrap(indoor()
                + house_door_close())

def house_door_close():
    return f'''<g transform="translate(256,250)">
  <rect x="-90" y="-120" width="180" height="260" rx="8" fill="#E7C392" stroke="{LINE}" stroke-width="4"/>
  <rect x="-70" y="-100" width="140" height="230" rx="6" fill="#C9844A" stroke="{LINE}" stroke-width="3"/>
  <circle cx="40" cy="20" r="10" fill="#F4D35E" stroke="{LINE}" stroke-width="2"/>
  <rect x="-50" y="-80" width="40" height="50" rx="4" fill="#F3E2C4" opacity="0.5"/>
</g>
'''

def sc_window():
    return wrap(indoor() + f'''
    <rect x="116" y="80" width="280" height="240" rx="12" fill="#8B5A2B" stroke="{LINE}" stroke-width="6"/>
    <rect x="136" y="100" width="110" height="95" rx="4" fill="#A8D8F0"/>
    <rect x="266" y="100" width="110" height="95" rx="4" fill="#A8D8F0"/>
    <rect x="136" y="210" width="110" height="90" rx="4" fill="#A8D8F0"/>
    <rect x="266" y="210" width="110" height="90" rx="4" fill="#A8D8F0"/>
    <rect x="246" y="100" width="20" height="200" fill="#8B5A2B"/>
    <rect x="136" y="190" width="240" height="20" fill="#8B5A2B"/>
    <ellipse cx="360" cy="150" rx="18" ry="10" fill="#fff" opacity="0.6"/>
    <g transform="translate(256,360)">{_pot()}</g>
    ''')

def _pot():
    return f'''<rect x="-16" y="10" width="32" height="24" rx="4" fill="#E07A3A"/>
    <ellipse cx="-6" cy="0" rx="8" ry="16" fill="#4F9A3A"/>
    <ellipse cx="8" cy="-4" rx="8" ry="18" fill="#5AAB44"/>'''

def sc_table():
    return wrap(indoor() + f'''
    <ellipse cx="256" cy="430" rx="180" ry="28" fill="#2C3A32" opacity="0.12"/>
    <rect x="80" y="280" width="352" height="24" rx="6" fill="#C9844A" stroke="{LINE}" stroke-width="2"/>
    <rect x="110" y="304" width="18" height="90" fill="#8B5A2B"/>
    <rect x="384" y="304" width="18" height="90" fill="#8B5A2B"/>
    ''' + map_prop(200, 260, 1.3) + radio_prop(330, 248, 1.15) + bottle_prop(260, 252, 1))

def sc_radio():
    return wrap(indoor() + f'''
    <ellipse cx="256" cy="400" rx="120" ry="24" fill="#2C3A32" opacity="0.12"/>
    <rect x="140" y="300" width="232" height="18" rx="4" fill="#C9844A"/>
    ''' + radio_prop(256, 230, 3.2, "#3D7CC9"))

def sc_bag():
    return wrap(outdoor() + bush(80, 400) + tree(420, 340, 0.9)
                + shadow(256, 430, 80, 16)
                + bag_prop(256, 300, 3.0, "#C45C2A"))

def sc_bag_red():
    return wrap(outdoor() + bush(80, 400)
                + shadow(256, 430, 80, 16)
                + bag_prop(256, 300, 3.0, "#E85D4C")
                + kid(400, 360, 0.85, pose="wave", **SIMBA))

def sc_boots():
    boot = lambda x: f'''<g transform="translate({x},300)">
      <rect x="-22" y="-10" width="36" height="50" rx="8" fill="#6B3F22" stroke="{LINE}" stroke-width="3"/>
      <rect x="-22" y="28" width="50" height="18" rx="8" fill="#4A2C17" stroke="{LINE}" stroke-width="3"/>
      <rect x="-16" y="-4" width="24" height="10" rx="2" fill="#C9844A"/>
    </g>'''
    return wrap(outdoor() + bush(80, 410) + shadow(256, 430, 90)
                + boot(210) + boot(310))

def sc_flashlight():
    return wrap(indoor() + f'''
    <rect x="0" y="0" width="512" height="512" fill="#3A4A68" opacity="0.15"/>
    ''' + flashlight_prop(230, 260, 3.2, True))

def sc_map():
    return wrap(outdoor() + tree(60, 340, 0.8)
                + shadow(256, 450, 140, 18)
                + big_map(256, 270, 1, False)
                + kid(80, 380, 0.7, pose="point", **SIMBA))

def big_map(x, y, sc=1, blue=False):
    paper = "#D7EBFA" if blue else "#F7E3A8"
    path = "#3D7CC9" if blue else "#C45C2A"
    return f'''<g transform="translate({x},{y}) scale({sc})">
  <rect x="-160" y="-120" width="320" height="240" rx="12" fill="{paper}" stroke="{LINE}" stroke-width="5"/>
  <path d="M-110 60 C-60 -20, 0 40, 40 -10 C80 -50, 110 20, 130 -30" fill="none" stroke="{path}" stroke-width="6" stroke-linecap="round"/>
  <circle cx="-110" cy="60" r="10" fill="#2D9A5B"/>
  <circle cx="130" cy="-30" r="10" fill="#E85D4C"/>
  <ellipse cx="-40" cy="-50" rx="30" ry="20" fill="#8FCB6A"/>
  <rect x="50" y="40" width="40" height="28" rx="4" fill="#F3C98B" stroke="{LINE}" stroke-width="2"/>
  <polygon points="50,40 70,18 90,40" fill="#E07A3A"/>
  <text x="-110" y="86" font-size="14" font-family="Verdana, sans-serif" fill="#2C3A32">START</text>
</g>
'''

def sc_map_blue():
    return wrap(outdoor() + shadow(256, 450, 140, 18) + big_map(256, 270, 1, True))

def sc_yard():
    return wrap(outdoor() + fence() + house(256, 280, 1.15)
                + tree(80, 340, 1, True) + tree(430, 350, 0.9)
                + bush(140, 400)
                + kid(150, 370, 0.8, pose="wave", **SIMBA))

def sc_path():
    return wrap(outdoor() + tree(70, 320, 1) + tree(430, 300, 1.1, True)
                + path_road()
                + kid(200, 360, 0.95, pose="walk", **SIMBA)
                + kid(280, 370, 0.9, pose="walk", **MEI))

def sc_sign():
    return wrap(outdoor() + path_road()
                + arrow_sign(200, 220, "left") + arrow_sign(300, 220, "right")
                + kid(140, 360, 0.9, pose="point", **SIMBA))

def sc_flag():
    return wrap(outdoor() + tree(80, 340, 0.9)
                + flagpole(300, 260)
                + shadow(180, 430, 50)
                + kid(180, 350, 1.1, pose="ready", item="flag", **SIMBA))

def sc_camp():
    tent = lambda x, color: f'''<g transform="translate({x},300)">
      <polygon points="-70,80 0,-40 70,80" fill="{color}" stroke="{LINE}" stroke-width="3"/>
      <polygon points="-20,80 0,20 20,80" fill="#FFF8E7" opacity="0.8"/>
    </g>'''
    lantern = f'''<g transform="translate(256,360)">
      <rect x="-10" y="-20" width="20" height="24" rx="4" fill="#F4D35E" stroke="{LINE}" stroke-width="2"/>
      <rect x="-6" y="-28" width="12" height="10" fill="#8B5A2B"/>
      <circle cx="0" cy="-8" r="20" fill="#FFF3B0" opacity="0.35"/>
    </g>'''
    return wrap(outdoor() + tree(50, 320, 1) + tree(470, 330, 0.9)
                + tent(170, "#E07A3A") + tent(360, "#3D7CC9") + lantern
                + kid(256, 380, 0.75, pose="sit", **SIMBA))

def sc_room():
    return wrap(indoor()
                + '''<rect x="340" y="80" width="90" height="110" rx="6" fill="#8B5A2B"/>
                <rect x="352" y="94" width="66" height="82" rx="3" fill="#A8D8F0"/>
                <rect x="40" y="110" width="70" height="160" rx="6" fill="#C9844A"/>
                '''
                + f'''<rect x="140" y="260" width="220" height="18" rx="4" fill="#C9844A" stroke="{LINE}" stroke-width="2"/>
                <rect x="160" y="278" width="14" height="70" fill="#8B5A2B"/>
                <rect x="326" y="278" width="14" height="70" fill="#8B5A2B"/>'''
                + map_prop(200, 248, 1) + radio_prop(300, 240, 0.9)
                + bag_prop(90, 300, 1.1)
                + kid(256, 360, 0.85, pose="stand", **SIMBA))

def sc_start():
    return wrap(outdoor() + path_road() + tree(80, 330, 1)
                + start_marker(300, 360, 2.2)
                + kid(180, 350, 1.0, pose="point", **SIMBA))

def sc_left():
    return wrap(outdoor() + path_left() + arrow_sign(280, 200, "left")
                + kid(300, 350, 1.05, pose="walk", flip=True, **SIMBA))

def path_left():
    return '''<path d="M500 440 C300 440, 260 400, 120 360" fill="none" stroke="#E6C38A" stroke-width="46"/>
    <path d="M500 440 C300 440, 260 400, 120 360" fill="none" stroke="#F4E1B5" stroke-width="10" stroke-dasharray="12 16"/>'''

def path_right():
    return '''<path d="M20 440 C200 440, 250 400, 400 350" fill="none" stroke="#E6C38A" stroke-width="46"/>
    <path d="M20 440 C200 440, 250 400, 400 350" fill="none" stroke="#F4E1B5" stroke-width="10" stroke-dasharray="12 16"/>'''

def sc_right():
    return wrap(outdoor() + path_right() + arrow_sign(160, 200, "right")
                + kid(200, 350, 1.05, pose="walk", **SIMBA))

def sc_up():
    hill = f'<ellipse cx="256" cy="360" rx="220" ry="90" fill="{GRASS_DARK}"/>'
    return wrap(outdoor() + hill + arrow_sign(340, 160, "up")
                + path_up()
                + kid(240, 300, 1.0, pose="walk", **SIMBA))

def path_up():
    return '''<path d="M256 500 L256 260" fill="none" stroke="#E6C38A" stroke-width="36"/>'''

def sc_down():
    hill = f'<ellipse cx="256" cy="260" rx="220" ry="80" fill="{GRASS_DARK}"/>'
    return wrap(outdoor() + hill + arrow_sign(360, 140, "down")
                + '''<path d="M256 200 L256 500" fill="none" stroke="#E6C38A" stroke-width="36"/>'''
                + kid(250, 340, 1.0, pose="walk", **SIMBA))

def sc_turn():
    return wrap(outdoor() + path_road() + bush(80, 400)
                + shadow(256, 430, 60)
                + kid(256, 348, 1.15, pose="come", **SIMBA))

def sc_landmark():
    return wrap(outdoor() + landmark_tree(300, 280, 1.25)
                + bush(80, 410)
                + kid(140, 360, 0.95, pose="point", **SIMBA)
                + kid(200, 370, 0.85, pose="stand", **MEI))

def sc_compass():
    return wrap(outdoor() + tree(60, 340, 0.8) + f'''
    <g transform="translate(256,250)">
      <circle cx="0" cy="0" r="110" fill="#FFF8E7" stroke="{LINE}" stroke-width="8"/>
      <circle cx="0" cy="0" r="96" fill="#EAF6F0" stroke="#8FCB6A" stroke-width="3"/>
      <polygon points="0,-70 16,0 0,16 -16,0" fill="#E85D4C"/>
      <polygon points="0,70 16,0 0,-16 -16,0" fill="#3D7CC9"/>
      <circle cx="0" cy="0" r="10" fill="#F4D35E" stroke="{LINE}" stroke-width="2"/>
      <text x="0" y="-78" text-anchor="middle" font-size="22" font-family="Verdana, sans-serif" font-weight="700" fill="#2C3A32">N</text>
    </g>
    ''' + kid(400, 380, 0.7, pose="stand", **SIMBA))

def sc_lantern():
    return wrap(outdoor(night=True) + tree(70, 330, 1) + tree(450, 340, 0.9)
                + '''<g transform="translate(256,230)">
                    <rect x="-16" y="-10" width="32" height="40" rx="6" fill="#F4D35E" stroke="#2C3A32" stroke-width="3"/>
                    <rect x="-10" y="-22" width="20" height="14" fill="#8B5A2B"/>
                    <circle cx="0" cy="8" r="50" fill="#FFF3B0" opacity="0.28"/>
                    <circle cx="0" cy="8" r="90" fill="#FFF3B0" opacity="0.12"/>
                  </g>'''
                + kid(180, 360, 0.95, pose="stand", item="flashlight", **SIMBA)
                + kid(340, 365, 0.9, pose="stand", **MEI))

def sc_sun():
    return wrap(outdoor() + tree(80, 340, 1, True)
                + f'<circle cx="420" cy="78" r="70" fill="{SUN_RING}" opacity="0.55"/>'
                + kid(250, 350, 1.1, pose="wave", **SIMBA))

def sc_clock():
    return wrap(outdoor() + f'''
    <g transform="translate(256,230)">
      <circle cx="0" cy="0" r="110" fill="#FFF8E7" stroke="{LINE}" stroke-width="8"/>
      <circle cx="0" cy="0" r="8" fill="{LINE}"/>
      <line x1="0" y1="0" x2="0" y2="-60" stroke="{LINE}" stroke-width="8" stroke-linecap="round"/>
      <line x1="0" y1="0" x2="46" y2="20" stroke="#E07A3A" stroke-width="6" stroke-linecap="round"/>
      <text x="0" y="-80" text-anchor="middle" font-size="20" font-family="Verdana" font-weight="700">12</text>
      <text x="84" y="8" text-anchor="middle" font-size="20" font-family="Verdana" font-weight="700">3</text>
    </g>
    ''' + kid(400, 380, 0.7, pose="wait", **SIMBA))

def sc_water():
    return wrap(outdoor() + tree(80, 340, 1, True)
                + shadow(256, 440, 80)
                + bottle_prop(256, 260, 4.0)
                + kid(400, 360, 0.8, pose="stand", item="bottle", **SIMBA))

def sc_notebook():
    return wrap(indoor() + f'''
    <rect x="96" y="120" width="320" height="250" rx="12" fill="#FFF8E7" stroke="{LINE}" stroke-width="4"/>
    <path d="M140 280 C180 220, 240 300, 300 230 C340 200, 360 250, 380 220" fill="none" stroke="#C45C2A" stroke-width="5"/>
    <circle cx="140" cy="280" r="8" fill="#2D9A5B"/>
    <rect x="330" y="240" width="36" height="24" rx="3" fill="#F3C98B"/>
    <line x1="130" y1="160" x2="300" y2="160" stroke="#D5E3D9" stroke-width="4"/>
    <line x1="130" y1="190" x2="280" y2="190" stroke="#D5E3D9" stroke-width="4"/>
    ''' + kid(80, 390, 0.7, pose="stand", item="notebook", **SIMBA))

def sc_pencil():
    return wrap(indoor() + f'''
    <rect x="70" y="200" width="280" height="200" rx="8" fill="#FFF8E7" stroke="{LINE}" stroke-width="3"/>
    <path d="M100 330 L200 280 L300 300" fill="none" stroke="#3D7CC9" stroke-width="4"/>
    <g transform="translate(340,180) rotate(35)">
      <rect x="-12" y="-80" width="24" height="140" rx="4" fill="#F4D35E" stroke="{LINE}" stroke-width="2"/>
      <polygon points="-12,60 12,60 0,100" fill="#E8B889" stroke="{LINE}" stroke-width="2"/>
      <polygon points="-5,88 5,88 0,100" fill="#2C3A32"/>
      <rect x="-12" y="-80" width="24" height="20" fill="#E85D4C"/>
    </g>
    ''')

def sc_plan():
    return wrap(indoor() + f'''
    <rect x="110" y="90" width="290" height="340" rx="8" fill="#F7E3A8" stroke="{LINE}" stroke-width="4"/>
    <rect x="110" y="90" width="290" height="40" rx="8" fill="#C9844A"/>
    <text x="255" y="118" text-anchor="middle" font-size="20" font-family="Verdana" font-weight="700" fill="#FFF8E7">PLAN</text>
    <circle cx="160" cy="180" r="18" fill="#2D9A5B"/>
    <text x="160" y="187" text-anchor="middle" font-size="18" fill="#fff" font-family="Verdana" font-weight="700">1</text>
    <text x="200" y="190" font-size="20" font-family="Verdana" fill="#2C3A32">Check the map</text>
    <circle cx="160" cy="250" r="18" fill="#3D7CC9"/>
    <text x="160" y="257" text-anchor="middle" font-size="18" fill="#fff" font-family="Verdana" font-weight="700">2</text>
    <text x="200" y="260" font-size="20" font-family="Verdana" fill="#2C3A32">Go together</text>
    <circle cx="160" cy="320" r="18" fill="#E07A3A"/>
    <text x="160" y="327" text-anchor="middle" font-size="18" fill="#fff" font-family="Verdana" font-weight="700">3</text>
    <text x="200" y="330" font-size="20" font-family="Verdana" fill="#2C3A32">Stay together</text>
    ''')

def sc_design():
    return wrap(indoor() + f'''
    <rect x="60" y="80" width="390" height="280" rx="10" fill="#FFF8E7" stroke="{LINE}" stroke-width="4"/>
    <rect x="90" y="120" width="80" height="60" rx="6" fill="#8FCB6A"/>
    <rect x="190" y="120" width="80" height="60" rx="6" fill="#E6C38A"/>
    <rect x="290" y="120" width="80" height="60" rx="6" fill="#8FCB6A"/>
    <rect x="90" y="200" width="80" height="60" rx="6" fill="#A8D8F0"/>
    <rect x="190" y="200" width="80" height="60" rx="6" fill="#8FCB6A"/>
    <rect x="290" y="200" width="80" height="60" rx="6" fill="#F4D35E"/>
    <circle cx="130" cy="230" r="10" fill="#2D9A5B"/>
    <polygon points="330,210 350,230 330,250 310,230" fill="#E85D4C"/>
    <path d="M130 230 L230 230 L330 230" fill="none" stroke="#C45C2A" stroke-width="4" stroke-dasharray="6 6"/>
    ''' + kid(200, 400, 0.75, pose="stand", item="notebook", **SIMBA)
        + kid(330, 405, 0.7, pose="point", **MEI))

def sc_level():
    tiles = ""
    colors = [["#8FCB6A", "#E6C38A", "#8FCB6A", "#8FCB6A"],
              ["#8FCB6A", "#E6C38A", "#A8D8F0", "#8FCB6A"],
              ["#F4D35E", "#E6C38A", "#E6C38A", "#E07A3A"],
              ["#8FCB6A", "#8FCB6A", "#8FCB6A", "#E07A3A"]]
    for r, row in enumerate(colors):
        for c, col in enumerate(row):
            tiles += f'<rect x="{86+c*85}" y="{80+r*85}" width="78" height="78" rx="10" fill="{col}" stroke="#fff" stroke-width="3"/>\n'
    return wrap(f'<rect width="512" height="512" fill="#EAF6F0"/>' + tiles
                + start_marker(125, 365, 1.2)
                + star_burst(380, 140)
                + f'<text x="256" y="470" text-anchor="middle" font-size="22" font-family="Verdana" fill="#2C3A32" font-weight="700">My Level</text>')

def sc_roles():
    badge = lambda x, y, color, label: f'''<g transform="translate({x},{y})">
      <circle cx="0" cy="-70" r="22" fill="{color}" stroke="{LINE}" stroke-width="3"/>
    </g>'''
    return wrap(outdoor() + tree(50, 340, 0.9)
                + shadow(150, 430, 40) + shadow(256, 430, 40) + shadow(360, 430, 40)
                + kid(150, 350, 1.0, pose="stand", item="map", **MEI)
                + kid(256, 345, 1.05, pose="talk", item="radio", **SIMBA)
                + kid(360, 350, 1.0, pose="stand", bag=True, **LEO)
                + badge(150, 350, "#3D7CC9", "MAP")
                + badge(256, 345, "#2D9A5B", "RADIO")
                + badge(360, 350, "#E07A3A", "BAG"))

def sc_share():
    return wrap(outdoor() + tree(80, 340, 1, True)
                + shadow(200, 430, 50) + shadow(310, 430, 50)
                + kid(190, 350, 1.05, pose="stand", item="map", **SIMBA)
                + kid(330, 350, 1.05, pose="stand", flip=True, **MEI))

def sc_rules():
    return wrap(indoor() + f'''
    <rect x="96" y="70" width="320" height="370" rx="16" fill="#FFF8E7" stroke="{LINE}" stroke-width="4"/>
    <rect x="96" y="70" width="320" height="54" rx="16" fill="#2D9A5B"/>
    <text x="256" y="106" text-anchor="middle" font-size="24" font-family="Verdana" font-weight="700" fill="#fff">Team Rules</text>
    <circle cx="150" cy="180" r="14" fill="#F4D35E"/>
    <text x="180" y="188" font-size="20" font-family="Verdana" fill="#2C3A32">Stay together</text>
    <circle cx="150" cy="250" r="14" fill="#F4D35E"/>
    <text x="180" y="258" font-size="20" font-family="Verdana" fill="#2C3A32">Take turns</text>
    <circle cx="150" cy="320" r="14" fill="#F4D35E"/>
    <text x="180" y="328" font-size="20" font-family="Verdana" fill="#2C3A32">Use kind words</text>
    <circle cx="150" cy="390" r="14" fill="#F4D35E"/>
    <text x="180" y="398" font-size="20" font-family="Verdana" fill="#2C3A32">Help a friend</text>
    ''')

def sc_story():
    return wrap(indoor() + f'''
    <g transform="translate(256,260)">
      <rect x="-150" y="-110" width="150" height="200" rx="6" fill="#3D7CC9" stroke="{LINE}" stroke-width="3"/>
      <rect x="0" y="-110" width="150" height="200" rx="6" fill="#FFF8E7" stroke="{LINE}" stroke-width="3"/>
      <ellipse cx="70" cy="-40" rx="30" ry="20" fill="#8FCB6A"/>
      <rect x="50" y="-10" width="40" height="30" fill="#F3C98B"/>
      <circle cx="-80" cy="-30" r="20" fill="#F4D35E"/>
      <path d="M-110 40 Q-80 20 -50 40" fill="none" stroke="#F4D35E" stroke-width="4"/>
    </g>
    ''' + kid(100, 400, 0.7, pose="sit", **SIMBA))

def sc_pin():
    return wrap(outdoor() + big_map(256, 260, 0.95, False) + f'''
    <g transform="translate(330,200)">
      <path d="M0 -30 C18 -30 18 -8 0 20 C-18 -8 -18 -30 0 -30Z" fill="#E85D4C" stroke="{LINE}" stroke-width="3"/>
      <circle cx="0" cy="-18" r="7" fill="#FFF8E7"/>
    </g>
    ''')

def sc_search():
    return wrap(outdoor() + tree(60, 330, 1) + tree(450, 340, 0.9)
                + kid(200, 350, 1.05, pose="look" if False else "point", item="map", **SIMBA)
                + kid(330, 360, 0.95, pose="look" if False else "hips", **LEO)
                + f'''<g transform="translate(360,220)">
                  <circle cx="0" cy="0" r="36" fill="none" stroke="{LINE}" stroke-width="8"/>
                  <line x1="26" y1="26" x2="52" y2="52" stroke="{LINE}" stroke-width="8" stroke-linecap="round"/>
                  <circle cx="0" cy="0" r="26" fill="#A8D8F0" opacity="0.35"/>
                </g>''')

def sc_kit():
    return wrap(indoor() + f'''
    <ellipse cx="256" cy="400" rx="200" ry="30" fill="#2C3A32" opacity="0.1"/>
    <rect x="60" y="280" width="392" height="28" rx="6" fill="#C9844A"/>
    ''' + bag_prop(120, 230, 1.6) + bottle_prop(210, 230, 1.6)
        + map_prop(290, 230, 1.5) + flashlight_prop(370, 230, 1.5) + radio_prop(430, 220, 1.2))

def sc_call():
    waves = '''<g transform="translate(340,220)" fill="none" stroke="#3D7CC9" stroke-width="5" stroke-linecap="round">
      <path d="M0 0 Q12 -16 0 -32" opacity="0.9"/>
      <path d="M16 8 Q36 -16 16 -44" opacity="0.7"/>
      <path d="M32 16 Q62 -16 32 -56" opacity="0.5"/>
    </g>'''
    return wrap(outdoor() + bush(80, 410)
                + shadow(230, 430, 55)
                + kid(230, 348, 1.15, pose="talk", item="radio", **SIMBA) + waves)

def sc_walk():
    return wrap(outdoor() + path_road() + tree(80, 330, 1) + tree(430, 320, 1, True)
                + kid(250, 348, 1.1, pose="walk", bag=True, **SIMBA))

def sc_safe():
    return wrap(outdoor() + f'''
    <path d="M40 420 C120 400, 160 360, 200 300" fill="none" stroke="#C45C2A" stroke-width="16"/>
    <path d="M40 420 C200 430, 300 400, 470 360" fill="none" stroke="#E6C38A" stroke-width="46"/>
    <path d="M40 420 C200 430, 300 400, 470 360" fill="none" stroke="#F4E1B5" stroke-width="10" stroke-dasharray="12 16"/>
    ''' + tree(180, 250, 0.7) + start_marker(80, 420, 1)
        + kid(300, 360, 1.0, pose="walk", **SIMBA)
        + f'<text x="400" y="330" font-size="18" font-family="Verdana" font-weight="700" fill="#2D9A5B">safe</text>')

def sc_star():
    return wrap(outdoor() + tree(60, 340, 0.8)
                + f'''<g transform="translate(256,230) scale(2.2)">{star_burst(0,0)}</g>'''
                + kid(256, 380, 0.9, pose="ready", **SIMBA))

def sc_report():
    return wrap(indoor() + f'''
    <rect x="180" y="80" width="220" height="160" rx="8" fill="#F7E3A8" stroke="{LINE}" stroke-width="3"/>
    <path d="M200 180 C240 140, 280 190, 360 130" fill="none" stroke="#C45C2A" stroke-width="3"/>
    ''' + kid(256, 330, 1.15, pose="talk", item="map", **SIMBA)
        + kid(90, 360, 0.8, pose="listen", **MEI)
        + kid(420, 360, 0.8, pose="listen", flip=True, **LEO))

def sc_year():
    balloons = ""
    for x, y, c in ((80, 120, "#E85D4C"), (150, 80, "#3D7CC9"), (360, 90, "#F4D35E"), (440, 130, "#2D9A5B")):
        balloons += f'''<g transform="translate({x},{y})">
          <ellipse cx="0" cy="0" rx="22" ry="28" fill="{c}" stroke="{LINE}" stroke-width="2"/>
          <path d="M0 28 Q-4 50 0 70" fill="none" stroke="{LINE}" stroke-width="2"/>
        </g>'''
    return wrap(outdoor() + balloons + flagpole(256, 240)
                + kid(170, 350, 0.95, pose="wave", **MEI)
                + kid(256, 340, 1.05, pose="ready", **SIMBA)
                + kid(345, 352, 0.95, pose="wave", flip=True, **LEO))

def sc_home():
    return wrap(outdoor() + fence() + house(256, 260, 1.35)
                + tree(70, 340, 1, True) + tree(450, 350, 1)
                + kid(140, 370, 0.85, pose="wave", **SIMBA))

def sc_question():
    return wrap(outdoor() + big_map(300, 240, 0.7)
                + kid(160, 350, 1.1, pose="hips", **SIMBA)
                + f'''<g transform="translate(150,200)">
                  <circle cx="0" cy="0" r="28" fill="#FFF8E7" stroke="{LINE}" stroke-width="3"/>
                  <text x="0" y="12" text-anchor="middle" font-size="36" font-family="Verdana" font-weight="700" fill="#E07A3A">?</text>
                </g>''')

def sc_fair():
    return wrap(outdoor() + tree(60, 340, 0.9)
                + shadow(180, 430, 40) + shadow(256, 430, 40) + shadow(340, 430, 40)
                + kid(170, 350, 0.95, pose="stand", **MEI)
                + kid(256, 340, 1.05, pose="stand", item="radio", **SIMBA)
                + kid(350, 350, 0.95, pose="stand", flip=True, **LEO)
                + star_burst(256, 200))

def sc_practice():
    checks = f'''<g transform="translate(380,200)">
      <rect x="0" y="0" width="40" height="40" rx="8" fill="#DCFCE7" stroke="#2D9A5B" stroke-width="3"/>
      <path d="M8 20 L16 30 L32 10" fill="none" stroke="#2D9A5B" stroke-width="5" stroke-linecap="round"/>
      <rect x="0" y="56" width="40" height="40" rx="8" fill="#DCFCE7" stroke="#2D9A5B" stroke-width="3"/>
      <path d="M8 76 L16 86 L32 66" fill="none" stroke="#2D9A5B" stroke-width="5" stroke-linecap="round"/>
    </g>'''
    return wrap(outdoor() + bush(80, 410)
                + shadow(230, 430, 55)
                + kid(230, 348, 1.15, pose="talk", item="radio", **SIMBA) + checks)

def sc_friends():
    return wrap(outdoor() + tree(60, 340, 1, True) + tree(460, 350, 0.9)
                + kid(170, 350, 1.0, pose="wave", **MEI)
                + kid(256, 340, 1.1, pose="wave", **SIMBA)
                + kid(345, 350, 1.0, pose="wave", flip=True, **LEO))

def sc_hill():
    return wrap(outdoor()
                + f'<ellipse cx="256" cy="340" rx="240" ry="120" fill="{GRASS_DARK}"/>'
                + f'<ellipse cx="256" cy="320" rx="180" ry="90" fill="{GRASS}"/>'
                + tree(200, 240, 0.7) + start_marker(256, 220, 1)
                + kid(180, 380, 0.85, pose="point", **SIMBA))

def sc_bridge():
    return wrap(outdoor() + f'''
    <ellipse cx="256" cy="430" rx="220" ry="30" fill="#7EC8E3"/>
    <rect x="110" y="300" width="292" height="24" rx="4" fill="#C9844A" stroke="{LINE}" stroke-width="2"/>
    <rect x="120" y="250" width="12" height="90" fill="#8B5A2B"/>
    <rect x="380" y="250" width="12" height="90" fill="#8B5A2B"/>
    <rect x="110" y="246" width="292" height="10" fill="#8B5A2B"/>
    ''' + kid(256, 268, 0.9, pose="walk", **SIMBA)
        + tree(60, 330, 0.9) + tree(450, 340, 0.9, True))

def sc_table_radio():
    return wrap(indoor()
                + f'''<rect x="80" y="300" width="352" height="24" rx="6" fill="#C9844A" stroke="{LINE}" stroke-width="2"/>
                <rect x="110" y="324" width="18" height="90" fill="#8B5A2B"/>
                <rect x="384" y="324" width="18" height="90" fill="#8B5A2B"/>'''
                + radio_prop(256, 230, 2.4))

def sc_bag_door():
    return wrap(indoor() + house_door_close() + bag_prop(140, 360, 1.8, "#C45C2A")
                + kid(400, 360, 0.8, pose="point", flip=True, **SIMBA))

def sc_light():
    return wrap(indoor() + f'''
    <circle cx="256" cy="80" r="40" fill="#FFE27A"/>
    <circle cx="256" cy="80" r="80" fill="#FFF3B0" opacity="0.45"/>
    <rect x="248" y="0" width="16" height="40" fill="#8B5A2B"/>
    <rect x="80" y="280" width="352" height="24" rx="6" fill="#C9844A"/>
    ''' + kid(256, 330, 1.05, pose="stand", **SIMBA)
        + map_prop(256, 268, 1.1))


SCENES = {
    "hello": sc_hello,
    "name": sc_name,
    "ready": sc_ready,
    "team": sc_team,
    "meet": sc_meet,
    "go": sc_go,
    "wait": sc_wait,
    "stop": sc_stop,
    "come": sc_come,
    "help": sc_help,
    "thank": sc_thank,
    "listen": sc_listen,
    "speak": sc_speak,
    "look": sc_look,
    "found": sc_found,
    "rest": sc_rest,
    "count": sc_count,
    "idea": sc_idea,
    "ask": sc_ask,
    "agree": sc_agree,
    "door": sc_door,
    "window": sc_window,
    "table": sc_table,
    "radio": sc_radio,
    "bag": sc_bag,
    "bag-red": sc_bag_red,
    "boots": sc_boots,
    "flashlight": sc_flashlight,
    "map": sc_map,
    "map-blue": sc_map_blue,
    "yard": sc_yard,
    "path": sc_path,
    "sign": sc_sign,
    "flag": sc_flag,
    "camp": sc_camp,
    "room": sc_room,
    "start": sc_start,
    "left": sc_left,
    "right": sc_right,
    "up": sc_up,
    "down": sc_down,
    "turn": sc_turn,
    "landmark": sc_landmark,
    "compass": sc_compass,
    "lantern": sc_lantern,
    "sun": sc_sun,
    "clock": sc_clock,
    "water": sc_water,
    "notebook": sc_notebook,
    "pencil": sc_pencil,
    "plan": sc_plan,
    "design": sc_design,
    "level": sc_level,
    "roles": sc_roles,
    "share": sc_share,
    "rules": sc_rules,
    "story": sc_story,
    "pin": sc_pin,
    "search": sc_search,
    "kit": sc_kit,
    "call": sc_call,
    "walk": sc_walk,
    "safe": sc_safe,
    "star": sc_star,
    "report": sc_report,
    "year": sc_year,
    "home": sc_home,
    "question": sc_question,
    "fair": sc_fair,
    "practice": sc_practice,
    "friends": sc_friends,
    "hill": sc_hill,
    "bridge": sc_bridge,
    "table-radio": sc_table_radio,
    "bag-door": sc_bag_door,
    "light": sc_light,
}


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    # remove old generated svgs only (keep any other assets)
    for p in OUT.glob("*.svg"):
        p.unlink()
    for name, fn in SCENES.items():
        svg = fn()
        path = OUT / f"{name}.svg"
        path.write_text(svg, encoding="utf-8")
        if "None" in svg:
            print("WARN None in", name)
    print(f"wrote {len(SCENES)} svgs to {OUT}")


if __name__ == "__main__":
    main()
