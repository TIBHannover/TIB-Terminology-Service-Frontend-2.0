export interface FacetProp {
    data: Facet;
  }
  
  export interface Facet {
    prefix: string;
    data: Array<{ doc_count: number; key: string; key_as_string?: string }>;
  }
  
  export interface AnnotationIF {
    concept: string;
    offset: {
      start: number;
      end: number;
    };
    class: string;
  }
  
  export interface CardReqIF {
    abstract: string;
    authors: Array<string>;
    date: string;
    id: string;
    pdfLink: string;
    docLink: string;
    source: string;
    title: string;
    title_annotations: Array<AnnotationIF>;
    abstract_annotations: Array<AnnotationIF>;
    publication: { url: string;
                      source: string};
  }
  