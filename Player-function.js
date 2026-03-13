let currentAudio = null;
let currentThumb = null;
let isLooping = false;
let isAutoPlay = false;

const keysDown = {};

// Picking from the song bank
function toggleAudio(id) {
  const audio = document.getElementById(id);
  const thumb = audio.parentElement;

  // Stop previous audio and reset its thumbnail
  if (currentAudio && currentAudio !== audio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    if (currentThumb) {
      currentThumb.style.transform = 'scale(1)';
      currentThumb.style.opacity = '1';
    }
  }

  // Toggle clicked audio
  if (audio.paused) {
    audio.play()
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
  const thumb = audio.parentElement;

  // Stop previous audio and reset its thumbnail
  if (currentAudio && currentAudio !== audio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  if (currentThumb) {
    currentThumb.style.transform = 'scale(1)';
    currentThumb.style.opacity = '1';
  }
  

  audio.play();
  currentAudio = audio;
  currentThumb = thumb;
  thumb.style.transform = 'scale(1.15)';
  thumb.style.opacity = '0.8';
  

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

  const container = currentThumb;
  const img = container.querySelector('img');
  const display = document.getElementById('shuffleThumb');

  display.classList.add('fade-out')

  setTimeout(() => {
    display.src = img.src; // set shuffle thumbnail to match current song
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
    currentAudio.parentElement.style.opacity = '0.8';
  }
}

function LoopAudio() {
  isLooping = !isLooping;
  const audios = document.querySelectorAll('audio');
  audios.forEach(audio =>
    audio.loop = isLooping
  );

  document.querySelector('#loopButton').innerHTML = isLooping 
    ? '<i data-lucide="repeat"></i>' 
    : '<i data-lucide="repeat" id="off"></i>';

  lucide.createIcons();
}

function ToggleAutoPlay() {
  isAutoPlay = !isAutoPlay;
  const btn = document.getElementById('autoplayButton');
  btn.innerHTML = isAutoPlay 
  ?'<i data-lucide="step-forward"></i>' 
  :'<i data-lucide="step-forward" id="off"></i>';

  lucide.createIcons();

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
    if (keysDown[e.code]) return; // already pressed, ignore repeat
    keysDown[e.code] = true;      // mark key as pressed

    const blockedKeys = ['Space', 'KeyS', 'KeyD', 'KeyA', 'KeyE', 'KeyQ', 'KeyW', 'KeyX', 'KeyZ', 'Slash'];
    if (blockedKeys.includes(e.code) || e.code.startsWith('Digit')) {
      e.preventDefault();
    }

    switch(e.code) {
      case 'Space':
        TogglePlayPauseShuffle();
        break;
      case 'KeyS':
        const btn = document.getElementById('shuffleButton');
        btn.classList.add('active');
        PickRandomAudio();
        break;
      case 'KeyD':
        LoopAudio();
        break;
      case 'KeyA':
        ToggleAutoPlay();
        break;
      case 'KeyE':
        Skip10Seconds();
        break;
      case 'KeyQ':
        Rewind10Seconds();
        break;
      case 'KeyW':
        ReturnToTop();
        break;
      case 'KeyX':
        IncreaseVolume();
        break;
      case 'KeyZ':
        DecreaseVolume();
        break;
      case 'Slash':
        ToggleHelp();
        break;

      default:
        if (e.code.startsWith('Digit')) {
          const num = parseInt(e.code.replace('Digit',''), 10); // 0-9
          if (currentAudio && currentAudio.duration) {
            currentAudio.currentTime = currentAudio.duration * (num / 10);
            console.log(`Jumped to ${num*10}%`);
          }
        }
        break;
    }  
  });
  document.addEventListener('keyup', (e) => {
    keysDown[e.code] = false; // mark key as released
    if (e.code === 'KeyS') {
      const btn = document.getElementById('shuffleButton');
      btn.classList.remove('active');
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

function ToggleHelp() {
  const help = document.getElementById('help');
  help.classList.toggle('hidden');
}

window.addEventListener('DOMContentLoaded', () => {
  KeyControls();
  ToggleHelp();
});

setInterval(UpdateVolume, 100);

setInterval(UpdateProgress, 100);
