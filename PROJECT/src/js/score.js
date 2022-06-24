import {
    initializeApp
  } from 'firebase/app';
  import {
    arrayUnion, collection, doc, getDoc, getDocs, getFirestore, increment, query, updateDoc, where
  } from 'firebase/firestore';
import {
    apiKey, appId, authDomain, measurementId, messagingSenderId, projectId,
    storageBucket
} from "../../env.js";
import Mustache from 'mustache';
import { async } from '@firebase/util';

  
  
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
const userName = document.getElementById('userName');
const userSelect = document.getElementById('userSelect');
const userSelectScript = document.getElementById('userSelectScript');

// если что-то введено в input имени пользователя - регенерим select
userName.onchange = async function(){
    // Пользователи будут отображены в select options    
    let users = await getUsersWithName();

    
    let template = document.getElementById('userSelectScript').innerHTML;
    // админ будет видеть имя польозвател и его баллы
    // а выбираться будет его id
    var user_data = { data : users, value:  function () {return this[0]}, 
    text: function (){return this[1]+" "+this[2]+" | "+this[3]} };
    
    let rendered = Mustache.render(template, user_data)
    document.getElementById('userSelect').innerHTML = rendered;
}

// Получаем массив пользователей с введенной фамилией
async function getUsersWithName(){

    // запрашиваем фамилию из формы
    const userSurname =  userName.value;
    
    // если пользователь с данной фамилией - в массив
    const q = query(collection(db, "users"), where("surname", "==", userSurname));
    const querySnapshot = await getDocs(q);

    let selectedUsers = []
    querySnapshot.forEach((doc) => {     
      selectedUsers.push([doc.id,doc.data().surname, doc.data().name, doc.data().count])
    });
    // возвращаем пользователей
    return selectedUsers


};




const scoreForm = document.getElementById('scoreForm');
scoreForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const userId = scoreForm.userSelect.value;
    const value = scoreForm.eventValue.value;
    
    Decrement(userId, value)
    scoreForm.reset();
    
    onSuccess();
    

    
});

async function Decrement(userId, value){
    let userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
        count: increment(-value),
        
      });
}



function onSuccess() {   
    
    document.getElementById("successMessage").text = "Баллы вычтены\r\nА теперь призы!"
    
    document.getElementById("successMessage").style.visibility = "visible";



}