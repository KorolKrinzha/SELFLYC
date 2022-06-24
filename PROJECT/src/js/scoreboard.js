import {
    initializeApp
} from 'firebase/app';
import {
    getAuth
} from 'firebase/auth';
import {
    collection,
    getDocs, getFirestore, orderBy, query, where
} from 'firebase/firestore';
import { apiKey, authDomain, projectId, 
    storageBucket, messagingSenderId, appId, measurementId } from "../../env.js"
  
  
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
import Mustache from 'mustache';


async function LoadUsers(){
    const q = query(collection(db, "users"),
     where("count", ">", 0), 
    orderBy("count", "desc"));

    const querySnapshot = await getDocs(q);
    // Массив словарей со всеми активными участниками
    let dict_users = []
    querySnapshot.forEach((doc) => {
    
    
    dict_users.push({
        firstname: doc.data().name,
        surname: doc.data().surname,
        count: doc.data().count
    }
        )
    });
    //  Рендерим пользователей в таблицу
    let template = document.getElementById('names_table_score').innerHTML;
    let rendered = Mustache.render(template, {  "users": dict_users, "user": function () {
        return this.firstname.slice(0,10)+" "+this.surname.slice(0,10)}
     });
    document.getElementById('names_table').innerHTML = rendered;

    let template_count = document.getElementById('count_table_score').innerHTML;
    let rendered_count = Mustache.render(template_count, {  "users": dict_users, "user": function () {
        return this.count}
     });
     document.getElementById('count_table').innerHTML = rendered_count;
}
LoadUsers();

