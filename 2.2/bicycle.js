import { html, render } from "../node_modules/lit-html/lit-html.js";

class Bicycle extends HTMLElement {
    constructor() {
        super();

        this.props = {
          bicycleComments: ""
        }

        this.attachShadow({ mode: 'open' });

        const template = html`
          <style>
            :host {
              position: relative;
              display: flex;
              margin-left: 34px;
              height: 70px;
            }
            .text{
              font-size: 1.2rem;
              line-height: 70px;
              margin-right: 20px;
              font-weight: 800;
            }
            #bicycleComments{
              font-size: 1.1rem;
            }
          </style>
        <label class="text">Bicycle comments:</label>
        <textarea id="bicycleComments" placeholder="Comments..." rows="4" cols="55"></textarea>
        `;

        render(template, this.shadowRoot)
        this.shadowRoot.querySelector('#bicycleComments').addEventListener('input', this.onUpdateBicycle);
        this.onUpdateBicycle = this.onUpdateBicycle.bind(this);
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
      
      set bicycleComments(value) {
        this.props.bicycleComments = value;
        this.updateChildren();
      }
      
      get bicycleComments() {
        return this.props.bicycleComments;
      }

      onUpdateBicycle = event => {
        const value = event.target.value;
        this.dispatchEvent(new CustomEvent('update-bicycle', {
          bubbles: true,
          composed: true,
          detail: {
            value,
          },
        }));
      }

      updateChildren = () => {
        this.shadowRoot.querySelector('#bicycleComments').value = this.props.bicycleComments;
      }
}

export default Bicycle