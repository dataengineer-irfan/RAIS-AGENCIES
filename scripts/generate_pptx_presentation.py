import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

sys.stdout.reconfigure(encoding='utf-8')

# Output PPTX Path
OUT_PPTX = "public/RAIS_Agencies_Automation_Architecture.pptx"
os.makedirs("public", exist_ok=True)

prs = Presentation()
# Set widescreen 16:9 (13.33 x 7.5 inches)
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)
blank_layout = prs.slide_layouts[6]

# Brand Colors
C_DARK = RGBColor(8, 12, 22)         # #080C16
C_NAVY = RGBColor(16, 26, 48)        # #101A30
C_GOLD = RGBColor(212, 175, 55)      # #D4AF37
C_GOLD_LIGHT = RGBColor(245, 218, 122) # #F5DA7A
C_WHITE = RGBColor(248, 250, 252)    # #F8FAFC
C_MUTED = RGBColor(148, 163, 184)    # #94A3B8
C_GREEN = RGBColor(37, 211, 102)     # WhatsApp Green

def add_slide_background(slide, prs):
    # Dark full bleed background
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg.fill.solid()
    bg.fill.fore_color.rgb = C_DARK
    bg.line.fill.background()
    
    # Outer gold border
    margin = Inches(0.4)
    border = slide.shapes.add_shape(
        MSO_SHAPE.RECTANGLE, 
        margin, margin, 
        prs.slide_width - (margin * 2), 
        prs.slide_height - (margin * 2)
    )
    border.fill.background()
    border.line.color.rgb = C_GOLD
    border.line.width = Pt(1.5)
    
    # Gold decorative corner lines / header accent
    line = slide.shapes.add_shape(
        MSO_SHAPE.RECTANGLE,
        Inches(0.8), Inches(1.5),
        prs.slide_width - Inches(1.6), Pt(2)
    )
    line.fill.solid()
    line.fill.fore_color.rgb = C_GOLD
    line.line.fill.background()
    
    # Footer text
    txBox = slide.shapes.add_textbox(Inches(0.8), Inches(6.9), prs.slide_width - Inches(1.6), Inches(0.4))
    tf = txBox.text_frame
    p = tf.paragraphs[0]
    p.text = "RAIS Agencies — Near Reddies Colony, Rayachoty (516269)  |  WhatsApp: +91 93474 53135  |  Instagram: @raisfrozenfoods"
    p.font.size = Pt(11)
    p.font.color.rgb = C_GOLD
    p.alignment = PP_ALIGN.CENTER

def add_header(slide, title_text, category_text="RAIS AGENCIES ARCHITECTURE BLUEPRINT"):
    tb = slide.shapes.add_textbox(Inches(0.8), Inches(0.55), prs.slide_width - Inches(1.6), Inches(0.9))
    tf = tb.text_frame
    tf.word_wrap = True
    
    p0 = tf.paragraphs[0]
    p0.text = category_text.upper()
    p0.font.size = Pt(11)
    p0.font.bold = True
    p0.font.color.rgb = C_GOLD
    
    p1 = tf.add_paragraph()
    p1.text = title_text
    p1.font.size = Pt(26)
    p1.font.bold = True
    p1.font.color.rgb = C_GOLD_LIGHT

# ==========================================================
# SLIDE 1: TITLE SLIDE
# ==========================================================
slide1 = prs.slides.add_slide(blank_layout)
bg1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
bg1.fill.solid()
bg1.fill.fore_color.rgb = C_DARK
bg1.line.fill.background()

# Title Diamond
d_size = Inches(2.2)
diamond = slide1.shapes.add_shape(
    MSO_SHAPE.DIAMOND,
    (prs.slide_width - d_size) / 2, Inches(1.1),
    d_size, d_size
)
diamond.fill.solid()
diamond.fill.fore_color.rgb = C_NAVY
diamond.line.color.rgb = C_GOLD
diamond.line.width = Pt(3)

# Initial 'R'
r_box = slide1.shapes.add_textbox((prs.slide_width - d_size) / 2, Inches(1.2), d_size, d_size)
rtf = r_box.text_frame
rp = rtf.paragraphs[0]
rp.text = "R"
rp.font.size = Pt(88)
rp.font.bold = True
rp.font.color.rgb = C_GOLD_LIGHT
rp.alignment = PP_ALIGN.CENTER

