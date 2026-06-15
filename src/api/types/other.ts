export type OrcidPersonData = {
  name: {
    "given-names": { value: string };
    "family-name": { value: string };
  };
};

export type OrcidPerson = {
  name: string;
  family: string;
  profile: string;
};
