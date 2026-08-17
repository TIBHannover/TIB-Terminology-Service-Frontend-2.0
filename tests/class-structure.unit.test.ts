import { expect, test } from "@playwright/test";
import type { OntologyTermDataV2 } from "../src/api/types/ontologyTypes";

const windowShim = {
  location: {
    href: "http://localhost/",
    pathname: "/",
    search: "",
    hash: "",
  },
  history: {
    state: null,
    pushState: () => {},
    replaceState: () => {},
  },
  addEventListener: () => {},
  removeEventListener: () => {},
};

(globalThis as { document?: unknown; window?: unknown }).window = windowShim;
(globalThis as { document?: unknown }).document = {
  defaultView: windowShim,
};

const { TsClass } = require("../src/concepts/class") as typeof import(
  "../src/concepts/class"
);
const { TsTerm } = require("../src/concepts/term") as typeof import(
  "../src/concepts/term"
);

const TERM_IRI = "http://example.test/term/root";
const PARENT_IRI = "http://example.test/term/parent";
const TARGET_IRI = "http://example.test/term/target";
const OUTPUT_IRI = "http://example.test/term/output";
const PROPERTY_IRI = "http://example.test/prop/part-of";
const INPUT_PROPERTY_IRI = "http://example.test/prop/has-input";
const OUTPUT_PROPERTY_IRI = "http://example.test/prop/has-output";
const SOME_VALUES_FROM = "http://www.w3.org/2002/07/owl#someValuesFrom";
const CARDINALITY = "http://www.w3.org/2002/07/owl#qualifiedCardinality";

function createClass(term: Partial<OntologyTermDataV2>) {
  return new TsClass(
    {
      iri: TERM_IRI,
      label: ["Root term"],
      type: ["class"],
      ontologyId: "test-ontology",
      linkedEntities: {
        [PARENT_IRI]: { label: ["Parent term"] },
        [TARGET_IRI]: { label: ["Target term"] },
        [OUTPUT_IRI]: { label: ["Output term"] },
        [PROPERTY_IRI]: { label: ["part of"] },
        [INPUT_PROPERTY_IRI]: { label: ["has input"] },
        [OUTPUT_PROPERTY_IRI]: { label: ["has output"] },
      },
      ...term,
    },
    [],
  );
}

test.describe("TsClass.recursivelyBuildStructure", () => {
  test("returns link nodes for direct linked class IRIs", () => {
    const term = createClass({
      [TsTerm.SUBCLASS_PURL]: PARENT_IRI,
    });

    expect(term.recursivelyBuildStructure(TsTerm.SUBCLASS_PURL)).toEqual([
      {
        type: "link",
        iri: PARENT_IRI,
        label: "Parent term",
        target: "terms",
      },
    ]);
  });

  test("returns expression nodes for property restrictions", () => {
    const term = createClass({
      [TsTerm.SUBCLASS_PURL]: {
        [TsTerm.ON_PROPERTY_URI]: PROPERTY_IRI,
        [SOME_VALUES_FROM]: TARGET_IRI,
      },
    });

    expect(term.recursivelyBuildStructure(TsTerm.SUBCLASS_PURL)).toEqual([
      {
        type: "expression",
        left: {
          type: "link",
          iri: PROPERTY_IRI,
          label: "part of",
          target: "props",
        },
        relation: "someValuesFrom",
        right: {
          type: "link",
          iri: TARGET_IRI,
          label: "Target term",
          target: "terms",
        },
      },
    ]);
  });

  test("keeps top-level subclass arrays as separate structure nodes", () => {
    const term = createClass({
      [TsTerm.SUBCLASS_PURL]: [
        PARENT_IRI,
        {
          [TsTerm.ON_PROPERTY_URI]: INPUT_PROPERTY_IRI,
          [SOME_VALUES_FROM]: TARGET_IRI,
        },
        {
          [TsTerm.ON_PROPERTY_URI]: OUTPUT_PROPERTY_IRI,
          [SOME_VALUES_FROM]: OUTPUT_IRI,
        },
      ],
    });

    expect(term.recursivelyBuildStructure(TsTerm.SUBCLASS_PURL)).toEqual([
      {
        type: "link",
        iri: PARENT_IRI,
        label: "Parent term",
        target: "terms",
      },
      {
        type: "expression",
        left: {
          type: "link",
          iri: INPUT_PROPERTY_IRI,
          label: "has input",
          target: "props",
        },
        relation: "someValuesFrom",
        right: {
          type: "link",
          iri: TARGET_IRI,
          label: "Target term",
          target: "terms",
        },
      },
      {
        type: "expression",
        left: {
          type: "link",
          iri: OUTPUT_PROPERTY_IRI,
          label: "has output",
          target: "props",
        },
        relation: "someValuesFrom",
        right: {
          type: "link",
          iri: OUTPUT_IRI,
          label: "Output term",
          target: "terms",
        },
      },
    ]);
  });

  test("keeps cardinality values as literals", () => {
    const term = createClass({
      [TsTerm.SUBCLASS_PURL]: {
        [TsTerm.ON_PROPERTY_URI]: PROPERTY_IRI,
        [CARDINALITY]: "1",
      },
    });

    expect(term.recursivelyBuildStructure(TsTerm.SUBCLASS_PURL)).toEqual([
      {
        type: "expression",
        left: {
          type: "link",
          iri: PROPERTY_IRI,
          label: "part of",
          target: "props",
        },
        relation: "qualifiedCardinality",
        right: {
          type: "literal",
          value: "1",
        },
      },
    ]);
  });

  test("returns undefined when no structure can be built", () => {
    expect(
      createClass({}).recursivelyBuildStructure(TsTerm.SUBCLASS_PURL),
    ).toBeUndefined();

    expect(
      createClass({
        [TsTerm.SUBCLASS_PURL]: "http://example.test/term/unlinked",
      }).recursivelyBuildStructure(TsTerm.SUBCLASS_PURL),
    ).toBeUndefined();
  });
});
