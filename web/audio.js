// Retro Nokia 8-bit Monophonic Sound Synthesizer using Web Audio API
(function(window) {
  let audioCtx = null;
  let isMuted = false;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Ensure AudioContext unlocks on first touch/click
  const unlockEvents = ['touchstart', 'touchend', 'mousedown', 'keydown'];
  const unlock = () => {
    initAudio();
    unlockEvents.forEach(evt => document.removeEventListener(evt, unlock));
  };
  unlockEvents.forEach(evt => document.addEventListener(evt, unlock, { once: true, passive: true }));

  function playTone(freq, durationMs, type = 'square', gainLevel = 0.15) {
    if (isMuted) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(gainLevel, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + durationMs / 1000);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + durationMs / 1000);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  const Sound = {
    init: initAudio,
    setMuted: function(muted) {
      isMuted = muted;
    },
    isMuted: function() {
      return isMuted;
    },
    toggleMute: function() {
      isMuted = !isMuted;
      return isMuted;
    },

    // Keypad button click
    click: function() {
      playTone(180, 25, 'triangle', 0.08);
      if (navigator.vibrate) navigator.vibrate(10);
    },

    // Direction turn
    turn: function() {
      playTone(320, 25, 'square', 0.05);
      if (navigator.vibrate) navigator.vibrate(8);
    },

    // Regular food eaten (crisp high beep)
    eat: function() {
      playTone(740, 50, 'square', 0.18);
      setTimeout(() => {
        playTone(1100, 60, 'square', 0.2);
      }, 50);
      if (navigator.vibrate) navigator.vibrate(30);
    },

    // Bonus bug appeared
    bonusAppear: function() {
      const notes = [440, 554, 659];
      notes.forEach((freq, idx) => {
        setTimeout(() => playTone(freq, 60, 'square', 0.15), idx * 70);
      });
    },

    // Bonus bug eaten (festive victory arpeggio)
    bonusEat: function() {
      const notes = [587, 740, 880, 1174];
      notes.forEach((freq, idx) => {
        setTimeout(() => playTone(freq, 70, 'square', 0.22), idx * 60);
      });
      if (navigator.vibrate) navigator.vibrate([30, 30, 40]);
    },

    // Game over tune (classic descending 4-note Nokia melody)
    gameOver: function() {
      const notes = [493, 440, 392, 330];
      notes.forEach((freq, idx) => {
        setTimeout(() => playTone(freq, 140, 'square', 0.25), idx * 150);
      });
      if (navigator.vibrate) navigator.vibrate([100, 50, 150]);
    },

    // Pause tone
    pause: function() {
      playTone(523, 70, 'square', 0.12);
    },

    // Menu select tone
    select: function() {
      playTone(659, 40, 'square', 0.12);
      setTimeout(() => playTone(880, 50, 'square', 0.15), 45);
    }
  };

  window.NokiaSound = Sound;
})(window);
