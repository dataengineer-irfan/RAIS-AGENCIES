import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

sys.stdout.reconfigure(encoding='utf-8')

OUT_PPTX = "public/RAIS_Instagram_Automation_Setup_Journey_BabySteps.pptx"
os.makedirs("public", exist_ok=True)

prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)
blank_layout = prs.slide_layouts[6]

# Brand Colors
C_DARK = RGBColor(8, 12, 22)           # #080C16
C_NAVY = RGBColor(16, 26, 48)          # #101A30
C_GOLD = RGBColor(212, 175, 55)        # #D4AF37
C_GOLD_LIGHT = RGBColor(245, 218, 122) # #F5DA7A
C_WHITE = RGBColor(248, 250, 252)      # #F8FAFC
C_MUTED = RGBColor(148, 163, 184)      # #94A3B8
C_GREEN = RGBColor(37, 211, 102)       # WhatsApp Green
C_BLUE = RGBColor(59, 130, 246)        # Meta Blue

def add_slide_background(slide, prs):
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
    bg.fill.solid()
    bg.fill.fore_color.rgb = C_DARK
    bg.line.fill.background()
    
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
    
    line = slide.shapes.add_shape(
        MSO_SHAPE.RECTANGLE,
        Inches(0.8), Inches(1.5),
        prs.slide_width - Inches(1.6), Pt(2)
    )
    line.fill.solid()
    line.fill.fore_color.rgb = C_GOLD
    line.line.fill.background()
    
    txBox = slide.shapes.add_textbox(Inches(0.8), Inches(6.9), prs.slide_width - Inches(1.6), Inches(0.4))
    tf = txBox.text_frame
    p = tf.paragraphs[0]
    p.text = "RAIS Agencies — Step-by-Step Meta Automation Blueprint  |  WhatsApp: 9347453135  |  @raisfrozenfoods"
    p.font.size = Pt(11)
    p.font.color.rgb = C_GOLD
    p.alignment = PP_ALIGN.CENTER

def add_header(slide, title_text, step_text="STEP-BY-STEP SETUP JOURNEY"):
    tb = slide.shapes.add_textbox(Inches(0.8), Inches(0.55), prs.slide_width - Inches(1.6), Inches(0.9))
    tf = tb.text_frame
    tf.word_wrap = True
    
    p0 = tf.paragraphs[0]
    p0.text = step_text.upper()
    p0.font.size = Pt(11)
    p0.font.bold = True
    p0.font.color.rgb = C_GOLD
    
    p1 = tf.add_paragraph()
    p1.text = title_text
    p1.font.size = Pt(25)
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

r_box = slide1.shapes.add_textbox((prs.slide_width - d_size) / 2, Inches(1.2), d_size, d_size)
rtf = r_box.text_frame
rp = rtf.paragraphs[0]
rp.text = "R"
rp.font.size = Pt(88)
rp.font.bold = True
rp.font.color.rgb = C_GOLD_LIGHT
rp.alignment = PP_ALIGN.CENTER

tb1 = slide1.shapes.add_textbox(Inches(1.0), Inches(3.6), prs.slide_width - Inches(2.0), Inches(2.5))
tf1 = tb1.text_frame
tf1.word_wrap = True

p = tf1.paragraphs[0]
p.text = "HOW WE BUILT THE RAIS INSTAGRAM AUTOMATION"
p.font.size = Pt(40)
p.font.bold = True
p.font.color.rgb = C_GOLD_LIGHT
p.alignment = PP_ALIGN.CENTER

p2 = tf1.add_paragraph()
p2.text = "The Complete End-to-End Setup Process Explained in Baby Steps"
p2.font.size = Pt(20)
p2.font.bold = True
p2.font.color.rgb = C_WHITE
p2.alignment = PP_ALIGN.CENTER

p3 = tf1.add_paragraph()
p3.text = "Instagram Business  ➔  Facebook Page  ➔  Meta Developers App  ➔  Website Dashboard  ➔  Automated API"
p3.font.size = Pt(14)
p3.font.color.rgb = C_GOLD
p3.alignment = PP_ALIGN.CENTER

p4 = tf1.add_paragraph()
p4.text = "\n📍 RAIS Agencies, Rayachoty   |   Account: @raisfrozenfoods   |   WhatsApp: 9347453135"
p4.font.size = Pt(12)
p4.font.color.rgb = C_MUTED
p4.alignment = PP_ALIGN.CENTER

