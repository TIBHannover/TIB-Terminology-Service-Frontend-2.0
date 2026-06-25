type UserSettings = {
  userCollectionEnabled: boolean;
  activeCollection: { title: string; ontology_ids: any[] };
  advancedSearchEnabled: boolean;
  activeSearchSetting: Record<string, any>;
  activeSearchSettingIsModified: boolean;
};

class UserModel {
  id: string;
  token: string;
  fullName: string;
  username: string;
  authProvider: string;
  company: string;
  gitHomeUrl: string;
  orcidId: string;
  csrf: string;
  jwt: string;
  systemAdmin: boolean;
  settings: UserSettings;

  constructor() {
    this.id = "";
    this.token = "";
    this.fullName = "";
    this.username = "";
    this.authProvider = "";
    this.company = "";
    this.gitHomeUrl = "";
    this.orcidId = "";
    this.csrf = "";
    this.jwt = "";
    this.systemAdmin = false;
    this.settings = {
      userCollectionEnabled: false,
      activeCollection: { title: "", ontology_ids: [] },
      advancedSearchEnabled: false,
      activeSearchSetting: {},
      activeSearchSettingIsModified: false,
    };
  }

  setId(id: string) {
    this.id = id;
  }

  setCsrf(token: string) {
    this.csrf = token;
  }

  setJwt(token: string) {
    this.jwt = token;
  }

  setToken(token: string) {
    this.token = token;
  }

  setUsername(username: string) {
    this.username = username;
  }

  setAuthProvider(providerName: string) {
    this.authProvider = providerName;
  }

  setFullName(fullName: string) {
    this.fullName = fullName;
  }

  setGitInfo({ company, homeUrl }: { company: string; homeUrl: string }) {
    this.company = company;
    this.gitHomeUrl = homeUrl;
  }

  setOrcidInfo({ orcidId }: { orcidId: string }) {
    this.orcidId = orcidId;
  }

  setSystemAdmin(isAdmin: boolean) {
    this.systemAdmin = isAdmin;
  }

  setSettings(settings: UserSettings) {
    this.settings = settings;
  }
}

export default UserModel;
