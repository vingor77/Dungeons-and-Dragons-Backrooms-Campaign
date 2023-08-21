import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBWMoq9JTr6OvhSI3cJYsr94_ESxc8DACY",
  authDomain: "backroomscampaign.firebaseapp.com",
  projectId: "backroomscampaign",
  storageBucket: "backroomscampaign.appspot.com",
  messagingSenderId: "198515475662",
  appId: "1:198515475662:web:b01bf625ba2dcdba0d7c9f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export default getFirestore(app);