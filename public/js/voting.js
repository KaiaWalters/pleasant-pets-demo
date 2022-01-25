const thumbUp = document.getElementsByClassName("upVote")
const thumbDown = document.getElementsByClassName("downVote")
const upValue = document.getElementsByClassName("upValue")
const downValue = document.getElementsByClassName("downValue")
const netScore = document.getElementsByClassName("netScore")
//module method for structuring node modules 
//look up supporter files. 

Array.from(thumbUp).forEach(function(element, index) {
    element.addEventListener('click', function() {
        //inner text = priimitive, primitives are always passed by value
        //review memory 
        //reference vs value
        let upValue = element.firstElementChild
        let downValue = +element.parentElement.lastElementChild.firstElementChild.innerText
        let url = element.parentElement.parentElement.childNodes[3].src
        let currentUpVotes = +upValue.innerText + 1
    
        upValue.innerText = currentUpVotes
        playCatSound("/../assets/audio/meow_audio.mp3")
        saveUpdates(url, currentUpVotes, downValue)
    })
})
Array.from(thumbDown).forEach(function(element) {
    element.addEventListener('click', function() {
        let downValue = element.firstElementChild
        let upValue = +element.parentElement.lastElementChild.firstElementChild.innerText
        let url = element.parentElement.parentElement.childNodes[3].src
        let currentDownVotes = +downValue.innerText + 1 

        downValue.innerText = currentDownVotes
        playCatSound("/../assets/audio/hiss_audio.mp3")
        saveUpdates(url, upValue, currentDownVotes)
    })
})


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
            return response.json()
        }
    })
};

function playCatSound(audio) {
        const meow = new Audio(audio);
        meow.play();
        meow.loop =false;
        meow.playbackRate = 2;
}

function computeNetScore(upVotes, downVotes){
    let net = upVotes - downVotes

    netScore.innerText = net.toString()
    console.log("net", upVotes - downVotes)
} 



 



