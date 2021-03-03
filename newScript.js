const table = document.getElementById("historyTable");
const addAmount = document.getElementById("expanseAmount");
const addDate = document.getElementById("expanseDate");
const addCategory = document.getElementById("expanseCategory");
const addDescription = document.getElementById("expanseDescription");
var allExpanses = [];

var summaryAllValue = 0;
var summaryMonthValue = 0;
var summaryFoodValue = 0;
var summaryRentValue = 0;
var summaryTravelValue = 0;
var summaryOthersValue = 0;

const summaryAll = document.getElementById("summaryAll");
const summaryMonth = document.getElementById("summaryMonth");
const summaryFood = document.getElementById("summaryFood");
const summaryRent = document.getElementById("summaryRent");
const summaryTravel = document.getElementById("summaryTravel");
const summaryOthers = document.getElementById("summaryOthers");


//Expanse constructor function
function Expanse(amount, category, date, description) {
    this.amount = amount;
    this.category = category;
    this.date = date;
    this.description = description;
}

window.addEventListener('load', function() {
    summaryAll.innerHTML = 0;
    summaryMonth.innerHTML = 0;
    summaryFood.innerHTML = 0;
    summaryRent.innerHTML = 0;
    summaryTravel.innerHTML = 0;
    summaryOthers.innerHTML = 0;
    refreshExpanses();
});

function refreshExpanses() {
    for (var i = 0; i < localStorage.length; i++){
        if(!allExpanses.includes(localStorage.key(i)) && localStorage.key(i) !== "expanseIndex") {
            allExpanses.push(localStorage.key(i));

            var currentExpanse = JSON.parse(localStorage.getItem(localStorage.key(i)));
            let newRow = document.createElement("tr");
            newRow.setAttribute("class", "row");

            let id = document.createElement("input");
            id.setAttribute("type", "hidden")
            id.setAttribute("value", localStorage.key(i));
            id.appendChild(document.createTextNode(localStorage.key(i)));
            let newAmount = document.createElement("td");
            newAmount.appendChild(document.createTextNode(currentExpanse.amount + "$"));

            let newCategory = document.createElement("td");
            newCategory.appendChild(document.createTextNode(currentExpanse.category));

            let newDate = document.createElement("td");
            newDate.appendChild(document.createTextNode(currentExpanse.date));

            let newDescription = document.createElement("td");
            newDescription.appendChild(document.createTextNode(currentExpanse.description));
            newDescription.setAttribute('class', 'description');

            let newDelete = document.createElement("td");
            newDelete.appendChild(document.createTextNode("Delete"));
            newDelete.setAttribute('class', 'delete');
            newDelete.setAttribute("onclick", "deleteRow(this)")

            newRow.append(id);
            newRow.appendChild(newAmount);
            newRow.appendChild(newCategory);
            newRow.appendChild(newDate);
            newRow.appendChild(newDescription);
            newRow.appendChild(newDelete);
            table.insertBefore(newRow,table.children[1]);
            calculateSummaries(currentExpanse);
            console.log("test log");
        }
    }
}


function calculateSummaries(expanse) {
    var currentExpanseValue = parseFloat(expanse.amount);
    var currentExpanseDate = new Date(expanse.date);
    var now = new Date();

    summaryAllValue += currentExpanseValue;
    summaryAll.innerHTML = summaryAllValue;

    if(now.getMonth() === currentExpanseDate.getMonth()){
        summaryMonthValue += currentExpanseValue;
        summaryMonth.innerHTML = summaryMonthValue;

    }
    switch(expanse.category) {
        case "food":
            summaryFoodValue += currentExpanseValue
            summaryFood.innerHTML = summaryFoodValue;
            break;
        case "rent":
            summaryRentValue += currentExpanseValue
            summaryRent.innerHTML = summaryRentValue;
            break;
        case "travel":
            summaryTravelValue += currentExpanseValue
            summaryTravel.innerHTML = summaryTravelValue;
            break;
        case "others":
            summaryOthersValue += currentExpanseValue
            summaryOthers.innerHTML = summaryOthersValue;
            break;
    }
}
//Adding new Expanse to database and table
function addExpanse(context) {
    if(addAmount.value === "" || addDate.value === "") {
        return false;
    }

    if(localStorage.getItem("expanseIndex") === null){
        localStorage.setItem("expanseIndex","1");
    }

    let index = parseInt(localStorage.getItem("expanseIndex"));

    var expanse = new Expanse(addAmount.value, addCategory.value, addDate.value, addDescription.value);
    addAmount.value = "";
    addCategory.value = "";
    addDate.value = "";
    addDescription.value = "";
    localStorage.setItem(`expanse${index}`,JSON.stringify(expanse));

    index++;
    localStorage.setItem("expanseIndex", index);
    refreshExpanses();



}

function deleteRow(context) {
    var indexValue = context.parentNode.children[0].value;
    allExpanses = allExpanses.filter(function(value, index, array) {
        if (value === indexValue) {
            return false;
        }else return true;
    });
    console.log(allExpanses);
    var i = context.parentNode.rowIndex;
    table.deleteRow(i);
    localStorage.removeItem(indexValue);
}


function changeDate(context) {
    const id = context.id;
    if(id === "todayButton") {
        var now = new Date();

        var day = ("0" + now.getDate()).slice(-2);
        var month = ("0" + (now.getMonth() + 1)).slice(-2);

        var today = now.getFullYear()+"-"+(month)+"-"+(day) ;

        addDate.value = today;
    }else{
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        var day = ("0" + yesterday.getDate()).slice(-2);
        var month = ("0" + (yesterday.getMonth() + 1)).slice(-2);

        var yes = yesterday.getFullYear()+"-"+(month)+"-"+(day) ;

        addDate.value = yes;
    }
}
