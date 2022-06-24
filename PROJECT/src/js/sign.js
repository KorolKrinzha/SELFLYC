import {
    initializeApp
} from 'firebase/app';
import {
    createUserWithEmailAndPassword,
    getAuth
} from 'firebase/auth';
import {
    doc,
    getFirestore,
    setDoc
} from 'firebase/firestore';
import {
    apiKey, appId, authDomain, measurementId, messagingSenderId, projectId,
    storageBucket
} from "../../env.js";
import { deleteCookie, getCookie, setCookie } from "./cookieutilities.js";

  
  
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

const auth = getAuth();
const db = getFirestore();


// Считываем форму
const signUpForm = document.querySelector('.signup');
signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Берем все, что указал пользователь
    const email = signUpForm.email.value;
    const password = signUpForm.password.value;
    const name = signUpForm.name.value;
    const surname = signUpForm.surname.value;
    const grade = signUpForm.grade.value;
    
    // С мэйлом и паролем регаем пользователя 
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
           
            setCookie('uuid', String(user.uid), {
                'path': '/',
                'expires': 'Tue, 19 Jan 2038 03:14:07 GMT'
            })
            
            //  В БД создаем пользователя

            setDoc(doc(db, 'users', String(user.uid)), {
                name: name,
                surname: surname,
                count: 0,
                sites: [],
                grade: grade,
                events: []
            });
            signUpForm.reset();
            returntoPage();


        })
        .catch((error) => {
            // ---Обработка ошибок--- 
            document.getElementById("errorMessage").style.visibility = "visible"
            
            if (error.code == "auth/email-already-in-use") {
                document.getElementById("errorMessage").text = "Данная почта уже использована"

            } else if (error.code == "auth/weak-password") {
                document.getElementById("errorMessage").text = "Используйте пароль с >5 символами"
            } else if (error.code == "auth/invalid-email") {
                document.getElementById("errorMessage").text = "Неправильно введена почта"
            } else {
                document.getElementById("errorMessage").text = "Ошибка регистрации"
            }

        });

});


// Функция для возврата на страницу ивента
function returntoPage() {

    let page = getCookie('page');
    if (typeof page=="undefined"){
        document.getElementById("returntoPage").href = "/";
    }
    else{
        document.getElementById("returntoPage").href = page;
    }
    
    deleteCookie('page')

    document.getElementById("returntoPage").style.color = "red";
    document.getElementById("returntoPage").text = "Ты в системе! \r\nНажми, чтобы Вернуться на страницу"
    document.getElementById("errorMessage").style.visibility = "hidden"
    document.getElementById("returntoPage").style.visibility = "visible";



}