# ==========================================================
# SLIDE 2: STEP 1 - INSTAGRAM PROFESSIONAL ACCOUNT
# ==========================================================
slide2 = prs.slides.add_slide(blank_layout)
add_slide_background(slide2, prs)
add_header(slide2, "Step 1: Setting Up the Instagram Business Account", "STEP 1 OF 7")

b2_1 = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.9), Inches(1.8), Inches(5.5), Inches(4.7))
b2_1.fill.solid()
b2_1.fill.fore_color.rgb = C_NAVY
b2_1.line.color.rgb = C_GOLD
b2_1.line.width = Pt(1.5)

tf2_1 = b2_1.text_frame
tf2_1.word_wrap = True
p = tf2_1.paragraphs[0]
p.text = "📱 Why We Created a Business Profile"
p.font.size = Pt(20)
p.font.bold = True
p.font.color.rgb = C_GOLD_LIGHT

points1 = [
    "Personal Profiles Can't Be Automated: Meta's security strictly blocks third-party code from posting on personal Instagram accounts.",
    "Switching to Professional: You went to Settings > Account Type > Switch to Professional / Business Account.",
    "Username Selected: @raisfrozenfoods (clean, professional, and directly matches Rayachoty wholesale products).",
    "Why Pronouns Were Left Blank: Instagram's pronoun field is strictly for individual personal profiles; business brand profiles leave it empty."
]
for pt in points1:
    p2 = tf2_1.add_paragraph()
    p2.text = f"• {pt}"
    p2.font.size = Pt(13)
    p2.font.color.rgb = C_WHITE

b2_2 = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.8), Inches(5.5), Inches(4.7))
b2_2.fill.solid()
b2_2.fill.fore_color.rgb = C_NAVY
b2_2.line.color.rgb = C_GOLD
b2_2.line.width = Pt(1.5)

tf2_2 = b2_2.text_frame
tf2_2.word_wrap = True
p = tf2_2.paragraphs[0]
p.text = "🔑 What This Unlocked"
p.font.size = Pt(20)
p.font.bold = True
p.font.color.rgb = C_GREEN

unlocks1 = [
    "Unlocked Instagram Graph API access.",
    "Allowed adding external clickable links in bio (our 66-SKU HTML catalogue).",
    "Enabled business contact buttons (WhatsApp & Email).",
    "Prepared the account to be connected to Facebook Page in Step 2."
]
for u in unlocks1:
    p2 = tf2_2.add_paragraph()
    p2.text = f"✔ {u}"
    p2.font.size = Pt(13)
    p2.font.color.rgb = C_WHITE

# ==========================================================
# SLIDE 3: STEP 2 - FACEBOOK PAGE LINKING
# ==========================================================
slide3 = prs.slides.add_slide(blank_layout)
add_slide_background(slide3, prs)
add_header(slide3, "Step 2: Creating & Linking the Facebook Business Page", "STEP 2 OF 7")

b3_1 = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.9), Inches(1.8), Inches(11.4), Inches(4.7))
b3_1.fill.solid()
b3_1.fill.fore_color.rgb = C_NAVY
b3_1.line.color.rgb = C_GOLD
b3_1.line.width = Pt(1.5)

tf3 = b3_1.text_frame
tf3.word_wrap = True
p = tf3.paragraphs[0]
p.text = "🔗 The Meta Requirement: Why Facebook is Mandatory"
p.font.size = Pt(20)
p.font.bold = True
p.font.color.rgb = C_GOLD_LIGHT

fb_steps = [
    "1. Meta Owns Both Platforms: Meta manages Instagram APIs entirely through the Facebook Business Graph infrastructure.",
    "2. The Missing Bridge: An Instagram account cannot exist in the developer API by itself. It MUST be linked to a parent Facebook Business Page.",
    "3. What We Did: We created the 'RAIS Agencies' Facebook Page.",
    "4. The Handshake: In Instagram app (Edit Profile > Page > Connect Facebook Page) and Facebook Page settings (Linked Accounts > Instagram), we connected @raisfrozenfoods to the RAIS Agencies Facebook page.",
    "5. Result: Now, any API call made to the Facebook Page can automatically control and publish Reels to @raisfrozenfoods!"
]
for s in fb_steps:
    p2 = tf3.add_paragraph()
    p2.text = f"• {s}"
    p2.font.size = Pt(13.5)
    p2.font.color.rgb = C_WHITE

