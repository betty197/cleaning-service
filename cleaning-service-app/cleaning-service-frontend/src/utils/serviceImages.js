/**
 * Curated high-resolution image presets for cleaning service items
 */
export const SERVICE_IMAGE_PRESETS = [
  {
    id: "residential",
    name: "Home & Residential Cleaning",
    keywords: ["home", "house", "residential", "room", "apartment", "living", "maid", "regular", "standard", "general"],
    image: "https://images.pexels.com/photos/6195277/pexels-photo-6195277.jpeg?auto=compress&cs=tinysrgb&w=1200",
    description: "Everyday residential and home living room cleaning"
  },
  {
    id: "home_office",
    name: "Home Office Cleaning",
    keywords: ["home office", "home-office", "office at home", "workspace", "desk", "study room", "remote work", "executive office"],
    image: "https://images.pexels.com/photos/6195964/pexels-photo-6195964.jpeg?auto=compress&cs=tinysrgb&w=1200",
    description: "Professional cleaning for productive, organized home workspaces"
  },
  {
    id: "deep",
    name: "Deep Cleaning",
    keywords: ["deep", "intensive", "detailed", "spring", "scrub", "complete", "deep clean", "sanitization"],
    image: "https://images.pexels.com/photos/6195288/pexels-photo-6195288.jpeg?auto=compress&cs=tinysrgb&w=1200",
    description: "Intensive deep scrub and sanitization for kitchens and living spaces"
  },
  {
    id: "office",
    name: "Office & Commercial Cleaning",
    keywords: ["office", "commercial", "corporate", "workplace", "business", "desk", "building"],
    image: "https://images.pexels.com/photos/5882568/pexels-photo-5882568.jpeg?auto=compress&cs=tinysrgb&w=1200",
    description: "Professional corporate office and workspace care"
  },
  {
    id: "carpet",
    name: "Carpet Cleaning",
    keywords: ["carpet", "rug", "floor covering", "steam cleaning"],
    image: "https://images.pexels.com/photos/4107278/pexels-photo-4107278.jpeg?auto=compress&cs=tinysrgb&w=1200",
    description: "Professional carpet vacuuming and floor-fabric care"
  },
  {
    id: "upholstery",
    name: "Sofa & Upholstery Cleaning",
    keywords: ["sofa", "couch", "upholstery", "mattress", "fabric"],
    image: "https://images.pexels.com/photos/4401535/pexels-photo-4401535.jpeg?auto=compress&cs=tinysrgb&w=1200",
    description: "Professional cleaning for sofas and upholstered furniture"
  },
  {
    id: "window",
    name: "Window & Glass Cleaning",
    keywords: ["window", "glass", "facade", "pane", "mirror"],
    image: "https://images.pexels.com/photos/34668154/pexels-photo-34668154.jpeg?auto=compress&cs=tinysrgb&w=1200",
    description: "Streak-free crystal clear window and glass washing"
  },
  {
    id: "move",
    name: "Move-In / Move-Out Cleaning",
    keywords: ["move", "moving", "tenancy", "relocation", "checkout", "end of tenancy", "tenant"],
    image: "https://images.pexels.com/photos/6195273/pexels-photo-6195273.jpeg?auto=compress&cs=tinysrgb&w=1200",
    description: "Spotless turnover cleaning for incoming and outgoing occupants"
  },
  {
    id: "post_construction",
    name: "Post-Construction Cleaning",
    keywords: ["construction", "renovation", "builder", "remodel", "dust", "after builder"],
    image: "https://images.pexels.com/photos/6195129/pexels-photo-6195129.jpeg?auto=compress&cs=tinysrgb&w=1200",
    description: "Thorough debris and dust removal after building or renovation"
  },
  {
    id: "kitchen",
    name: "Kitchen & Appliance Cleaning",
    keywords: ["kitchen", "oven", "refrigerator", "fridge", "stove", "grease", "appliance", "cook"],
    image: "https://images.pexels.com/photos/6195130/pexels-photo-6195130.jpeg?auto=compress&cs=tinysrgb&w=1200",
    description: "Heavy degreasing and detailed kitchen appliance cleaning"
  },
  {
    id: "bathroom",
    name: "Bathroom & Sanitization",
    keywords: ["bathroom", "washroom", "toilet", "tile", "grout", "sanitiz", "disinfect"],
    image: "https://images.pexels.com/photos/4098187/pexels-photo-4098187.jpeg?auto=compress&cs=tinysrgb&w=1200",
    description: "Hygienic bathroom scrubbing, tile descaling and disinfection"
  }
];

const SERVICE_CATEGORY_MATCHES = [
  ["home_office", /\b(home office|office at home|workspace|study room)\b/],
  ["kitchen", /\b(kitchen|oven|refrigerator|fridge|stove|appliance)\b/],
  ["bathroom", /\b(bathroom|washroom|toilet|shower|sanitiz|disinfect)\b/],
  ["post_construction", /\b(post[- ]construction|construction|renovation|after builder)\b/],
  ["move", /\b(move[- ]in|move[- ]out|moving|tenancy|relocation|checkout)\b/],
  ["upholstery", /\b(sofa|couch|upholstery|mattress|fabric)\b/],
  ["carpet", /\b(carpet|rug)\b/],
  ["window", /\b(window|glass|pane|facade|mirror)\b/],
  ["office", /\b(office|commercial|corporate|workplace|business|desk)\b/],
  ["deep", /\b(deep|intensive|detailed|spring|complete)\b/],
  ["residential", /\b(home|house|residential|apartment|regular|standard|general)\b/]
];

/** Returns the same curated image for a service category on every render. */
export function getServiceImage(service) {
  const serviceName = (service?.service_name || service?.name || "").toLowerCase();
  const match = SERVICE_CATEGORY_MATCHES.find(([, pattern]) => pattern.test(serviceName));
  const presetId = match?.[0] || "residential";
  return SERVICE_IMAGE_PRESETS.find((preset) => preset.id === presetId).image;
}
