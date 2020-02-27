const budgetController = (function() {

  const Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

   const Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  Expense.prototype.calcPercentage = function(totalIncome){
    if (totalIncome > 0){
    this.percentage = Math.round((this.value/ totalIncome) * 100);
    } else {
    this.percentage = -1;
    }
   }

  Expense.prototype.getPercentages = function(){
    return this.percentage;
  }

  const calculateTotal = function(type){
    let sum = 0;
    data.allItems[type].forEach((e) => {
      sum += e.value;
    });
    data.totals[type] = sum;
  }





  let data = {
      allItems: {
        exp:[],
        inc: []
      },
      totals: {
        exp: 0,
        inc: 0
      },
      budget:0,
      percentage: -1,
    }

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
    },
    calculateBudget: function(){
      // calculate income and expenses

      calculateTotal('exp');
      calculateTotal('inc');

      //calculate the budget: income - exepenses

      data.budget = data.totals.inc - data.totals.exp;
      //calculate the percentage of income we spent
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100)
      } else {
        data.percentage = -1;
      }
    },

    calculatePercentage: function() {
      data.allItems.exp.forEach(function(e) {
        e.calcPercentage(data.totals.inc);
      })

    },

    getPercentage: function(){
      let allPers = data.allItems.exp.map(function(e) {
        return e.getPercentages();

      })
    return allPers;
    },

    getBudget: function() {
      return {
          budget: data.budget,
          totalInc: data.totals.inc,
          totalExp: data.totals.exp,
          percentage: data.percentage
      }
    },

    deleteItem: function(type, ID) {
      let ids, index;

        ids = data.allItems[type].map(function(current) {
          return current.id;
        })
        index = ids.indexOf(ID);
        if (index !== -1 ){
          data.allItems[type].splice(index, 1);
        }
    }
  }
})();











const userController = (function() {

  const DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    btnValue: '.add__btn',
    incomeHtml:'.income__list',
    expenseHtml:'.expenses__list',
    budgetValue: '.budget__value',
    budgetIncomeValue: '.budget__income--value',
    budgetExpensesValue: '.budget__expenses--value',
    budgetPercentageValue: '.budget__expenses--percentage',
    container: '.container',
    expPercentage:'.item__percentage',
    dateLabel: '.budget__title--month'
  }

  const formatNumber = function(num,type) {

      let numSplit, int, dec, sign;

      num = Math.abs(num);
      num = num.toFixed(2);
      numSplit =  num.split('.');
      int = numSplit[0];
      if (int.length > 3) {
        int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3 , int.length);
      }
      dec = numSplit[1]
      return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

    };

  return {
    getinput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // will be either "inc" or "exp"
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      }
    },

    addListItem: function (obj, type){

      //create HTML string with placeholder text
      let html, newHtml;
        if(type === 'inc'){
          element = DOMstrings.incomeHtml;
          html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
        } else if (type === 'exp'){
          element = DOMstrings.expenseHtml;
          html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
        }

      // replace placeholder text with some actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));


      //insert HTML
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

    },

    deleteListItem: function(selectId) {
      console.log(selectId)
        let element = document.getElementById(selectId);
        console.log(element);
        element.parentNode.removeChild(element);
    },

    clearFields: function() {
      let fields, fieldsArr;

      fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach((current) => {
          current.value = "";
      });

      fieldsArr[0].focus();
    },
    displayBudget: function(obj){
      let type;
      obj.budget > 0 ? type = "inc" : type = "exp";
      document.querySelector(DOMstrings.budgetValue).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMstrings.budgetIncomeValue).textContent = formatNumber(obj.totalInc, 'inc');
      document.querySelector(DOMstrings.budgetExpensesValue).textContent = formatNumber(obj.totalExp, 'exp');
      if(obj.percentage > 0){
      document.querySelector(DOMstrings.budgetPercentageValue).textContent = obj.percentage + '%';
      } else {
      document.querySelector(DOMstrings.budgetPercentageValue).textContent ='---';
      }
    },

    displayPercentages: function(percentages) {
      let fields = document.querySelectorAll(DOMstrings.expPercentage);

      let nodeListForEach = function(list, callback) {
        for (i = 0; i < list.length; i++) {
          callback(list[i], i)
        }
      };

      nodeListForEach(fields, function(current, index) {
        if(percentages[i] > 0){
        current.textContent = percentages[index] + '%'
        }else{
        current.textContent = '---';
        }
      })

    },

    displayMonth: function(){
        let now, year, month;
        now = new Date();
        months = ['January', "February", 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        month = now.getMonth();
        year = now.getFullYear();

        document.querySelector(DOMstrings.dateLabel).textContent = months[month - 1] + ' ' + year;

    },

    getDOMstrings: function() {
      return DOMstrings;
    }
  };
})();


const controller = (function(budgetCtrl, userCtrl) {

  const setupEventListener = function() {
    const DOM = userCtrl.getDOMstrings();
    document.querySelector(DOM.btnValue).addEventListener("click", ctrlAddItem);
    document.addEventListener("keypress", function(event){
      if (event.keyCode === 13 || event.which === 13){
        ctrlAddItem();
      }
      document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    });
  }

  const updateBudget = function() {
    //1. calcul the budget
    budgetCtrl.calculateBudget();

    //2. return the budget

    let budget = budgetCtrl.getBudget();



    //3. display the budget
    userCtrl.displayBudget(budget);
  };

  const updatePercentages = function (){
    //1. calcul percentage

    budgetCtrl.calculatePercentage();

    //2.return it
    let percentage = budgetCtrl.getPercentage();

    //3. update the user interface
      userCtrl.displayPercentages(percentage);

  };


  const ctrlAddItem = function() {

    let input, newItem;

    //1. Get the field input data
   input = userCtrl.getinput();
    if(input.description !== "" && !isNaN(input.value) && input.value > 0){
      //2. add item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      //3. add the item to the UI
      userCtrl.addListItem(newItem, input.type);

      //4. Clear fields value
      userCtrl.clearFields();

      // 5. Calculate and update the budget
      updateBudget();
      updatePercentages();
    }
  }

  const ctrlDeleteItem = function(event) {
   let itemID;

   itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
   if(itemID){
      splitID = itemID.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]);

      //1. delete the item from the data
        budgetCtrl.deleteItem(type, ID);

      //2. delete the item from the UI
        userCtrl.deleteListItem(itemID);

      //3. update and show the new budget
      updateBudget();
   }
  };

  return {
    init: function() {
      userCtrl.displayMonth();
      userCtrl.displayBudget(
          {
          budget: 0,
          totalInc: 0,
          totalExp: 0,
          percentage: 0

      }
          );
      setupEventListener();
    }
  }
})(budgetController, userController);

controller.init();

