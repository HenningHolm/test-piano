<script lang="ts">
  import { getContext, onMount } from 'svelte'
  import Piano from '../game/Piano'
  import PanelTemplate from './PanelTemplate.svelte'

  const engine = getContext('engine')

  let isPlaying = $state(false)
  let selectedSong = $state('Mozart - Rondo Alla Turca')
  let checkPianoLoaded = $state(false)
  let fileContent = $state(null)

  onMount(async () => {
    await Piano.load()
    console.log('loaded!')
    checkPianoLoaded = true
  })

  function playPause() {
    isPlaying ? pause() : play()
  }

  function play() {
    isPlaying = true
    const engineInstance = engine.get()
    engineInstance.start()
  }

  function stop() {
    isPlaying = false
    const engineInstance = engine.get()
    engineInstance.stop()
  }

  function pause() {
    isPlaying = false
    const engineInstance = engine.get()
    engineInstance.pause()
  }

  function stepForward() {
    const engineInstance = engine.get()
    engineInstance.stepForward()
  }

  function stepBackward() {
    const engineInstance = engine.get()
    engineInstance.stepBackward()
  }
</script>
<!-- the buttons could be replaced with icons later -->
<PanelTemplate title="Player">
  {#snippet children()}
    <p>{engine.get()?.song?.name || ''}</p>
    {#if checkPianoLoaded}
      <div class="controls">
        <button class="control" disabled={!checkPianoLoaded} onclick={stepBackward}>
          Step Backward
        </button>
        <button class="control" disabled={!checkPianoLoaded} onclick={playPause}>
          {#if isPlaying}
            Pause
          {:else}
            Play
          {/if}
        </button>
        <button class="control" disabled={!checkPianoLoaded} onclick={stop}>
          Stop
        </button>
        <button class="control" disabled={!checkPianoLoaded} onclick={stepForward}>
          Step Forward
        </button>
      </div>
    {:else}
      <div>
        <img src="/loading.gif" style="height:20px" alt="Loading" />
        <div>Loading samples</div>
      </div>
    {/if}
  {/snippet}
</PanelTemplate>

<style>
  .controls {
    display: flex;
    justify-content: space-around;
  }

  .control {
    background-color: #444;
    border: none;
    color: #fff;
    padding: 7px;
    margin: 0 5px;
    cursor: pointer;
    border-radius: 5px;
  }

  .control:hover {
    background-color: #555;
  }

  p {
    margin: 5px 0;
    font-weight: bold;
  }
</style>