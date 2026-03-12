let currentAudio = null;
let currentThumb = null;
let isLooping = false;
let isAutoPlay = false;


// Picking from the song bank
function toggleAudio(id) {
  const audio = document.getElementById(id);
  const thumb = audio.parentElement;

  // Stop previous audio and reset its thumbnail
  if (currentAudio && currentAudio !== audio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    if (currentThumb) currentThumb.style.transform = 'scale(1)';
  }

  // Toggle clicked audio
  if (audio.paused) {
    audio.play();
    currentAudio = audio;
    currentThumb = thumb;
    thumb.style.transform = 'scale(1.15)';
    thumb.style.opacity = '0.8';
  } else {
    audio.pause();
    audio.currentTime = 0;
    thumb.style.transform = 'scale(1)';
    thumb.style.opacity = '1';
    currentAudio = null;
    currentThumb = null;
  }

  UpdateShuffleThumbnail();

  if (isAutoPlay) {
    audio.onended = () => {
      PickRandomAudio();
    };
  } else {
    audio.onended = null;
  } 

}

// Shuffle function
function PickRandomAudio() {
  const audios = Array.from(document.querySelectorAll('audio'));
  const randomIndex = Math.floor(Math.random() * audios.length);
  const audio = audios[randomIndex];
  const thumb = audio.parentElement.querySelector('img');

  // Stop previous audio and reset its thumbnail
  if (currentAudio && currentAudio !== audio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    if (currentThumb) {
      currentThumb.style.transform = 'scale(1)';
      currentThumb.style.opacity = '1';
    }
  }

  audio.play();
  currentAudio = audio;
  currentThumb = thumb;

  const display = document.getElementById('shuffleThumb');
  display.classList.add('fade-out');

  setTimeout(() => {
    display.src = thumb.src;
    display.classList.remove('fade-out');
  }, 250);
  
  UpdateShuffleThumbnail();

  if (isAutoPlay) {
    audio.onended = () => {
      PickRandomAudio();
    };
  } else {
    audio.onended = null;
  } 
}

function UpdateShuffleThumbnail() {
  if (!currentAudio) return;

  const thumb = currentAudio.parentElement.querySelector('img'); // thumbnail of currentAudio
  const display = document.getElementById('shuffleThumb');

  display.src = thumb.src; // set shuffle thumbnail to match current song
  display.classList.add('fade-out');

  setTimeout(() => {
    display.classList.remove('fade-out');
  }, 250);

}

// Stop all audio and reset thumbnails
function StopAllAudio() {
  const audios = document.querySelectorAll('audio');
  audios.forEach(audio => {
    audio.pause();
    audio.parentElement.style.transform = 'scale(1)';
    audio.parentElement.style.opacity = '1';
  });
  currentThumb = null;
}

function PlayAudio() {
  if (currentAudio && currentAudio.paused) {
    currentAudio.play();
    currentAudio.parentElement.style.transform = 'scale(1.15)';
  }
}

function LoopAudio() {
  isLooping = !isLooping;
  const audios = document.querySelectorAll('audio');
  audios.forEach(audio =>
    audio.loop = isLooping
  );

  document.querySelector('#loopButton').textContent = isLooping ? 'Loop On (D)' : 'Loop Off (D)';
}

function ToggleAutoPlay() {
  isAutoPlay = !isAutoPlay;
  const btn = document.getElementById('autoplayButton');
  btn.textContent = isAutoPlay ? 'Auto-Play On (A)' : 'Auto-Play Off (A)';

  if (currentAudio) {
    if (isAutoPlay) {
      currentAudio.onended = () => {
        PickRandomAudio();
      };
    } else {
    currentAudio.onended = null;
    }
  }
}

function Skip10Seconds() {
  if (currentAudio) {
    currentAudio.currentTime = Math.min(
      currentAudio.currentTime + 10,
      currentAudio.duration
    );
  }
}

function Rewind10Seconds() {
  if (currentAudio) {
    currentAudio.currentTime = Math.max(
      currentAudio.currentTime - 10,
      0
    );
  }
}

function TogglePlayPauseShuffle() {
  if (!currentAudio) return;
  if (currentAudio.paused) {
    currentAudio.play();
}
  else {
    currentAudio.pause();
  }
}

function UpdateProgress() {
  if (!currentAudio) return;
  const progress = document.getElementById('audioProgress');
  const percent = (currentAudio.currentTime / currentAudio.duration) * 100;
  progress.value = percent;
}

function KeyControls() {
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      if (currentAudio) {
        if (currentAudio.paused) {
          currentAudio.play();
        } else {
          currentAudio.pause();
        } 
      }
    }
    if (e.code === 's' || e.code === 'KeyS') {
      e.preventDefault();
      PickRandomAudio();
    }
    if (e.code === 'd' || e.code === 'KeyD') {
      e.preventDefault();
      LoopAudio();
    }
    if (e.code === 'a' || e.code === 'KeyA') {
      e.preventDefault();
      ToggleAutoPlay();
    }
    if (e.code === 'e' || e.code === 'KeyE') {
      e.preventDefault();
      Skip10Seconds();
    }
    if (e.code === 'q' || e.code === 'KeyQ') {
      e.preventDefault();
      Rewind10Seconds();
    }
    if (e.code.startsWith('Digit')) {
      e.preventDefault();  // stop scrolling
      const num = parseInt(e.code.replace('Digit',''), 10); // 0-9
      if (currentAudio && currentAudio.duration) {
        currentAudio.currentTime = currentAudio.duration * (num / 10);
        console.log(`Jumped to ${num*10}%`);
      }
    }
    if (e.code === 'w' || e.code === 'KeyW') {
      e.preventDefault();
      ReturnToTop();
    }
    if (e.code === 'x' || e.code === 'KeyX') {
      e.preventDefault();
      IncreaseVolume();
    }
    if (e.code === 'z' || e.code === 'KeyZ') {
      e.preventDefault();
      DecreaseVolume();
    }

  });
}

function ReturnToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function IncreaseVolume(){
  if (currentAudio) {
    currentAudio.volume = Math.min(currentAudio.volume + 0.1, 1);
  }
}

function DecreaseVolume() {
  if (currentAudio) {
    currentAudio.volume = Math.max(currentAudio.volume - 0.1, 0);
  }
}

function UpdateVolume() {
  if (!currentAudio) return;
  const progress = document.getElementById('volumeLevel');
  const percent = (currentAudio.volume / 1) * 100;
  progress.value = percent;
}

window.addEventListener('DOMContentLoaded', () => {
  KeyControls();
});

setInterval(UpdateVolume, 100);

setInterval(UpdateProgress, 100);
