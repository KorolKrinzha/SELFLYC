const LINK = "https://selflyc.ru";
const PORT = 443

class Header extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
        <style>
        @import url(/src/css/style.css)        
        </style>
        <header>
    <nav class="navbar-SELF" role="navigation">
      <div class="container-fluid">
        <a class="navbar-brand" href="/">
          <img src="/src/svg/SELF_icon.svg" width="40" height="40" class="d-inline-block align-center" alt="">
          SELF
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
              <a class="nav-link align-center" href="${LINK}:${PORT}/userscore">Баллы</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="${LINK}:${PORT}/#events">Расписание</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="${LINK}:${PORT}/sign">Регистрация</a>
            </li>
          </ul>

        </div>
      </div>
    </nav>
  </header>
      `;
    }
}
customElements.define('header-component', Header);