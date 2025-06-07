<script lang="ts">
  import { Midi } from '@tonejs/midi'
  import PanelTemplate from './PanelTemplate.svelte'
  import { readFile } from '../../utils/helpers'
  import Engine from '../../game/Engine'
  
  let selectedSong = $state('Mozart - Rondo Alla Turca')
  let fileContent = $state(null)
  let fileInput: HTMLInputElement

  function loadFile(event: Event) {
    console.log('loading the file')
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    console.log(file)
    
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result
        if (result) {
          const midi = new Midi(result as ArrayBuffer)
          const engine = Engine.instance
          if (engine) {
            engine.placeSong(midi, file.name)
          }
        }
      }
      reader.readAsArrayBuffer(file)
    }
  }

  async function loadPredefinedSong() {
    const engine = Engine.instance
    if (engine) {
      const midiFile = await readFile('MozartWolfgangAmadeus_AllaTurcaRondo.midi')
      engine.placeSong(midiFile, selectedSong)
    }
  }
</script>

<PanelTemplate title="Song Select">
  {#snippet children()}
    <div class="row">
      <label for="filereader" class="upload-button">
        <input 
          bind:this={fileInput} 
          onchange={loadFile} 
          type="file" 
          name="filereader" 
          class="file-input" 
          id="filereader" 
        />
        "Icon"
        Upload a midi file
      </label>
    </div>
    <div class="row">
      <label for="songs">Or pick a predefined song:</label>
      <select id="songs" bind:value={selectedSong} name="songs">
        <option label="Mozart - Rondo Alla Turca" value="Mozart - Rondo Alla Turca">Mozart - Rondo Alla Turca</option>
      </select>
      <button class="control" onclick={loadPredefinedSong}>
        Update
      </button>
    </div>
  {/snippet}
</PanelTemplate>

<style>
  :global(::-webkit-file-upload-button) {
    display: none;
  }

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 10px;
  }

  .row label {
    margin-right: 10px;
    white-space: nowrap;
  }

  #filereader {
    font-size: 1em;
    cursor: pointer;
  }

  #songs {
    font-size: 1em;
    background-color: #333;
    border: solid #4f4f4f;
    border-radius: 5px;
    color: white;
  }

  .upload-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 5px 10px;
    background-color: #444;
    color: white;
    font-size: 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    text-align: center;
  }

  .upload-button:hover {
    background-color: #555;
  }

  .file-input {
    display: none;
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
</style>