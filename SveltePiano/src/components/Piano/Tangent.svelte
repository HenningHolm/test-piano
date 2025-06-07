<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { color } from 'd3-color'
  import { colorScale } from '../../game/Note'
  import { musicEvents } from '../../game/EventBroker';

  interface Props {
    velocity?: number
    note?: string
    midiNumber?: number
    classType?: string
    style?: string
  }

  let { velocity = 0, note = '', midiNumber = 0, classType = '', style = '' }: Props = $props()

  let currentVelocity = $state(0)
  let unsubscribeReset: (() => void) | null = null

  // Beregn farge basert på MIDI nummer (note-basert, ikke octave-basert)
  const keyColor = $derived(color(colorScale(midiNumber)))

  onMount(() => {
    unsubscribeReset = musicEvents.on('reset', () => {
      releaseKey()
    })
  })

  onDestroy(() => {
    if (unsubscribeReset) {
      unsubscribeReset()
    }
  })

  export function pressKey(vel: number = 100) {
    currentVelocity = vel
  }

  export function releaseKey() {
    currentVelocity = 0
  }
</script>

<div 
  class="{classType}"
  class:pressed={currentVelocity} 
  style="{style}{currentVelocity ? `; background-color: ${keyColor}; box-shadow: 0 5px #666;` : ''}"
>
  <!-- <span>{note}</span> -->
</div>

<style>
  .pressed {
    box-shadow: 0 5px #666;
  }
</style>