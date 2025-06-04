<script lang="ts">
  import Key from './Key.svelte'

  interface Props {
    keyWidth: number
    octaveWidth: number
    octave: number
  }

  let { keyWidth, octaveWidth, octave }: Props = $props()

  let keyRefs: { [key: string]: Key } = {}

  const whiteKeyWidth = $derived(keyWidth * 2)

  export function pressKey(note: string) {
    keyRefs[note]?.pressKey()
  }

  export function releaseKey(note: string) {
    keyRefs[note]?.releaseKey()
  }
</script>

<div class="octave" style="width: {octaveWidth}px">
  <div class="white-keys">
    <Key 
      bind:this={keyRefs.C}
      classType="white-key"
      style="width: {whiteKeyWidth}px"
      note="C" 
      midiNumber={octave * 12 + 0}
    />
    <Key 
      bind:this={keyRefs.D}
      classType="white-key" 
      style="width: {whiteKeyWidth}px"
      note="D" 
      midiNumber={octave * 12 + 2}
    />
    <Key 
      bind:this={keyRefs.E}
      classType="white-key" 
      style="width: {whiteKeyWidth}px"
      note="E" 
      midiNumber={octave * 12 + 4}
    />
    <Key 
      bind:this={keyRefs.F}
      classType="white-key" 
      style="width: {whiteKeyWidth}px"
      note="F" 
      midiNumber={octave * 12 + 5}
    />
    <Key 
      bind:this={keyRefs.G}
      classType="white-key" 
      style="width: {whiteKeyWidth}px"
      note="G" 
      midiNumber={octave * 12 + 7}
    />
    <Key 
      bind:this={keyRefs.A}
      classType="white-key" 
      style="width: {whiteKeyWidth}px"
      note="A" 
      midiNumber={octave * 12 + 9}
    />
    <Key 
      bind:this={keyRefs.B}
      classType="white-key" 
      style="width: {whiteKeyWidth}px"
      note="B" 
      midiNumber={octave * 12 + 11}
    />
  </div>
  <div class="black-keys">
    <Key 
      bind:this={keyRefs['C#']}
      classType="black-key" 
      style="width: {keyWidth}px; left: {2 + keyWidth}px"
      note="C#" 
      midiNumber={octave * 12 + 1}
    />
    <Key 
      bind:this={keyRefs['D#']}
      classType="black-key" 
      style="width: {keyWidth}px; left: {4 + keyWidth * 3}px"
      note="D#" 
      midiNumber={octave * 12 + 3}
    />
    <Key 
      bind:this={keyRefs['F#']}
      classType="black-key" 
      style="width: {keyWidth}px; left: {6 + keyWidth * 6}px"
      note="F#" 
      midiNumber={octave * 12 + 6}
    />
    <Key 
      bind:this={keyRefs['G#']}
      classType="black-key" 
      style="width: {keyWidth}px; left: {4 + keyWidth * 8}px"
      note="G#" 
      midiNumber={octave * 12 + 8}
    />
    <Key 
      bind:this={keyRefs['A#']}
      classType="black-key" 
      style="width: {keyWidth}px; left: {keyWidth * 10}px"
      note="A#" 
      midiNumber={octave * 12 + 10}
    />
  </div>
</div>

<style>
  .octave {
    height: 100%;
    margin: 0;
    padding: 0;
    position: relative;
  }

  .white-keys {
    display: flex;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    position: absolute;
  }

  .black-keys {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    top: 0;
    left: 0;
    position: absolute;
  }

  :global(.white-key) {
    height: 100%;
    border: 1px solid;
    border-radius: 5px;
    background-color: whitesmoke;
    margin: 0;
    padding: 0;
    box-shadow: inset 0 0 5px #4d4c4c;
  }

  :global(.black-key) {
    height: calc(100% / 1.5);
    border-radius: 5px;
    background-color: rgb(49, 49, 49);
    margin: 0;
    padding: 0;
    position: absolute;
    border: 1px solid black;
    box-shadow: 0px 0px 5px #4d4c4c;
  }
</style>