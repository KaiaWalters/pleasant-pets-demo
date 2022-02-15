
//Audio.js 
//You can choose to add music to your project. 
//This is completely optional but would be a nice touch! 

const musicButton = document.getElementsByClassName("music")[0]

musicButton.addEventListener('click', function() {
    console.log('page is fully loaded');
    playAudio("/../assets/audio/pusheen_audio.m4a")
});


let playAudio = (audio) => {
    const music = new Audio(audio);
    music.play();
    music.loop = false;
    music.playbackRate = 1;
}

