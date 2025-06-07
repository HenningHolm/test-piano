<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import PanelTemplate from './PanelTemplate.svelte'
  import { musicEvents } from '../../game/EventBroker'
  import Engine from '../../game/Engine'
  
  let tempo = $state(120)
  let unsubscribeReset: (() => void) | null = null

  onMount(() => {
    // Listen to tempo changes from EventBroker instead of engine context
    unsubscribeReset = musicEvents.on('tempo-change', (data: { bpm: number }) => {
      tempo = data.bpm
    })
  })

  onDestroy(() => {
    if (unsubscribeReset) {
      unsubscribeReset()
    }
  })

  function updateTempo() {
    const engineInstance = Engine.instance
    if (engineInstance) {
      engineInstance.tempoChange(tempo)
    }
  }
</script>

<PanelTemplate title="Tempo (bpm)">
  {#snippet children()}
    <div class="container">
      <input 
        id="tempo"
        type="range" 
        name="tempo"
        min="1" 
        max="240"
        step="1"
        bind:value={tempo}
        oninput={updateTempo}
      />
      <input 
        id="tempo-number"
        type="number" 
        name="tempo-number"
        min="1" 
        max="240"
        step="1"
        bind:value={tempo}
        oninput={updateTempo}
      />
    </div>
  {/snippet}
</PanelTemplate>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  #tempo {
    width: 100%;
  }

  #tempo-number {
    width: 80px;
    text-align: center;
    background-color: #333;
    border: 1px solid #555;
    color: white;
    border-radius: 3px;
    padding: 5px;
  }
</style>