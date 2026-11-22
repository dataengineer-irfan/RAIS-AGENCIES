// Google Business Profile & Local Growth Data for RAIS Agencies (Rayachoty)

export interface GBPPostItem {
  id: number;
  dayNumber: number;
  headline: string;
  contentEnglish: string;
  contentTelugu: string;
  callToAction: string;
  targetSku?: string;
  status: 'DRAFT' | 'APPROVED' | 'SCHEDULED' | 'PUBLISHED';
  scheduledDate?: string;
}

export interface GBPReviewItem {
  id: number;
  reviewerName: string;
  rating: number;
  date: string;
  comment: string;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  hasReplied: boolean;
  replyEnglish: string;
  replyTelugu: string;
  isApproved: boolean;
  approvedBy?: string;
}

export interface LocalSEOKeyword {
  id: number;
  keyword: string;
  intent: string;
  relevanceScore: number;
  language: string;
}

export interface GBPSkuItem {
  sku: string;
  name: string;
  brand: string;
  category: string;
  packSize: string;
  inStock: boolean;
}

export const VERIFIED_BUSINESS_FACTS = {
  businessName: 'RAIS Agencies',
  tagline: 'Wholesale Frozen Food Products & Packaging Solutions',
  address: 'Dor no 63/1, Sundupalli Road, main road, opposite Reddies Colony, Rayachoty – 516269',
  hubLandmark: 'Beside Indel Money Bank, Sundupalli Road Hub',
  locality: 'Rayachoty, Annamayya District, Andhra Pradesh',
  phone: '9347453135',
  websiteUrl: 'https://dataengineer-irfan.github.io/RAIS-AGENCIES/',
  catalogueUrl: 'https://dataengineer-irfan.github.io/RAIS-AGENCIES/catalogue.html',
  instagram: '@raisfrozenfoods',
  primaryCategory: 'Frozen food store',
  rating: 5.0,
  operatingHours: 'Open 24 hours',
  gmbUrl: 'https://www.google.com/maps/place/RAIS+Agencies/@14.059359,78.759402,17z/data=!3m1!4b1!4m6!3m5!1s0x3bb30318ccf76259:0x47c3e259f30654fa!8m2!3d14.059359!4d78.759402!16s%2Fg%2F11npc8m4rr',
  secondaryCategories: [
    'Wholesale food store',
    'Restaurant supply store',
    'Packaging supply store',
    'Food products supplier'
  ]
};

export const INITIAL_GBP_SKUS: GBPSkuItem[] = [
  { sku: 'RAIS-MM-MOZZ', name: 'Diced Mozzarella Cheese', brand: 'Milky Mist', category: 'Cheese & Dairy', packSize: '1 KG & 2 KG PACK', inStock: true },
  { sku: 'RAIS-AMUL-FF6', name: 'French Fries (6mm Shoestring)', brand: 'Amul', category: 'Frozen Snacks', packSize: '2.5 KG PACKET', inStock: true },
  { sku: 'RAIS-HUP-FF9', name: 'French Fries (9mm Regular)', brand: 'Hup Hup', category: 'Frozen Snacks', packSize: '2.5 KG PACKET', inStock: true },
  { sku: 'RAIS-TRI-NUG', name: 'Crispy Chicken Nuggets', brand: 'Triken', category: 'Frozen Chicken', packSize: '1 KG PACKET', inStock: true },
  { sku: 'RAIS-TRI-MOM', name: 'Steamed & Fried Chicken Momos', brand: 'Triken', category: 'Frozen Chicken', packSize: '50 PCS PACKET', inStock: true },
  { sku: 'RAIS-PB-85', name: 'Commercial Pizza Base 8.5 Inch', brand: 'RAIS Bakery', category: 'Bakery & Bases', packSize: '5 PCS PACKET', inStock: true },
  { sku: 'RAIS-PB-10', name: 'Commercial Pizza Base 10 Inch', brand: 'RAIS Bakery', category: 'Bakery & Bases', packSize: '5 PCS PACKET', inStock: true },
  { sku: 'RAIS-PKG-BP40', name: 'Food-Grade OGR Butter Paper 40 GSM', brand: 'Packaging Solutions', category: 'Packaging', packSize: '10x10 & 12x12 Cut Sheets', inStock: true },
  { sku: 'RAIS-PKG-PB10', name: 'Corrugated Thermal Pizza Box 10 Inch', brand: 'Packaging Solutions', category: 'Packaging', packSize: '50 PCS BUNDLE', inStock: true },
  { sku: 'RAIS-DM-MAYO', name: 'Eggless Burger Mayonnaise', brand: 'Del Monte', category: 'Sauces', packSize: '1 KG POUCH', inStock: true }
];

