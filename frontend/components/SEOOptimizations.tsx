import JsonLd from './JsonLd'
import { localBusinessSchema } from './LocalBusinessSchema'

// Enhanced person schema with your specific information
export const enhancedPersonSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Salah Eddine Boussettah",
  "alternateName": "SB",
  "description": "Full Stack Developer, Game Developer, and Digital Artist based in Marrakech, Morocco with 5+ years of experience creating innovative web applications, mobile apps, and digital art.",
  "url": "https://boussettahsalah.online",
  "image": "https://boussettahsalah.online/profile-image.jpg",
  "email": "dev@boussettahsalah.online",
  "telephone": "+212649224364",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Menara Marrakech",
    "addressLocality": "Marrakech",
    "addressRegion": "Marrakech",
    "postalCode": "40200",
    "addressCountry": "Morocco"
  },
  "sameAs": [
    "https://github.com/SallahBoussettah",
    "https://www.linkedin.com/in/salah-eddine-boussettah-349a9a34b/",
    "https://x.com/SalahBoussettah"
  ],
  "jobTitle": "Full Stack Developer",
  "worksFor": {
    "@type": "Organization",
    "name": "Freelance Developer"
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
    "Mobile App Development",
    "MongoDB",
    "Express.js",
    "Framer Motion",
    "Tailwind CSS"
  ],
  "alumniOf": {
    "@type": "EducationalOrganization",
    "name": "Software Development"
  },
  "nationality": "Moroccan",
  "birthPlace": {
    "@type": "Place",
    "name": "Morocco"
  }
}

// Portfolio/Creative Work schema
export const portfolioSchema = {
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "SB. - Full Stack Developer Portfolio",
  "description": "A comprehensive portfolio showcasing web development, game development, and digital art projects by Salah Eddine Boussettah",
  "author": {
    "@type": "Person",
    "name": "Salah Eddine Boussettah",
    "url": "https://boussettahsalah.online"
  },
  "url": "https://boussettahsalah.online/projects",
  "dateCreated": "2024",
  "dateModified": new Date().toISOString(),
  "genre": ["Web Development", "Game Development", "Digital Art", "Mobile Development"],
  "keywords": "React, Next.js, Node.js, TypeScript, Game Development, Digital Art, Portfolio",
  "inLanguage": "en",
  "copyrightHolder": {
    "@type": "Person",
    "name": "Salah Eddine Boussettah"
  },
  "copyrightYear": "2024"
}

// Website schema with enhanced information
export const enhancedWebsiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "SB. - Salah Eddine Boussettah Portfolio",
  "alternateName": "SB Portfolio",
  "description": "Professional portfolio showcasing full-stack web development, game development, and digital art projects by Salah Eddine Boussettah from Marrakech, Morocco",
  "url": "https://boussettahsalah.online",
  "author": {
    "@type": "Person",
    "name": "Salah Eddine Boussettah",
    "url": "https://boussettahsalah.online"
  },
  "publisher": {
    "@type": "Person",
    "name": "Salah Eddine Boussettah"
  },
  "copyrightHolder": {
    "@type": "Person",
    "name": "Salah Eddine Boussettah"
  },
  "copyrightYear": "2024",
  "inLanguage": "en",
  "dateCreated": "2024",
  "dateModified": new Date().toISOString(),
  "keywords": "Full Stack Developer, React Developer, Next.js, Node.js, Game Developer, Digital Artist, Marrakech, Morocco",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://boussettahsalah.online/projects?search={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}

// Breadcrumb schema for better navigation
export const createBreadcrumbSchema = (items: Array<{name: string, url: string}>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
})

// SEO Component that includes all schemas
export default function SEOOptimizations({ breadcrumbs }: { breadcrumbs?: Array<{name: string, url: string}> }) {
  return (
    <>
      <JsonLd data={enhancedPersonSchema} />
      <JsonLd data={enhancedWebsiteSchema} />
      <JsonLd data={portfolioSchema} />
      <JsonLd data={localBusinessSchema} />
      {breadcrumbs && <JsonLd data={createBreadcrumbSchema(breadcrumbs)} />}
    </>
  )
}