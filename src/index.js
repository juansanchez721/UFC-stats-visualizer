import "./styles/index.scss";
import "./styles/reset.scss"
require('babel-polyfill')

// import * as WebScrap from './scripts/webscraper'
const nah = require('./scripts/webscraper')

import Card from './scripts/card'
// const Card = require('./scripts/card');

// function testfunction() {
//     console.log("test message")
// }

// testfunction()

// function getData() {
//     fetch('http://api.sportradar.us/ufc/trial/v2/en/rankings.json?api_key=wjvfbsmrqxd6gfjgqu9mdkv3')
//     .then(response => {
//         return response.json()
//     })
//     .then(fighters => {
//         fighters.rankings.forEach(element => {
//             console.log(element.name);
            
//         });
//     })
// }

// getData();
const axios = require('axios');

document.addEventListener('DOMContentLoaded', () => {
    // let yo = document.getElementsByClassName('each-fighter')
    // for(let i = 0; i< yo.length; i++) {
    //     yo[i].addEventListener("click", () => flipCard(yo[i].id, i))
    // }
    // nah.getImgURL();

    axios.get(`/rankings`)
    .then((response) => {
        debugger
        const rankings = response.data.rankings
        // console.log(rankings); 

        getRankings(rankings)
    })
    .catch(function (error) {
        debugger
        console.log(error.response);
    })

    // let query = "grace hopper";
    // axios.get(`/search?string=${query}`)
    // .then((response) => {
    //     console.log(response);
    // })
    // .catch(function (error) {
    //     console.log(error);
    // });
    
})

function getRankings(rankings) {

    // var mainContainer = document.getElementById("navbar");
    let dropdown = document.getElementById("weight-classes")
    // dropdown.setAttribute("id", "weight-classes")
    for (var i = 0; i < rankings.length; i++) {
        // console.log(response.data.rankings.length)
        let division = rankings[i].name.split("_").join(" ")
        // rankings[0].competitor_rankings[0].competitor.name
        let competitors = rankings[i].competitor_rankings.map(rank => {
            return rank.competitor 
        })
        let info = []
        competitors.forEach(fighter => {
                info.push([Object.values(fighter), "|"]) 
            }   
            )
                dropdown.appendChild(new Option(`${division}`, `${info}` ));
    }
  
            dropdown.addEventListener('change', (e) => getFighters(e.target.value))
            // mainContainer.append(dropdown)
}


const getFighters = async (competitors) => {
    debugger 

    cards = {}

    let fighters = competitors.split("|")
    fighters.pop()
    
    let athletes = fighters.map((fighter) => {
        return fighter.split(",").filter(item => item !== "")
    })

    let promises = []
    let fightfight = athletes.map((fighter, i) => { //check here to remove last undefined "athlete"
        // while ( i < athletes.length-1){
            // let firstName = fighter[2].split(" ")[1]
            let name = fighter[2].slice(1) + "-" + fighter[1]
            // promises.push(nah.getImgURL(name))
            
            return {
                id: fighter[0],
                name,
                abrev: fighter[3],
                // imange: immm
            }
            // }
        })

        // let immm = await nah.getImgURL(fightfight[0].name)
        // console.log(fightfight[0].name)
        // fightfight[0]['image']= immm
        // console.log(fightfight)

         getImage(fightfight)
    // Promise.all(promises).then(val => console.log(val))
        console.log(fightfight)
    

}

async function getImage(fightfight) {
    let tempName=""
    for(let i = 0; i < fightfight.length; i++ ){

        tempName= fightfight[i].name.split(" ").join("-")

        
        fightfight[i]['image']= await nah.getImgURL(tempName)
        // console.log(fightfight[0].name)
        // fightfight[i]['image']= immm
        // console.log(fightfight)
    }
    console.log(fightfight)
    // return fightfight

    let dContainer = document.getElementById("data-container")
    dContainer.innerHTML = '';

    fightfight.forEach((fighter, i) => {

                var fightStats = document.createElement("div") //main div to append things to
                fightStats.setAttribute("id", `each-fighter-${i}` )
                fightStats.classList.add("each-fighter");
                
                var fighterImg = document.createElement("div") //div to append img to
                fighterImg.setAttribute("id", `${ i === 0 ? "champ-img" : "fighter-img"}`)
                fighterImg.style.backgroundImage = `url(${fighter.image})`;

                var fighterInfo = document.createElement("div") //div to append text/data to
                fighterInfo.setAttribute("id", "fighter-info")

                
                let name = fighter.name.split(", ").reverse().join(" ") //flip name around
                let position = i === 0 ? "C" : i;  //if position is 0, then athlete is current champion if division
                // var text = document.createTextNode(`${name}, ${fighter.id},  rank: ${position}`)
                
                let rank = document.createElement("h2")
                rank.textContent = `${position}`

                let fighterName = document.createElement("h1")
                fighterName.textContent = `${name.split("-")[1].toUpperCase()}`

                fighterInfo.appendChild(rank)
                fighterInfo.appendChild(fighterName)

                fightStats.appendChild(fighterImg)
                fightStats.appendChild(fighterInfo)

                let flipped = document.createElement("div") //div to append text/data to
                fightStats.appendChild(flipped)


                dContainer.appendChild(fightStats)
                fightStats.addEventListener("click", (event) => {
                    flipCard(`each-fighter-${i}`, fighter.id)
                })
                         
    })
}


function addFlippedInfo(id) {
    debugger
    console.log(id)
    let flip = document.getElementById(id).children[2] //grab the flip div
    flip.innerHTML = `${cards[id].fighterObject.info.nickname}`
}

let cards = {}
function flipCard(id, fighterId) {
    console.log(cards)
    if(!cards[id]) {
        cards[id] = {
          degree:0,
          fighterObject:fighterInfo(id, fighterId)  
        } 
        debugger
    }
    // console.log(k)

    var card = document.getElementById(id);
    let flip = document.getElementById(id).children[2] //grab the flip div
    debugger
    console.log(flip)
    if (cards[id].degree !== 0)  {
        cards[id].degree -= 180;
        // flip.style.display = "none"
        // card.style.transitionDuration = "0.9s"
        flip.classList.remove("flip-div")
        flip.classList.add("hide-div")
        // flip.innerHTML = ""
    } else {
        cards[id].degree += 180;
        flip.classList.remove("hide-div")
        flip.classList.add("flip-div")
        debugger
        // document.getElementById("flip-div").style.display = "block"
    }

    card.style.transform = "rotatey(" + cards[id].degree + "deg)";
    card.style.transitionDuration = "0.9s"
    // console.log(cards)
    debugger
}

function fighterInfo(id, fighterId) {
    // let isbn = '0201558025';
  // debugger
  console.log("api called again")
//   axios.get(`/fighters/${fighterId}`)
//   .then((response) => {
//       debugger
//       console.log(response.data); 
//       cards[id].fighterObject = response.data
//       addFlippedInfo(id)
//   })
//   .catch(function (error) {
//       debugger
//       console.log(error.response);
//   });

}
