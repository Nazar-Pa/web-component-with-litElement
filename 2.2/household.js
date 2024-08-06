import { html, render } from "../node_modules/lit-html/lit-html.js";

class HouseHold extends HTMLElement {
    constructor() {
        super();

        this.props = {
          householdComments: ""
        }

        this.state = {};

        this.attachShadow({ mode: 'open' });

        const template = html`
        <style>
          :host {
            display: flex;
            margin-top: 20px;
            height: 70px;
          }
          .text{
            font-size: 1.2rem;
            line-height: 70px;
            margin-right: 20px;
            font-weight: 800;
          }
          #comments{
            font-size: 1.1rem;
          }
        </style>
        <label class="text">House hold comments:</label>
        <textarea id="comments" placeholder="Comments..." rows="4" cols="55"></textarea>
        `;

        render(template, this.shadowRoot)
        this.shadowRoot.querySelector('#comments').addEventListener('input', this.onUpdateHousehold);
        this.onUpdateHousehold = this.onUpdateHousehold.bind(this);
    }


    connectedCallback = () => {
        Object.keys(this.props).forEach((propName) => {
          if (this.hasOwnProperty(propName)) {
            let value = this[propName];
            delete this[propName];
            this[propName] = value;
          }
        });
        this.updateChildren();
      }
      
      set householdComments(value) {
        this.props.householdComments = value;
        this.updateChildren();
      }
      
      get householdComments() {
        return this.props.householdComments;
      }

      onUpdateHousehold = (event) => {
        const value = event.target.value;
        this.dispatchEvent(new CustomEvent('update-household', {
          bubbles: true,
          composed: true,
          detail: {
            value,
          },
        }));
      };


      updateChildren = () => {
        this.shadowRoot.querySelector('#comments').value = this.props.householdComments;
      };
}

export default HouseHold