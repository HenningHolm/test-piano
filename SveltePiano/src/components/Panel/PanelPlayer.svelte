<script lang="ts">
  import { onMount } from 'svelte'
  import soundplayer from '../../game/SoundPlayer'
  import PanelTemplate from './PanelTemplate.svelte'
  import Engine from '../../game/Engine'

  let isPlaying = $state(false)
  let selectedSong = $state('Mozart - Rondo Alla Turca')
  let checkPianoLoaded = $state(false)
  let fileContent = $state(null)

  onMount(async () => {
    await soundplayer.load()
    console.log('loaded!')
    checkPianoLoaded = true
  })

  function playPause() {
    isPlaying ? pause() : play()
  }

  function play() {
    isPlaying = true
    const engineInstance = Engine.instance
    if (engineInstance) {
      engineInstance.start()
    }
  }

  function stop() {
    isPlaying = false
    const engineInstance = Engine.instance
    if (engineInstance) {
      engineInstance.stop()
    }
  }

  function pause() {
    isPlaying = false
    const engineInstance = Engine.instance
    if (engineInstance) {
      engineInstance.pause()
    }
  }

  function stepForward() {
    const engineInstance = Engine.instance
    if (engineInstance) {
      engineInstance.stepForward()
    }
  }

  function stepBackward() {
    const engineInstance = Engine.instance
    if (engineInstance) {
      engineInstance.stepBackward()
    }
  }

  // Reactive computation for song name
  const currentSongName = $derived(Engine.instance?.song?.name || '')
</script>

<PanelTemplate title="Player">
  {#snippet children()}
    <p>{currentSongName}</p>
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