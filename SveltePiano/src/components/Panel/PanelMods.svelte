<script lang="ts">
  import PanelTemplate from './PanelTemplate.svelte'
  import Engine from '../../game/Engine'

  let leftHand = $state(true)
  let rightHand = $state(true)
  let mode = $state('playAlong')

  function updateLeftHand() {
    const engine = Engine.instance
    if (engine) {
      engine.leftHand = leftHand
    }
  }

  function updateRightHand() {
    const engine = Engine.instance
    if (engine) {
      engine.rightHand = rightHand
    }
  }

  function updateMode() {
    const engine = Engine.instance
    if (engine) {
      engine.updateMode(mode)
    }
  }

  $effect(() => {
    updateLeftHand()
  })

  $effect(() => {
    updateRightHand()
  })

  $effect(() => {
    updateMode()
  })
</script>

<PanelTemplate title="Mode">
  {#snippet children()}
    <div class="row">
      <!-- <FontAwesomeIcon id="left-hand-icon" icon={faHand} /> -->
      Left hand
      <input 
        class="input" 
        type="checkbox" 
        name="left-hand" 
        bind:checked={leftHand}
      />
      <input 
        class="input" 
        type="checkbox" 
        name="right-hand" 
        bind:checked={rightHand}
      />
      <!-- <FontAwesomeIcon icon={faHand} /> -->
       Right hand
    </div>
    <div class="row">
      <div class="row">
        <input 
          class="mode" 
          id="play-along" 
          type="radio" 
          name="mode" 
          value="playAlong" 
          bind:group={mode}
        />
        <label for="play-along">Play along</label>
      </div>
      <div class="row">
        <input 
          class="mode" 
          id="wait-input" 
          type="radio" 
          name="mode" 
          value="waitInput" 
          bind:group={mode}
        />
        <label for="wait-input">Wait for input</label>
      </div>
    </div>
  {/snippet}
</PanelTemplate>

<style>
  #left-hand-icon {
    transform: scale(-1, 1);
  }

  .row {
    display: flex;
    flex-direction: row;
    padding-right: 5px;
    padding-left: 5px;
    align-items: center;
    justify-content: center;
    margin-bottom: 5px;
  }

  .input {
    margin: 5px;
  }

  label {
    margin-left: 5px;
    font-size: 0.9rem;
  }
</style>