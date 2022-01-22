

const thumbUp = document.getElementsByClassName("upVote")
const thumbDown = document.getElementsByClassName("downVote")
const upValue = document.getElementsByClassName("upValue")
const downValue = document.getElementsByClassName("downValue")
const netScore = document.getElementsByClassName("netScore")

let net = 0 
let upVotes = 0 
let downVotes = 0 

function computeNetScore(upVotes, downVotes){
    let net = upVotes - downVotes

    netScore.innerText = net.toString()
    console.log("net", upVotes - downVotes)
} 
    
Array.from(thumbUp).forEach(function(element, index) {
    element.addEventListener('click', function() {
        upVotes+=1
        upValue[index].innerText = upVotes.toString()
        console.log(upVotes)
        console.log("waka", upValue.innerText)
        computeNetScore(upVotes, downVotes)
    })
})
Array.from(thumbDown).forEach(function(element) {
    element.addEventListener('click', function() {
        downVotes+=1
        downValue.innerText = downVotes.toString()
        computeNetScore(upVotes, downVotes)
    })
})


 



