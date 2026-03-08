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

// Shuffle all boxes on page load
function shuffleAllBoxes() {
  // Get all boxes
  const boxes = Array.from(document.querySelectorAll('.box'));
  
  // Shuffle using Fisher–Yates
  for (let i = boxes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [boxes[i], boxes[j]] = [boxes[j], boxes[i]];
  }

  // Remove existing boxes from all containers
  const containers = document.querySelectorAll('.container');
  containers.forEach(container => container.innerHTML = '');

  // Re-insert boxes in rows of 3
  let row = 0;
  for (let i = 0; i < boxes.length; i++) {
    containers[row].appendChild(boxes[i]);
    row = (row + 1) % containers.length;
  }
}
// Run on page load
window.addEventListener('DOMContentLoaded', shuffleAllBoxes);

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

setInterval(UpdateProgress, 100);

function spacebarToggle() {
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
  });
}

function Shufflehotkey() {
  document.addEventListener('keydown', (e) => {
    if (e.code === 's' || e.code === 'KeyS') {
      e.preventDefault();
      PickRandomAudio();
    }
  });
}

function Loophotkey() {
  document.addEventListener('keydown', (e) => {
    if (e.code === 'd' || e.code === 'KeyD') {
      e.preventDefault();
      LoopAudio();
    }
  });
}

function Autohotkey() {
  document.addEventListener('keydown', (e) => {
    if (e.code === 'a' || e.code === 'KeyA') {
      e.preventDefault();
      ToggleAutoPlay();
    }
  });
}

function Skiphotkey() {
  document.addEventListener('keydown', (e) => {
    if (e.code === 'e' || e.code === 'KeyE') {
      e.preventDefault();
      Skip10Seconds();
    }
  });
}

function Rewindhotkey() {
  document.addEventListener('keydown', (e) => {
    if (e.code === 'q' || e.code === 'KeyQ') {
      e.preventDefault();
      Rewind10Seconds();
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  spacebarToggle();
  Shufflehotkey();
  Loophotkey();
  Autohotkey();
  Skiphotkey();
  Rewindhotkey();
  ReturnToTopHotkey();
  IncreaseVolumeHotkey();
  DecreaseVolumeHotkey();
});

document.addEventListener('keydown', (e) => {
  // Only handle number row keys (Digit0-Digit9)
  if (e.code.startsWith('Digit')) {
    e.preventDefault();  // stop scrolling
    const num = parseInt(e.code.replace('Digit',''), 10); // 0-9
    if (currentAudio && currentAudio.duration) {
      currentAudio.currentTime = currentAudio.duration * (num / 10);
      console.log(`Jumped to ${num*10}%`);
    }
  }
});

function ReturnToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function ReturnToTopHotkey() {
  document.addEventListener('keydown', (e) => {
    if (e.code === 'w' || e.code === 'KeyW') {
      e.preventDefault();
      ReturnToTop();
    }
  });
}

function IncreaseVolume(){
  if (currentAudio) {
    currentAudio.volume = Math.min(currentAudio.volume + 0.1, 1);
  }
}

function IncreaseVolumeHotkey() {
  document.addEventListener('keydown', (e) => {
    if (e.code === 'x' || e.code === 'KeyX') {
      e.preventDefault();
      IncreaseVolume();
    }
  });
}

function DecreaseVolume() {
  if (currentAudio) {
    currentAudio.volume = Math.max(currentAudio.volume - 0.1, 0);
  }
}

function DecreaseVolumeHotkey() {
  document.addEventListener('keydown', (e) => {
    if (e.code === 'z' || e.code === 'KeyZ') {
      e.preventDefault();
      DecreaseVolume();
    }
  });
}

function UpdateVolume() {
  if (!currentAudio) return;
  const progress = document.getElementById('volumeLevel');
  const percent = (currentAudio.volume / 1) * 100;
  progress.value = percent;
}

setInterval(UpdateVolume, 100);
