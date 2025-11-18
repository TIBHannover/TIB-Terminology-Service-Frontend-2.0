
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();
const siteUrl = process.env.REACT_APP_PUBLIC_URL;

const routes = [
  { path: '', title: 'Home' },
  { path: 'ontologysuggestion', title: 'Ontology Suggestion' },
  { path: 'ontologies', title: 'Ontologies' },
  { path: 'api', title: 'API' },
  { path: 'docs', title: 'Documentation' },
  { path: 'search', title: 'Search' },
  { path: 'imprint', title: 'Imprint' },
  { path: 'PrivacyPolicy', title: 'Privacy Policy' },
  { path: 'TermsOfUse', title: 'Terms of Use' },
  { path: 'about', title: 'About' },
  { path: 'help', title: 'Help' },
  { path: 'contact', title: 'Contact' },
];

if (process.env.REACT_APP_COLLECTION_TAB_SHOW === "true") {
  routes.push({ path: 'collections', title: 'Collections' });
}


function generateSitemap() {
  const urls = routes.map(route => `
  <url>
    <loc>${siteUrl}${route.path}</loc>
    <title>${route.title}</title>
  </url>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  fs.writeFileSync('./build/sitemap.xml', xml.trim());
  console.log('Sitemap generated!');
}

generateSitemap();
