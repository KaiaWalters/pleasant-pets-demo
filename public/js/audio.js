

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

