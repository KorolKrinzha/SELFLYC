class Meta extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
      
        `
    }
}
customElements.define('meta-component', Meta);