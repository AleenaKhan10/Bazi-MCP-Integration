import math

def get_point(cx, cy, r, angle_deg):
    rad = math.radians(angle_deg)
    return cx + r * math.cos(rad), cy + r * math.sin(rad)

elements = {
    'Wood': (80, 170),
    'Fire': (200, 55),
    'Earth': (320, 170),
    'Metal': (265, 315),
    'Water': (135, 315)
}

CENTER = (200, 195)
ARC_RADIUS = 135  # Radius of the ring of arrows

# Gradients and Header
svg_header = """<!-- Five Elements (Wu Xing) Cycle Diagram -->
<!-- Shows both Generating Cycle (outer arrows) and Controlling Cycle (inner star) -->
<!-- Arrowheads are inline polygons (PDF-safe, no marker-end dependency) -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 410" width="400" height="410">
  <defs>
    <!-- Gradients for each element -->
    <radialGradient id="woodGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#4ade80"/>
      <stop offset="100%" style="stop-color:#16a34a"/>
    </radialGradient>
    <radialGradient id="fireGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#f87171"/>
      <stop offset="100%" style="stop-color:#dc2626"/>
    </radialGradient>
    <radialGradient id="earthGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#fbbf24"/>
      <stop offset="100%" style="stop-color:#d97706"/>
    </radialGradient>
    <radialGradient id="metalGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#e5e7eb"/>
      <stop offset="100%" style="stop-color:#9ca3af"/>
    </radialGradient>
    <radialGradient id="waterGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#60a5fa"/>
      <stop offset="100%" style="stop-color:#2563eb"/>
    </radialGradient>
  </defs>
  
  <!-- Background circle -->
  <circle cx="200" cy="195" r="175" fill="#fef9e7" stroke="#d4a574" stroke-width="2"/>
"""

svg_footer = """  <!-- Element Circles -->
  <!-- Wood (East - Upper Left) -->
  <circle cx="80" cy="170" r="40" fill="url(#woodGrad)" stroke="#166534" stroke-width="2"/>
  <text x="80" y="163" text-anchor="middle" fill="white" font-size="20" font-weight="bold">木</text>
  <text x="80" y="183" text-anchor="middle" fill="white" font-size="11">Wood</text>
  
  <!-- Fire (South - Top) -->
  <circle cx="200" cy="55" r="40" fill="url(#fireGrad)" stroke="#991b1b" stroke-width="2"/>
  <text x="200" y="48" text-anchor="middle" fill="white" font-size="20" font-weight="bold">火</text>
  <text x="200" y="68" text-anchor="middle" fill="white" font-size="11">Fire</text>
  
  <!-- Earth (Center - Upper Right) -->
  <circle cx="320" cy="170" r="40" fill="url(#earthGrad)" stroke="#92400e" stroke-width="2"/>
  <text x="320" y="163" text-anchor="middle" fill="white" font-size="20" font-weight="bold">土</text>
  <text x="320" y="183" text-anchor="middle" fill="white" font-size="11">Earth</text>
  
  <!-- Metal (West - Lower Right) -->
  <circle cx="265" cy="315" r="40" fill="url(#metalGrad)" stroke="#4b5563" stroke-width="2"/>
  <text x="265" y="308" text-anchor="middle" fill="#374151" font-size="20" font-weight="bold">金</text>
  <text x="265" y="328" text-anchor="middle" fill="#374151" font-size="11">Metal</text>
  
  <!-- Water (North - Lower Left) -->
  <circle cx="135" cy="315" r="40" fill="url(#waterGrad)" stroke="#1e40af" stroke-width="2"/>
  <text x="135" y="308" text-anchor="middle" fill="white" font-size="20" font-weight="bold">水</text>
  <text x="135" y="328" text-anchor="middle" fill="white" font-size="11">Water</text>
  
  <!-- Legend - Centered, wider box, smaller font -->
  <rect x="85" y="375" width="230" height="26" rx="5" fill="white" stroke="#d4a574" stroke-width="1"/>
  <line x1="100" y1="388" x2="125" y2="388" stroke="#059669" stroke-width="3"/>
  <polygon points="126,384 132,388 126,392" fill="#059669"/>
  <text x="137" y="392" fill="#059669" font-size="9" font-weight="600">Generating</text>
  <line x1="210" y1="388" x2="235" y2="388" stroke="#dc2626" stroke-width="2" stroke-dasharray="5,3"/>
  <polygon points="236,384 242,388 236,392" fill="#dc2626"/>
  <text x="247" y="392" fill="#dc2626" font-size="9" font-weight="600">Controlling</text>
</svg>
"""

