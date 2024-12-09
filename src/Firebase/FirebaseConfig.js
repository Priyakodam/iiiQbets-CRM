import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';  // Import Firebase Storage

const firebaseConfig = {
    apiKey: "AIzaSyDenskeYCyuulYCKsuNACDSD9u7_MqgZ6I",
    authDomain: "crm-internal-b987e.firebaseapp.com",
    projectId: "crm-internal-b987e",
    storageBucket: "crm-internal-b987e.appspot.com",
    messagingSenderId: "1031658492743",
    appId: "1:1031658492743:web:2479c6d8a20e2d0a347262"
  };

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();  

export { db, auth, storage,firebase  };
