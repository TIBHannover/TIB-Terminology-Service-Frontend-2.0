export type OntologyFollowPreferences = {
  notifyNote: boolean;
  notifyIssue: boolean;
  notifyPublication: boolean;
  notifyGithub: boolean;
};

export type OntologyFollow = OntologyFollowPreferences & { ontologyId: string };

export const defaultFollowPreferences: OntologyFollowPreferences = {
  notifyNote: true,
  notifyIssue: true,
  notifyPublication: true,
  notifyGithub: true,
};

export const followPreferenceOptions: { key: keyof OntologyFollowPreferences; label: string }[] = [
  { key: "notifyNote", label: "Notes" },
  { key: "notifyIssue", label: "Issues / term requests" },
  { key: "notifyPublication", label: "Publications" },
  { key: "notifyGithub", label: "GitHub activity" },
];
