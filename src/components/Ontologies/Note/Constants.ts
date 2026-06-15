export const ONTOLOGY_COMPONENT_ID = 1;
export const CLASS_COMPONENT_ID = 2;
export const PROPERTY_COMPONENT_ID = 3;
export const INDIVIDUAL_COMPONENT_ID = 4;
export const NOTE_COMPONENT_VALUES = ['', 'ontology', 'class', 'property', 'individual']
export const TERM_TYPES = ['', 'ontology', 'terms', 'properties', 'individuals']

export const VISIBILITY_ONLY_ME = 1;
export const VISIBILITY_TS_USRES = 2;
export const VISIBILITY_PUBLIC = 3;
export const VISIBILITY_VALUES = ['', 'me', 'internal', 'public']

export const COMPONENT_TYPES_FOR_DROPDOWN = [
    {label: "Ontology", value:ONTOLOGY_COMPONENT_ID},
    {label: "Class", value:CLASS_COMPONENT_ID},
    {label: "Property", value:PROPERTY_COMPONENT_ID},
    {label: "Individual", value:INDIVIDUAL_COMPONENT_ID}
];


export const VISIBILITY_FOR_DROPDOWN = [
    {label: "Me", value:VISIBILITY_ONLY_ME},
    {label: "Internal", value:VISIBILITY_TS_USRES},
    {label: "Public", value:VISIBILITY_PUBLIC}
];
