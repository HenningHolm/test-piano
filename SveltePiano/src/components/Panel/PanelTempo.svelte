<script lang="ts">
  import { getContext } from 'svelte'
  import PanelTemplate from './PanelTemplate.svelte'

  const engine = getContext('engine')
  
  let tempo = $state(120)

  function updateTempo() {
    const engineInstance = engine.get()
    if (engineInstance) {
      engineInstance.tempoChange(tempo)
    }
  }

  // Listen to tempo changes from engine
  $effect(() => {
    const engineInstance = engine.get()
    if (engineInstance) {
      engineInstance.on('tempoChange', (newTempo: number) => {
        tempo = newTempo
      })
    }
  })
</script>

<PanelTemplate title="Tempo (bpm)">
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
      id="tempoInput"
      type="number" 
      name="tempoInput"
      bind:value={tempo}
      oninput={updateTempo}
    />
  </div>
</PanelTemplate>

<style>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  input[type="range"] {
    margin-right: 10px;
  }

  input[type="number"] {
    font-size: smaller;
    height: 20px;
    width: 50px;
    margin-top: 5px;
    padding: 5px;
    border-radius: 5px;
    border: none;
  }
</style>