# Main Title
tb1 = slide1.shapes.add_textbox(Inches(1.0), Inches(3.6), prs.slide_width - Inches(2.0), Inches(2.5))
tf1 = tb1.text_frame
tf1.word_wrap = True

p = tf1.paragraphs[0]
p.text = "RAIS AGENCIES"
p.font.size = Pt(46)
p.font.bold = True
p.font.color.rgb = C_GOLD_LIGHT
p.alignment = PP_ALIGN.CENTER

p2 = tf1.add_paragraph()
p2.text = "END-TO-END AUTOMATION & CONTENT MARKETING ARCHITECTURE"
p2.font.size = Pt(20)
p2.font.bold = True
p2.font.color.rgb = C_WHITE
p2.alignment = PP_ALIGN.CENTER

p3 = tf1.add_paragraph()
p3.text = "15-Day 30-Reel Campaign  •  Meta Cloud API Publishing  •  66-SKU Digital Conversion Funnel"
p3.font.size = Pt(14)
p3.font.color.rgb = C_GOLD
p3.alignment = PP_ALIGN.CENTER

p4 = tf1.add_paragraph()
p4.text = "\n📍 Near Reddies Colony, Rayachoty (516269)   |   📲 WhatsApp: +91 93474 53135   |   📸 @raisfrozenfoods"
p4.font.size = Pt(13)
p4.font.color.rgb = C_MUTED
p4.alignment = PP_ALIGN.CENTER

# ==========================================================
# SLIDE 2: EXECUTIVE SUMMARY & STRATEGIC GOALS
# ==========================================================
slide2 = prs.slides.add_slide(blank_layout)
add_slide_background(slide2, prs)
add_header(slide2, "Executive Summary & Core Business Mission")

cards2 = [
    ("Dominating Rayachoty Distribution", 
     "Establish RAIS Agencies as the unquestioned #1 frozen food wholesale depot in Annamayya district, capturing both commercial and residential demand."),
    ("66-SKU Commercial Inventory", 
     "Showcasing top national brands: Triken Momos, Master Chef Nuggets, McCain French Fries, ITC Triangles, Godrej Patties, Mooz Cheese & Kraft Packaging."),
    ("Zero Ad Spend Organic Reach", 
     "Harnessing Instagram's Reels algorithm with 18.0-second retention pacing, localized bilingual dubbing (Telugu + Hindi), and zero competitor explore hashtags."),
    ("High-Conversion Direct Funnel", 
     "Every video directly drives potential buyers into instant WhatsApp chats (wa.me/919347453135) or the 66-SKU real-time digital catalogue.")
]

for idx, (title, desc) in enumerate(cards2):
    x = Inches(0.9 + (idx % 2) * 5.8)
    y = Inches(1.8 + (idx // 2) * 2.4)
    box = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(5.5), Inches(2.1))
    box.fill.solid()
    box.fill.fore_color.rgb = C_NAVY
    box.line.color.rgb = C_GOLD
    box.line.width = Pt(1.5)
    
    tf = box.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = f"✔ {title}"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = C_GOLD_LIGHT
    
    p2 = tf.add_paragraph()
    p2.text = desc
    p2.font.size = Pt(13)
    p2.font.color.rgb = C_WHITE

# ==========================================================
# SLIDE 3: HIGH-RETENTION CONTENT STRATEGY
# ==========================================================
slide3 = prs.slides.add_slide(blank_layout)
add_slide_background(slide3, prs)
add_header(slide3, "High-Retention Content Strategy: The 15 Scenarios")

# Column 1: The Problem
b1 = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.9), Inches(1.8), Inches(5.5), Inches(4.7))
b1.fill.solid()
b1.fill.fore_color.rgb = RGBColor(30, 15, 20)
b1.line.color.rgb = RGBColor(220, 80, 80)
b1.line.width = Pt(1.5)
tf1 = b1.text_frame
tf1.word_wrap = True
p = tf1.paragraphs[0]
p.text = "❌ Why Traditional Ads Fail"
p.font.size = Pt(20)
p.font.bold = True
p.font.color.rgb = RGBColor(255, 120, 120)

