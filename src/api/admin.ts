import { getTsPluginHeaders } from "./header";
import { microBackendUrl } from "./helper";

export async function isSystemAdmin(): Promise<boolean> {
  try {
    const response = await fetch(microBackendUrl("/admin/is_system_admin/"), {
      method: "POST",
      headers: getTsPluginHeaders({ withAccessToken: true }),
      credentials: "include",
    });
    return response.ok && (await response.json())._result?.is_system_admin === true;
  } catch {
    return false;
  }
}

export async function sendTestEmail(): Promise<boolean> {
  try {
    const response = await fetch(microBackendUrl("/admin/send_test_email/"), {
      method: "POST",
      headers: getTsPluginHeaders({ withAccessToken: true }),
      credentials: "include",
    });
    return response.status === 202;
  } catch {
    return false;
  }
}
