import { html, render } from "../node_modules/lit-html/lit-html.js";

 const template = html`
  <style>
  * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}
.address {
  width: 900px;
  background-color: #e4def3;
  margin: auto;
  height: 300px;
  padding: 40px;
  box-shadow: 0 1px 27px rgba(54, 54, 54, 0.92), 0 1px 20px rgba(0, 0, 0, 0.95);
  border-radius: 7px;
  margin-bottom: 30px
}
.plz-stadt {
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-gap: 60px;
  margin: 20px 0 20px 24px;
}
label {
  line-height: 30px;
  font-size: 1.1rem;
}
input {
  width: 100%;
  height: 30px;
  padding-left: 8px;
  font-size: 1rem;
  border: none;
  border-radius: 2px;
  outline: none;
}
.flex {
  display: flex;
  width: 100%;
}
.strasse-haus {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-gap: 60px;
  margin: 20px 0;
}
label {
  margin-right: 10px;
  font-weight: 600;
}
input[type="text"] {
  outline: none;
}
input[type="text"]:focus {
  border: 1px solid rgb(144, 163, 144);
  border-radius: 3px;
}
#myInput {
  border: none;
}
.select-field {
  position: relative;
  width: 100%;
  display: inline-block;
}
.street {
  display: flex;
  border: none;
}
.street:focus-within {
  border: 1px solid rgb(144, 163, 144);
  border-radius: 3px;
}
.down-arrow {
  line-height: 30px;
  width: 30px;
  text-align: center;
  background-color: rgb(255, 255, 255);
  cursor: pointer;
  font-size: 1.7rem;
}
.land {
  margin: 20px 0px 20px 0px;
}
.land label {
  margin-left: 16px;
}
.land input {
  background-color: rgb(202, 187, 212);
}
.dropdown-content {
  position: absolute;
  display: none;
  background-color: #f6f6f6;
  min-width: 230px;
  overflow: auto;
  border: 1px solid #ddd;
  z-index: 1;
  max-height: 60vh;
  animation: 0.5s 1 fadeIn;
}
.show {
  display: block;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  background-color: #ffffff;
  animation: 0.7s 1 fadeIn;
}
.dropdown-content a:hover {
  background-color: rgb(59, 59, 59);
  color: white;
}
.btn{
  margin-bottom: 20px;
  float: right;
  font-weight: 600;
  padding: 5px 15px;
  border: 1px solid #b2b2b3;
  cursor: pointer;  
}
.btn:hover{
  background-color: #8357f1;
  color: #fff;
  border: none'
}
  </style>




  <div class="address">
  <div class="plz-stadt">
  <div class="flex">
      <label>PLZ</label>
      <input type="text" placeholder="Postal code" id="plz">
  </div>
  <div class="flex">
      <label>Stadt</label>
      <input type="text" placeholder="Stadt" id="city">
  </div> 
</div>
<div class="strasse-haus">
  <div class="flex">
      <label>Strasse</label>
      <div class="select-field">
          <div class="street">
      <input type="text" placeholder="Strasse" id="myInput">
      <span id="down-arrow" class="down-arrow">&blacktriangledown;</span>
  </div>
      <div id="myDropdown" class="dropdown-content">
      </div>
  </div>
  </div>
  <div class="flex">
      <label>Hausnummer</label>
      <input type="text" placeholder="Hausnummer" id="hausnummer">
  </div>
</div>
<div class="flex land">
  <label>Land</label>
  <input type="text" placeholder="Land" value="de" disabled=true>
</div>
<button class="btn">Info</button>
<h4 id="info"><h4>
  </div>
`;

class Address extends HTMLElement {

  dropDown;
  input;
  plzInput;
  cityInput;
  hausnummer;
  info;
  fetchedStreets;

