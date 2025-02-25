export function renderAboutPage() {
  let content = [
    <div>
      <div>
        <h3>What is TIB Terminology Service?</h3>
        <p>TIB Terminology Service is an open source, free of charge web service hosted by <a href="https://www.tib.eu/de/">TIB – Leibniz Information Centre for Science and Technology and University Library.</a></p>
        <p>TIB Terminology Service intends to be your one-stop-shop for terminology search, browsing and look-up. In particular, it enables you to:</p>
        <ul>
          <li>Access the latest versions of the most relevant terminologies from chemistry, engineering, architecture and many more domains.</li>
          <li>Explore domain knowledge via concept hierarchies, find synonyms, translations of terms (via API), look up definitions, and retrieve a concept’s persistent identifier.</li>
          <li>Use TIB Terminology Service data (JSON) in your own service or application via REST API.</li>
          <li>Suggest your own or other ontologies to be indexed in TIB Terminology Service.</li>
        </ul>
        <h3>Roadmap</h3>
        <p>TIB Terminology Service is constantly improving. In the future, more contents and functionality will be added, e.g.</p>
        <ul>
          <li>further general-purpose and domain terminologies,</li>
          <li>tools for the collaborative creation of terminologies (e.g. versioning system, online editor)</li>
          <li>a help-desk to assist the user community in the curation of terminologies.</li>
        </ul>
      </div>
    </div>
  ];

  return content;
}