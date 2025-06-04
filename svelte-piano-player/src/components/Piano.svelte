<script>
  import { onMount } from 'svelte';
  import PianoKey from './PianoKey.svelte';
  import { pianoStore } from '../stores/piano.js';
  import { playNote, stopNote } from '../lib/audio.js';

  let keys = [
    { note: 'C4', pressed: false },
    { note: 'D4', pressed: false },
    { note: 'E4', pressed: false },
    { note: 'F4', pressed: false },
    { note: 'G4', pressed: false },
    { note: 'A4', pressed: false },
    { note: 'B4', pressed: false },
    { note: 'C5', pressed: false },
  ];

  const handleKeyPress = (note) => {
    playNote(note);
    pianoStore.update(store => {
      const key = store.keys.find(k => k.note === note);
      if (key) key.pressed = true;
      return store;
    });
  };

  const handleKeyRelease = (note) => {
    stopNote(note);
    pianoStore.update(store => {
      const key = store.keys.find(k => k.note === note);
      if (key) key.pressed = false;
      return store;
    });
  };

  onMount(() => {
    // Initialize MIDI or other setup if needed
  });
</script>

<style>
  .piano {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    height: 200px;
    background: #fff;
    border: 1px solid #000;
  }
</style>

<div class="piano">
  {#each keys as { note, pressed }}
    <PianoKey 
      note={note} 
      pressed={pressed} 
      on:press={() => handleKeyPress(note)} 
      on:release={() => handleKeyRelease(note)} 
    />
  {/each}
</div>