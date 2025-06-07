<script lang="ts">
  import ThePanel from './components/Panel/ThePanel.svelte'
  import TheKeyboard from './components/Keyboard/TheKeyboard.svelte'
  import TheSheet from './components/Sheet/TheSheet.svelte'
  // import KeyboardInputs from './components/Inputs/KeyboardInputs.svelte'

  let isEngineReady = $state(false)

  function assignApp(engineInstance: any) {
    console.log('The engine is ready', engineInstance)
    isEngineReady = true
    // Ikke nødvendig å lagre engine - bruker Engine.instance direkte
  }
</script>

  <div id="game">
    {#if isEngineReady}
      <ThePanel />
    {/if}
    <TheSheet onEngineReady={assignApp} />
    {#if isEngineReady}
      <TheKeyboard />
    {/if}
  </div>


<style>
  :global(body) {
  min-height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
  #game {
    width: 100vw;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: 15vh 70vh 15vh;
    grid-template-areas:
      "panel panel panel panel"
      "sheet sheet sheet sheet"
      "keyboard keyboard keyboard keyboard";
  }

  :global(#panel) {
    grid-area: panel;
  }

  :global(#sheet) {
    grid-area: sheet;
    border: solid 1px black;
  }

  :global(#keyboard) {
    grid-area: keyboard;
  }

  :global(*) {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  @media screen and (max-height: 992px) {
    :global(body) {
      font-size: 2vh;
    }
  }
</style>
