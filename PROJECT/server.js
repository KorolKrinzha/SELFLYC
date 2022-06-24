import { resolve, dirname, join } from "path";
import { existsSync, createWriteStream, readFileSync } from "fs";
import express from "express";
import { mainGenerate, generateFromSite } from "./generate.mjs";
import favicon from "serve-favicon";
import { SITEPORT, SITELINK, scoreSite, key_path, cert_path } from "./env.js";
import morgan from "morgan";
import https from "https";
import http from "http";
import helmet from "helmet";

const app = express();

const __dirname = resolve(dirname(""));
const PORT = SITEPORT ?? 80;
const LINK = SITELINK ?? "localhost";
const ROUTE = __dirname + "/src/html/";

// Публичные папки - статичные файлы и скрипты
app.use("/dist", express.static(resolve(__dirname, "dist")));
app.use("/src", express.static(resolve(__dirname, "src")));
app.use("/.well-known", express.static(resolve(__dirname, ".well-known")));
app.use(express.static("public_root"));

// Отображение иконки
app.use(favicon(join(__dirname, "src", "images", "SELF_icon.ico")));

// Защита от уязвимостей
app.use(helmet.hsts());
app.use(helmet.hidePoweredBy());

// Логи будут храниться в access.log
let accessLogStream = createWriteStream(join(__dirname, "access.log"), {
  flags: "a",
});

// Что будут отображать логи
app.use(
  morgan(
    ':remote-addr - :remote-user \
  [:date[clf]]\
  ":method :url HTTP/:http-version" \
  :status \
  :res[content-length]\
   ":referrer" ',
    {
      stream: accessLogStream,
    }
  )
);

// ---Пути сайта---

app.get("/", (req, res) => {
  res.sendFile(ROUTE + "index.html");
});
// Регистрация
app.get("/sign", (req, res) => {
  res.sendFile(ROUTE + "sign.html");
});
// Логин
app.get("/login", (req, res) => {
  res.sendFile(ROUTE + "login.html");
});
// Личный счет
app.get("/userscore", (req, res) => {
  res.sendFile(ROUTE + "userscore.html");
});

// Таблица лидеров
app.get(`/admin/${scoreSite}/scoreboard`, (req, res) => {
  res.sendFile(ROUTE + "scoreboard.html");
});

let adminRouter = express.Router();
let qrRouter = express.Router({
  mergeParams: true,
});
adminRouter.use("/:userId/QR", qrRouter);

// Если просто /admin - 404
adminRouter.route("/").get(function (req, res) {
  res.status(404).sendFile(ROUTE + "404.html");
});
// Генерим QR-код и сайт по id ивента
adminRouter.route("/:userId").get(function (req, res) {
  // Админ-панель

  if (req.params.userId == scoreSite) {
    res.sendFile(ROUTE + "score.html");
  } else {
    mainGenerate(req.params.userId).finally(function () {
      res.set("Content-Type", "text/html");
      res.status(
        200
      ).send(`<h3 style="white-space: pre-line;">Ура! Новый QR-код создан. \n
      Ищи его <a href="${LINK}:${PORT}/admin/${req.params.userId}/QR"> по этой ссылке </a>
      Покажи QR-код лицеисту, чтобы он смог отсканировать свой QR-код и получить балл. \n
      Ссылка дублирована: ${LINK}:${PORT}/admin/${req.params.userId}/QR
      </h3>`);
    });
  }
});
// QR на рандомный сайт ивента указанного id
qrRouter.route("/").get(function (req, res) {
  res.status(200).sendFile(__dirname + `/src/qr/${req.params.userId}.svg`);
});
app.use("/admin", adminRouter);

// Если просто /events - 404
let eventsRouter = express.Router();
eventsRouter.route("/").get(function (req, res) {
  res.status(404).sendFile(ROUTE + "404.html");
});
// Рандомная страница ивента
eventsRouter.route("/:eventId").get(function (req, res) {
  // получаем url запроса - это имя рандомного html файла
  const file = `${ROUTE}tmps/${req.url.slice(1)}.html`;

  // отправляем страницу, если такая есть
  // иначе not found
  if (existsSync(file)) {
    res.sendFile(file);
    generateFromSite(req.url.slice(1));
  } else {
    res.status(404).sendFile(ROUTE + "404.html");
  }
  console.log(file);
});

app.use("/events", eventsRouter);

// Остальные запросы - not found
app.get("*", function (req, res) {
  res.status(404).sendFile(ROUTE + "404.html");
});

// HTTP старт
const httpServer = http.createServer(app);
httpServer.listen(80, () => {
  console.log("HTTP Server running on port 80");
});

// HTTPS старт

const httpsServer = https.createServer(
  {
    key: readFileSync(key_path),
    cert: readFileSync(cert_path),
  },
  app
);
httpsServer.listen(PORT, () => {
  console.log(`HTTPS Server running on port ${PORT}`);
});