items_bad = [
    "Static Posters: Users scroll past flyers in under 0.5s.",
    "Generic Foreign Stock Footage: Zero emotional connection with Andhra / Rayachoty buyers.",
    "Cardboard Boxes in Craving Scenes: Showing industrial shipping cartons kills hunger cravings.",
    "Competitor Explore Hashtags: Blue clickable tags (#Rayachoty, #Foodie) send buyers to rivals!"
]
for item in items_bad:
    p2 = tf1.add_paragraph()
    p2.text = f"• {item}"
    p2.font.size = Pt(13)
    p2.font.color.rgb = C_WHITE

# Column 2: The Solution
b2 = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.8), Inches(5.5), Inches(4.7))
b2.fill.solid()
b2.fill.fore_color.rgb = RGBColor(12, 30, 24)
b2.line.color.rgb = C_GREEN
b2.line.width = Pt(1.5)
tf2 = b2.text_frame
tf2.word_wrap = True
p = tf2.paragraphs[0]
p.text = "✔ The RAIS Contextual Engine"
p.font.size = Pt(20)
p.font.bold = True
p.font.color.rgb = C_GREEN

items_good = [
    "Contextual Emotion: Monsoon rain, midnight craving, cricket match, kids after school, party rush.",
    "Appetite Pairing: Sizzling hot momos & fries served with mint mayo, peri-peri & sweet chilli dip.",
    "18.0-Second Exact Pacing: Hyper-calibrated duration boosts algorithmic completion rates by +68%.",
    "Clean Local Branding: Zero competitor hashtags. Direct WhatsApp (9347453135) + Web Catalogue."
]
for item in items_good:
    p2 = tf2.add_paragraph()
    p2.text = f"• {item}"
    p2.font.size = Pt(13)
    p2.font.color.rgb = C_WHITE

# ==========================================================
# SLIDE 4: VIDEO PRODUCTION & CGI ENGINE
# ==========================================================
slide4 = prs.slides.add_slide(blank_layout)
add_slide_background(slide4, prs)
add_header(slide4, "Video Production Pipeline: Character Lock & Audio Sync")

steps4 = [
    ("1. 3D Character Identity Lock", 
     "Custom 3D Pixar-stylized character 'Ayesha' created with modest pastel embroidered hijab, golden skin tone, and warm South Indian facial expressions across all 15 scenarios."),
    ("2. Neural Bilingual Voice Dubbing", 
     "High-fidelity neural TTS engines synthesizing conversational Telugu and Hindi speech. Exact sentence timing normalized so Telugu and Hindi audio end at exactly 14.5 seconds."),
    ("3. Dynamic Bilingual Subtitles", 
     "Rendered using headless Playwright canvas with custom gold drop-shadows and brand typography, ensuring 100% video comprehension even when viewers browse with sound muted."),
    ("4. Luxury Diamond End Card", 
     "Final 3.5 seconds feature the official animated gold emblem, @raisfrozenfoods handle, WhatsApp 9347453135, and digital catalogue URL with persistent audio continuity.")
]

for idx, (title, desc) in enumerate(steps4):
    y = Inches(1.8 + idx * 1.2)
    box = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.9), y, Inches(11.4), Inches(1.05))
    box.fill.solid()
    box.fill.fore_color.rgb = C_NAVY
    box.line.color.rgb = C_GOLD
    box.line.width = Pt(1)
    
    tf = box.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = title
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = C_GOLD_LIGHT
    
    p2 = tf.add_paragraph()
    p2.text = desc
    p2.font.size = Pt(12)
    p2.font.color.rgb = C_WHITE

# ==========================================================
# SLIDE 5: META GRAPH API CLOUD ARCHITECTURE
# ==========================================================
slide5 = prs.slides.add_slide(blank_layout)
add_slide_background(slide5, prs)
add_header(slide5, "Meta Graph API Cloud Publishing Architecture")

