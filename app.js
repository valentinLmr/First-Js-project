const budgetController = (function() {
  const Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

   const Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };



  let data = {
        allItems: {
          exp:[],
          inc: []
        },
        totals: {
          exp: 0,
          inc: 0
        }
  };

  return {
    addItem: function(type, desc, val){

    let newItem, id;

    if(data.allItems[type].length > 0) {
      id = data.allItems[type][data.allItems[type].length -  1].id + 1;
    }else {
      id = 1;
    }

      if (type === 'exp'){
        newItem = new Expense(id, desc, val);
      }else if (type === 'inc'){
        newItem = new Income(id, desc, val);
      }


      data.allItems[type].push(newItem);
      return newItem;
    }
  }
})();





const userController = (function() {

  const DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    btnValue: '.add__btn'
  }

  return {
    getinput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // will be either "inc" or "exp"
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value
      }
    },
    getDOMstrings: function() {
      return DOMstrings;
    }
  }
})();


const controller = (function(budgetCtrl, userCtrl) {

  const setupEventListener = function() {
    const DOM = userCtrl.getDOMstrings();
    document.querySelector(DOM.btnValue).addEventListener("click", ctrlAddItem);
    document.addEventListener("keypress", function(event){
      if (event.keyCode === 13 || event.which === 13){
        ctrlAddItem();
      }
    });
  }


  const ctrlAddItem = function() {

  let input, newItem;

   input = userCtrl.getinput();

   newItem = budgetCtrl.addItem(input.type, input.description, input.value);

  }

  return {
    init: function() {
      setupEventListener();
    }
  }
})(budgetController, userController);

controller.init();