// Authentic Google Maps customer reviews for RAIS Agencies
export const INITIAL_GBP_REVIEWS: GBPReviewItem[] = [
  {
    id: 1,
    reviewerName: "Hidayathullah H",
    rating: 5,
    date: "20 hours ago (New)",
    comment: "RAIS Agencies is a great place in Rayachoty for frozen food products and food packaging materials. They offer a good range of products including Milky Mist mozzarella cheese, pizza bases, burger buns, French fries, chicken nuggets, sauces and other restaurant supplies. Good product quality, competitive prices and responsive service. A useful supplier for cafes, restaurants, bakeries and QSR businesses. They also provide delivery to nearby areas. Highly recommended for frozen food and packaging requirements!",
    sentiment: "POSITIVE",
    hasReplied: true,
    replyEnglish: "Thank you so much Hidayathullah garu for your fantastic review and for sharing product photos! 🙏 We are proud to support local cafes, restaurants, bakeries, and QSRs across Rayachoty and our nearby delivery corridors with certified cold-chain frozen foods and high-quality printed packaging materials (pizza boxes, burger clamshells, and fried chicken buckets). We look forward to fulfilling your next kitchen order!",
    replyTelugu: "హిదాయతుల్లా గారు, మీ అద్భుతమైన రివ్యూ మరియు ఫోటోలు పంచుకున్నందుకు చాలా ధన్యవాదాలు! రాయచోటి మరియు పరిసర ప్రాంతాల్లోని హోటళ్లు, కేఫ్‌లకు నాణ్యమైన ఫ్రోజెన్ ఫుడ్స్ మరియు ప్యాకేజింగ్ మెటీరియల్స్ సరఫరా చేయడంలో మేము ఎల్లప్పుడూ ముందుంటాము.",
    isApproved: true,
    approvedBy: "RAIS Admin"
  },
  {
    id: 2,
    reviewerName: "MOHAMMED ATHIQ UR RAHMAN SHAIK",
    rating: 5,
    date: "Recent",
    comment: "Had a really good experience with RAIS Agencies. The frozen food quality is really good, fresh, and available at very reasonable prices compared to other places. Good quality products at budget-friendly prices. Overall, very happy with the experience and would definitely recommend this place!",
    sentiment: "POSITIVE",
    hasReplied: true,
    replyEnglish: "Thank you Mohammed Athiq Ur Rahman Shaik for your wonderful feedback! At RAIS Agencies, maintaining top frozen food quality at budget-friendly wholesale rates for Rayachoty's food businesses is our top priority. We look forward to serving you regularly!",
    replyTelugu: "మొహమ్మద్ అతీక్ ఉర్ రెహ్మాన్ షేక్ గారు, మీ విలువైన అభిప్రాయానికి ధన్యవాదాలు! రాయచోటిలోని వ్యాపారాలకు అత్యుత్తమ నాణ్యతతో సరసమైన హోల్‌సేల్ ధరలకే ఫ్రోజెన్ ఫుడ్స్ అందించడమే మా లక్ష్యం.",
    isApproved: true,
    approvedBy: "RAIS Admin"
  },
  {
    id: 3,
    reviewerName: "Sahul N",
    rating: 5,
    date: "1 week ago",
    comment: "The ultimate destination in Rayachoti for all your frozen food needs. Great selection, fresh stock, and excellent convenience. A must-visit..",
    sentiment: "POSITIVE",
    hasReplied: true,
    replyEnglish: "Thank you Sahul N for calling us the ultimate destination for frozen food in Rayachoty! We work hard to ensure fresh inventory of french fries, momos, burger patties, and packaging is always in stock beside Indel Bank.",
    replyTelugu: "సాహుల్ గారు, మీ గొప్ప ప్రశంసకు హృదయపూర్వక ధన్యవాదాలు! రాయచోటిలోని ప్రతి ఫాస్ట్ ఫుడ్ మరియు కేఫ్ కి ఫ్రెష్ స్టాక్ మరియు పూర్తి వెరైటీ అందుబాటులో ఉంచడమే మా ధ్యేయం.",
    isApproved: true,
    approvedBy: "RAIS Admin"
  },
  {
    id: 4,
    reviewerName: "Harshavardhana Raju",
    rating: 5,
    date: "1 month ago",
    comment: "We had an excellent experience with RAIS Agencies Rayachoti! All their frozen food products are fresh, tasty, and of great quality, with very reasonable prices. They have a well-managed team that understands our business needs and delivers on time.",
    sentiment: "POSITIVE",
    hasReplied: true,
    replyEnglish: "Thank you Harshavardhana Raju garu! We are proud to support your commercial food requirements with reliable -18°C cold chain logistics and wholesale pricing across Rayachoty. We appreciate your partnership!",
    replyTelugu: "హర్షవర్ధన రాజు గారు, మీ పాజిటివ్ రివ్యూకు చాలా ధన్యవాదాలు! రాయచోటిలో మీ వ్యాపార అవసరాలకు అనుగుణంగా నాణ్యమైన ఫ్రోజెన్ ఫుడ్స్ మరియు సరైన సమయానికి డెలివరీ అందించడం మా బాధ్యత.",
    isApproved: true,
    approvedBy: "RAIS Admin"
  },
  {
    id: 5,
    reviewerName: "Shyam Krishna",
    rating: 5,
    date: "1 month ago",
    comment: "Good quality and affordable price",
    sentiment: "POSITIVE",
    hasReplied: true,
    replyEnglish: "Thank you Shyam Krishna for appreciating our quality and wholesale pricing! RAIS Agencies is committed to delivering the best commercial rates for Rayachoty's food entrepreneurs.",
    replyTelugu: "శ్యామ్ కృష్ణ గారు, నాణ్యత మరియు సరసమైన ధరలపై మీ ప్రశంసకు చాలా ధన్యవాదాలు! ఎల్లప్పుడూ మీకు ఉత్తమ హోల్‌సేల్ సేవలు అందిస్తాము.",
    isApproved: true,
    approvedBy: "RAIS Admin"
  }
];

