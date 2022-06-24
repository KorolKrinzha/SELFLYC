import { initializeApp } from "firebase/app";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  increment,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getCookie } from "./cookieutilities.js";
import {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId,
  SITELINK,
  SITEPORT,
} from "../../env.js";

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
  measurementId: measurementId,
};
initializeApp(firebaseConfig);
const db = getFirestore();

// Добавляем куки
// Это нужно, чтобы после регистрации пользователь вернулся
const addComebackPage = () => {
  document.cookie = `page=${document.location.pathname}; path=/; expires=Tue, 19 Jan 2038 03:14:07 GMT`;
  return;
};

async function addPoint() {
  let uuid = getCookie("uuid");
  // в куки записан id пользователя
  // проверяем, есть ли такой в бд
  try {
    const docRef = doc(db, "users", uuid);
    const docSnap = await getDoc(docRef);

    // проверка на существование пользователя
    if (docSnap.exists()) {
      let user = docSnap.data();
      let site = document.location.pathname;
      // Изначально site = /event/aaaa
      // поэтому мы его делим на части, чтобы использовать link в бд
      site = site.slice(8);

      // Проверка
      // Посетил ли пользователь сайт
      if (!user.sites.includes(site)) {
        // Только тогда, когда узнаем, что юзер впервые здесь
        // * Это нужно, чтобы сайту прибавлялось только уникальное посещение

        let eventId = await getId(site);
        let value = await getValue(eventId);
        let eventTitle = await addVisit(eventId);

        // Проверяем, есть ли у ивента поле value и title
        // если нет - ставим дефолт
        if (typeof value != "number") {
          value = 1;
        }
        if (typeof eventTitle != "string") {
          eventTitle = "default";
        }

        // ---Запрос к документу пользователя---
        // count: Плюс баллы за посещение
        // sites:
        //Посещенный сайт идет в список
        // он уже не считается для пользователя уникальным
        // events: Имя ивента

        await updateDoc(docRef, {
          count: increment(value),
          sites: arrayUnion(site),
          events: arrayUnion(eventTitle),
        });
      } else {
        // Ничего не делаем,
        //если пользователь уже был
      }
    } else {
      // Кидаем на регистрацию
      // если пользователя не существует

      addComebackPage();
      location.href = `${SITELINK}:${SITEPORT}/sign`;
    }
  } catch (err) {
    // Кидаем на регистрацию
    // если произошла ошибка
    console.log(err);
    addComebackPage();
    location.href = `${SITELINK}:${SITEPORT}/sign`;
  }
}
addPoint();

// id по ссылке
async function getId(site) {
  const q = query(collection(db, "events"), where("old_link", "==", site));
  const querySnapshot = await getDocs(q);

  let singleEvent = [];
  querySnapshot.forEach((doc) => {
    singleEvent.push(doc.id);
  });

  // возвращаем id ивента
  let singleEventId = singleEvent[0];

  return singleEventId;
}

// узнаем ценность ивента по его ссылке
async function getValue(id) {
  const eventRef = doc(db, "events", id);
  const docSnap = await getDoc(eventRef);
  let eventValue = docSnap.data().value;

  return eventValue;
}

// добавляем ивенту посещение и получаем его название
async function addVisit(id) {
  const eventRef = doc(db, "events", id);

  // +1 посещение
  await updateDoc(eventRef, {
    visits: increment(1),
  });

  // название ивента
  const docSnap = await getDoc(eventRef);
  let eventTitle = docSnap.data().title;

  // функция возвращает имя ивента
  // оно будет добавлено в массив events посетившего пользователя
  return eventTitle;
}
