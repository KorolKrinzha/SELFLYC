import {
    initializeApp
} from 'firebase/app';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { apiKey, appId, authDomain, measurementId, messagingSenderId, projectId, SITELINK, SITEPORT, storageBucket } from "../../env.js";
import { getCookie } from "./cookieutilities.js";
import Mustache from 'mustache';


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


async function LoadUser() {
    let uuid = getCookie('uuid');
    try {
        const docRef = doc(db, "users", uuid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            let user = docSnap.data()
            renderScore(user.count)
            renderUsername(user.name, user.surname)

        } else {
            addComebackPage();
            location.href = `${SITELINK}:${SITEPORT}/sign`
        }
    } catch (err) {
        // Кидаем на регистрацию
        // если произошла ошибка
        console.log(err);
        addComebackPage();
        location.href = `${SITELINK}:${SITEPORT}/sign`

    }

}


function renderScore(count) {
    var template = document.getElementById('score').innerHTML;
    var rendered = Mustache.render(template, { score:  count});
    document.getElementById('score_target').innerHTML = rendered;
}

function renderUsername(surname, name) {
    surname[0].toUpperCase();
    name[0].toUpperCase();
    const username = `${surname} ${name}`
    var template = document.getElementById('username').innerHTML;
    var rendered = Mustache.render(template, { name:  username});
    document.getElementById('username_target').innerHTML = rendered;
}

const addComebackPage = () => {
    document.cookie = `page=${document.location.pathname}; path=/; expires=Tue, 19 Jan 2038 03:14:07 GMT`;
    return
  };

LoadUser();