class Footer extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
        <style>
        @import url(/src/css/style.css)        
        </style>
        <footer class="footer-SELF">
            <p>SELF X LYCEUM</p>
        </footer>
      `;
  }
}
customElements.define("footer-component", Footer);