# ==========================================================
# SLIDE 4: STEP 3 & 4 - META FOR DEVELOPERS APP
# ==========================================================
slide4 = prs.slides.add_slide(blank_layout)
add_slide_background(slide4, prs)
add_header(slide4, "Step 3 & 4: Meta for Developers App & Use Cases", "STEPS 3 & 4 OF 7")

b4_1 = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.9), Inches(1.8), Inches(5.5), Inches(4.7))
b4_1.fill.solid()
b4_1.fill.fore_color.rgb = C_NAVY
b4_1.line.color.rgb = C_GOLD
b4_1.line.width = Pt(1.5)

tf4_1 = b4_1.text_frame
tf4_1.word_wrap = True
p = tf4_1.paragraphs[0]
p.text = "🛠 Meta Developer Portal"
p.font.size = Pt(20)
p.font.bold = True
p.font.color.rgb = C_GOLD_LIGHT

portal_steps = [
    "developers.facebook.com: We navigated to Meta's official developer console.",
    "App Creation: Selected 'Create App' > App Type: 'Business' (named 'RAIS Automation Hub').",
    "App Dashboard: This gave us our official Meta App ID and allowed adding API products.",
    "Business Asset Group: Connected your business assets (Facebook Page + Instagram Account) under this new developer app."
]
for s in portal_steps:
    p2 = tf4_1.add_paragraph()
    p2.text = f"• {s}"
    p2.font.size = Pt(13)
    p2.font.color.rgb = C_WHITE

b4_2 = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.8), Inches(5.5), Inches(4.7))
b4_2.fill.solid()
b4_2.fill.fore_color.rgb = C_NAVY
b4_2.line.color.rgb = C_GOLD
b4_2.line.width = Pt(1.5)

tf4_2 = b4_2.text_frame
tf4_2.word_wrap = True
p = tf4_2.paragraphs[0]
p.text = "🔒 Unlocking The Use Cases"
p.font.size = Pt(20)
p.font.bold = True
p.font.color.rgb = C_GREEN

perms = [
    "Use Case: 'Instagram Content Publishing' was enabled in the app dashboard.",
    "instagram_content_publish: Permission to upload MP4 videos and publish Reels.",
    "instagram_basic: Permission to read Instagram account info and post status.",
    "pages_show_list: Permission for the code to see your connected Facebook Page.",
    "pages_read_engagement: Permission to fetch comments and read view metrics."
]
for p_item in perms:
    p2 = tf4_2.add_paragraph()
    p2.text = f"✔ {p_item}"
    p2.font.size = Pt(13)
    p2.font.color.rgb = C_WHITE

# ==========================================================
# SLIDE 5: STEP 5 - TOKENS & INSTAGRAM ACCOUNT ID
# ==========================================================
slide5 = prs.slides.add_slide(blank_layout)
add_slide_background(slide5, prs)
add_header(slide5, "Step 5: Generating Access Tokens & Finding Account ID", "STEP 5 OF 7")

b5 = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.9), Inches(1.8), Inches(11.4), Inches(4.7))
b5.fill.solid()
b5.fill.fore_color.rgb = C_NAVY
b5.line.color.rgb = C_GOLD
b5.line.width = Pt(1.5)

tf5 = b5.text_frame
tf5.word_wrap = True
p = tf5.paragraphs[0]
p.text = "🔑 The Secret Keys to Automating Instagram"
p.font.size = Pt(20)
p.font.bold = True
p.font.color.rgb = C_GOLD_LIGHT

token_steps = [
    "1. Meta Graph API Explorer: We opened Meta's testing console (developers.facebook.com/tools/explorer).",
    "2. Generating the User Token: We requested an access token with the required permissions and authorized your Facebook account.",
    "3. Exchanging for Long-Lived Token: Short-lived tokens expire in 1 hour. We exchanged it for a 60-day / permanent Long-Lived Access Token so our automated Python scripts can run uninterrupted.",
    "4. Querying the Connected Instagram Account: We ran the Graph API query: GET /me/accounts?fields=instagram_business_account",
    "5. The Result: Meta responded with your permanent Instagram Business Account ID: 29157923917158606.",
    "Now our code had both the Access Key (Token) and the Destination Address (Account ID)!"
]
for s in token_steps:
    p2 = tf5.add_paragraph()
    p2.text = f"• {s}"
    p2.font.size = Pt(13)
    p2.font.color.rgb = C_WHITE

