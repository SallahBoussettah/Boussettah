export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "SB. - Salah Eddine Boussettah",
  description:
    "Full Stack Developer offering web development, mobile app development, and game development services",
  url: "https://boussettahsalah.online",
  telephone: "+212649224364",
  email: "dev@boussettahsalah.online",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Menara Marrakech",
    addressLocality: "Marrakech",
    addressRegion: "Marrakech",
    postalCode: "40200",
    addressCountry: "Morocco",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "31.6295",
    longitude: "-7.9811",
  },
  openingHours: "Mo-Fr 09:00-18:00",
  priceRange: "$$",
  serviceArea: {
    "@type": "GeoCircle",
    geoMidpoint: {
      "@type": "GeoCoordinates",
      latitude: "31.6295",
      longitude: "-7.9811",
    },
    geoRadius: "50000", // 50km radius
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Development Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Web Development",
          description:
            "Custom web application development using React, Next.js, and Node.js",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Mobile App Development",
          description: "Cross-platform mobile application development",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Game Development",
          description: "Custom game development and interactive experiences",
        },
      },
    ],
  },
};
