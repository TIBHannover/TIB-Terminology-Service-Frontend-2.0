import { OrcidPersonData, OrcidPerson } from "./types/other";

export async function resolveOrcidId(id: string): Promise<OrcidPerson> {
  try {
    let url = `https://pub.orcid.org/v3.0/${id}/person`;
    let response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
    });
    let data = (await response.json()) as OrcidPersonData;
    let profilePage = `https://orcid.org/${id}`;
    return {
      name: data.name["given-names"].value,
      family: data.name["family-name"].value,
      profile: profilePage,
    };
  } catch {
    return { name: "", family: "", profile: "" };
  }
}
