import { html, render } from "../node_modules/lit-html/lit-html.js";

class AdminData extends HTMLElement {
    constructor() {
        super();

        this.props = {
            validFrom: ""
          }
  

        this.attachShadow({ mode: 'open' });

        const template = html`
        <style>
        :host{
          margin-left: 108px;
        }
        #validFrom{
          font-size: 1.2rem;
        }
        .text{
          font-size: 1.2rem;
          font-weight: 800;
        }
        </style>
        <label class="text">Valid from:</label>
        <input type="date" id="validFrom"></input>`;

        render(template, this.shadowRoot)
        this.shadowRoot.querySelector('#validFrom').addEventListener('input', this.onUpdateDate);
        this.onUpdateDate = this.onUpdateDate.bind(this);
    }

    connectedCallback() {
        Object.keys(this.props).forEach((propName) => {
          if (this.hasOwnProperty(propName)) {
            let value = this[propName];
            delete this[propName];
            this[propName] = value;
          }
        });
        
        this.updateChildren();
      }
      
      set validFrom(value) {
        this.props.validFrom = value;
        this.updateChildren();
      }
      
      get validFrom() {
        return this.props.validFrom;
      }

      onUpdateDate = event => {
        const value = event.target.value;
        this.dispatchEvent(new CustomEvent('update-validfrom', {
          bubbles: true,
          composed: true,
          detail: {
            value,
          },
        }));
      }


      updateChildren = () => {
        this.shadowRoot.querySelector('#validFrom').value = this.props.validFrom 
      }
}

export default AdminData