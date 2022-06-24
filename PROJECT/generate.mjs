import pkg from "@cheprasov/qrcode";
import { initializeApp } from "firebase/app";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { constants, copyFile, unlink, writeFile } from "fs";
import {
  apiKey,
  appId,
  authDomain,
  measurementId,
  messagingSenderId,
  projectId,
  SITELINK,
  SITEPORT,
  storageBucket,
} from "./env.js";
const { QRCodeCanvas, QRCodeSVG } = pkg;

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

// Генерим html-файл по шаблону template.html в корне проекта
function generateSite(filename) {
  const destFile = `./src/html/tmps/${filename}.html`;
  const sourceFile = "./template.html";
  copyFile(
    sourceFile,
    destFile,
    constants.COPYFILE_EXCL | constants.COPYFILE_FICLONE,
    (err) => {
      if (err) throw err;
    }
  );
}

// Генерим QR-код в виде svg файла. Он будет доступен волонтерам
function generateQRcode(link, filename, title = "SELF") {
  // В виде содержимого SVG файла указываем ссылку на рандомную страницу link
  const qrSVG = new QRCodeSVG(`${SITELINK}:${SITEPORT}/events/${link}`, {
    level: "H",
  });
  let fileContent = String(qrSVG);

  // ---Эти все манипуляции нужны, чтобы разместить надпись ивента в центре кода---
  let ViewBoxstring = fileContent.match(
    `viewBox="0 0 [0-9][0-9] [0-9][0-9]"`,
    "g"
  )[0];

  //записываем размеры X и Y svg
  let ViewBoxstringX = Number(ViewBoxstring.slice(13, 15));
  let ViewBoxstringY = Number(ViewBoxstring.slice(16, 18));

  //снизу к файлу добавляем пространство - это место для названия ивента
  fileContent = fileContent.replace(
    new RegExp(`viewBox="0 0 [0-9][0-9] [0-9][0-9]"`, "g"),
    `viewBox="0 0 ${ViewBoxstringX} ${ViewBoxstringY + 10}"`
  );

  // к увеличенному svg файлу добавляем вниз название
  fileContent =
    fileContent.slice(0, -6) +
    `<text x="${ViewBoxstringX / 2}" y="${ViewBoxstringY + 7}" 
    alignment-baseline="middle" font-size="5px" 
    stroke-width="0" stroke="#000"
     text-anchor="middle">${title}</text>` +
    fileContent.slice(-6);

  // Записываем файл в папку с кодами
  let filepath = `./src/qr/${filename}.svg`;
  writeFile(filepath, fileContent, (err) => {
    if (err) throw err;
  });

  return fileContent;
}

// Генерация рандомного имени файла/url
function generateLink() {
  const allCapsAlpha = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
  const allLowerAlpha = [..."abcdefghijklmnopqrstuvwxyz"];
  const allNumbers = [..."0123456789"];

  const base = [...allCapsAlpha, ...allNumbers, ...allLowerAlpha];
  const len = 28;
  const result = [...Array(len)]
    .map((i) => base[(Math.random() * base.length) | 0])
    .join("");

  return result;
}

// Очищаем папку от мусора - старых qr кодов и страниц сайта
function clearTrash(link, svgname) {
  // удаление страницы
  unlink(`./src/html/tmps/${link}.html`, (err) => {
    if (err);
    console.log(`File ${link}.html deleted`);
  });
  // удаление qr-кода
  unlink(`./src/qr/${svgname}.svg`, (err) => {
    if (err);
    console.log(`File ${svgname}.svg deleted`);
  });
}

// Генератор сайта админки. По id ивента создаем новый сайт
async function mainGenerate(event_id) {
  const docRef = doc(db, "events", event_id);
  // зпрос к бд ивента
  const docSnap = await getDoc(docRef);

  // удаляем мусор
  clearTrash(docSnap.data().link, docSnap.id);

  const eventRef = doc(db, "events", event_id);
  const new_link = generateLink(); // новая ссылка
  const eventTitle = docSnap.data().title; // название ивента - будет использовано в QR коде

  // обновляем ссылку а затем генерим код и страницу
  await updateDoc(eventRef, {
    link: new_link,
  }).then(function () {
    // After setting up link generate new QR and Sites
    generateQRcode(new_link, event_id, eventTitle);
    generateSite(new_link); // New filename so that links change
  });
}

// ! Часть с автогенерацией
// Необходимо, чтобы страница была полностью одноразовый
// Одно посещение и страница удаляется
// Так мы не зависим от беспечных волонтеров

// По имени сайта получаем его id
async function getEventId(site) {
  const q = query(collection(db, "events"), where("link", "==", site));
  const querySnapshot = await getDocs(q);

  let siteEvent = [];
  querySnapshot.forEach((doc) => {
    siteEvent.push(doc.id);
  });
  // возвращаем id
  return siteEvent;
}
// По имени сайта получаем его название
async function getEventTitle(site) {
  const q = query(collection(db, "events"), where("link", "==", site));
  const querySnapshot = await getDocs(q);

  let siteEvent = [];
  querySnapshot.forEach((doc) => {
    siteEvent.push(doc.data().title);
  });
  // возвращаем название ивента
  return siteEvent;
}

// когда пользователь заходит на страницу ивента, запускается этот скрипт
async function generateFromSite(site) {
  // id по url
  const eventId = await getEventId(site);
  const eventTitle = await getEventTitle(site);
  const event_id = eventId[0];

  // Запрос к бд по id
  const eventRef = doc(db, "events", event_id);
  const docSnap = await getDoc(eventRef);
  console.log(docSnap.data().static);

  // ! Порой бывает, что нам нужно, чтобы ссылка не менялась
  // Например, на лекциях и тому подобное
  // Поэтому, если в бд у ивента static = true, мы ничего не обновляем
  if (docSnap.data().static != true) {
    // ---Создание нового сайта---

    clearTrash(docSnap.data().link, docSnap.id);
    // Старая ссылка - нынешний сайт.
    //А к новой ссылке доступ получит новый пользователь
    const new_link = generateLink();
    await updateDoc(eventRef, {
      link: new_link,
      old_link: site,
    }).then(function () {
      // Генерация кода и страницы
      generateQRcode(new_link, event_id, eventTitle);
      generateSite(new_link);
    });
  } else {
    // В статике обновляем разве что old_link
    // ведь в index.js мы до сих пор делаем запросы именно к этому параметру

    await updateDoc(eventRef, {
      old_link: site,
    });
  }
}

export { mainGenerate, generateFromSite };
