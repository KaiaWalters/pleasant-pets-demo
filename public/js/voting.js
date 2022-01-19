//should become global variables 
module.exports = {
    upVotes, 
    downVotes
}

let upVotes = 0 
let downVotes = 0 

document.getElementsByClassName("upVote").addEventListener('onClick', handleVotes("upVote"), once) 
document.getElementsByClassName("downVote").addEventListener('onClick', handleVotes("downVote"), once) 


function handleVotes(voteType) {
    if(voteType == "upVote"){
        upVotes+=1
    } else if (voteType == "downVote") {
        downVotes+=1
    }else {
        console.log(`ERROR: Invalid input ${voteType}. If you have added a new button, it needs to be added to voting.js`)
    }
    console.log(upVote, downVote)
}