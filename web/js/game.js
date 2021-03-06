function getElement(id) {
    item = document.getElementById(id);
    if(item == null) {
        throw "No element found with id " + id;
    }
    itemHeight = item.style.height;
    itemWidth = item.style.width;
    return {
        elem: item,
        height: itemHeight,
        width: itemWidth,
        id: id
    };
}

ws = new WebSocket("ws://192.168.105.49:8080/game");
var clientNumber = -1;
var clientID = "";
var pressedKeys = [];
var playerOne = getElement("player1");
var playerTwo = getElement("player2");

var gemOne = getElement("gem1");
var gemTwo = getElement("gem2");
var gemThree = getElement("gem3");
var gemFour = getElement("gem4");

var botOne = getElement("bot1");
var botTwo = getElement("bot2");
var botThree = getElement("bot3");

var myHealth = getElement("myHealth");
var otherHealth = getElement("otherHealth");
// myHealth.setAttribute("style", "height: 30px; background-color: #ddd; width: 80px;");
// otherHealth.setAttribute("style", "height: 30px; background-color: #ddd; width: 80px;");
var playerHeight = playerOne.height;
var playerWidth = playerOne.width;
var maxTeleports = 10;
var teleports = 0;
ws.onopen = function() {
    console.log("game.html websocket opened");
}

ws.onclose = function() {
    console.log("game.html websocket closed");
    // ws.send(JSON.stringify({etype: "SocketClosedUnexpectedly", object: clientID}));
}

ws.onmessage = function(event) {
    console.log("message received", event.data);
    // var rect = player2_sprite.getBoundingClientRect();
    data = JSON.parse(event.data)
    if(data.etype == "SetClientID") {
        clientNumber = parseInt(data.object);
        clientID = "p" + (clientNumber + 1).toString();
        if(clientNumber == 0) {
            playerOne.elem.style.background = "radial-gradient(green, black)";
            playerTwo.elem.style.background = "radial-gradient(orange, black)";
        } else {
            playerOne.elem.style.background = "radial-gradient(orange, black)";
            playerTwo.elem.style.background = "radial-gradient(green, black)";
        }
        // currentPositions = getCurrentPositions();
        // currentPositions.object = clientID;
        // currentPositions.etype = "Update";
        // console.log("msg as reply to setclientid", JSON.stringify(currentPositions));
        console.log("This client has ID:", clientID, clientNumber);
        // ws.send(JSON.stringify(currentPositions));
    } else if (data.etype == "SendUpdate") {
        currentPositions = getCurrentPositions();
        currentPositions.etype = "Update";
        currentPositions.object = "p1";
        console.log("msg being sent as reply to update", JSON.stringify(currentPositions));
        ws.send(JSON.stringify(currentPositions));
    } else if (data.etype == "Update") {
        setAllPositions(data);
        console.log("set positions");
    } else if (data.etype == "Win" && data.object == clientID) {
        alert("You Win");
        ws.close();
        throw new Error();
    } else if (data.etype == "Lose" && data.object != clientID) {
        alert("You Win");
        ws.close();
        throw new Error();
    } else if (data.etype == "Win" && data.object != clientID) {
        alert("You Lose");
        ws.close();
        throw new Error();
    } else if (data.etypr == "Lose" && data.object == clientID) {
        alert("You Lose");
        ws.close();
        throw new Error();
    } else {
        console.log("Unknown event");
    }
    // console.log("teleports ", teleports);
}

function setPosition(elem, position) {
    if (typeof elem == undefined) {
        console.log(elem, "is undefined.");
    }
    elem.style.left = (position.x - 15).toString() + "px";
    elem.style.top = (position.y - 20).toString() + "px";
}

function setHealth(elem, health, id) {
    health /= 10;
    // console.log(elem, "is undefined.");
    elem.style.width = health.toString() + "%";
    elem.innerHTML = health + '% ' + id;
}

function setAllPositions(data) {
    console.log("setting all positions");
    setPosition(playerOne.elem, data.p1_pos);
    setPosition(playerTwo.elem, data.p2_pos);
    setPosition(botOne.elem, data.b1_pos);
    setPosition(botTwo.elem, data.b2_pos);
    setPosition(botThree.elem, data.b3_pos);
    setPosition(gemOne.elem, data.g1_pos);
    setPosition(gemTwo.elem, data.g2_pos);
    setPosition(gemThree.elem, data.g3_pos);
    setPosition(gemFour.elem, data.g4_pos);
    if (clientID == "p1") {
        setHealth(myHealth.elem, data.h1, "myHealth");
        setHealth(otherHealth.elem, data.h2, "Opponent Health");
    } else {
        setHealth(myHealth.elem, data.h2, "myHealth");
        setHealth(otherHealth.elem, data.h1, "Opponent Health");
    }
}

function getPositionOfElement(element) {
    // console.log(element, "is undefined.");
    let centerX = (element.offsetLeft + 15);
    let centerY = (element.offsetTop + 20);
    return {
        x: centerX,
        y: centerY
    };
}

function getHealth(element) {
    // if (typeof elem == undefined) {
    //     console.log("element", elem, " has type undefined");
    // }
    // console.log("style is", elem.style);
    // healthStr = parseInt(window.getComputedStyle(elem.elem).width);
    // console.log("healthstr is" + healthStr);
    health = parseInt(window.getComputedStyle(document.getElementById(element.id)).width);
    // console.log("health is ", health);
    // console.log("type of health", typeof health);
    return health;
}

function getCurrentPositions() {
    console.log("Getting all positions");
    return {
        etype: "None",
        object: "None",
        p1_pos: getPositionOfElement(playerOne.elem),
        p2_pos: getPositionOfElement(playerTwo.elem),
        b1_pos: getPositionOfElement(botOne.elem),
        b2_pos: getPositionOfElement(botTwo.elem),
        b3_pos: getPositionOfElement(botThree.elem),
        g1_pos: getPositionOfElement(gemOne.elem),
        g2_pos: getPositionOfElement(gemTwo.elem),
        g3_pos: getPositionOfElement(gemThree.elem),
        g4_pos: getPositionOfElement(gemFour.elem),
        h1: getHealth(myHealth.elem) * 10,
        h2: getHealth(otherHealth.elem) * 10
    };
}

window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

document.onkeydown = function(event) {
    type = "";
    if (event.keyCode == 37) {
        type = "Left";
    } else if (event.keyCode == 38) {
        type = "Up";
    } else if (event.keyCode == 39) {
        type = "Right";
    } else if (event.keyCode == 40) {
        type = "Down";
    } else if (event.keyCode == 32) {
        type = "Teleport";
        teleports++;
    } else {
        console.log("Unknown keyCode detected", event.keyCode);
    }
    if (type.localeCompare("") != 0 && teleports < maxTeleports) {
        currentPositions = getCurrentPositions();
        currentPositions.object = clientID;
        currentPositions.etype = type;
        console.log("msg being sent on key down", JSON.stringify(currentPositions));
        ws.send(JSON.stringify(currentPositions));
    }
}
