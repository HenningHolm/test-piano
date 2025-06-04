<script lang="ts">
  import PanelMidiInput from './PanelMidiInput.svelte'
  import PanelSongSelect from './PanelSongSelect.svelte'
  import PanelPlayer from './PanelPlayer.svelte'
  import PanelMods from './PanelMods.svelte'
  import PanelTempo from './PanelTempo.svelte'
  import BuyMeACoffee from './BuyMeACoffee.svelte'
  import AboutAuthor from './AboutAuthor.svelte'
</script>

<div id="panel">
  <h2>
    <a href="/">Web Piano</a>
  </h2>
  <PanelSongSelect />
  <PanelPlayer />
  <PanelMods />
  <PanelTempo />
  <PanelMidiInput />

  <!-- <BuyMeACoffee /> -->
  <!-- <AboutAuthor /> -->
</div>

<style>
  :global(body) {
    font-family: 'Poppins', sans-serif;
  }

  #panel {
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: #333;
    color: #fff;
    padding: 10px 20px;
  }

  .panel {
    display: flex;
    font-size: 12px;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    text-align: center;
  }

  #panel a {
    color: #fff;
    text-decoration: none;
    font-size: 16px;
    font-weight: bold;
  }

  :global(.control) {
    background-color: #444;
    border: none;
    color: #fff;
    padding: 2px;
    margin: 0 5px;
    cursor: pointer;
    border-radius: 5px;
  }

  :global(#icon-container) {
    display: flex;
    justify-content: space-evenly;
  }

  :global(#about) {
    padding: 5px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
</style>