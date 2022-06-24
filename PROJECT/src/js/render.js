import {
  initializeApp
} from 'firebase/app';
import {
  getAuth
} from 'firebase/auth';
import {
  collection,
  getDocs, getFirestore, query,
  where
} from 'firebase/firestore';
import Mustache from 'mustache';
import {
  apiKey, appId, authDomain, measurementId, messagingSenderId, projectId,
  storageBucket
} from "../../env.js";


const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
  measurementId: measurementId
};
initializeApp(firebaseConfig);

const db = getFirestore();

function renderTitle(title) {
  var template = document.getElementById('title').innerHTML;
  var rendered = Mustache.render(template, { title:  title});
    document.getElementById('title_target').innerHTML = rendered;
}

function renderDescription(description) {
  var template = document.getElementById('description').innerHTML;
  var rendered = Mustache.render(template, { description:  description});
    document.getElementById('description_target').innerHTML = rendered;
}


async function getInfo() {
  let filename = document.location.pathname.split('/').pop();
  
  const q = query(collection(db, "events"), where("old_link", "==", filename));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {

      let title = doc.data().title;
      let description = doc.data().description;
      renderDescription(description);
      renderTitle(title);
      
  });


}

getInfo();