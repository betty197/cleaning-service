/**
 * Curated high-resolution image presets for cleaning service items
 */
export const SERVICE_IMAGE_PRESETS = [
  {
    id: "residential",
    name: "Home & Residential Cleaning",
    keywords: ["home", "house", "residential", "room", "apartment", "living", "maid", "regular", "standard", "general"],
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80",
    description: "Everyday residential and home living room cleaning"
  },
  {
    id: "home_office",
    name: "Home Office Cleaning",
    keywords: ["home office", "home-office", "office at home", "workspace", "desk", "study room", "remote work", "executive office"],
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
    description: "Professional cleaning for productive, organized home workspaces"
  },
  {
    id: "deep",
    name: "Deep Cleaning",
    keywords: ["deep", "intensive", "detailed", "spring", "scrub", "complete", "deep clean", "sanitization"],
    image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=900&q=80",
    description: "Intensive deep scrub and sanitization"
  },
  {
    id: "office",
    name: "Office & Commercial Cleaning",
    keywords: ["office", "commercial", "corporate", "workplace", "business", "desk", "building"],
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
    description: "Professional corporate office and workspace care"
  },
  {
    id: "carpet",
    name: "Carpet & Upholstery Cleaning",
    keywords: ["carpet", "rug", "upholstery", "sofa", "couch", "mattress", "fabric", "steam"],
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=900&q=80",
    description: "Deep carpet shampooing, vacuuming and sofa care"
  },
  {
    id: "window",
    name: "Window & Glass Cleaning",
    keywords: ["window", "glass", "facade", "pane", "mirror"],
    image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=900&q=80",
    description: "Streak-free crystal clear window and glass washing"
  },
  {
    id: "move",
    name: "Move-In / Move-Out Cleaning",
    keywords: ["move", "moving", "tenancy", "relocation", "checkout", "end of tenancy", "tenant"],
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80",
    description: "Spotless turnover cleaning for incoming and outgoing occupants"
  },
  {
    id: "post_construction",
    name: "Post-Construction Cleaning",
    keywords: ["construction", "renovation", "builder", "remodel", "dust", "after builder"],
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80",
    description: "Thorough debris and dust removal after building or renovation"
  },
  {
    id: "kitchen",
    name: "Kitchen & Appliance Cleaning",
    keywords: ["kitchen", "oven", "refrigerator", "fridge", "stove", "grease", "appliance", "cook"],
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=80",
    description: "Heavy degreasing and detailed kitchen appliance cleaning"
  },
  {
    id: "bathroom",
    name: "Bathroom & Sanitization",
    keywords: ["bathroom", "washroom", "toilet", "tile", "grout", "sanitiz", "disinfect"],
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=900&q=80",
    description: "Hygienic bathroom scrubbing, tile descaling and disinfection"
  }
];

/**
 * Returns a matching high-quality image URL for a given cleaning service item.
 * If the service already has a valid image URL, it returns it.
 * Otherwise, it analyzes the service name and description to match the most appropriate image.
 */
export function getServiceImage(service) {
  if (service && typeof service.image === "string" && service.image.trim().length > 5) {
    return service.image.trim();
  }

  const rawName = (service?.service_name || service?.name || "").toLowerCase();
  const desc = (service?.description || "").toLowerCase();
  const text = `${rawName} ${desc}`.replace(/[^a-z0-9\s]/g, " ");

  const exactMatches = {
    home: [
      "home cleaning",
      "home & residential cleaning",
      "residential cleaning",
      "house cleaning",
      "apartment cleaning",
      "home service",
      "living room cleaning"
    ],
    home_office: [
      "home office cleaning",
      "home office",
      "home-office cleaning",
      "office at home cleaning",
      "remote work cleaning",
      "workspace cleaning",
      "study room cleaning"
    ],
    office: [
      "office cleaning",
      "office & commercial cleaning",
      "commercial cleaning",
      "corporate cleaning",
      "workplace cleaning",
      "business cleaning",
      "desk cleaning"
    ],
    deep: [
      "deep cleaning",
      "deep clean",
      "intensive cleaning",
      "spring cleaning",
      "detailed cleaning",
      "complete cleaning",
      "deep sanitization"
    ]
  };

  for (const [presetId, targets] of Object.entries(exactMatches)) {
    const matchedPreset = SERVICE_IMAGE_PRESETS.find((preset) => preset.id === presetId);
    if (matchedPreset && targets.some((target) => text.includes(target))) {
      return matchedPreset.image;
    }
  }

  const aliases = {
    home: ["home", "house", "residential", "apartment", "living", "room", "maid", "general cleaning", "standard cleaning"],
    home_office: ["home office", "home-office", "office at home", "study room", "workspace", "remote work", "desk area"],
    office: ["office", "commercial", "corporate", "workplace", "business", "desk", "workspace", "workspace cleaning"],
    deep: ["deep", "intensive", "detailed", "spring", "scrub", "complete", "sanitization", "deep clean"]
  };

  for (const [presetId, keywords] of Object.entries(aliases)) {
    const matchedPreset = SERVICE_IMAGE_PRESETS.find((preset) => preset.id === presetId);
    if (matchedPreset && keywords.some((keyword) => text.includes(keyword))) {
      return matchedPreset.image;
    }
  }

  for (const preset of SERVICE_IMAGE_PRESETS) {
    const isMatch = preset.keywords.some((keyword) => text.includes(keyword));
    if (isMatch) {
      return preset.image;
    }
  }

  const idNum = Number(service?.id || service?.service_id) || rawName.length || 0;
  const index = Math.abs(idNum) % SERVICE_IMAGE_PRESETS.length;
  return SERVICE_IMAGE_PRESETS[index].image;
}
