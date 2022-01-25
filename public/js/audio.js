const musicButton = document.getElementsByClassName("music")[0]

musicButton.addEventListener('click', function() {
    console.log('page is fully loaded');
    playAudio()
});


function playAudio() {
    const music = new Audio("/../assets/audio/pusheen_audio.m4a");
    music.play();
    music.loop = false;
    music.playbackRate = 1;
}