# ==========================================================
# SLIDE 6: STEP 6 - INTEGRATION IN WEBSITE (.ENV & TABS)
# ==========================================================
slide6 = prs.slides.add_slide(blank_layout)
add_slide_background(slide6, prs)
add_header(slide6, "Step 6: Integrating with Our Website & .env Secrets", "STEP 6 OF 7")

b6_1 = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.9), Inches(1.8), Inches(5.5), Inches(4.7))
b6_1.fill.solid()
b6_1.fill.fore_color.rgb = C_NAVY
b6_1.line.color.rgb = C_GOLD
b6_1.line.width = Pt(1.5)

tf6_1 = b6_1.text_frame
tf6_1.word_wrap = True
p = tf6_1.paragraphs[0]
p.text = "🔐 Safe Secret Storage (.env)"
p.font.size = Pt(20)
p.font.bold = True
p.font.color.rgb = C_GOLD_LIGHT

env_items = [
    "We created the protected '.env' file in rais-website:",
    "• VITE_INSTAGRAM_ACCESS_TOKEN: Your secure Meta authentication token.",
    "• VITE_INSTAGRAM_ACCOUNT_ID: 29157923917158606.",
    "• VITE_INSTAGRAM_USERNAME: raisfrozenfoods.",
    "Protection: .env is automatically ignored by Git so your tokens are NEVER exposed on public GitHub repositories!"
]
for e in env_items:
    p2 = tf6_1.add_paragraph()
    p2.text = f"{e}"
    p2.font.size = Pt(13)
    p2.font.color.rgb = C_WHITE

b6_2 = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.8), Inches(5.5), Inches(4.7))
b6_2.fill.solid()
b6_2.fill.fore_color.rgb = C_NAVY
b6_2.line.color.rgb = C_GOLD
b6_2.line.width = Pt(1.5)

tf6_2 = b6_2.text_frame
tf6_2.word_wrap = True
p = tf6_2.paragraphs[0]
p.text = "💻 The New Website Tabs & Features"
p.font.size = Pt(20)
p.font.bold = True
p.font.color.rgb = C_GREEN

web_items = [
    "1. Reels Calendar Tab (src/data/reelsCalendar.ts): Created an interactive dashboard tab in the website displaying all 30 reels with live video previews.",
    "2. Live Digital Catalogue (catalogue.html): Added the 66-SKU HTML catalogue directly into the public website with live search & filters.",
    "3. Direct Links in Navigation & Footer: Added direct buttons in Navbar, Footer, and Contact page pointing to Instagram DM and WhatsApp 9347453135."
]
for w in web_items:
    p2 = tf6_2.add_paragraph()
    p2.text = f"✔ {w}"
    p2.font.size = Pt(13)
    p2.font.color.rgb = C_WHITE

# ==========================================================
# SLIDE 7: STEP 7 - HOW THE PYTHON BACKEND PUBLISHES
# ==========================================================
slide7 = prs.slides.add_slide(blank_layout)
add_slide_background(slide7, prs)
add_header(slide7, "Step 7: How Our Python Code Actually Publishes to Instagram", "STEP 7 OF 7")

b7 = slide7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.9), Inches(1.8), Inches(11.4), Inches(4.7))
b7.fill.solid()
b7.fill.fore_color.rgb = C_NAVY
b7.line.color.rgb = C_GOLD
b7.line.width = Pt(1.5)

tf7 = b7.text_frame
tf7.word_wrap = True
p = tf7.paragraphs[0]
p.text = "⚡ The Exact 4-Step Publishing Workflow (publish_single_reel.py)"
p.font.size = Pt(20)
p.font.bold = True
p.font.color.rgb = C_GOLD_LIGHT

py_steps = [
    "1. Video Hosting: Meta API cannot read files from a local Windows C: drive. The script uploads the 7.6MB MP4 to a public CDN (uguu.se / catbox) to get a direct HTTPS stream URL.",
    "2. Reel Container Creation: Python makes a POST request to https://graph.instagram.com/29157923917158606/media with media_type='REELS', the video URL, and our clean Telugu/Hindi caption.",
    "3. Server Transcoding Polling: Meta servers download the video and convert it to Instagram's mobile codecs. Our script polls Meta every 4 seconds until status reaches FINISHED.",
    "4. Final Publish & Pinned Comment: Python calls https://graph.instagram.com/29157923917158606/media_publish. The video instantly goes LIVE! Then Python immediately posts an official top comment with clickable WhatsApp & catalogue links."
]
for s in py_steps:
    p2 = tf7.add_paragraph()
    p2.text = f"{s}\n"
    p2.font.size = Pt(12.5)
    p2.font.color.rgb = C_WHITE