  constructor() {
    super();

    this.dropDownList = false;
    this.attachShadow({ mode: 'open' });
    render(template, this.shadowRoot)
    this.dropDown = this.shadowRoot.getElementById("myDropdown")
    this.plzInput = this.shadowRoot.getElementById('plz');
    this.cityInput = this.shadowRoot.getElementById('city');
    this.hausnummer = this.shadowRoot.getElementById('hausnummer');
    this.info = this.shadowRoot.getElementById('info');
    this.input = this.shadowRoot.getElementById("myInput");
  }

 
  fetchData = () => {
    this.displayDropdown('none')
    this.input.value = ''
    
    if(this.plzInput.value === ''){
      this.dropDown.innerHTML = ''
      this.cityInput.value = ''
      sessionStorage.removeItem("response");
    }

    let formData = new URLSearchParams();
    formData.append("finda", "city")
    formData.append("city", this.plzInput.value)
    formData.append("lang", "de_DE")

    let requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    };

    this.getData(requestOptions);
  }

  getData = async requestOptions => {
      const res = await fetch("https://corsanywhere.herokuapp.com/https://www.postdirekt.de/plzserver/PlzAjaxServlet", requestOptions);
      const data = await res.json()
      let response = data.rows;
        if(typeof response !== 'undefined'){
          if(response.length > 0){
            response.slice(0, 1).map(row => {
              if(typeof(Storage) !== "undefined"){
                sessionStorage.setItem("response", JSON.stringify(response))
                this.cityInput.value = row.city
                this.dropDownList = true
                if(typeof row.street !== 'undefined'){
                  this.input.value = row.street
                  this.fetchedStreets = JSON.parse(sessionStorage.getItem("response"))
                  this.showFilteredStreets(this.fetchedStreets)
                }
              }
            })
          }
        }
    }
  

  showFilteredStreets = (result) => {
        if(result.length > 0) {
            const html = result.map(row =>              
                `<a class="link">${row.street}</a>`
            ).join('')
            this.dropDown.innerHTML = html;               
            this.dropDownList ? this.dropDown.style.display = 'block' : this.dropDown.style.display = 'none';
        }
        const slides = this.shadowRoot.querySelectorAll('.link')
        for(let i =0; i<slides.length; i++){
        slides.item(i).addEventListener('click', (e) => this.selectStreet(e))
        }
        
  }

  selectStreet = (e) => {
    this.input.value = e.target.innerText;
    this.displayDropdown('none')
  }

  openStreetsDropdown = () => {
    this.dropDownList = !this.dropDownList
    if(this.dropDownList && sessionStorage.getItem("response") !== null) {
      this.displayDropdown('block')
    } else {
      this.displayDropdown('none')
    }
  }

  filterStreets = () => {
    
    if(this.fetchedStreets !== null){
      let filteredData = [];
      this.fetchedStreets.map(res => {
          if(res.street.toLowerCase().indexOf(this.input.value.toLowerCase()) > -1){
              filteredData.push({
                  "street": res.street})
                  this.showFilteredStreets(filteredData)
          } 
      })
    } 
  }

  getAllEnteredData = () => {
    const plz = this.plzInput.value;
    const city = this.cityInput.value;
    const street = this.input.value;
    const hausnummer = this.hausnummer.value;
    if(!plz || !city || !street || !hausnummer){
      alert("All fields must be filled out")
      return
    }
    let info = {}
    info = {
      plz,
      city,
      street,
      hausnummer, 
      land: "de"
    }
    this.info.innerText = JSON.stringify(info)
  }

  displayDropdown(value){
    this.dropDown.style.display = value
  }

  connectedCallback() {
    this.shadowRoot.querySelector('.down-arrow').addEventListener('click', () => this.openStreetsDropdown())
    this.shadowRoot.getElementById('plz').addEventListener('keyup', () => this.fetchData())
    this.input.addEventListener('keyup', () => this.filterStreets())
    this.shadowRoot.querySelector('.btn').addEventListener('click', () => this.getAllEnteredData())
  }


}

window.customElements.define('address-comp', Address);