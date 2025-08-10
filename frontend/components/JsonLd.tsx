interface JsonLdProps {
  data: Record<string, any>
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// Schema data for different pages
export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Salah Eddine Boussettah",
  "alternateName": "SB",
  "description": "Full Stack Developer, Game Developer, and Digital Artist with 5+ years of experience",
  "url": "https://boussettahsalah.online",
  "image": "https://boussettahsalah.online/profile-image.jpg",
  "sameAs": [
    "https://github.com/SallahBoussettah",
    "https://www.linkedin.com/in/salah-eddine-boussettah-349a9a34b/",
    "https://x.com/SalahBoussettah"
  ],
  "jobTitle": "Full Stack Developer",
  "worksFor": {
    "@type": "Organization",
    "name": "Freelance"
  },
  "knowsAbout": [
    "React",
    "Next.js", 
    "Node.js",
    "TypeScript",
    "JavaScript",
    "Game Development",
    "Digital Art",
    "Web Development",
    "Mobile App Development"
  ]
}

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "SB. - Salah Eddine Boussettah Portfolio",
  "description": "Portfolio showcasing web development, game development, and digital art projects",
  "url": "https://boussettahsalah.online",
  "author": {
    "@type": "Person",
    "name": "Salah Eddine Boussettah"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://boussettahsalah.online/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}

export const portfolioSchema = {
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "Developer Portfolio",
  "description": "A collection of web development, game development, and digital art projects",
  "author": {
    "@type": "Person",
    "name": "Salah Eddine Boussettah"
  },
  "url": "https://boussettahsalah.online/projects",
  "dateCreated": "2024",
  "genre": ["Web Development", "Game Development", "Digital Art"]
}