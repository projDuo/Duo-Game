import { globalToken } from "./auth.js";
import {globalRoom} from "./playerMenu.js"

export async function load(game){
    const response = await fetch("game.html")
    const text = await response.text();
    document.body.innerHTML = text;

    console.log("DADASd")
    document.getElementById("playGroundContOne").append(useCard(game.card))
// const objects = [
//     { element: "Energy", effect: { Atk: 10 } },
//     { element: "Wood", effect: { Add: 4 } },
//     { element: "Fire", effect: "Stun" },
//     { element: "Water", effect: "Flow" },
//     { element: "Air", effect: { Atk: 10 } },
//     { element: "Earth", effect: { Add: 4 } },

//     { element: "Energy", effect: { Atk: 10 } },
//     { element: "Wood", effect: { Add: 4 } },
//     { element: "Fire", effect: "Stun" },
//     { element: "Water", effect: "Flow" },
//     { element: "Air", effect: { Atk: 10 } },
//     { element: "Earth", effect: { Add: 4 } },

//     { element: "Energy", effect: { Atk: 10 } },
//     { element: "Wood", effect: { Add: 4 } },
//     { element: "Fire", effect: "Stun" },
//     { element: "Water", effect: "Flow" },
//     { element: "Air", effect: { Atk: 10 } },
//     { element: "Earth", effect: { Add: 4 } },
// ];

// document.getElementById("bth").addEventListener("click", function(){
//     console.log(globalRoom)
//     console.log(globalToken)
//     globalRoom.leave(globalToken)
// })


function useCard(card){
    const divCard = createElementWithClass("div", "centerCard");
    const divLeftElement = createElementWithClass("div", "contNumber");
    const pLeft = createElementWithClass("p", "number");
    const divCenterElement = createElementWithClass("div", "contCenter");
    const divRightElement = createElementWithClass("div", "contNumber");
    const pRight = createElementWithClass("p", "number");

    return creationCard(card, divCard, divLeftElement, divCenterElement, divRightElement, pLeft, pRight)
}




function addCard(obj, index, total, overlapWidth) {
    const divCard = createElementWithClass("div", "card");
    const divLeftElement = createElementWithClass("div", "contNumber");
    const pLeft = createElementWithClass("p", "number");
    const divCenterElement = createElementWithClass("div", "contCenter");
    const divRightElement = createElementWithClass("div", "contNumber");
    const pRight = createElementWithClass("p", "number");

    divCard.addEventListener('mouseover', () => {
        divCard.classList.add('persistent-hover');
    });
    divCard.addEventListener('mouseleave', () => {
        setTimeout(() => {
            divCard.classList.remove('persistent-hover');
        }, 100);
    });

    setPosition(divCard, index, total, overlapWidth)
    return creationCard(obj, divCard, divLeftElement, divCenterElement, divRightElement, pLeft, pRight)
}

function creationCard(obj, elementDiv, left, center, right, pL, pR){
    switch (obj.element) {
        case "Air":
            elementDiv.style.background = "lightskyblue";
            elementDiv.style.color = "lightskyblue";
            break;
        case "Wood":
            elementDiv.style.background = "sienna";
            elementDiv.style.color = "sienna";
            break;
        case "Water":
            elementDiv.style.background = "steelblue";
            elementDiv.style.color = "steelblue";
            break;
        case "Fire":
            elementDiv.style.background = "red";
            elementDiv.style.color = "red";
            break;
        case "Energy":
            elementDiv.style.background = "orange";
            elementDiv.style.color = "orange";
            break;
        case "Earth":
            elementDiv.style.background = "saddlebrown";
            elementDiv.style.color = "saddlebrown";
            break;
    }

    if (obj.effect.Atk) {
        center.innerText = obj.element;
        pL.innerText = obj.effect.Atk;
        pR.innerText = obj.effect.Atk;
        if (obj.effect.Atk >= 10) {
            double(pL, pR);
        }
    } else if (obj.effect.Add) {
        center.innerHTML = `<ion-icon name="dice-outline"></ion-icon>`;
        pL.innerText = `+${obj.effect.Add}`;
        pR.innerText = `+${obj.effect.Add}`;
        double(pL, pR);
    } else if (obj.effect === "Stun") {
        center.innerHTML = `<ion-icon class="number" name="sync-outline"></ion-icon>`;
        pL.innerHTML = `<ion-icon class="number" name="sync-outline"></ion-icon>`;
        pR.innerHTML = `<ion-icon class="number" name="sync-outline"></ion-icon>`;
    } else if (obj.effect === "Flow") {
        center.innerHTML = `<ion-icon class="number" name="flash-outline"></ion-icon>`;
        pL.innerHTML = `<ion-icon class="number" name="flash-outline"></ion-icon>`;
        pR.innerHTML = `<ion-icon class="number" name="flash-outline"></ion-icon>`;
    }

    left.append(pL);
    right.append(pR);
    elementDiv.append(left, center, right);
    return elementDiv;
}

function createElementWithClass(tag, className) {
    const element = document.createElement(tag);
    element.classList.add(className);
    return element;
}

function double(firstElement, secondElement) {
    firstElement.classList.remove("number");
    secondElement.classList.remove("number");
    firstElement.classList.add("doubleNumber");
    secondElement.classList.add("doubleNumber");
}

function setPosition(divCard ,index, total, overlapWidth){
    const cardWidth = 140;
    const deckWidth = (total - 1) * (cardWidth - overlapWidth) + cardWidth;
    const startPosition = `calc(50% - ${deckWidth / 2}px)`;

    divCard.style.left = `calc(${startPosition} + ${index * (cardWidth - overlapWidth)}px)`;
    divCard.style.zIndex = index;
}















const containerOne = document.getElementById("containerOne")

// function respawnCards() {
//     // containerThree.innerHTML = '';
//     // containerOne.innerHTML = '';
//     let overlapWidth = 50;
//     const totalCardWidth = (objects.length - 1) * (140 - overlapWidth) + 140;

//     if (totalCardWidth > containerThree.offsetWidth) {
//         overlapWidth = (objects.length * 140 - containerThree.offsetWidth) / (objects.length - 1);
//         if (overlapWidth < 10) overlapWidth = 10;
//     }


//     objects.forEach((obj, index) => {
//         containerThree.append(addCard(obj, index, objects.length, overlapWidth));
//     });

//     objects.forEach((obj, index) => {
//         containerOne.append(enemyCard(index, objects.length, overlapWidth));
//     });
// }

function renderCards() {
    let overlapWidth = 50;
    const totalCardWidth = (objects.length - 1) * (140 - overlapWidth) + 140;

    if (totalCardWidth > containerThree.offsetWidth) {
        overlapWidth = (objects.length * 140 - containerThree.offsetWidth) / (objects.length - 1);
        if (overlapWidth < 10) overlapWidth = 10;
    }
    console.log(1)

    let containerThreeCard = containerThree.getElementsByClassName("card")
    let containerOneCard = containerOne.getElementsByClassName("enemyCard")

    for(let [index, element] of Object.entries(containerThreeCard)){
        setPosition(element ,index , containerThreeCard.length, overlapWidth)
    }

    for(let [index, element] of Object.entries(containerOneCard)){
        setPosition(element ,index , containerOneCard.length, overlapWidth)
    }
}

window.addEventListener('resize', renderCards);

// respawnCards();















function enemyCard(index, total, overlapWidth) {
    const divCardEnemy = createElementWithClass("div", "enemyCard");
    const divLeftElement = createElementWithClass("div", "contNumber");
    const divCenterElement = createElementWithClass("div", "contCenter");
    const divRightElement = createElementWithClass("div", "contNumber");

    divLeftElement.innerHTML = `<ion-icon class="enemy" name="skull-outline"></ion-icon>`;
    divCenterElement.innerHTML = `<ion-icon class="enemy" name="skull-outline"></ion-icon>`;
    divRightElement.innerHTML = `<ion-icon class="enemy" name="skull-outline"></ion-icon>`;

    setPosition(divCardEnemy, index, total, overlapWidth)

    divCardEnemy.append(divLeftElement, divCenterElement, divRightElement);
    return divCardEnemy;
}















function numberEnemyCard(num, side){
    const divCardEnemy = createElementWithClass("div", "enemyLeftAndRight");
    const divLeftElement = createElementWithClass("div", "contNumber");
    const divCenterElement = createElementWithClass("div", "contCenter");
    const divRightElement = createElementWithClass("div", "contNumber");
    const p = createElementWithClass("p", (side === "left") ? "enemyLeft" : "enemyRight");

    divLeftElement.innerHTML = `<ion-icon class="${(side === "left") ? "enemyLeft" : "enemyRight"}" name="skull-outline"></ion-icon>`;
    p.innerText = num;
    divCenterElement.append(p);
    divRightElement.innerHTML = `<ion-icon class="${(side === "left") ? "enemyLeft" : "enemyRight"}" name="skull-outline"></ion-icon>`;

    divCardEnemy.append(divLeftElement, divCenterElement, divRightElement);
    return divCardEnemy;
}
    document.getElementById("playerThree").append(numberEnemyCard(22, "left"));
    document.getElementById("playerFour").append(numberEnemyCard(22, "right"));






//! aaa


    const newCard = document.getElementById("newCard");
    const inputNewCard = document.getElementById("inputNewCard");
    let numa = 44;
    
    newCard.addEventListener("click", function(){
        numa--; // Зменшує значення numa на 1
        inputNewCard.innerText = numa;
    });
}


export function spawnPlayersCards(cards) {
    const containerThree = document.getElementById("containerThree");
    // console.log(containerThree)
    if(containerThree === null){
        console.log(cards)
        containerThree.innerHTML = '';
        // containerOne.innerHTML = '';
        let overlapWidth = 50;
        const totalCardWidth = (objects.length - 1) * (140 - overlapWidth) + 140;
    
        if (totalCardWidth > containerThree.offsetWidth) {
            overlapWidth = (objects.length * 140 - containerThree.offsetWidth) / (objects.length - 1);
            if (overlapWidth < 10) overlapWidth = 10;
        }
    
    
        cards.forEach((obj, index) => {
            containerThree.append(addCard(obj, index, cards.length, overlapWidth));
        });
    }

    // objects.forEach((obj, index) => {
    //     containerOne.append(enemyCard(index, objects.length, overlapWidth));
    // });
}