export const INITIAL_GBP_KEYWORDS: LocalSEOKeyword[] = [
  { id: 1, keyword: 'frozen food wholesale rayachoty', intent: 'Commercial B2B', relevanceScore: 98, language: 'en' },
  { id: 2, keyword: 'french fries wholesale rayachoty', intent: 'Commercial B2B', relevanceScore: 95, language: 'en' },
  { id: 3, keyword: 'milky mist cheese wholesale rayachoty', intent: 'Commercial B2B', relevanceScore: 94, language: 'en' },
  { id: 4, keyword: 'mozzarella cheese supplier rayachoty', intent: 'Commercial B2B', relevanceScore: 92, language: 'en' },
  { id: 5, keyword: 'butter paper wholesale rayachoty', intent: 'Commercial B2B', relevanceScore: 90, language: 'en' },
  { id: 6, keyword: 'pizza base wholesale rayachoty', intent: 'Commercial B2B', relevanceScore: 88, language: 'en' },
  { id: 7, keyword: 'restaurant supplies rayachoty', intent: 'Commercial B2B', relevanceScore: 85, language: 'en' },
  { id: 8, keyword: 'chicken nuggets bulk rayachoty', intent: 'Commercial B2B', relevanceScore: 84, language: 'en' },
  { id: 9, keyword: 'rayachoti frozen foods agency', intent: 'Local Direct', relevanceScore: 89, language: 'te-en' },
  { id: 10, keyword: 'butter paper kilo rate rayachoty', intent: 'Commercial B2B', relevanceScore: 82, language: 'te-en' }
];

