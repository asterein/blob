class Component extends HTMLElement {
  constructor() {
     // Initiate the shadow DOM
     super();
     this.attachShadow({ mode: 'open'});
  }
  connectedCallback () {
    // Props
    this.blob = this.getAttribute('blob');
    this.index = this.getAttribute('index');
    this.name = this.getAttribute('name');
    this.render();
  }

  render () {
    // Create base container
    const container = document.createElement('div');
    container.classList.add('blob-card');
    this.shadowRoot.appendChild(container);

    // Create blob header
    const header = document.createElement('div');
    header.classList.add('blob-header');
    header.innerHTML = `
      <div>${this.name.split(".blob")[0]}</div>
      <div>#${this.index}</div>
    `;

    // Create blob text
    const blob = document.createElement('div');
    blob.classList.add('blob-text');
    blob.innerText = this.blob;

    // Append
    container.appendChild(header);
    container.appendChild(blob);
    this.addStyling();
  }

  addStyling () {
    const style = document.createElement('style');
    style.textContent = `
      :host, :host * {
        box-sizing: border-box;
        padding: 0;
        margin: 0 auto;
      }

      .blob-card {
        display: block;
        padding: 4rem 2rem 2rem 2rem;
        border-radius: 3px;
        outline: 1px solid var(--white);
        overflow: hidden;
        position: relative;
        margin: 1.5rem auto;
      }

      .blob-header {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
        padding: 0.5rem 2rem;
        outline: 1px solid var(--white);
        font-weight: bold;
        display: flex;
        justify-content: space-between;
      }

      .blob-header > div {
        width: 50%;
      }

      .blob-header > div:last-child {
        text-align: right;
      }
    `;
    this.shadowRoot.appendChild(style);
  }
}

customElements.define('blob-card', Component);
