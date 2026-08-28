/**
 * Demo / fallback catalogue.
 *
 * These products are served by the product proxy routes
 * (`app/api/v1/products/**`) whenever the upstream `API_URL` service is
 * unreachable, not configured, or returns no products. They are shaped exactly
 * like the real backend payload (`ApiProduct`) so they flow through
 * `mapApiProductToUiProduct` / `mapApiProductToUiProductDetail` untouched and the
 * storefront (home, shop, bestseller, product detail, recommendations) stays
 * fully browsable for demos without a running backend.
 */
import type { ApiMetaEntry, ApiProduct } from "./productMapping";

const img = (name: string) => `/Img/demo/${name}.webp`;

const meta = (
  benefits: string[],
  specs: { label: string; value: string }[],
): ApiMetaEntry[] => [
  { metaKey: "healthBenefits", valueType: "json", metaValue: JSON.stringify(benefits) },
  { metaKey: "specifications", valueType: "json", metaValue: JSON.stringify(specs) },
];

const inventory = (
  available: number,
  opts: { reserved?: number; allowBackorder?: boolean; lowStockThreshold?: number } = {},
) => ({
  quantity: available + (opts.reserved ?? 0),
  availableQuantity: available,
  reservedQuantity: opts.reserved ?? 0,
  effectiveQuantity: available,
  lowStockThreshold: opts.lowStockThreshold ?? 5,
  allowBackorder: opts.allowBackorder ?? false,
});

