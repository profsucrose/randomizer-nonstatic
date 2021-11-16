import { GoogleAuthProvider } from "firebase/auth";

const popupProvider = new GoogleAuthProvider();

// probably windwardschool.org
const organizationDomain = process.env.REACT_APP_FIREBASE_ORGANIZATION_DOMAIN;

popupProvider.setCustomParameters({
  // add hd parameter (organization domain) if it exists
  ...(organizationDomain && {
    hd: organizationDomain
  }),
});

export default popupProvider;
