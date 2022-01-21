

const thumbUp = document.getElementsByClassName("upVote")
const thumbDown = document.getElementsByClassName("downVote")
const upValue = document.getElementsByClassName("upValue")
const downValue = document.getElementsByClassName("downValue")
const netScore = document.getElementsByClassName("netScore")

    let net = 0 
    let upVotes = 0 
    let downVotes = 0 

    function computeNetScore(upVotes, downVotes){
        console.log("net", upVotes - downVotes)
    } 
    
Array.from(thumbUp).forEach(function(element) {
    element.addEventListener('click', function() {
        upVotes+=1
        upValue.innerText = upVotes.toString()
        console.log(upVotes)
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




// why am i not able to create a function andhave that function called on click? 


// function handleVotes(voteType) {
//     let upVotes = 0 
//     let downVotes = 0 

//     if(voteType == "upVote"){
      
        
//     } else if (voteType == "downVote") {

//     }else {
//         console.log(`ERROR: Invalid input ${voteType}. If you have added a new button, it needs to be added to voting.js`)
//     }
// }




 



