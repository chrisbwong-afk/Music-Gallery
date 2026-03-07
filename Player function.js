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

  document.querySelector('#loopButton').textContent = isLooping ? 'Loop On' : 'Loop Off';
}

function ToggleAutoPlay() {
  isAutoPlay = !isAutoPlay;
  const btn = document.getElementById('autoplayButton');
  btn.textContent = isAutoPlay ? 'Auto-Play On' : 'Auto-Play Off';

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

window.addEventListener('DOMContentLoaded', spacebarToggle);
