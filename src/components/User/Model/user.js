class UserModel {
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

  setId(id) {
    this.id = id;
  }

  setCsrf(token) {
    this.csrf = token;
  }

  setJwt(token) {
    this.jwt = token;
  }

  setToken(token) {
    this.token = token;
  }

  setUsername(username) {
    this.username = username;
  }


  setAuthProvider(providerName) {
    this.authProvider = providerName;
  }

  setFullName(fullName) {
    this.fullName = fullName;
  }

  setGitInfo({ company, homeUrl }) {
    this.company = company;
    this.gitHomeUrl = homeUrl;
  }

  setOrcidInfo({ orcidId }) {
    this.orcidId = orcidId;
  }

  setSystemAdmin(isAdmin) {
    this.systemAdmin = isAdmin;
  }

  setSettings(settings) {
    this.settings = settings;
  }
}

export default UserModel;
