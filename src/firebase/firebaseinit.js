import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyDGcxjil815PJeXgvHwoi36IJGHwI-E7W8",
    authDomain: "weatherapp-cca7c.firebaseapp.com",
    projectId: "weatherapp-cca7c",
    storageBucket: "weatherapp-cca7c.appspot.com",
    messagingSenderId: "131484772362",
    appId: "1:131484772362:web:bb4ee0c754589544e2d7f3"
  };
  
  // Initialize Firebase
  const firebaseApp = firebase.initializeApp(firebaseConfig);
  export default firebaseApp.firestore();