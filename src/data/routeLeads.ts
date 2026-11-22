export interface RouteLeadItem {
  id: number;
  businessName: string;
  location: string;
  mapsUrl: string;
  leadType: string;
  productFit: string;
  phone?: string;
  status: 'NEW_SCOUTED' | 'OUTREACH_READY' | 'SAMPLE_SENT' | 'PRICE_LIST_SHARED' | 'ACTIVE_ACCOUNT';
  suggestedProposal: string;
}

export const REAL_SCOUTED_ROUTE_LEADS: RouteLeadItem[] = [
  {
    id: 1,
    businessName: "Lazeez Food Court Pizza",
    location: "Rayachoty",
    mapsUrl: "https://www.google.com/maps/place/Lazeez+Food+Court+Pizza/",
    leadType: "Pizzeria & Fast Food",
    productFit: "Milky Mist Mozzarella Cheese, 10\" Corrugated Pizza Boxes, 8.5\" Pizza Bases, Burger Buns",
    status: "OUTREACH_READY",
    suggestedProposal: "Namaste Lazeez Food Court Pizza team! 🙏 RAIS Agencies is Rayachoty's direct wholesale distributor for Milky Mist diced mozzarella cheese and heavy 3-ply corrugated pizza delivery boxes right beside Indel Bank. We offer direct depot pricing to cut your kitchen costs. Can we drop off a sample box today?"
  },
  {
    id: 2,
    businessName: "Tummy Things Cafe",
    location: "Rayachoty",
    mapsUrl: "https://www.google.com/maps/place/Tummy+Things+Cafe/",
    leadType: "Modern Cafe & Fast Food",
    productFit: "French Fries (6mm & 9mm), Triken Chicken Nuggets, Triken Momos, Burger Clamshells",
    status: "OUTREACH_READY",
    suggestedProposal: "Namaste Tummy Things Cafe! 🙏 We supply crispy French fries (Amul & Hup Hup), Triken chicken momos, and printed burger packaging at wholesale depot rates in Rayachoty with -18°C cold chain delivery. Let us know if we can share our cafe pricing sheet!"
  },
  {
    id: 3,
    businessName: "Food Mohalla Rayachoty",
    location: "Rayachoty",
    mapsUrl: "https://www.google.com/maps/place/Food+Mohalla+Rayachoty/",
    leadType: "Fast Food Franchise / QSR",
    productFit: "Mozzarella Cheese, French Fries, Burger Mayonnaise, OGR Butter Paper 40 GSM",
    status: "OUTREACH_READY",
    suggestedProposal: "Namaste Food Mohalla team! 🙏 RAIS Agencies offers reliable daily wholesale supply of French fries, Milky Mist cheese, and food-grade wrapping paper right here in Rayachoty. Cut your transit delays with our local depot inventory."
  },
  {
    id: 4,
    businessName: "SLV FastFood Center",
    location: "Rayachoty",
    mapsUrl: "https://www.google.com/maps/place/SLV+FastFood+Center/",
    leadType: "High-Volume Fast Food Counter",
    productFit: "Triken Steamed & Fried Momos, French Fries, Burger Patties",
    status: "OUTREACH_READY",
    suggestedProposal: "Namaste SLV FastFood! 🙏 Looking to expand your evening snack menu? We distribute Triken 50-piece chicken momos and crispy fries at direct wholesale margins. Daily pickup or town delivery available."
  },
  {
    id: 5,
    businessName: "SMR juice Cafe & Restaurant",
    location: "Rayachoty",
    mapsUrl: "https://www.google.com/maps/place/SMR+juice+Cafe+%26+Restaurant/",
    leadType: "Juice & Snack Cafe",
    productFit: "French Fries, Burger Buns, Del Monte Eggless Mayonnaise, Takeaway Cups",
    status: "OUTREACH_READY",
    suggestedProposal: "Namaste SMR Cafe! 🙏 RAIS Agencies supplies complete cafe snack lines (fries, sauces, burger packaging) across Rayachoty with zero stockouts. We'd love to partner with you for your daily kitchen supply."
  },
  {
    id: 6,
    businessName: "Bestarabic Restaurant Jailmandi Kadiri",
    location: "Kadiri",
    mapsUrl: "https://www.google.com/maps/place/Bestarabic+Restaurant+Jailmandi+Kadiri/",
    leadType: "Mandi & Arabic Cuisine",
    productFit: "French Fries, Fried Chicken Buckets, OGR Butter Paper, Garlic Mayo",
    status: "OUTREACH_READY",
    suggestedProposal: "Namaste Bestarabic Kadiri team! 🙏 RAIS Agencies runs a scheduled refrigerated delivery vehicle along the Kadiri corridor from Rayachoty. We supply bulk French fries, printed fried chicken buckets, and butter paper sheets directly to your kitchen door. Can we share our Kadiri route rates?"
  },
  {
    id: 7,
    businessName: "Nazeer's zaffran house",
    location: "Kadiri",
    mapsUrl: "https://www.google.com/maps/place/Nazeer%27s+zaffran+house/",
    leadType: "Restaurant & Grill",
    productFit: "Frozen Veg Snacks, Fried Chicken Buckets, French Fries",
    status: "OUTREACH_READY",
    suggestedProposal: "Namaste Nazeer's Zaffran House! 🙏 Our refrigerated route vehicle delivers commercial food products and packaging to Kadiri every week. Cut out middlemen costs on French fries and packaging supplies with direct depot wholesale pricing."
  },
  {
    id: 8,
    businessName: "KK’s Empire Family Restaurant",
    location: "Rayachoty",
    mapsUrl: "https://www.google.com/maps/place/KK%E2%80%99s+Empire+Family+Restaurant/",
    leadType: "Family Dining & Banquet",
    productFit: "Mozzarella Cheese, Frozen Veggies, French Fries, Bakery Bases",
    status: "OUTREACH_READY",
    suggestedProposal: "Namaste KK's Empire! 🙏 We are your local Rayachoty wholesale partner for certified -18°C frozen foods and commercial cheese. Guaranteed stock availability beside Indel Bank."
  },
  {
    id: 9,
    businessName: "Mg Grand Restaurant and Banquet",
    location: "Rayachoty",
    mapsUrl: "https://www.google.com/maps/place/Mg+Grand+Restaurant+and+Banquet/",
    leadType: "Hotel & Banquet Dining",
    productFit: "Milky Mist Mozzarella, Frozen Mixed Vegetables, French Fries",
    status: "OUTREACH_READY",
    suggestedProposal: "Namaste MG Grand Banquet team! 🙏 RAIS Agencies provides commercial catering and banquet frozen food supplies at bulk contract rates across Rayachoty. Let us know if we can share a customized wholesale quote."
  },
  {
    id: 10,
    businessName: "Abhiruchi Family Restaurant Garden",
    location: "Rayachoty",
    mapsUrl: "https://www.google.com/maps/place/Abhiruchi+Family+Restaurant+Garden/",
    leadType: "Garden Restaurant & Starters",
    productFit: "Crispy Chicken Nuggets, French Fries, Momos",
    status: "OUTREACH_READY",
    suggestedProposal: "Namaste Abhiruchi Garden Restaurant! 🙏 Boost your kitchen starter sales with Triken chicken nuggets, authentic momos, and golden fries delivered fresh at -18°C. Let us know when to drop off a sample pack!"
  }
];