export const demoProducts: ApiProduct[] = [
  {
    id: 1,
    slug: "heritage-leather-backpack",
    title: "Heritage Full-Grain Leather Backpack",
    productType: "variable",
    status: "active",
    hasVariants: true,
    sku: "NBX-BAG-HERITAGE",
    shortDescription:
      "A structured everyday carry in vegetable-tanned full-grain leather, with a padded 16-inch laptop compartment and antique-brass hardware built to outlast the trends.",
    description:
      "The Heritage Backpack is cut from a single hide of vegetable-tanned full-grain leather and hand-finished by a family workshop that has been making bags for three generations. The grain is left uncorrected, so every bag carries its own marks and deepens into a personal patina over years of use.\n\nInside, a fleece-lined 16-inch laptop sleeve floats above the base to protect against drops, alongside a zip security pocket, two accessory slips and a pen loop. The water-repellent poly-canvas lining wipes clean, the YKK zips are coated against corrosion, and a hidden trolley pass-through slides the bag over a suitcase handle. Magnetic buckles look traditional but open one-handed.\n\nEvery Heritage Backpack ships carbon-neutral in fully recyclable packaging and is covered by a two-year hardware and stitching warranty, with affordable repairs offered well beyond that.",
    thumbnail: img("backpack-main"),
    media: [
      { url: img("backpack-main") },
      { url: img("backpack-detail") },
      { url: img("backpack-angle") },
      { url: img("backpack-lifestyle") },
    ],
    categories: [
      { id: 11, name: "Accessories", slug: "accessories" },
      { id: 12, name: "Bags & Backpacks", slug: "bags-backpacks" },
    ],
    minPrice: 4499,
    basePrice: 4499,
    comparePrice: 5999,
    totalStock: 40,
    averageRating: 4.8,
    totalReviews: 214,
    rating1Count: 2,
    rating2Count: 3,
    rating3Count: 9,
    rating4Count: 41,
    rating5Count: 159,
    defaultVariantId: 101,
    variants: [
      {
        id: 101,
        title: "Chestnut Brown / 18 L",
        sku: "NBX-BAG-HERITAGE-CHT-18",
        price: 4499,
        comparePrice: 5999,
        status: "active",
        image: img("backpack-main"),
        media: [{ url: img("backpack-main") }, { url: img("backpack-detail") }],
        inventory: inventory(24),
        attributeValues: [
          {
            id: 1001,
            attribute: { id: 1, name: "Colour", slug: "colour" },
            attributeValue: { id: 1, value: "Chestnut Brown", valueSlug: "chestnut-brown" },
          },
          {
            id: 1002,
            attribute: { id: 2, name: "Capacity", slug: "capacity" },
            attributeValue: { id: 2, value: "18 L", valueSlug: "18-l" },
          },
        ],
      },
      {
        id: 102,
        title: "Charcoal Black / 18 L",
        sku: "NBX-BAG-HERITAGE-BLK-18",
        price: 4499,
        comparePrice: 5999,
        status: "active",
        image: img("backpack-detail"),
        media: [{ url: img("backpack-detail") }],
        inventory: inventory(9, { lowStockThreshold: 10 }),
        attributeValues: [
          {
            id: 1003,
            attribute: { id: 1, name: "Colour", slug: "colour" },
            attributeValue: { id: 3, value: "Charcoal Black", valueSlug: "charcoal-black" },
          },
          {
            id: 1004,
            attribute: { id: 2, name: "Capacity", slug: "capacity" },
            attributeValue: { id: 2, value: "18 L", valueSlug: "18-l" },
          },
        ],
      },
      {
        id: 103,
        title: "Charcoal Black / 24 L Travel",
        sku: "NBX-BAG-HERITAGE-BLK-24",
        price: 5299,
        comparePrice: 6799,
        status: "active",
        image: img("backpack-angle"),
        media: [{ url: img("backpack-angle") }],
        inventory: inventory(7, { lowStockThreshold: 8 }),
        attributeValues: [
          {
            id: 1005,
            attribute: { id: 1, name: "Colour", slug: "colour" },
            attributeValue: { id: 3, value: "Charcoal Black", valueSlug: "charcoal-black" },
          },
          {
            id: 1006,
            attribute: { id: 2, name: "Capacity", slug: "capacity" },
            attributeValue: { id: 4, value: "24 L Travel", valueSlug: "24-l-travel" },
          },
        ],
      },
    ],
    metaEntries: meta(
      [
        "Vegetable-tanned full-grain leather that patinas with age",
        "Fleece-lined 16\" laptop compartment suspended off the base",
        "Water-repellent lining with corrosion-coated YKK zips",
        "Hidden trolley pass-through for airport travel",
        "Two-year warranty, carbon-neutral shipping",
      ],
      [
        { label: "Outer material", value: "Vegetable-tanned full-grain buffalo leather" },
        { label: "Lining", value: "Water-repellent recycled poly-canvas" },
        { label: "Laptop sleeve", value: "Fits up to 16-inch (37 × 26 cm)" },
        { label: "Dimensions", value: "45 × 30 × 15 cm" },
        { label: "Weight", value: "1.2 kg" },
        { label: "Hardware", value: "Antique brass, YKK zips" },
        { label: "Warranty", value: "2 years hardware & stitching" },
      ],
    ),
  },

  {
    id: 2,
    slug: "aurora-anc-wireless-headphones",
    title: "Aurora ANC Wireless Over-Ear Headphones",
    productType: "variable",
    status: "active",
    hasVariants: true,
    sku: "NBX-AUD-AURORA",
    shortDescription:
      "Adaptive hybrid noise cancellation, 40-hour battery and hi-res LDAC audio in a 250 g frame tuned for long-haul flights and open-plan offices.",
    description:
      "Aurora pairs a 40 mm bio-cellulose driver with a hybrid adaptive noise-cancelling system that samples the room 50,000 times a second, cutting steady noise by up to 42 dB without the pressure-cabin feeling of older ANC headphones. A transparency mode pipes the outside world back in so you can hear an announcement or hold a quick conversation without taking the headphones off.\n\nThe battery lasts 40 hours with ANC on and 60 with it off; a 10-minute USB-C top-up returns six hours. Bluetooth 5.4 with multipoint keeps a laptop and phone connected at once, and the LDAC and aptX Adaptive codecs carry hi-res streams intact. Memory-foam earcups wrapped in protein leather spread the clamp evenly, and the headband folds flat into an included hard case.\n\nOn-ear controls, wear detection and a companion app with a 10-band EQ round out the package. Spare earpads and the cable are available as replacement parts.",
    thumbnail: img("headphones-main"),
    media: [
      { url: img("headphones-main") },
      { url: img("headphones-detail") },
      { url: img("headphones-angle") },
      { url: img("headphones-lifestyle") },
    ],
    categories: [
      { id: 21, name: "Electronics", slug: "electronics" },
      { id: 22, name: "Audio", slug: "audio" },
    ],
    minPrice: 12499,
    basePrice: 12499,
    comparePrice: 15999,
    totalStock: 46,
    averageRating: 4.7,
    totalReviews: 318,
    rating1Count: 4,
    rating2Count: 7,
    rating3Count: 18,
    rating4Count: 74,
    rating5Count: 215,
    defaultVariantId: 201,
    variants: [
      {
        id: 201,
        title: "Matte Black",
        sku: "NBX-AUD-AURORA-BLK",
        price: 12499,
        comparePrice: 15999,
        status: "active",
        image: img("headphones-main"),
        media: [{ url: img("headphones-main") }, { url: img("headphones-detail") }],
        inventory: inventory(28),
        attributeValues: [
          {
            id: 2001,
            attribute: { id: 1, name: "Colour", slug: "colour" },
            attributeValue: { id: 5, value: "Matte Black", valueSlug: "matte-black" },
          },
        ],
      },
      {
        id: 202,
        title: "Graphite",
        sku: "NBX-AUD-AURORA-GRP",
        price: 12499,
        comparePrice: 15999,
        status: "active",
        image: img("headphones-angle"),
        media: [{ url: img("headphones-angle") }],
        inventory: inventory(18),
        attributeValues: [
          {
            id: 2002,
            attribute: { id: 1, name: "Colour", slug: "colour" },
            attributeValue: { id: 6, value: "Graphite", valueSlug: "graphite" },
          },
        ],
      },
      {
        id: 203,
        title: "Ivory (Limited)",
        sku: "NBX-AUD-AURORA-IVY",
        price: 13299,
        comparePrice: 15999,
        status: "active",
        image: img("headphones-detail"),
        media: [{ url: img("headphones-detail") }],
        inventory: inventory(0, { allowBackorder: true }),
        attributeValues: [
          {
            id: 2003,
            attribute: { id: 1, name: "Colour", slug: "colour" },
            attributeValue: { id: 7, value: "Ivory", valueSlug: "ivory" },
          },
        ],
      },
    ],
    metaEntries: meta(
      [
        "Hybrid adaptive ANC rated to −42 dB",
        "40-hour battery with 10-minute = 6-hour fast charge",
        "Bluetooth 5.4 multipoint for two devices at once",
        "Hi-res LDAC and aptX Adaptive codecs",
        "Memory-foam earcups and a fold-flat hard case",
      ],
      [
        { label: "Driver", value: "40 mm bio-cellulose dynamic" },
        { label: "Noise cancellation", value: "Hybrid adaptive, up to −42 dB" },
        { label: "Battery life", value: "40 h (ANC on) / 60 h (ANC off)" },
        { label: "Charging", value: "USB-C — 10 min gives 6 h" },
        { label: "Codecs", value: "LDAC, aptX Adaptive, AAC, SBC" },
        { label: "Bluetooth", value: "5.4 with multipoint" },
        { label: "Weight", value: "250 g" },
        { label: "In the box", value: "Hard case, USB-C & 3.5 mm cables" },
      ],
    ),
  },

  {
    id: 3,
    slug: "artisan-stoneware-mug-set",
    title: "Artisan Reactive-Glaze Stoneware Mug Set",
    productType: "variable",
    status: "active",
    hasVariants: true,
    sku: "NBX-KIT-MUGSET",
    shortDescription:
      "Hand-thrown 350 ml stoneware mugs finished in a reactive glaze, so colour and speckle fall differently on every piece. Microwave and dishwasher safe.",
    description:
      "Each mug in this set is thrown on a wheel, trimmed by hand and dipped in a reactive glaze that breaks and pools in the kiln — the result is a family of mugs that share a shape but never a face. Expect gentle variation in colour depth, speckle and the ring where the glaze meets the raw clay foot; it is the point, not a flaw.\n\nThe body is double-fired stoneware for chip resistance, with a matte exterior that stays cool enough to hold and a glossy interior that will not stain from coffee or tea. A generous thumb-rest handle suits larger hands, and the 350 ml capacity is a true mug rather than a token cup. Bases are unglazed and waxed smooth so they never scratch a table.\n\nMugs are safe in the microwave, dishwasher and an oven up to 220°C. Sets are packed in moulded pulp trays and can be topped up later with open-stock singles.",
    thumbnail: img("mugs-main"),
    media: [
      { url: img("mugs-main") },
      { url: img("mugs-detail") },
      { url: img("mugs-angle") },
      { url: img("mugs-lifestyle") },
    ],
    categories: [
      { id: 31, name: "Kitchenware", slug: "kitchenware" },
      { id: 32, name: "Drinkware", slug: "drinkware" },
    ],
    minPrice: 1799,
    basePrice: 1799,
    totalStock: 51,
    averageRating: 4.9,
    totalReviews: 96,
    rating1Count: 0,
    rating2Count: 1,
    rating3Count: 2,
    rating4Count: 8,
    rating5Count: 85,
    defaultVariantId: 302,
    variants: [
      {
        id: 301,
        title: "Set of 2",
        sku: "NBX-KIT-MUGSET-2",
        price: 1799,
        status: "active",
        image: img("mugs-detail"),
        media: [{ url: img("mugs-detail") }],
        inventory: inventory(30),
        attributeValues: [
          {
            id: 3001,
            attribute: { id: 3, name: "Set size", slug: "set-size" },
            attributeValue: { id: 8, value: "2 mugs", valueSlug: "2-mugs" },
          },
        ],
      },
      {
        id: 302,
        title: "Set of 4",
        sku: "NBX-KIT-MUGSET-4",
        price: 3299,
        status: "active",
        image: img("mugs-main"),
        media: [{ url: img("mugs-main") }, { url: img("mugs-angle") }],
        inventory: inventory(18),
        attributeValues: [
          {
            id: 3002,
            attribute: { id: 3, name: "Set size", slug: "set-size" },
            attributeValue: { id: 9, value: "4 mugs", valueSlug: "4-mugs" },
          },
        ],
      },
      {
        id: 303,
        title: "Set of 6",
        sku: "NBX-KIT-MUGSET-6",
        price: 4999,
        status: "active",
        image: img("mugs-angle"),
        media: [{ url: img("mugs-angle") }],
        inventory: inventory(3, { lowStockThreshold: 6 }),
        attributeValues: [
          {
            id: 3003,
            attribute: { id: 3, name: "Set size", slug: "set-size" },
            attributeValue: { id: 10, value: "6 mugs", valueSlug: "6-mugs" },
          },
        ],
      },
    ],
    metaEntries: meta(
      [
        "Reactive glaze — no two mugs are identical",
        "Double-fired stoneware for chip resistance",
        "Matte body stays cool; glossy interior resists stains",
        "Wide thumb-rest handle, true 350 ml capacity",
        "Microwave, dishwasher and oven safe to 220°C",
      ],
      [
        { label: "Material", value: "Double-fired reactive-glaze stoneware" },
        { label: "Capacity", value: "350 ml per mug" },
        { label: "Finish", value: "Matte exterior, glossy interior" },
        { label: "Dimensions", value: "9 cm tall × 8.5 cm diameter" },
        { label: "Care", value: "Microwave, dishwasher & oven safe (≤220°C)" },
        { label: "Origin", value: "Hand-thrown in small-batch kilns" },
        { label: "Note", value: "Colour and speckle vary by piece" },
      ],
    ),
  },

  {
    id: 4,
    slug: "nibblex-pro-75-mechanical-keyboard",
    title: "NibbleX Pro 75% Hot-Swap Mechanical Keyboard",
    productType: "variable",
    status: "active",
    hasVariants: true,
    sku: "NBX-PC-PRO75",
    shortDescription:
      "A gasket-mounted 75% board with hot-swap sockets, PBT double-shot keycaps, tri-mode wireless and a 200-hour battery. VIA/QMK on every platform.",
    description:
      "The Pro 75% is built around a gasket-mounted design: the switch plate sits on silicone strips rather than being screwed to the case, giving each keystroke a soft, slightly cushioned landing and a deeper acoustic signature. Layers of sound-dampening foam and a lubed stabiliser set arrive tuned out of the box, so there is no rattle or ping to fix.\n\nEvery switch drops into a five-pin hot-swap socket — change feel or replace a failed switch with no soldering. The MDA-profile PBT double-shot keycaps resist shine, and per-key south-facing RGB clears tall keycaps. Connect over Bluetooth 5.2 to three devices, a 2.4 GHz dongle for latency-free play, or USB-C. The 4000 mAh battery runs about 200 hours with the lighting off.\n\nRemapping, macros and layers are handled in VIA or full QMK, identically on macOS, Windows and Linux. A coiled aviator cable, keycap and switch pullers, and eight spare switches are included.",
    thumbnail: img("keyboard-main"),
    media: [
      { url: img("keyboard-main") },
      { url: img("keyboard-detail") },
      { url: img("keyboard-angle") },
      { url: img("keyboard-lifestyle") },
    ],
    categories: [
      { id: 21, name: "Electronics", slug: "electronics" },
      { id: 41, name: "Keyboards", slug: "keyboards" },
    ],
    minPrice: 6999,
    basePrice: 6999,
    comparePrice: 8499,
    totalStock: 37,
    averageRating: 4.6,
    totalReviews: 142,
    rating1Count: 3,
    rating2Count: 5,
    rating3Count: 12,
    rating4Count: 38,
    rating5Count: 84,
    defaultVariantId: 401,
    variants: [
      {
        id: 401,
        title: "Linear Red switches",
        sku: "NBX-PC-PRO75-RED",
        price: 6999,
        comparePrice: 8499,
        status: "active",
        image: img("keyboard-main"),
        media: [{ url: img("keyboard-main") }, { url: img("keyboard-detail") }],
        inventory: inventory(16),
        attributeValues: [
          {
            id: 4001,
            attribute: { id: 4, name: "Switch", slug: "switch" },
            attributeValue: { id: 11, value: "Linear Red", valueSlug: "linear-red" },
          },
        ],
      },
      {
        id: 402,
        title: "Tactile Brown switches",
        sku: "NBX-PC-PRO75-BRN",
        price: 6999,
        comparePrice: 8499,
        status: "active",
        image: img("keyboard-detail"),
        media: [{ url: img("keyboard-detail") }],
        inventory: inventory(15),
        attributeValues: [
          {
            id: 4002,
            attribute: { id: 4, name: "Switch", slug: "switch" },
            attributeValue: { id: 12, value: "Tactile Brown", valueSlug: "tactile-brown" },
          },
        ],
      },
      {
        id: 403,
        title: "Silent Ink switches",
        sku: "NBX-PC-PRO75-INK",
        price: 7499,
        comparePrice: 8999,
        status: "active",
        image: img("keyboard-angle"),
        media: [{ url: img("keyboard-angle") }],
        inventory: inventory(6, { lowStockThreshold: 8 }),
        attributeValues: [
          {
            id: 4003,
            attribute: { id: 4, name: "Switch", slug: "switch" },
            attributeValue: { id: 13, value: "Silent Ink", valueSlug: "silent-ink" },
          },
        ],
      },
    ],
    metaEntries: meta(
      [
        "Gasket-mounted plate for a soft, cushioned typing feel",
        "Five-pin hot-swap sockets — no soldering to change switches",
        "Tri-mode wireless (BT 5.2 / 2.4 GHz / USB-C), ~200-hour battery",
        "Factory-lubed switches and stabilisers, tuned out of the box",
        "VIA/QMK remapping on macOS, Windows and Linux",
      ],
      [
        { label: "Layout", value: "75% — 82 keys, hot-swap 5-pin" },
        { label: "Keycaps", value: "PBT double-shot, MDA profile" },
        { label: "Mount", value: "Gasket, with silicone dampening" },
        { label: "Connectivity", value: "Bluetooth 5.2 · 2.4 GHz · USB-C" },
        { label: "Battery", value: "4000 mAh — up to 200 h (RGB off)" },
        { label: "Software", value: "VIA & QMK, per-key RGB" },
        { label: "Weight", value: "850 g" },
        { label: "In the box", value: "Coiled cable, pullers, 8 spare switches" },
      ],
    ),
  },

  {
    id: 5,
    slug: "atelier-signature-eau-de-parfum",
    title: "Atelier Signature Eau de Parfum",
    productType: "variable",
    status: "active",
    hasVariants: true,
    sku: "NBX-FRG-ATELIER",
    shortDescription:
      "An 18% eau de parfum built on bergamot, cedar and amber, hand-blended in Grasse and bottled in refillable recycled glass. 8–10 hours of wear.",
    description:
      "Atelier Signature opens bright, with bergamot and a lift of pink pepper, then settles over the first hour into a warm heart of cedar, orris and a trace of jasmine. The base is where it lingers — amber, vetiver and tonka bean give a soft, skin-close warmth that lasts eight to ten hours and leaves a close trail rather than filling a room.\n\nThe juice is an eau de parfum at 18% perfume-oil concentration, macerated for six weeks and hand-blended by a fourth-generation perfumer in Grasse. The formula is clean — no parabens, phthalates or synthetic musks flagged by IFRA — and it is vegan and not tested on animals.\n\nThe bottle is refillable recycled glass with a magnetic cap; refills use 90% less packaging than a new bottle. Every order is boxed with a 10 ml travel atomiser.",
    thumbnail: img("parfum-main"),
    media: [
      { url: img("parfum-main") },
      { url: img("parfum-detail") },
      { url: img("parfum-lifestyle") },
      { url: img("parfum-store") },
    ],
    categories: [
      { id: 51, name: "Fragrance", slug: "fragrance" },
      { id: 52, name: "Beauty & Grooming", slug: "beauty-grooming" },
    ],
    minPrice: 3299,
    basePrice: 3299,
    totalStock: 62,
    averageRating: 4.5,
    totalReviews: 67,
    rating1Count: 2,
    rating2Count: 3,
    rating3Count: 6,
    rating4Count: 17,
    rating5Count: 39,
    defaultVariantId: 501,
    variants: [
      {
        id: 501,
        title: "Nº2 Woody Amber / 50 ml",
        sku: "NBX-FRG-ATELIER-N2-50",
        price: 3299,
        status: "active",
        image: img("parfum-main"),
        media: [{ url: img("parfum-main") }, { url: img("parfum-detail") }],
        inventory: inventory(26),
        attributeValues: [
          {
            id: 5001,
            attribute: { id: 5, name: "Scent", slug: "scent" },
            attributeValue: { id: 14, value: "Nº2 Woody Amber", valueSlug: "no2-woody-amber" },
          },
          {
            id: 5002,
            attribute: { id: 6, name: "Size", slug: "size" },
            attributeValue: { id: 15, value: "50 ml", valueSlug: "50-ml" },
          },
        ],
      },
      {
        id: 502,
        title: "Nº2 Woody Amber / 100 ml",
        sku: "NBX-FRG-ATELIER-N2-100",
        price: 5299,
        status: "active",
        image: img("parfum-detail"),
        media: [{ url: img("parfum-detail") }],
        inventory: inventory(22),
        attributeValues: [
          {
            id: 5003,
            attribute: { id: 5, name: "Scent", slug: "scent" },
            attributeValue: { id: 14, value: "Nº2 Woody Amber", valueSlug: "no2-woody-amber" },
          },
          {
            id: 5004,
            attribute: { id: 6, name: "Size", slug: "size" },
            attributeValue: { id: 16, value: "100 ml", valueSlug: "100-ml" },
          },
        ],
      },
      {
        id: 503,
        title: "Ambra Warm Spice / 100 ml",
        sku: "NBX-FRG-ATELIER-AMB-100",
        price: 5299,
        status: "active",
        image: img("parfum-lifestyle"),
        media: [{ url: img("parfum-lifestyle") }],
        inventory: inventory(5, { lowStockThreshold: 6 }),
        attributeValues: [
          {
            id: 5005,
            attribute: { id: 5, name: "Scent", slug: "scent" },
            attributeValue: { id: 17, value: "Ambra Warm Spice", valueSlug: "ambra-warm-spice" },
          },
          {
            id: 5006,
            attribute: { id: 6, name: "Size", slug: "size" },
            attributeValue: { id: 16, value: "100 ml", valueSlug: "100-ml" },
          },
        ],
      },
    ],
    metaEntries: meta(
      [
        "18% perfume-oil concentration for 8–10 hours of wear",
        "Hand-blended in Grasse and macerated for six weeks",
        "Refillable recycled-glass bottle — refills cut packaging by 90%",
        "Clean formula: no parabens, phthalates or synthetic musks",
        "Vegan, never tested on animals, boxed with a travel atomiser",
      ],
      [
        { label: "Concentration", value: "Eau de Parfum — 18% perfume oils" },
        { label: "Top notes", value: "Bergamot, pink pepper" },
        { label: "Heart notes", value: "Cedar, orris, jasmine" },
        { label: "Base notes", value: "Amber, vetiver, tonka bean" },
        { label: "Longevity", value: "8–10 hours, close sillage" },
        { label: "Bottle", value: "Refillable recycled glass, magnetic cap" },
        { label: "Made in", value: "Grasse, France" },
      ],
    ),
  },
];

