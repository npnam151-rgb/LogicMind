
class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private static instance: SoundManager;
  
  private victoryAudio: HTMLAudioElement;
  private bgmAudio: HTMLAudioElement;

  // Web Audio Graph Nodes for Victory Boost
  private victoryGain: GainNode | null = null;
  private victorySource: MediaElementAudioSourceNode | null = null;
  private isVictoryConnected: boolean = false;

  private hasBGMStarted: boolean = false;
  private bgmFadeInterval: any = null;

  private constructor() {
    try {
        this.isMuted = localStorage.getItem('logicmind_muted') === 'true';
    } catch (e) {
        this.isMuted = false;
    }

    // Victory Audio
    this.victoryAudio = new Audio("https://res.cloudinary.com/dbfngei2f/video/upload/v1768810076/gaming-victory-464016_tl3nfp.mp3");
    this.victoryAudio.crossOrigin = "anonymous";
    
    // Background Music (Dropbox)
    this.bgmAudio = new Audio("https://www.dropbox.com/scl/fi/xnh84yc1n6ks7el8ygnq9/Drifting-Rooms-2.mp3?rlkey=psw9g2zy839pi05ooza2cnqbz&st=8euxbsbl&raw=1");
    this.bgmAudio.loop = true;
    // Note: Removed crossOrigin for BGM to allow simpler opaque playback if CORS fails
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
          this.ctx = new AudioContext();
          
          // --- VICTORY SETUP (Boost Volume) ---
          this.victoryGain = this.ctx.createGain();
          this.victoryGain.gain.value = 3.5; // Boost to 350%
          this.victoryGain.connect(this.ctx.destination);
      }
    }
    // Attempt resume if suspended
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  private connectVictorySource() {
     // Only connect if we have context and haven't connected yet
     if (this.ctx && this.victoryGain && !this.isVictoryConnected) {
         try {
             this.victorySource = this.ctx.createMediaElementSource(this.victoryAudio);
             this.victorySource.connect(this.victoryGain);
             this.isVictoryConnected = true;
         } catch(e) {
             console.warn("Could not connect victory audio to gain node (CORS likely). Playing normal volume.");
         }
     }
  }

  public loadSounds(soundMap: Record<string, string>) {
     // Preload
     this.victoryAudio.load();
     this.bgmAudio.load();
     
     // Setup Global Interaction Listener to unlock AudioContext
     const unlockHandler = () => {
         this.initCtx();
         this.startBGM();
         window.removeEventListener('click', unlockHandler);
         window.removeEventListener('touchstart', unlockHandler);
         window.removeEventListener('keydown', unlockHandler);
     };
     window.addEventListener('click', unlockHandler);
     window.addEventListener('touchstart', unlockHandler);
     window.addEventListener('keydown', unlockHandler);
  }

  public startBGM() {
    if (this.hasBGMStarted || this.isMuted) return;
    
    // BGM Logic: Standard HTML5 Audio (Most Reliable for external links)
    this.hasBGMStarted = true;
    this.bgmAudio.volume = 0; // Start silent for manual fade
    
    const playPromise = this.bgmAudio.play();
    
    if (playPromise !== undefined) {
        playPromise.then(() => {
            // Manual Fade In using setInterval
            if (this.bgmFadeInterval) clearInterval(this.bgmFadeInterval);
            let vol = 0;
            this.bgmFadeInterval = setInterval(() => {
                if (this.isMuted) {
                    this.bgmAudio.volume = 0;
                    clearInterval(this.bgmFadeInterval);
                    return;
                }
                vol += 0.05;
                if (vol >= 0.6) {
                    vol = 0.6;
                    clearInterval(this.bgmFadeInterval);
                }
                this.bgmAudio.volume = vol;
            }, 200); // 200ms * 12 steps = ~2.4s fade in
        }).catch(e => {
            console.warn("BGM Auto-play blocked (waiting for interaction):", e);
            this.hasBGMStarted = false;
        });
    }
  }

  public stopBGM() {
      if (this.bgmAudio) {
          this.bgmAudio.pause();
          this.bgmAudio.currentTime = 0;
      }
      if (this.bgmFadeInterval) clearInterval(this.bgmFadeInterval);
      this.hasBGMStarted = false;
  }

  public play(type: string) {
    if (this.isMuted) return;
    this.initCtx(); // Ensure context is ready for SFX

    const t = this.ctx ? this.ctx.currentTime : 0;

    switch (type) {
        case 'VICTORY':
            // 1. Duck BGM Volume
            const originalVol = this.bgmAudio.volume;
            this.bgmAudio.volume = 0.1;
            
            // 2. Play Victory Sound
            // Try to hook up boost if not already done
            this.connectVictorySource();
            
            this.victoryAudio.currentTime = 0;
            this.victoryAudio.play().then(() => {
                // 3. Restore BGM after ~4 seconds
                setTimeout(() => {
                    if (!this.isMuted && !this.bgmAudio.paused) {
                        // Smooth restore (simple steps)
                        let v = 0.1;
                        const restoreInterval = setInterval(() => {
                             v += 0.05;
                             if (v >= 0.6) { v = 0.6; clearInterval(restoreInterval); }
                             this.bgmAudio.volume = v;
                        }, 100);
                    }
                }, 4000);
            }).catch(e => console.warn("Victory Play failed", e));
            break;

        case 'CLICK':
            this.playTone(800, 'sine', 0.05, t, 0.1);
            break;
        case 'SWITCH':
            this.playTone(600, 'sine', 0.05, t, 0.05);
            break;
        case 'ERROR':
            this.playTone(150, 'sawtooth', 0.15, t, 0.1);
            break;
        case 'UNLOCK':
            this.playTone(523.25, 'sine', 0.1, t, 0.1); 
            this.playTone(659.25, 'sine', 0.2, t + 0.1, 0.1); 
            break;
        case 'SUCCESS':
             this.playTone(880, 'sine', 0.1, t, 0.1);
             break;
    }
  }

  // Synthesizer for UI sound effects (keeps app light)
  private playTone(freq: number, type: OscillatorType, duration: number, startTime: number, vol: number) {
      if (!this.ctx) return;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);
      
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(vol, startTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('logicmind_muted', String(this.isMuted));
    
    if (this.isMuted) {
        this.stopBGM();
        this.victoryAudio.pause();
        this.victoryAudio.currentTime = 0;
        if (this.ctx) this.ctx.suspend();
    } else {
        if (this.ctx) this.ctx.resume();
        this.startBGM();
    }

    return this.isMuted;
  }

  public getMutedState() {
    return this.isMuted;
  }
}

export const soundManager = SoundManager.getInstance();
