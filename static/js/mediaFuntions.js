let tellmessage=document.querySelector('#tellmessage');
let previous = document.querySelector('#pre');
let play = document.querySelector('#play');
let next = document.querySelector('#next');
let title = document.querySelector('#title');
let recent_volume= document.querySelector('#volume');
let volume_show = document.querySelector('#volume_show');
let slider = document.querySelector('#duration_slider');
let show_duration = document.querySelector('#show_duration');
let track_image = document.querySelector('#track_image');
let auto_play = document.querySelector('#auto');
let present = document.querySelector('#present');
let total = document.querySelector('#total');
let artist = document.querySelector('#artist');
let nowPlayTime=document.querySelector('#nowPlayTime');
let totalPlayTime=document.querySelector('#totalPlayTime');

//message center


let timer;
let autoplay = 1;

let index_no = 0;
let Playing_song = false;

//create a audio Element
let track = document.createElement('audio');



//mute sound function
function mute_sound(){
    //document.querySelector('.fa fa-volume-up').className="fa fa-volume-off";

    if (track.volume == 0){
        track.volume = 1;
        volume.value = 85;
        document.querySelector('#voset').innerHTML=`<i class="fa fa-volume-up" aria-hidden="true"  id="volume_icon"></i>`;
    }
    else{
        document.querySelector('#voset').innerHTML=`<i class="fa fa-volume-off" aria-hidden="true"></i>`;
        track.volume = 0;
        volume.value = 0;
    }

}


// checking.. the song is playing or not
function justplay(){
    if(Playing_song==false){
        playsong();

    }else{
        pausesong();
    }
}


// reset song slider
function reset_slider(){
    slider.value = 0;
    nowPlayTime.innerHTML="0:00";
    
}

// play song
function playsong(){
    track.play();
    Playing_song = true;
    play.innerHTML = '<i class="fa fa-pause" aria-hidden="true"></i>';
}

//pause song
function pausesong(){
    track.pause();
    Playing_song = false;
    play.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>';
}







// change volume
function volume_change(){
    track.volume = recent_volume.value / 100;
    if (track.volume>0){
        document.querySelector('#voset').innerHTML=`<i class="fa fa-volume-up" aria-hidden="true"></i>`;
    }
    else{
        document.querySelector('#voset').innerHTML=`<i class="fa fa-volume-off" aria-hidden="true"></i>`;
    }
}

// change slider position 
function change_duration(){
    slider_position = track.duration * (slider.value / 100);
    track.currentTime = slider_position;
}

// autoplay function
function autoplay_switch(){
    if (autoplay==1){
    autoplay = 0;
    auto_play.style.background = "rgba(255,255,255,0.2)";
    }else{
    autoplay = 1;
    auto_play.style.background = "#FF8A65";
    }
}