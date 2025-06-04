<script lang="ts">
  import { onMount, getContext } from 'svelte'
  import Octave from './KeyOctave.svelte'
  import piano from '../game/Piano'
  import keyboardMapping from '../utils/keyboardMapping'
  import { keysToBePressed } from '../game/Note'
  import _ from 'lodash'

  interface Props {
    octaveAmount?: number
    startingOctave?: number
  }

  let { octaveAmount = 7, startingOctave = 2 }: Props = $props()
  
  const engineContext = getContext('engine') as any;
  
  let keyboard: HTMLDivElement
  let octaves: Octave[] = []
  let sheetWidth = $state(null)
  let octaveWidth = $state<null|number>(null) 
  let keyWidth = $state<null|number>(null)
  let availableInputs = $state(null)
  let selectedInput = $state(null)

  const octaveRange = $derived(_.range(startingOctave, startingOctave + octaveAmount))

  onMount(() => {
    octaveWidth = keyboard.offsetWidth / octaveAmount
    keyWidth = octaveWidth / 12

    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') engineContext.get().stepBackward()
      if (e.key === 'ArrowRight') engineContext.get().stepForward()
      if (!keyboardMapping[e.key]) return
      
      const { octave, pitch, midi } = keyboardMapping[e.key]
      if (keysToBePressed.has(midi)) {
        keysToBePressed.delete(midi)
        engineContext.get().keysBeingPressed.add(midi)
        engineContext.get().start()
      }
      piano.keyDown({ midi })
      octaves[octave - 1]?.pressKey(pitch)
    })

    window.addEventListener('keyup', (e) => {
      if (!keyboardMapping[e.key]) return
      const { octave, pitch, midi } = keyboardMapping[e.key]
      piano.keyUp({ midi })
      octaves[octave - 1]?.releaseKey(pitch)
    })

    window.addEventListener('note-on', (e) => {
      const { octave, pitch, midi, velocity } = e.detail
      if (keysToBePressed.has(midi)) {
        keysToBePressed.delete(midi)
        engineContext.get().keysBeingPressed.add(midi)
        engineContext.get().start()
      }
      piano.keyDown({ midi, velocity })
      octaves[octave - 1]?.pressKey(pitch)
    })

    window.addEventListener('note-off', (e) => {
      const { octave, pitch, midi, velocity } = e.detail
      piano.keyUp({ midi, velocity })
      octaves[octave - 1]?.releaseKey(pitch)
    })
  })
</script>

<div id="keyboard" bind:this={keyboard}>
  {#each octaveRange as k, index}
    <Octave 
      bind:this={octaves[index]}
      {octaveWidth}
      {keyWidth}
      octave={k}
    />
  {/each}
</div>

<style>
  #keyboard {
    display: flex;
    margin-top: -5px;
    margin-bottom: 0px;
    background-color: black;
  }
</style>