export const INITIAL_GBP_POSTS: GBPPostItem[] = [
  {
    id: 1,
    dayNumber: 1,
    headline: 'Rayachoty’s One-Stop Wholesale Hub for Cafes & Restaurants!',
    contentEnglish: 'Starting or expanding a food business in Rayachoty? RAIS Agencies supplies premier frozen snacks, French fries, cheese, and packaging directly to your kitchen. Visit our hub beside Indel Money Bank on Sundupalli Road.',
    contentTelugu: 'రాయచోటిలోని హోటళ్లు మరియు కేఫ్‌లకు టోకు ధరలలో ఫ్రెంచ్ ఫ్రైస్, చీజ్ మరియు ప్యాకేజింగ్ మెటీరియల్స్ లభించును. సుండుపల్లి రోడ్, ఇండెల్ మనీ బ్యాంక్ పక్కన సంప్రదించండి.',
    callToAction: 'Call Now: 9347453135',
    targetSku: 'RAIS-AMUL-FF6',
    status: 'DRAFT'
  },
  {
    id: 2,
    dayNumber: 2,
    headline: 'Extra Crispy 6mm & 9mm French Fries in Wholesale Cartons',
    contentEnglish: 'Commercial-grade French fries engineered for high crispness, low oil absorption, and superior holding time. Available in bulk cartons at wholesale trade pricing for Rayachoty fast food joints.',
    contentTelugu: 'హోటల్ మరియు కేఫ్ మెనూ కొరకు క్రిస్పీ ఫ్రెంచ్ ఫ్రైస్ టోకు కార్టన్లలో లభించును.',
    callToAction: 'Order on WhatsApp: 9347453135',
    targetSku: 'RAIS-AMUL-FF6',
    status: 'DRAFT'
  },
  {
    id: 3,
    dayNumber: 3,
    headline: 'Zero Thawing: -18°C Guaranteed Cold-Chain Storage in Rayachoty',
    contentEnglish: 'In the frozen food business, temperature consistency protects your kitchen reputation. Every carton at RAIS Agencies is stored in dedicated commercial deep freezers.',
    contentTelugu: '-18 డిగ్రీల కోల్డ్ స్టోరేజ్ నాణ్యతతో ఫ్రెష్ ఫ్రోజెన్ ఫుడ్స్ మీ కిచెన్‌కు సకాలంలో డెలివరీ.',
    callToAction: 'Call Now: 9347453135',
    targetSku: 'RAIS-MM-MOZZ',
    status: 'DRAFT'
  },
  {
    id: 4,
    dayNumber: 4,
    headline: 'Crispy Chicken Nuggets: Quick 3-Minute Kitchen Prep!',
    contentEnglish: 'Speed is everything during evening rush hours. Our commercial chicken nuggets fry to golden perfection in 3 minutes with consistent portion control.',
    contentTelugu: 'సాయంత్రం రష్ సమయాలలో త్వరితగతిన తయారయ్యే రుచికరమైన చికెన్ నగ్గెట్స్ టోకు ధరలకే లభించును.',
    callToAction: 'Order on WhatsApp: 9347453135',
    targetSku: 'RAIS-TRI-NUG',
    status: 'DRAFT'
  },
  {
    id: 5,
    dayNumber: 5,
    headline: 'రాయచోటి హోటళ్లు మరియు కేఫ్‌లకు టోకు ధరలలో ఫ్రోజెన్ ఫుడ్స్!',
    contentEnglish: 'Why order frozen items from Bangalore or Kadapa and wait for bus parcels? RAIS Agencies delivers doorstep to Rayachoty kitchens.',
    contentTelugu: 'రాయచోటిలోని ఫాస్ట్ ఫుడ్ వ్యాపారులారా.. టోకు ధరల వివరాలకు 9347453135 వాట్సాప్ చేయండి. సుండుపల్లి రోడ్ లోని మా గోడౌన్ ను సందర్శించండి.',
    callToAction: 'Call Now: 9347453135',
    targetSku: 'RAIS-AMUL-FF6',
    status: 'DRAFT'
  },
  {
    id: 6,
    dayNumber: 6,
    headline: 'Authentic Veg, Paneer & Chicken Momos for Fast Food Menus',
    contentEnglish: 'Add juicy, thin-wrapper momos to your menu without manual prep labor. High burst resistance during steaming or frying.',
    contentTelugu: 'రాయచోటిలో బెస్ట్ క్వాలిటీ వెజ్ మరియు చికెన్ మోమోస్ హోల్‌సేల్ సప్లై.',
    callToAction: 'Order on WhatsApp: 9347453135',
    targetSku: 'RAIS-TRI-MOM',
    status: 'DRAFT'
  },
  {
    id: 7,
    dayNumber: 7,
    headline: 'Plan Your Sunday Evening Rush with RAIS Agencies',
    contentEnglish: 'Weekends mean higher customer footfall. Don’t run out of fries or parcel boxes on Sunday evening. Connect with our B2B desk for weekend stock.',
    contentTelugu: 'వారాంతపు ఆర్డర్ల రద్దీని తట్టుకోవడానికి ముందుగానే సరుకును స్టాక్ చేసుకోండి.',
    callToAction: 'Call Now: 9347453135',
    targetSku: 'RAIS-AMUL-FF6',
    status: 'DRAFT'
  },
  {
    id: 8,
    dayNumber: 8,
    headline: 'The Secret to Great Pizza: Milky Mist Diced Mozzarella',
    contentEnglish: 'Customers judge pizza by the cheese pull! Authorized wholesale supply of Milky Mist IQF Diced Mozzarella in Rayachoty. Melts evenly and cuts prep time.',
    contentTelugu: 'పిజ్జా మరియు బర్గర్లకు అద్భుతమైన స్ట్రెచ్ ఇచ్చే మిల్కీ మిస్ట్ డైస్డ్ మోజారెల్లా చీజ్ హోల్‌సేల్ రేటుకే పొందండి.',
    callToAction: 'Order on WhatsApp: 9347453135',
    targetSku: 'RAIS-MM-MOZZ',
    status: 'DRAFT'
  },
  {
    id: 9,
    dayNumber: 9,
    headline: 'Fresh 8.5" & 10" Commercial Pizza Bases in Stock',
    contentEnglish: 'Soft, consistent crusts ready for your pizza oven. No need for expensive dough equipment. High-volume daily fresh stock.',
    contentTelugu: 'రెడీ-టు-బేక్ 8.5 మరియు 10 ఇంచుల పిజ్జా బేస్‌లు టోకు ధరలకే లభించును.',
    callToAction: 'Call Now: 9347453135',
    targetSku: 'RAIS-PB-85',
    status: 'DRAFT'
  },
  {
    id: 10,
    dayNumber: 10,
    headline: 'High-Margin Burger Solutions: Buns, Patties & Mayo Bundles',
    contentEnglish: 'Upgrade your burger counter. RAIS Agencies supplies sesame burger buns, crispy patties, and thick commercial mayonnaise on a single invoice.',
    contentTelugu: 'బర్గర్ బన్స్, ప్యాటీస్ మరియు మయోనైస్ అన్నీ ఒకే చోట సులభంగా పొందండి.',
    callToAction: 'Order on WhatsApp: 9347453135',
    targetSku: 'RAIS-DM-MAYO',
    status: 'DRAFT'
  },
  {
    id: 11,
    dayNumber: 11,
    headline: 'Sliced & Block Cheddar Cheese for Bakeries and Sandwich Shops',
    contentEnglish: 'Perfect melt for grilled sandwiches, burger tops, and cheesy fries. Premium dairy consistency that keeps foodies coming back.',
    contentTelugu: 'శాండ్‌విచ్‌లు మరియు బర్గర్ల కొరకు నాణ్యమైన చెడ్డార్ చీజ్ స్లైసెస్ లభించును.',
    callToAction: 'Call Now: 9347453135',
    targetSku: 'RAIS-MM-MOZZ',
    status: 'DRAFT'
  },
  {
    id: 12,
    dayNumber: 12,
    headline: 'Powering Rayachoty’s Modern Cafes & Cloud Kitchens',
    contentEnglish: 'From Reddies Colony to Kadapa Road, we partner with passionate food entrepreneurs to make raw material procurement simple and reliable.',
    contentTelugu: 'రాయచోటిలోని ఆధునిక కేఫ్‌లకు నమ్మకమైన కిచెన్ సప్లై పార్ట్‌నర్ - రైస్ ఏజెన్సీస్.',
    callToAction: 'Call Now: 9347453135',
    targetSku: 'RAIS-AMUL-FF6',
    status: 'DRAFT'
  },
  {
    id: 13,
    dayNumber: 13,
    headline: 'Stop Oil Leakage: Food-Grade 40 GSM OGR Butter Paper',
    contentEnglish: 'Say goodbye to thin 28 GSM paper that tears and leaks oil into customer hands. RAIS Agencies stocks 10x10 & 12x12 certified Oil & Grease Resistant (OGR) sheets.',
    contentTelugu: 'పార్సెల్స్ నుండి ఆయిల్ కారకుండా ఉండే గట్టి 40 GSM ఫుడ్ గ్రేడ్ బట్టర్ పేపర్ హోల్‌సేల్ రేటుకే పొందండి.',
    callToAction: 'Order on WhatsApp: 9347453135',
    targetSku: 'RAIS-PKG-BP40',
    status: 'DRAFT'
  },
  {
    id: 14,
    dayNumber: 14,
    headline: 'Heavy Corrugated Pizza Boxes: Keep Crusts Crisp During Delivery',
    contentEnglish: 'Cheap paper boxes turn pizzas soggy during home delivery. Our premium corrugated boxes feature ventilation flutes that retain heat while venting steam.',
    contentTelugu: 'పిజ్జా హోమ్ డెలివరీలో వేడిని కాపాడుతూ మెత్తబడకుండా ఉంచే దృఢమైన పిజ్జా బాక్స్‌లు.',
    callToAction: 'Call Now: 9347453135',
    targetSku: 'RAIS-PKG-PB10',
    status: 'DRAFT'
  },
  {
    id: 15,
    dayNumber: 15,
    headline: 'Commercial Wrapping Paper for Shawarma & Frankie Stalls',
    contentEnglish: 'Rayachoty shawarma counters love our greaseproof cut sheets. Pre-cut sizes mean your staff saves prep time during peak hours.',
    contentTelugu: 'షవర్మా మరియు రోల్స్ కొరకు ప్రత్యేకమైన కట్ షీట్స్ బట్టర్ పేపర్.',
    callToAction: 'Order on WhatsApp: 9347453135',
    targetSku: 'RAIS-PKG-BP40',
    status: 'DRAFT'
  },
  {
    id: 16,
    dayNumber: 16,
    headline: 'రాయచోటిలో హోటల్స్ మరియు పార్సెల్స్ కొరకు బెస్ట్ బట్టర్ పేపర్!',
    contentEnglish: 'Food-grade 40 GSM butter paper and pizza takeaway boxes at wholesale rates. Immediate delivery from our Sundupalli Road hub.',
    contentTelugu: 'మీ హోటల్ పార్సెల్స్ కొరకు ఆయిల్ లీక్ అవ్వని క్వాలిటీ బట్టర్ పేపర్ మరియు పిజ్జా బాక్స్‌లు హోల్‌సేల్ రేటుకే పొందండి.',
    callToAction: 'Call Now: 9347453135',
    targetSku: 'RAIS-PKG-BP40',
    status: 'DRAFT'
  },
  {
    id: 17,
    dayNumber: 17,
    headline: 'Why Deal with 3 Different Vendors When RAIS Does It All?',
    contentEnglish: 'Don’t order cheese from one trader, frozen momos from outstation, and packaging from a paper store. RAIS Agencies bundles everything on a single invoice.',
    contentTelugu: 'చీజ్, ఫ్రోజెన్ స్నాక్స్ మరియు ప్యాకేజింగ్ మెటీరియల్స్ అన్నీ ఒకే ఆర్డర్‌లో మీ వద్దకు.',
    callToAction: 'Call Now: 9347453135',
    targetSku: 'RAIS-MM-MOZZ',
    status: 'DRAFT'
  },
  {
    id: 18,
    dayNumber: 18,
    headline: 'Certified Food-Safe Packaging for Modern Food Brands',
    contentEnglish: 'Today’s customers care about hygiene. Our food wrapping paper is chlorine-free, odor-free, and 100% food-grade compliant.',
    contentTelugu: 'ఆహార భద్రత మరియు పరిశుభ్రత ప్రమాణాలు కలిగిన నాణ్యమైన ప్యాకేజింగ్ మెటీరియల్స్.',
    callToAction: 'Order on WhatsApp: 9347453135',
    targetSku: 'RAIS-PKG-BP40',
    status: 'DRAFT'
  },
  {
    id: 19,
    dayNumber: 19,
    headline: 'Cut Kitchen Packaging Costs Every Month with Commercial Bundles',
    contentEnglish: 'Buying small retail rolls from general stores increases food costs. Switch to RAIS commercial bundles and protect your profit margins.',
    contentTelugu: 'చిన్న ప్యాకెట్ల కంటే బల్క్ బండిల్స్ తీసుకోవడం ద్వారా కిచెన్ ఖర్చులను తగ్గించుకోండి.',
    callToAction: 'Call Now: 9347453135',
    targetSku: 'RAIS-PKG-BP40',
    status: 'DRAFT'
  },
  {
    id: 20,
    dayNumber: 20,
    headline: 'Reliable Doorstep Delivery Right to Your Kitchen Counter',
    contentEnglish: 'Kitchen staff busy with morning prep? Don’t leave your stove to pick up supplies. RAIS Agencies delivers directly to your cafe doorstep in Rayachoty.',
    contentTelugu: 'రాయచోటిలోని వ్యాపారులకు నేరుగా కిచెన్ వద్దకే వేగవంతమైన డెలివరీ.',
    callToAction: 'Call Now: 9347453135',
    targetSku: 'RAIS-AMUL-FF6',
    status: 'DRAFT'
  },
  {
    id: 21,
    dayNumber: 21,
    headline: 'Tired of Waiting for Bangalore or Kadapa Bus Parcels?',
    contentEnglish: 'Stop paying high bus freight and dealing with bus stand pickup delays. RAIS Agencies is right here in Rayachoty beside Indel Money Bank.',
    contentTelugu: 'ఇతర నగరాల నుండి పార్సెల్స్ వచ్చే వరకు వేచి చూడాల్సిన అవసరం లేకుండా స్థానికంగానే సరుకును పొందండి.',
    callToAction: 'Order on WhatsApp: 9347453135',
    targetSku: 'RAIS-MM-MOZZ',
    status: 'DRAFT'
  },
  {
    id: 22,
    dayNumber: 22,
    headline: 'Thick Commercial Mayonnaise: Rich Consistency That Holds on Hot Patties',
    contentEnglish: 'A watery sauce ruins a good burger. Our Del Monte commercial mayonnaise has high emulsification that stays creamy even on sizzling patties.',
    contentTelugu: 'బర్గర్లు మరియు రోల్స్ కొరకు చిక్కనైన డెల్ మోంటే మయోనైస్ హోల్‌సేల్ ప్యాక్స్ లభించును.',
    callToAction: 'Call Now: 9347453135',
    targetSku: 'RAIS-DM-MAYO',
    status: 'DRAFT'
  },
  {
    id: 23,
    dayNumber: 23,
    headline: 'Weekend Rush Support for Rayachoty Kitchens',
    contentEnglish: 'A sudden party order or unexpected rush? When you run out of stock on busy days, our local godown on Sundupalli Road provides fast support for partner kitchens.',
    contentTelugu: 'రద్దీ సమయాలలో స్టాక్ అయిపోతే ఆందోళన చెందకండి. స్థానిక సప్లైయర్ గా మేము మీకు అండగా ఉంటాము.',
    callToAction: 'Call Now: 9347453135',
    targetSku: 'RAIS-AMUL-FF6',
    status: 'DRAFT'
  },
  {
    id: 24,
    dayNumber: 24,
    headline: 'Sweet Corn & Veg Appetizers for Quick Turnaround Menus',
    contentEnglish: 'Individual Quick Frozen (IQF) sweet corn kernels—juicy, sweet, and ready for butter corn cups, pizza toppings, or fried appetizers.',
    contentTelugu: 'పీజా టాపింగ్స్ మరియు కార్న్ కప్స్ కొరకు నాణ్యమైన స్వీట్ కార్న్ హోల్‌సేల్ సప్లై.',
    callToAction: 'Order on WhatsApp: 9347453135',
    targetSku: 'RAIS-AMUL-FF6',
    status: 'DRAFT'
  },
  {
    id: 25,
    dayNumber: 25,
    headline: 'Supplying Cafes Across Sambepalli, Galiveedu & Nearby Routes',
    contentEnglish: 'Running an eatery outside Rayachoty town? We service food outlets across the commercial corridor with scheduled route deliveries.',
    contentTelugu: 'రాయచోటి పరిసర ప్రాంతాలైన సంబేపల్లి, గాలివీడులలోని కేఫ్‌లకు కూడా సరుకు సప్లై చేయబడును.',
    callToAction: 'Call Now: 9347453135',
    targetSku: 'RAIS-MM-MOZZ',
    status: 'DRAFT'
  },
  {
    id: 26,
    dayNumber: 26,
    headline: 'Complete Food Service Range for Modern Bakeries',
    contentEnglish: 'Bakeries today aren’t just about bread—they sell pizzas, burgers, fries, and cold beverages. Source all supplies from one trusted partner.',
    contentTelugu: 'ఆధునిక బేకరీలకు అవసరమైన పిజ్జా బేస్‌లు, చీజ్, సాస్‌లు మరియు ప్యాకేజింగ్ ఒకే చోట.',
    callToAction: 'Call Now: 9347453135',
    targetSku: 'RAIS-PB-85',
    status: 'DRAFT'
  },
  {
    id: 27,
    dayNumber: 27,
    headline: 'Strict B2B Wholesale Pricing: Protecting Your Retail Margins',
    contentEnglish: 'We are strictly a commercial supply partner. We protect our cafe clients by never publishing wholesale trade rates publicly.',
    contentTelugu: 'హోల్‌సేల్ వ్యాపారుల హక్కులను కాపాడుతూ పారదర్శకమైన ట్రేడ్ రేట్స్ అందిస్తున్నాము. రేట్ల వివరాలకు వాట్సాప్ చేయండి.',
    callToAction: 'Order on WhatsApp: 9347453135',
    targetSku: 'RAIS-MM-MOZZ',
    status: 'DRAFT'
  },
  {
    id: 28,
    dayNumber: 28,
    headline: 'Crispy Breading Mix & Peri-Peri Seasoning for Fried Chicken',
    contentEnglish: 'Want that world-class crunchy fried chicken crust? We supply professional Cajun breading mix and hot peri-peri sprinkle seasoning.',
    contentTelugu: 'క్రిస్పీ ఫ్రైడ్ చికెన్ తయారీకి కావలసిన స్పెషల్ బ్రెడింగ్ మిక్స్ మరియు పెరి-పెరి పౌడర్ అందుబాటులో ఉంది.',
    callToAction: 'Call Now: 9347453135',
    targetSku: 'RAIS-TRI-NUG',
    status: 'DRAFT'
  },
  {
    id: 29,
    dayNumber: 29,
    headline: 'Powering Food Outlets Across Rayachoty & Annamayya District',
    contentEnglish: 'Thank you Rayachoty for trusting RAIS Agencies as your food service partner. Join our network of satisfied cafes, bakeries, and restaurants today.',
    contentTelugu: 'రాయచోటిలోని ఫుడ్ సర్వీస్ వ్యాపారులందరికీ మా హృదయపూర్వక ధన్యవాదాలు. నేడే ఆర్డర్ చేయండి - 9347453135.',
    callToAction: 'Call Now: 9347453135',
    targetSku: 'RAIS-AMUL-FF6',
    status: 'DRAFT'
  },
  {
    id: 30,
    dayNumber: 30,
    headline: 'Ready to Upgrade Your Kitchen Supply Chain?',
    contentEnglish: 'Join dozens of cafes, bakeries, and fast-food kitchens across Rayachoty relying on RAIS Agencies for consistent quality and prompt delivery.',
    contentTelugu: 'మీ రెస్టారెంట్ లేదా కేఫ్ కిచెన్ కు నమ్మకమైన సప్లైయర్ కొరకు ఇప్పుడే సంప్రదించండి - 9347453135.',
    callToAction: 'Call Now: 9347453135',
    targetSku: 'RAIS-MM-MOZZ',
    status: 'DRAFT'
  }
];
