type TourProfile = {
  homepage?: boolean;
  ontoPageTabs?: boolean;
}


export function storeTourProfile(profile: TourProfile) {
  try {
    let objInstr = JSON.stringify(profile);
    window.localStorage.setItem('tour_profile', objInstr);
    return;
  } catch (e) {
    return;
  }
}


export function getTourProfile(): TourProfile {
  try {
    let profile = window.localStorage.getItem('tour_profile');
    if (profile) {
      return JSON.parse(profile) as TourProfile;
    }
    return {} as TourProfile;
  } catch (e) {
    return {} as TourProfile;
  }
}
