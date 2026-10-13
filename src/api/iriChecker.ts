export type OntologyDetail = {
  iri: string;
  unresolvableSince: string;
  status: string;
  serverStatus: number;
  termName?: string;
  checkedUrl?: string;
  finalUrl?: string;
  reason?: string;
};

export type Ontology = {
  ontologyId: string;
  ontologyFileLocation?: string;
  totalNumberOfIRI?: number;
  numberOfDownIRI?: number;
  numberOfUpIRI?: number;
  numberOfRedirectedIRI?: number;
  numberOfChallengedIRI?: number;
  numberOfRateLimitedIRI?: number;
  numberOfTimeoutIRI?: number;
  numberOfErrorIRI?: number;
  percentageDown?: number;
  pidPatterns?: Record<string, number>;
  classifications?: any[];
  ontologyDetails?: OntologyDetail[];
};

function getOntologyResults(body: any): Ontology[] {
  if (Array.isArray(body)) {
    return body as Ontology[];
  }

  if (Array.isArray(body?.ontology)) {
    return body.ontology as Ontology[];
  }

  if (!Array.isArray(body?.results)) {
    return [];
  }

  return body.results.flatMap((result: any) =>
    Array.isArray(result?.ontology) ? result.ontology : [],
  ) as Ontology[];
}

function getBackendBase(): string {
  const base = process.env.REACT_APP_IRI_CHECKER_BACKEND_URL;
  if (!base) throw new Error("REACT_APP_IRI_CHECKER_BACKEND_URL not defined");
  return base.replace(/\/$/, "");
}

export async function readOntologyIriStatus(ontologyId: string): Promise<Ontology[] | null> {
  try {
    const res = await fetch(`${getBackendBase()}/read-ontology-iri-status/${encodeURIComponent(ontologyId)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json();
    return getOntologyResults(body);
  } catch (e) {
    console.error("readOntologyIriStatus error", e);
    return null;
  }
}
