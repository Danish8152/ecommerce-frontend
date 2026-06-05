export interface Product {
  id: number | string;
  name: string;
  price: string;
  oldPrice?: string;
  status?: string;
  discount?: string;
  rating: number;
  image: string;
  category: string;
  description: string;
  benefits: string[];
  specs: { label: string; value: string }[];
}

export const mockProducts: Product[] = [
  {
    id: 1,
    name: "Minimalist Leather Backpack",
    price: "4499.00",
    oldPrice: "5000.00",
    status: "New",
    rating: 4.8,
    image: "/Img/lifestyle1.png",
    category: "Accessories",
    description:
      "Handcrafted from top-grain water-resistant leather. Extremely spacious with dedicated compartments for a 15-inch laptop, tablet, charger, and daily essentials. Perfect for work, travel, or everyday use.",
    benefits: ["Genuine Full-Grain Leather", "Water-Resistant Coating", "Dedicated 15\" Laptop Slot"],
    specs: [
      { label: "Material", value: "Premium Leather" },
      { label: "Dimensions", value: "45 x 30 x 15 cm" },
      { label: "Warranty", value: "2 Years" },
      { label: "Origin", value: "Artisanal Crafted" },
    ],
  },
  {
    id: 2,
    name: "Noise Cancelling Wireless Headphones",
    price: "12499.00",
    oldPrice: "14999.00",
    status: "-16%",
    rating: 4.7,
    image: "/Img/lifestyle2.png",
    category: "Electronics",
    description:
      "Immerse yourself in pure audio bliss. Featuring hybrid active noise cancellation (ANC), 40-hour battery life, and crystal-clear microphone resolution for professional calls and deep focus.",
    benefits: ["Hybrid Active Noise Cancellation", "Up to 40 Hours Battery Life", "Fast Charging Support"],
    specs: [
      { label: "Connectivity", value: "Bluetooth 5.2 & Wired" },
      { label: "Driver Size", value: "40mm Dynamic" },
      { label: "Charge Time", value: "1.5 Hours" },
      { label: "Weight", value: "250g" },
    ],
  },
  {
    id: 3,
    name: "Ergonomic Office Task Chair",
    price: "8999.00",
    oldPrice: "10999.00",
    status: "-18%",
    rating: 4.5,
    image: "/Img/lifestyle3.png",
    category: "Furniture",
    description:
      "Engineered for ultimate back support and comfort during long working hours. Features breathable mesh backing, adjustable lumbar support, 3D armrests, and a heavy-duty nylon base.",
    benefits: ["Breathable High-Density Mesh", "Adjustable 3D Lumbar Support", "Tilt Tension & Angle Lock"],
    specs: [
      { label: "Frame Material", value: "Heavy-Duty Nylon" },
      { label: "Max Load", value: "120 kg" },
      { label: "Assembly", value: "Easy Self-Assembly" },
      { label: "Certifications", value: "BIFMA Standards" },
    ],
  },
  {
    id: 4,
    name: "Custom Mechanical Gaming Keyboard",
    price: "5499.00",
    status: "New",
    rating: 4.6,
    image: "/Img/lifestyle4.png",
    category: "Electronics",
    description:
      "A gorgeous hot-swappable 75% mechanical keyboard. Features pre-lubed linear switches, sound-absorbing foam layers, PBT double-shot keycaps, and customizable RGB lighting for the ultimate typing feel.",
    benefits: ["Hot-Swappable Switch Sockets", "Customizable RGB Backlight", "Factory Lubed Linear Switches"],
    specs: [
      { label: "Layout", value: "75% ANSI Layout" },
      { label: "Keycaps", value: "PBT Double-shot" },
      { label: "Connection", value: "Type-C Detachable" },
      { label: "Compatibility", value: "Windows, macOS, Linux" },
    ],
  },
  {
    id: 5,
    name: "Organic Cotton Designer Hoodie",
    price: "2499.00",
    status: "New",
    rating: 4.4,
    image: "/Img/lifestyle1.png",
    category: "Apparel",
    description:
      "Crafted from premium 100% GOTS-certified organic cotton. Extremely soft fleece interior, heavyweight knit construct, and relaxed contemporary fit designed for timeless casual style.",
    benefits: ["100% GOTS Organic Cotton", "Heavyweight 400 GSM Fabric", "Pre-Shrunk & Color Fast"],
    specs: [
      { label: "Material", value: "100% Organic Cotton" },
      { label: "Fit Type", value: "Relaxed Fit" },
      { label: "Care", value: "Machine wash cold" },
      { label: "Style", value: "Unisex Minimalist" },
    ],
  },
  {
    id: 6,
    name: "Double-Walled Ceramic Coffee Mug Set",
    price: "1299.00",
    status: "New",
    rating: 4.9,
    image: "/Img/lifestyle3.png",
    category: "Kitchenware",
    description:
      "Artisanal ceramic mugs featuring double-wall insulation to keep your beverages piping hot while remaining cool to the touch. Complete with a beautiful matte glaze finish.",
    benefits: ["Double-Wall Heat Insulation", "Hand-Glazed Ceramic Finish", "Microwave & Dishwasher Safe"],
    specs: [
      { label: "Capacity", value: "350ml per Mug" },
      { label: "Pack Size", value: "Set of 2" },
      { label: "Material", value: "Artisanal Stoneware" },
      { label: "Heat Limit", value: "Up to 220°C" },
    ],
  },
  {
    id: 7,
    name: "Polarized Lifestyle Sunglasses",
    price: "1999.00",
    status: "New",
    rating: 4.3,
    image: "/Img/lifestyle4.png",
    category: "Accessories",
    description:
      "Timeless retro design featuring polarized shatterproof lenses, UV400 protection, and lightweight matte black frames. Reduces glare and protects eyes during outdoor activities.",
    benefits: ["Polarized Glare Reduction", "UV400 100% Sun Protection", "Lightweight TR90 Frames"],
    specs: [
      { label: "Frame Material", value: "TR90 Flexible Polymer" },
      { label: "Lens Type", value: "TAC Polarized" },
      { label: "Weight", value: "21g" },
      { label: "Includes", value: "Hard Case & Cloth Bag" },
    ],
  },
  {
    id: 8,
    name: "Stainless Steel Vacuum Water Bottle",
    price: "1499.00",
    status: "New",
    rating: 4.8,
    image: "/Img/lifestyle4.png",
    category: "Lifestyle",
    description:
      "Double-walled vacuum insulated bottle keeping water ice-cold for up to 24 hours or steaming hot for 12 hours. Constructed from food-grade 18/8 stainless steel with leakproof straw lid.",
    benefits: ["24 Hours Cold / 12 Hours Hot", "18/8 Food Grade Stainless Steel", "BPA-Free Leakproof Cap"],
    specs: [
      { label: "Capacity", value: "750ml" },
      { label: "Material", value: "Food-Grade Stainless Steel" },
      { label: "Finish", value: "Powder Coated Matte" },
      { label: "Weight", value: "360g" },
    ],
  },
  {
    id: 9,
    name: "Aromatic Reed Room Diffuser",
    price: "1199.00",
    status: "New",
    rating: 4.5,
    image: "/Img/lifestyle3.png",
    category: "Home Decor",
    description:
      "Infuse your home with a calming, luxurious scent. Sourced from natural essential oils including lavender, vanilla, and white tea. Elegant amber glass bottle fits beautifully in any space.",
    benefits: ["Natural Essential Oils Blend", "Constant Flame-Free Fragrance", "Lasts Up to 90 Days"],
    specs: [
      { label: "Volume", value: "100ml" },
      { label: "Reeds Included", value: "8 Rattan Reeds" },
      { label: "Fragrance Notes", value: "Lavender, Vanilla, Amber" },
      { label: "Origin", value: "Cold-Pressed Essence" },
    ],
  },
  {
    id: 10,
    name: "Fast Qi Wireless Charging Pad",
    price: "1599.00",
    oldPrice: "1999.00",
    discount: "-20%",
    status: "-20%",
    rating: 4.4,
    image: "/Img/lifestyle2.png",
    category: "Electronics",
    description:
      "Ultra-thin fast charging pad supporting up to 15W Qi wireless output. Designed with premium aluminum housing, an anti-slip fabric top surface, and multi-protection safety features.",
    benefits: ["Up to 15W Fast Charge Output", "Premium Aluminum Base", "Smart Foreign Object Detection"],
    specs: [
      { label: "Input", value: "5V-2A / 9V-2A" },
      { label: "Connector", value: "Type-C Port" },
      { label: "Thickness", value: "6.5mm" },
      { label: "Safety", value: "Overcurrent & Temp Control" },
    ],
  },
  {
    id: 11,
    name: "High-Density Non-Slip Yoga Mat",
    price: "2499.00",
    status: "New",
    rating: 4.9,
    image: "/Img/lifestyle1.png",
    category: "Fitness",
    description:
      "Eco-friendly TPE yoga mat providing excellent cushioning and joint support. Non-slip texture on both sides ensures absolute stability during intense workout and yoga sessions.",
    benefits: ["Eco-Friendly TPE Material", "Extra Thick 6mm Cushioning", "Double-Sided Non-Slip Texture"],
    specs: [
      { label: "Material", value: "TPE (Thermal Plastic Elastomer)" },
      { label: "Dimensions", value: "183 x 61 cm" },
      { label: "Thickness", value: "6mm" },
      { label: "Includes", value: "Carrying Strap" },
    ],
  },
  {
    id: 12,
    name: "Luxury Scented Soy Wax Candles",
    price: "1899.00",
    rating: 4.6,
    image: "/Img/lifestyle3.png",
    category: "Home Decor",
    description:
      "Set of three premium hand-poured soy wax candles. Clean-burning cotton wicks infused with pure therapeutic essential oils. Perfect for relaxation, aromatherapy, and gifting.",
    benefits: ["100% Natural Soy Wax", "Lead-Free Clean Burn Wicks", "Therapeutic Essential Oils"],
    specs: [
      { label: "Pack Size", value: "Set of 3 Jars" },
      { label: "Burn Time", value: "25 Hours per Candle" },
      { label: "Scent Theme", value: "Rose, Sandalwood, Eucalyptus" },
      { label: "Wax Weight", value: "120g per Jar" },
    ],
  },
];
