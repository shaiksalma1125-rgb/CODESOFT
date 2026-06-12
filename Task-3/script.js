const display = document.getElementById("display");

function appendValue(value){
    display.value += value;
}

function clearDisplay(){
    display.value = "";
}

function deleteLast(){
    display.value = display.value.slice(0,-1);
}
function appendParentheses() {
    let value = display.value;

    let open = (value.match(/\(/g) || []).length;
    let close = (value.match(/\)/g) || []).length;

    if (open === close) {
        display.value += "(";
    } else {
        display.value += ")";
    }
}
function calculate(){
    try{
        display.value = eval(display.value);
    }
    catch(error)
    {
        display.value = "Error";
    }
}