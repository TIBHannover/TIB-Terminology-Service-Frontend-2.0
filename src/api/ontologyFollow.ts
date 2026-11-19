import { OntologyFollow, OntologyFollowPreferences } from "../concepts/ontologyFollow";
import { getTsPluginHeaders } from "./header";
import { microBackendUrl } from "./helper";

type FollowData = {
  ontology_id: string;
  notify_note: boolean;
  notify_issue: boolean;
  notify_publication: boolean;
  notify_github: boolean;
};

export async function fetchFollowedOntologies(): Promise<OntologyFollow[]> {
  const response = await fetch(microBackendUrl("/ontology_follow/"), {
    headers: getTsPluginHeaders({ withAccessToken: true }),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Could not load followed ontologies.");
  }
  const result: { follows: FollowData[] } = (await response.json())._result;
  return result.follows.map((follow) => ({
    ontologyId: follow.ontology_id,
    notifyNote: follow.notify_note,
    notifyIssue: follow.notify_issue,
    notifyPublication: follow.notify_publication,
    notifyGithub: follow.notify_github,
  }));
}

async function saveFollow(
  ontologyId: string,
  method: "POST" | "PATCH" | "DELETE",
  preferences?: Partial<OntologyFollowPreferences>,
): Promise<boolean> {
  const response = await fetch(microBackendUrl("/ontology_follow/"), {
    method,
    headers: getTsPluginHeaders({ isJson: true, withAccessToken: true }),
    credentials: "include",
    body: JSON.stringify({
      ontology_id: ontologyId,
      notify_note: preferences?.notifyNote,
      notify_issue: preferences?.notifyIssue,
      notify_publication: preferences?.notifyPublication,
      notify_github: preferences?.notifyGithub,
    }),
  });
  if (!response.ok) {
    throw new Error("Could not update this ontology follow.");
  }
  return (await response.json())._result.following;
}

export function setOntologyFollow(
  ontologyId: string,
  following: boolean,
  preferences?: OntologyFollowPreferences,
): Promise<boolean> {
  return saveFollow(ontologyId, following ? "POST" : "DELETE", preferences);
}

export function updateOntologyFollow(
  ontologyId: string,
  preferences: Partial<OntologyFollowPreferences>,
): Promise<boolean> {
  return saveFollow(ontologyId, "PATCH", preferences);
}

export async function unfollowOntologyFromEmail(token: string): Promise<string> {
  const response = await fetch(microBackendUrl("/ontology_follow/unfollow/"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "omit",
    body: JSON.stringify({ token }),
  });
  if (response.status === 410) {
    throw new Error("This unfollow link is no longer valid. Use a recent email or manage your followed ontologies.");
  }
  if (!response.ok) {
    throw new Error(response.status === 400
      ? "This unfollow link is invalid. Use the link in your ontology update email."
      : "Could not unfollow this ontology. Please try again.");
  }
  return (await response.json())._result.ontology_id;
}
