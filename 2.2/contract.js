class Contract extends HTMLElement {
    constructor() {
        super();


        const data = 
            {
              "contract": {
                "administrativeData": {
                    "validFrom": "2021-01-01",
                },
                "contractModules": {
                    "HOUSEHOLD": {
                        "key": "HOUSEHOLD",
                        "name": "Household Contents",
                        "comments": "The flat of the policy holder is 100 square meters"
                    },
                    "BICYCLE": {
                        "key": "BICYCLE",
                        "name": "Bicycle",
                        "comments": "The policyholder is happy to insure his new E-Bike also within the contract"
                    }
                }
              }
            }
  
        const { administrativeData, contractModules } = data.contract;

        this.state = {
            validFrom: administrativeData.validFrom,
            householdKey: contractModules.HOUSEHOLD.key,
            householdName: contractModules.HOUSEHOLD.name,
            householdComments: contractModules.HOUSEHOLD.comments,
            bicycleKey: contractModules.BICYCLE.key,
            bicycleName: contractModules.BICYCLE.name,
            bicycleComments: contractModules.BICYCLE.comments,       
        };


        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `<slot></slot>`;

        this.addEventListener('update-household', this.onUpdateHousehold);
        this.onUpdateHousehold = this.onUpdateHousehold.bind(this);
        this.addEventListener('update-bicycle', this.onUpdateBicycle);
        this.onUpdateBicycle = this.onUpdateBicycle.bind(this);
        this.addEventListener('update-validfrom', this.onUpdateDate);
        this.onUpdateDate = this.onUpdateDate.bind(this);
    };

    connectedCallback() {
        this.updateChildren();
    };

    onUpdateHousehold(event) {
        this.state.householdComments = event.detail.value;
        this.updateChildren();
    };

    onUpdateBicycle(event){
        this.state.bicycleComments = event.detail.value;
        this.updateChildren();
    };

    onUpdateDate(event){
        this.state.validFrom = event.detail.value;
        this.updateChildren();
    };

    updateChildren() {
        this.querySelector('household-data').householdComments = this.state.householdComments;
        this.querySelector('bicycle-data').bicycleComments = this.state.bicycleComments;
        this.querySelector('admin-data').validFrom = this.state.validFrom;
        this.querySelector('debug-data').jsonData = this.state;
    };
}

export default Contract