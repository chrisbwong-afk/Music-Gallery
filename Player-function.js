let currentAudio = null;
let currentThumb = null;
let isLooping = false;
let isAutoPlay = false;

let recentSongs = [];
const MAX_HISTORY = 10;

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
    thumb.style.transform = '';
    thumb.style.opacity = '';
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
  const songName = currentAudio.id;
  title.classList.add('fade-out');
  setTimeout(() => {
    title.textContent = songName;
    title.classList.remove('fade-out');
  }, 250);

}

// Shuffle function
function PickRandomAudio() {
  const audios = Array.from(document.querySelectorAll('audio'));

  let availableAudios = audios.filter(audio => !recentSongs.includes(audio));

  if (availableAudios.length === 0) {
    recentSongs = [];
    availableAudios = audios;
  }
  const randomIndex = Math.floor(Math.random() * availableAudios.length);
  const audio = availableAudios[randomIndex];
  const thumb = audio.parentElement;

  // Stop previous audio and reset its thumbnail
  if (currentAudio && currentAudio !== audio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  if (currentThumb) {
    currentThumb.style.transform = '';
    currentThumb.style.opacity = '';
  }
  

  audio.play();
  currentAudio = audio;
  currentThumb = thumb;
  thumb.style.transform = 'scale(1.15)';
  thumb.style.opacity = '0.8';

  console.log('currentAudio:', currentAudio);

  
  recentSongs.push(audio);
  if (recentSongs.length > MAX_HISTORY) {
    recentSongs.shift();
  }
  
  const display = document.getElementById('shuffleThumb');
  const title = document.getElementById('title');
  const songName = currentAudio.id;

  title.classList.add('fade-out');
  display.classList.add('fade-out');

  setTimeout(() => {
    display.src = thumb.src;
    title.textContent = songName;

    display.classList.remove('fade-out');
    title.classList.remove('fade-out');
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

function downloadCurrentAudio(e) {
  console.log('currentAudio:', currentAudio);
  console.log('function called');

  if (!currentAudio) return;

  const source = currentAudio.querySelector('source');

  console.log('source:', source);
  console.log('source src:', source ? source.src : 'No source element found');
  const link = document.createElement('a');
  link.setAttribute('href', source ? source.src : '');
  link.setAttribute('download', decodeURIComponent(source ? source.src.split('/').pop() : 'audio.mp3'));

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


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

    const blockedKeys = ['Space', 'KeyS', 'KeyD', 'KeyA', 'KeyE', 'KeyQ', 'KeyW', 'KeyX', 'KeyZ', 'Slash', 'KeyG'];
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
      case 'KeyC':
        const input = document.getElementById('darkModeToggle');
        input.click();
        break;
      case 'KeyG':
        if (keysDown['ControlLeft'] && keysDown['ShiftLeft']) {
          downloadCurrentAudio(e);
        }
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

function ToggleDarkMode() {
  const div = document.getElementById('theme');
  div.classList.toggle('dark');
  div.classList.toggle('light');

  const icon = document.getElementById('Icon');
  icon.classList.add('fade-out');
  setTimeout(() => {

    icon.setAttribute('data-lucide', div.classList.contains('dark') ? 'moon' : 'sun-dim');

    icon.classList.remove('fade-out');

    lucide.createIcons();
  }, 150);

  const title = document.querySelector('h1');

  title.style.color = div.classList.contains('dark') ? '#8ea2d2' : '#000000';

}

setInterval(UpdateVolume, 100);

setInterval(UpdateProgress, 100);