def make_arrow(x2, y2, angle_rad, color):
    # Expanded Size for Visibility
    # Tip at x2,y2
    # Base is back 16px
    base_len = 16
    width = 12 
    
    # Base center
    bx = x2 - base_len * math.cos(angle_rad)
    by = y2 - base_len * math.sin(angle_rad)
    
    # Left and Right of base
    # Perpendicular vector (-sin, cos) -> Normal to direction
    lx = bx + width/2 * math.sin(angle_rad)
    ly = by - width/2 * math.cos(angle_rad)
    
    rx = bx - width/2 * math.sin(angle_rad)
    ry = by + width/2 * math.cos(angle_rad)
    
    return f'<polygon points="{x2:.1f},{y2:.1f} {lx:.1f},{ly:.1f} {rx:.1f},{ry:.1f}" fill="{color}"/>'

content = [svg_header]
content.append('  <!-- Generating Cycle Arrows (Outer - Green) -->')
content.append('  <!-- Paths are segments of a circle centered at (200, 195) -->')

# Logic for Arcs:
# Center C=(200,195). Radius R_arc=135.
# Draw arc from Element A to Element B.
# StartPoint: Intersection of Element A Circle (r=42) and Path Circle (R=135).
# EndPoint: Intersection of Element B Circle (r=42) and Path Circle (R=135).
# Tangent at EndPoint: Perpendicular to radius vector (End - C).

generating_pairs = [
    ('Wood', 'Fire'),
    ('Fire', 'Earth'),
    ('Earth', 'Metal'),
    ('Metal', 'Water'),
    ('Water', 'Wood')
]

