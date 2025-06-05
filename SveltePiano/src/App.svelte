<script lang="ts">
  import svelteLogo from './assets/svelte.svg'
  import viteLogo from '/vite.svg'
  import Counter from './lib/Counter.svelte'
  import ThePanel from './components/Panel/ThePanel.svelte'
  import TheKeyboard from './components/Keyboard/TheKeyboard.svelte'
  import TheSheet from './components/Sheet/TheSheet.svelte'
  import { setContext } from 'svelte'

  let engine = $state({})
  let isEngineReady = $state(false)
  
  setContext('engine', {
    get: () => engine,
    set: (value) => { engine = value }
  })

  function assignApp(engineInstance) {
    console.log('The engine is ready', engineInstance)
    engine = engineInstance
    isEngineReady = true
    window.engine = engineInstance
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
