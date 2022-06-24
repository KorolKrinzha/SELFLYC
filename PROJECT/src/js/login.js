import {
    initializeApp
} from 'firebase/app';
import {
    getAuth,
    signInWithEmailAndPassword
} from 'firebase/auth';
import {
    getFirestore
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



// Считываем форму логина
const signInForm = document.querySelector('.signin');
signInForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = signInForm.email.value;
    const password = signInForm.password.value;
    // Берем почту и пароль
    // Выполняем signin 
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            setCookie('uuid', String(user.uid), {
                'path': '/',
                'expires': 'Tue, 19 Jan 2038 03:14:07 GMT'
                
            })
            signInForm.reset();
            returntoPage();
        })
        .catch((error) => {
             // ---Обработка ошибок--- 
            document.getElementById("errorMessage").style.visibility = "visible"
            if (error.code == "auth/user-not-found") {
                document.getElementById("errorMessage").text = "Пользователь не найден"
            } else {
                document.getElementById("errorMessage").text = "Ошибка при регистрации"
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
    document.getElementById("returntoPage").text = "Ты в системе! \r\nНажми, чтобы Вернуться на страницу";
    document.getElementById("errorMessage").style.visibility = "hidden";
    document.getElementById("returntoPage").style.whiteSpace = "pre-line";
    document.getElementById("returntoPage").style.visibility = "visible";



}