for start_name, end_name in generating_pairs:
    e1 = elements[start_name]
    e2 = elements[end_name]
    
    # Calculate angles of elements relative to Center
    ang1 = math.atan2(e1[1]-CENTER[1], e1[0]-CENTER[0])
    ang2 = math.atan2(e2[1]-CENTER[1], e2[0]-CENTER[0])
    
    # Normalize angles to 0-2pi for sorting? No, atan2 is -pi to pi.
    # We want clockwise flow. Wood->Fire etc.
    
    # Correct positions on the Path Circle (R=135) closest to the elements.
    # We use these angles to define the start/end of the Arc.
    # But we want the Arc to stop short at the element boundary (r=42).
    # Approx angular gap for r=42 at R=135 is: 42/135 radians ~ 0.3 rad (~18 deg).
    # So we retract the start angle by alpha and end angle by alpha?
    # Actually, let's calculate exact points:
    # Start: Point on ARC_RADIUS at angle (ang1 + offset)
    # End: Point on ARC_RADIUS at angle (ang2 - offset)
    # Check direction. Clockwise.
    # Wood(-168) -> Fire(-90).
    # -168 + offset ... -90 - offset.
    
    # Offset calculation:
    # r=42. R=135.
    # Angle offset alpha ~ asin(40/135) ? No.
    # Just approximate decent gap. 0.3 rad is good.
    gap_ang = 0.32 
    
    # Handle logic for 'crossing the seam' (-pi/pi) if needed, but atan2 handles smooth mostly?
    # Wood(-2.9) -> Fire(-1.57). Increasing? No. -2.9 to -1.57 is +1.3. Positive (Clockwise).
    
    # Special case: Metal(2.03) -> Water(2.3)? No.
    # Metal (265,315). dx=65, dy=120. atan2(1.1 rad / 63 deg).
    # Water (135,315). dx=-65, dy=120. atan2(2.0 rad / 116 deg).
    # Metal -> Water is 1.1 -> 2.0. Increasing +0.9.
    
    # Water(2.0) -> Wood(-2.9). 
    # 2.0 to 3.14(-3.14) to -2.9.
    # Jump is +1.3 rad approximately (crossing pi).
    
    # So we always add delta > 0.
    
    # Wait, atan2 range is -pi to pi.
    # Wood: -2.93
    # Fire: -1.57
    # Earth: -0.20
    # Metal: 1.07
    # Water: 2.07
    # Wood: -2.93 (+2pi = 3.35)
    
    s_ang = ang1
    e_ang = ang2
    
    # Adjust for wrap around
    if e_ang < s_ang:
        e_ang += 2*math.pi
        
    # Apply gaps
    s_arc = s_ang + gap_ang
    e_arc = e_ang - gap_ang
    
    # Coords
    sx = CENTER[0] + ARC_RADIUS * math.cos(s_arc)
    sy = CENTER[1] + ARC_RADIUS * math.sin(s_arc)
    
    ex = CENTER[0] + ARC_RADIUS * math.cos(e_arc)
    ey = CENTER[1] + ARC_RADIUS * math.sin(e_arc)
    
    # Draw Arc
    # Large arc flag: usually 0 for adjacent elements (angle < pi).
    # Sweep flag: 1 for clockwise (positive angle direction in SVG with y-down? 
    # WAIT. Standard math (y up): angle increases CCW.
    # SVG (y down): angle increases CW.
    # 0 deg (1,0). 90 deg (0,1).
    # cos(0)=1, sin(0)=0. cos(90)=0, sin(90)=1.
    # (0,1) is DOWN in SVG.
    # So SVG angles increase CLOCKWISE.
    # My atan2 calc used y-CENTER[1]. 
    # If y increases down, then atan2 reflects standard SVG angles.
    # So increase angle = Clockwise.
    # So Sweep Flag = 1.
    
    content.append(f'  <path d="M {sx:.1f} {sy:.1f} A {ARC_RADIUS} {ARC_RADIUS} 0 0 1 {ex:.1f} {ey:.1f}" fill="none" stroke="#059669" stroke-width="3"/>')
    
    # Tangent Angle at End (for Arrow)
    # For a circle, tangent is perpendicular to radius.
    # Radius vector at End: (ex-cx, ey-cy). Angle = e_arc.
    # Tangent vector (CW): angle + 90 deg (pi/2).
    t_ang = e_arc + math.pi/2
    
    content.append('  ' + make_arrow(ex, ey, t_ang, '#059669'))


# Controlling Arrows (Straight Lines)
content.append('\n  <!-- Controlling Arrows (Inner Star - Red) -->')
ctrl_paths = [
    ('Wood', 'Earth'),
    ('Earth', 'Water'),
    ('Water', 'Fire'),
    ('Fire', 'Metal'),
    ('Metal', 'Wood')
]

for start, end in ctrl_paths:
    p1 = elements[start]
    p2 = elements[end]
    dx = p2[0] - p1[0]
    dy = p2[1] - p1[1]
    angle = math.atan2(dy, dx)
    
    # Exact boundary r=42
    r_start = 42
    r_end = 42
    
    # Start point
    sx = p1[0] + r_start * math.cos(angle)
    sy = p1[1] + r_start * math.sin(angle)
    
    # End point
    ex = p2[0] - r_end * math.cos(angle)
    ey = p2[1] - r_end * math.sin(angle)
    
    # Line
    content.append(f'  <line x1="{sx:.1f}" y1="{sy:.1f}" x2="{ex:.1f}" y2="{ey:.1f}" stroke="#dc2626" stroke-width="2" stroke-dasharray="5,3"/>')
    content.append('  ' + make_arrow(ex, ey, angle, '#dc2626'))

content.append(svg_footer)

with open('app/templates/five_elements_cycle.svg', 'w', encoding='utf-8') as f:
    f.write('\n'.join(content))