type DemoListPayload = {
  success: true;
  demo: true;
  message: string;
  data: {
    items: ApiProduct[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  };
};

type DemoDetailPayload = {
  success: true;
  demo: true;
  message: string;
  data: ApiProduct;
};

const variantPrices = (product: ApiProduct) =>
  (product.variants || []).map((variant) => Number(variant.price) || 0).filter((price) => price > 0);

const lowestPrice = (product: ApiProduct) => {
  const prices = variantPrices(product);
  if (prices.length > 0) {
    return Math.min(...prices);
  }
  return Number(product.minPrice ?? product.basePrice ?? 0);
};

const matchesSearch = (product: ApiProduct, term: string) => {
  const haystack = [
    product.title,
    product.slug,
    product.description,
    product.shortDescription,
    ...(product.categories || []).map((category) => category.name),
    ...(product.variants || []).map((variant) => variant.title || ""),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return term
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => haystack.includes(token));
};

/** Build the list payload the storefront expects (`response.data.data.items`). */
export const buildDemoProductList = (searchParams: URLSearchParams): DemoListPayload => {
  const search = (searchParams.get("search") || searchParams.get("q") || "").trim();
  const sort = (searchParams.get("sort") || "newest").toLowerCase();
  const categorySlug = (searchParams.get("category") || "").trim().toLowerCase();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.max(1, Number(searchParams.get("limit")) || 20);

  let items = demoProducts.slice();

  if (search) {
    items = items.filter((product) => matchesSearch(product, search));
  }

  if (categorySlug) {
    items = items.filter((product) =>
      (product.categories || []).some(
        (category) => (category.slug || "").toLowerCase() === categorySlug,
      ),
    );
  }

  if (sort.includes("price")) {
    items.sort((a, b) => lowestPrice(a) - lowestPrice(b));
    if (sort.includes("desc") || sort.includes("high")) {
      items.reverse();
    }
  } else if (sort.includes("rating")) {
    items.sort((a, b) => Number(b.averageRating ?? 0) - Number(a.averageRating ?? 0));
  }
  // "newest" / default keeps authored order.

  const total = items.length;
  const start = (page - 1) * limit;

  return {
    success: true,
    demo: true,
    message: "Serving the built-in demo catalogue (upstream product service unavailable).",
    data: {
      items: items.slice(start, start + limit),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    },
  };
};

/** Build the single-product payload the storefront expects (`response.data.data`). */
export const buildDemoProductDetail = (idOrSlug: string): DemoDetailPayload => {
  const numericId = Number(idOrSlug);
  const match =
    demoProducts.find((product) => Number(product.id) === numericId) ||
    demoProducts.find((product) => product.slug === idOrSlug) ||
    demoProducts[0];

  return {
    success: true,
    demo: true,
    message: "Serving the built-in demo catalogue (upstream product service unavailable).",
    data: match,
  };
};

/** True when an upstream JSON body actually carried a usable product list. */
export const upstreamListHasItems = (parsed: unknown): boolean => {
  if (!parsed || typeof parsed !== "object") {
    return false;
  }
  const data = (parsed as { data?: { items?: unknown } }).data;
  return Array.isArray(data?.items) && data.items.length > 0;
};

/** True when an upstream JSON body actually carried a single product. */
export const upstreamDetailHasProduct = (parsed: unknown): boolean => {
  if (!parsed || typeof parsed !== "object") {
    return false;
  }
  const data = (parsed as { data?: { id?: unknown } }).data;
  return Boolean(data && typeof data === "object" && "id" in data && data.id != null);
};
