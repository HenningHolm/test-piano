<script lang="ts">
  import { onMount, onDestroy, getContext } from 'svelte'
  import Octave from './TangentOctave.svelte'
  import piano from '../../game/Piano'

  import { keysToBePressed } from '../../game/Note'
  import { musicEvents } from '../../game/EventBroker'
  import Engine from '../../game/Engine'
  import { midiToOctavePitch } from '../../utils/midiHelpers';

  interface Props {
    octaveAmount?: number
    startingOctave?: number
  }

  let { octaveAmount = 7, startingOctave = 2 }: Props = $props()
  
  let keyboard: HTMLDivElement
  let octaves: Octave[] = []
  let octaveWidth = $state<null|number>(null) 
  let keyWidth = $state<null|number>(null)
  let unsubscribeFunctions: Array<() => void> = []

  const octaveRange = $derived(Array.from({ length: octaveAmount }, (_, i) => startingOctave + i))

  onMount(() => {
    octaveWidth = keyboard.offsetWidth / octaveAmount
    keyWidth = octaveWidth / 12

    // Replace window events with EventBroker - keep same logic
    const unsubNoteOn = musicEvents.on('note-on', (e) => {
      const { midi, velocity } = e;
      const { octave, pitch } = midiToOctavePitch(midi);


      if (keysToBePressed.has(midi)) {
        keysToBePressed.delete(midi)
        Engine.instance?.keysBeingPressed.add(midi)
        Engine.instance?.start()
      }
      piano.keyDown({ midi, velocity })
      octaves[octave - 1]?.pressKey(pitch)
    })

    const unsubNoteOff = musicEvents.on('note-off', (e) => {
      const { midi } = e;
        const { octave, pitch } = midiToOctavePitch(midi);
      piano.keyUp({ midi });
      octaves[octave - 1]?.releaseKey(pitch);
    })

    unsubscribeFunctions.push(unsubNoteOn, unsubNoteOff)
  })

  onDestroy(() => {
    unsubscribeFunctions.forEach(unsub => unsub())
  })
</script>

<div id="piano" bind:this={keyboard}>
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
  #piano {
    display: flex;
    margin-top: -5px;
    margin-bottom: 0px;
    background-color: black;
  }
</style>