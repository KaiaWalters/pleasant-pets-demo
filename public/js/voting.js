const thumbUp = document.getElementsByClassName("upVote")
const thumbDown = document.getElementsByClassName("downVote")
const upValue = document.getElementsByClassName("upValue")
const downValue = document.getElementsByClassName("downValue")
const netScore = document.getElementsByClassName("netScore")

    //check out naming for upValue and DownValue
Array.from(thumbUp).forEach(function(element, index) {
    element.addEventListener('click', function() {
        let upValue = element.firstElementChild.innerText
        let downValue = element.parentElement.lastElementChild.firstElementChild.innerText
        let url = element.parentElement.parentElement.childNodes[3].src
        let currentUpVotes = +upValue + 1 

        saveUpdates(url, currentUpVotes, downValue)
    })
})
Array.from(thumbDown).forEach(function(element) {
    element.addEventListener('click', function() {
        let downValue = element.firstElementChild.innerText
        let upValue = element.parentElement.lastElementChild.firstElementChild.innerText
        let currentDownVotes = +downValue + 1 
        let url = element.parentElement.parentElement.childNodes[3].src

        saveUpdates(url, upValue, currentDownVotes)
    })
})

function computeNetScore(upVotes, downVotes){
    let net = upVotes - downVotes

    netScore.innerText = net.toString()
    console.log("net", upVotes - downVotes)
} 

function saveUpdates(url, upVotes, downVotes) {
    fetch(`cards`, {
        method: 'put', 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            'url': url, 
            'upVotes': upVotes, 
            'downVotes': downVotes
        })
    })
    .then(response => {
        if(response.ok){
            console.log("youve done did it you")
            return response.json()
        }
    })
    .then(data => {
        console.log(data)
        window.location.reload(true)
    });
};

// export default function sendSelectedCardInformation(selectedCard) {
//     let id = selectedCard.id.toString()
//     let selectedCard = selectedCard.url.toString()
//     return { id: selectedCard.id, url: selectedCard.url, upvotes: upvotes, downVotes: downVotes}
// }

 