stages5 = [
    ("Stage 1: CDN Hosting", "Video MP4 uploaded to high-speed public CDN (uguu.se / catbox) to produce a direct streamable HTTPS URL."),
    ("Stage 2: Container Creation", "POST request to Meta Graph API (/media) initializing Reel container with clean native captions and video URL."),
    ("Stage 3: Transcode Polling", "Automated polling loop checks Meta servers every 4s until status_code transitions from IN_PROGRESS to FINISHED."),
    ("Stage 4: Media Publish", "Meta API endpoint (/media_publish) called with creation_id, instantly publishing the Reel live on @raisfrozenfoods."),
    ("Stage 5: Pinned Top Comment", "System automatically posts verified top comment with direct clickable WhatsApp links (wa.me/919347453135) and catalogue URL.")
]

for idx, (title, desc) in enumerate(stages5):
    x = Inches(0.9 + idx * 2.3)
    box = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(2.0), Inches(2.15), Inches(4.5))
    box.fill.solid()
    box.fill.fore_color.rgb = C_NAVY
    box.line.color.rgb = C_GOLD
    box.line.width = Pt(1.5)
    
    tf = box.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = f"STEP {idx+1}\n\n{title}"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = C_GOLD_LIGHT
    p.alignment = PP_ALIGN.CENTER
    
    p2 = tf.add_paragraph()
    p2.text = f"\n{desc}"
    p2.font.size = Pt(12)
    p2.font.color.rgb = C_WHITE
    p2.alignment = PP_ALIGN.LEFT

# ==========================================================
# SLIDE 6: 2-PER-DAY ALGORITHMIC SCHEDULER
# ==========================================================
slide6 = prs.slides.add_slide(blank_layout)
add_slide_background(slide6, prs)
add_header(slide6, "The 2-Per-Day Algorithmic Schedule Blueprint")

box6_1 = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.9), Inches(1.8), Inches(5.5), Inches(4.7))
box6_1.fill.solid()
box6_1.fill.fore_color.rgb = C_NAVY
box6_1.line.color.rgb = C_GOLD
box6_1.line.width = Pt(1.5)

tf6_1 = box6_1.text_frame
tf6_1.word_wrap = True
p = tf6_1.paragraphs[0]
p.text = "☀️ SLOT 1: 12:30 PM IST (Lunch Peak)"
p.font.size = Pt(20)
p.font.bold = True
p.font.color.rgb = C_GOLD_LIGHT

points_slot1 = [
    "Language: TELUGU Version",
    "Audience Focus: Local Rayachoty cafe operators, tiffin centers, cloud kitchens, families & foodies browsing on lunch break.",
    "Content Angle: Consumer cravings, quick prep, evening snacks, family platters.",
    "Algorithm Benefit: Video gains traction and watch time throughout the afternoon."
]
for pt in points_slot1:
    p2 = tf6_1.add_paragraph()
    p2.text = f"✔ {pt}"
    p2.font.size = Pt(13)
    p2.font.color.rgb = C_WHITE

box6_2 = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.8), Inches(5.5), Inches(4.7))
box6_2.fill.solid()
box6_2.fill.fore_color.rgb = C_NAVY
box6_2.line.color.rgb = C_GOLD
box6_2.line.width = Pt(1.5)

tf6_2 = box6_2.text_frame
tf6_2.word_wrap = True
p = tf6_2.paragraphs[0]
p.text = "🌙 SLOT 2: 07:30 PM IST (Dinner Peak)"
p.font.size = Pt(20)
p.font.bold = True
p.font.color.rgb = C_GOLD_LIGHT

points_slot2 = [
    "Language: HINDI Version",
    "Audience Focus: Regional restaurant chefs, QSR operators, catering businesses, and wholesale food procurement managers.",
    "Content Angle: High profit margins, fast 3-minute turnaround, kraft packaging bulk supplies, wholesale depot stock.",
    "Algorithm Benefit: 7-hour breathing window prevents internal cannibalization."
]
for pt in points_slot2:
    p2 = tf6_2.add_paragraph()
    p2.text = f"✔ {pt}"
    p2.font.size = Pt(13)
    p2.font.color.rgb = C_WHITE

# ==========================================================
# SLIDE 7: CONVERSION & LEAD FUNNEL
# ==========================================================
slide7 = prs.slides.add_slide(blank_layout)
add_slide_background(slide7, prs)
add_header(slide7, "The Conversion Funnel: Turning Views Into Orders")

