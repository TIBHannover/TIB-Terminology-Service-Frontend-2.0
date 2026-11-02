import { getTsPluginHeaders } from "./header";
import { microBackendUrl } from "./helper";

export async function fetchFollowedOntologies(): Promise<string[]> {
  const response = await fetch(microBackendUrl("/ontology_follow/"), {
    headers: getTsPluginHeaders({ withAccessToken: true }),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Could not load followed ontologies.");
  }
  return (await response.json())._result.ontology_ids;
}

export async function setOntologyFollow(
  ontologyId: string,
  following: boolean,
): Promise<boolean> {
  const response = await fetch(microBackendUrl("/ontology_follow/"), {
    method: following ? "POST" : "DELETE",
    headers: getTsPluginHeaders({ isJson: true, withAccessToken: true }),
    credentials: "include",
    body: JSON.stringify({ ontology_id: ontologyId }),
  });
  if (!response.ok) {
    throw new Error("Could not update this ontology follow.");
  }
  return (await response.json())._result.following;
}
