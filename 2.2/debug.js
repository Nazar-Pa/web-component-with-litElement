import { html, render } from "../node_modules/lit-html/lit-html.js";

class Debug extends HTMLElement {
    constructor() {
        super();   
        
        this.props = {
          jsonData: ""
        }

        this.attachShadow({ mode: 'open' });

        const template = html `
        <style>
          :host {
            display: flex;
            margin-top: 20px;
            width: 770px;
          }
          #jsonData{
            line-height: 30px;
            font-weight: 300;
          }
        </style>
        </br>
        <h3 id="jsonData"></h3>
        `

        render(template, this.shadowRoot)
    }


    connectedCallback() {
        console.log('props', this.props);
        Object.keys(this.props).forEach((propName) => {
          if (this.hasOwnProperty(propName)) {
            let value = this[propName];
            delete this[propName];
            this[propName] = value;
          }
        });
        
        this.updateChildren();
    }
      
     
      set jsonData(value) {
        this.props.jsonData = value;        
        this.updateChildren();
      }
      
      get jsonData() {
        return this.props.jsonData;
      }


    updateChildren() {   
      this.shadowRoot.querySelector('#jsonData').innerText = JSON.stringify(this.props.jsonData);
    }
}

export default Debug