# ==========================================================
# SLIDE 8: SUMMARY FLOWCHART
# ==========================================================
slide8 = prs.slides.add_slide(blank_layout)
add_slide_background(slide8, prs)
add_header(slide8, "Summary: The Complete Architecture at a Glance", "COMPLETE BLUEPRINT")

flow_boxes = [
    ("1. Phone Setup", "Instagram Business Account (@raisfrozenfoods)\nLinked to Facebook Page (RAIS Agencies)"),
    ("2. Meta Cloud", "Meta Developer App (RAIS Automation Hub)\nUse Case: Instagram Content Publishing"),
    ("3. Keys & Token", "Long-Lived Access Token\nAccount ID: 29157923917158606"),
    ("4. Code Integration", ".env safe storage\nReels Dashboard in Website\n66-SKU HTML Catalogue live on GitHub"),
    ("5. Live Result", "Single Command Publish\nReel Live on Instagram\nVerified Top Comment with wa.me link")
]

for idx, (title, desc) in enumerate(flow_boxes):
    x = Inches(0.9 + idx * 2.3)
    box = slide8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(2.0), Inches(2.15), Inches(4.5))
    box.fill.solid()
    box.fill.fore_color.rgb = C_NAVY
    box.line.color.rgb = C_GOLD
    box.line.width = Pt(1.5)
    
    tf = box.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = f"STAGE {idx+1}\n\n{title}"
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
# SLIDE 9: ADMIN PORTAL VERIFICATION & MANAGEMENT
# ==========================================================
slide9 = prs.slides.add_slide(blank_layout)
add_slide_background(slide9, prs)
add_header(slide9, "Wholesale Admin Portal Access & Management (#admin)", "ADMIN VERIFICATION")

b9_1 = slide9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.9), Inches(1.8), Inches(5.5), Inches(4.7))
b9_1.fill.solid()
b9_1.fill.fore_color.rgb = C_NAVY
b9_1.line.color.rgb = C_GOLD
b9_1.line.width = Pt(1.5)

tf9_1 = b9_1.text_frame
tf9_1.word_wrap = True
p = tf9_1.paragraphs[0]
p.text = "🔑 Portal Access & Credentials"
p.font.size = Pt(20)
p.font.bold = True
p.font.color.rgb = C_GOLD_LIGHT

admin_creds = [
    "Live Admin URL: https://dataengineer-irfan.github.io/RAIS-AGENCIES/#admin",
    "Alternative Hash Routes: #reels, #automation, #dashboard",
    "Admin Username: admin  (or rais / rais.frozenfoods@gmail.com)",
    "Initial Default Passkey PIN: RAIS@516269",
    "Brute-Force Protected: 5 failed login attempts lock portal for 60 seconds."
]
for c in admin_creds:
    p2 = tf9_1.add_paragraph()
    p2.text = f"✔ {c}"
    p2.font.size = Pt(13)
    p2.font.color.rgb = C_WHITE

b9_2 = slide9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.8), Inches(5.5), Inches(4.7))
b9_2.fill.solid()
b9_2.fill.fore_color.rgb = C_NAVY
b9_2.line.color.rgb = C_GOLD
b9_2.line.width = Pt(1.5)

tf9_2 = b9_2.text_frame
tf9_2.word_wrap = True
p = tf9_2.paragraphs[0]
p.text = "📊 Admin Dashboard Capabilities"
p.font.size = Pt(20)
p.font.bold = True
p.font.color.rgb = C_GREEN

admin_features = [
    "1. Reels Calendar Dashboard: Preview all 30 master reels with live HTML5 video players, audio scripts & scheduling slots.",
    "2. Wholesale Inquiries: Review and export incoming commercial quote requests from Rayachoty restaurants.",
    "3. Security Settings: Change the master admin passkey PIN anytime.",
    "4. State Management: Export or reset local publishing data with 1-click."
]
for f in admin_features:
    p2 = tf9_2.add_paragraph()
    p2.text = f"✔ {f}"
    p2.font.size = Pt(13)
    p2.font.color.rgb = C_WHITE

prs.save(OUT_PPTX)
print(f"Baby Steps Setup PPTX generated successfully at: {OUT_PPTX}")
