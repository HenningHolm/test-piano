<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { color } from 'd3-color'
  import { colorScale } from '../../game/Note'
  import { musicEvents } from '../../game/EventBroker'

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

  const keyColor = $derived(color(colorScale(midiNumber)))

  onMount(() => {
    // Replace window event with EventBroker
    unsubscribeReset = musicEvents.on('reset', () => {
      releaseKey()
    })
  })

  onDestroy(() => {
    if (unsubscribeReset) {
      unsubscribeReset()
    }
  })

  export function pressKey(vel: number, midi: number) {
    // piano.keyDown({ midi: 72 });
    currentVelocity = 100
  }

  export function releaseKey(midi?: number) {
    currentVelocity = 0
    // piano.keyUp({ midi: midiNumber });
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