funnel_steps = [
    ("1. Reel View & Retention", "User watches 18s high-energy video on Instagram Reels feed. Mouthwatering culinary visual creates immediate buying desire."),
    ("2. Clear Call-To-Action", "End card prompts user to order via WhatsApp: 9347453135, or view catalogue on dataengineer-irfan.github.io/RAIS-AGENCIES/."),
    ("3. Frictionless Link Tap", "User taps direct link in verified Pinned Comment or Instagram Bio (dataengineer-irfan.github.io/RAIS-AGENCIES/catalogue.html)."),
    ("4. Digital Catalogue Exploration", "User explores 66 commercial SKUs with real-time live search, filters categories, and checks product specifications."),
    ("5. Instant WhatsApp Order", "User taps 'Order via WhatsApp' button. Pre-filled product message arrives at +91 93474 53135 -> Direct sale closed!")
]

for idx, (title, desc) in enumerate(funnel_steps):
    y = Inches(1.8 + idx * 0.98)
    box = slide7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.9), y, Inches(11.4), Inches(0.85))
    box.fill.solid()
    box.fill.fore_color.rgb = C_NAVY
    box.line.color.rgb = C_GOLD
    box.line.width = Pt(1)
    
    tf = box.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = f"{title}: {desc}"
    p.font.size = Pt(13)
    p.font.color.rgb = C_WHITE

# ==========================================================
# SLIDE 8: OPERATIONS & DELIVERABLES SUMMARY
# ==========================================================
slide8 = prs.slides.add_slide(blank_layout)
add_slide_background(slide8, prs)
add_header(slide8, "Operational Control & Asset Inventory")

b8_1 = slide8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.9), Inches(1.8), Inches(5.5), Inches(4.7))
b8_1.fill.solid()
b8_1.fill.fore_color.rgb = C_NAVY
b8_1.line.color.rgb = C_GOLD
b8_1.line.width = Pt(1.5)

tf8_1 = b8_1.text_frame
tf8_1.word_wrap = True
p = tf8_1.paragraphs[0]
p.text = "📁 Deliverables Inventory"
p.font.size = Pt(20)
p.font.bold = True
p.font.color.rgb = C_GOLD_LIGHT

inv = [
    "30 Master Reels (18.0s MP4): public/videos/final_30_reels/",
    "30-Reel ZIP Archive: render_work_backup/RAIS_Agencies_Catalogue_Accurate_18s_30_Reels.zip",
    "Social Branding Suite: Facebook cover, WhatsApp cover, Profile avatar, 6 Story Highlight covers",
    "Live 66-SKU Catalogue: dataengineer-irfan.github.io/RAIS-AGENCIES/catalogue.html",
    "15-Day Master Captions Plan: rais_2_per_day_15_day_instagram_master_plan.md"
]
for i in inv:
    p2 = tf8_1.add_paragraph()
    p2.text = f"• {i}"
    p2.font.size = Pt(12)
    p2.font.color.rgb = C_WHITE

b8_2 = slide8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.8), Inches(5.5), Inches(4.7))
b8_2.fill.solid()
b8_2.fill.fore_color.rgb = C_NAVY
b8_2.line.color.rgb = C_GOLD
b8_2.line.width = Pt(1.5)

tf8_2 = b8_2.text_frame
tf8_2.word_wrap = True
p = tf8_2.paragraphs[0]
p.text = "⚙ Operating Modes Available"
p.font.size = Pt(20)
p.font.bold = True
p.font.color.rgb = C_GOLD_LIGHT

modes = [
    "Mode A: 100% Manual (ACTIVE NOW): Post from phone gallery using copy-paste captions in Master Plan.",
    "Mode B: 1-Click CLI Automation: Run 'python scripts/publish_single_reel.py <id> <lang>' to post any specific reel via API without typing.",
    "Mode C: 2-Per-Day Daemon: Run 'python scripts/instagram_daily_scheduler.py --daemon' to auto-post 2 reels/day at 12:30 PM & 07:30 PM IST."
]
for m in modes:
    p2 = tf8_2.add_paragraph()
    p2.text = f"✔ {m}"
    p2.font.size = Pt(12)
    p2.font.color.rgb = C_WHITE

prs.save(OUT_PPTX)
print(f"PowerPoint Presentation generated successfully at: {OUT_PPTX}")
