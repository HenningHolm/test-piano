<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import keyboardMapping from '../../utils/keyboardMapping'
  import { musicEvents } from '../../game/EventBroker'
  import Engine from '../../game/Engine'

  let pressedKeys = new Set<string>()

  onMount(() => {
    window.addEventListener('keydown', handleKeydown)
    window.addEventListener('keyup', handleKeyup)
  })

  onDestroy(() => {
    window.removeEventListener('keydown', handleKeydown)
    window.removeEventListener('keyup', handleKeyup)
  })

  function handleKeydown(e: KeyboardEvent) {
    // Navigation controls
    if (e.key === 'ArrowLeft') {
      Engine.instance?.stepBackward()
      return
    }
    if (e.key === 'ArrowRight') {
      Engine.instance?.stepForward()
      return
    }

    // Piano key input
    if (e.repeat || pressedKeys.has(e.key)) return
    
    const mapping = keyboardMapping[e.key]
    if (mapping) {
      const { midi } = mapping  // Kun MIDI nummer
      pressedKeys.add(e.key)
      
      // Send kun MIDI - la ThePiano beregne octave/pitch
      musicEvents.emit('note-on', { midi }) // Standard velocity
    }
  }

  function handleKeyup(e: KeyboardEvent) {
    if (!pressedKeys.has(e.key)) return
    
    const mapping = keyboardMapping[e.key]
    if (mapping) {
      const { midi } = mapping
      pressedKeys.delete(e.key)
      
      musicEvents.emit('note-off', { midi })
    }
  }
</script>

<!-- No visual component - just event handling -->