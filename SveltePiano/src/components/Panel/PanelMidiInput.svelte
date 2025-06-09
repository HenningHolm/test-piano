<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import WebMidi from 'webmidi';
  import PanelTemplate from './PanelTemplate.svelte'
  import { musicEvents } from '../../game/EventBroker'

  let availableInputs = $state<string[]>([])
  let selectedInput = $state<string | null>(null)
  let midiDevice = $state<any>(null)

  onMount(async () => {
    try {
      await WebMidi.enable()
      console.log('WebMidi enabled!')
      console.log('Inputs:', WebMidi.inputs)
      console.log('Outputs:', WebMidi.outputs)
      updateDeviceList()
      
      // Listen for device changes
      WebMidi.addListener('connected', updateDeviceList)
      WebMidi.addListener('disconnected', updateDeviceList)
    } catch (err) {
      console.error('WebMidi could not be enabled:', err)
    }
  })

  onDestroy(() => {
    // Clean up listeners
    if (midiDevice) {
      midiDevice.removeListener()
    }
    WebMidi.removeListener()
  })

  function updateDeviceList() {
    availableInputs = WebMidi.inputs.map(input => input.name)
    if (availableInputs.length > 0 && !selectedInput) {
      selectedInput = availableInputs[0]
    }
  }

  function selectMidiInput(inputName: string) {
    // Clear previous device listeners
    if (midiDevice) {
      midiDevice.removeListener()
    }

    // Find and setup new device
    midiDevice = WebMidi.getInputByName(inputName)
    if (midiDevice) {
      setupMidiListeners(midiDevice)
    }
  }

  function setupMidiListeners(device: any) {
    // Note on events
    device.addListener('noteon', 'all', (e: any) => {
      const midi = e.note.number
      // Bruk normalized velocity (0-1) som Tone.js Piano forventer!
      const velocity = e.velocity  // 0-1 range, ikke rawVelocity!      
      musicEvents.emit('note-on', { midi, velocity })
    })

    // Note off events
    device.addListener('noteoff', 'all', (e: any) => {
      const midi = e.note.number
      musicEvents.emit('note-off', { midi })
    })
  }

  function refreshMidiDevices() {
    updateDeviceList()
  }

  $effect(() => {
    if (selectedInput) {
      selectMidiInput(selectedInput)
    }
  })
</script>

<PanelTemplate title="Midi Input (WebMidi)">
  {#snippet children()}
    {#if availableInputs.length > 0}
      <select id="midi-inputs" bind:value={selectedInput} name="songs">
        {#each availableInputs as input}
          <option value={input}>{input}</option>
        {/each}
      </select>
    {:else}
      <span>No input available</span>
    {/if}
    <button onclick={refreshMidiDevices}>
      Refresh
    </button>
  {/snippet}
</PanelTemplate>

<style>
  #left-hand-icon {
    transform: scale(-1, 1);
  }
  
  .panel {
    display: flex;
    flex-direction: column;
    text-align: center;
  }
  
  .column {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }
  
  .input {
    margin: 5px;
  }

  select {
    font-size: 1em;
    background-color: rgb(51, 51, 51);
    border: solid rgb(79, 79, 79);
    border-radius: 5px;
    color: white;
    margin-bottom: 10px;
  }

  button {
    background: rgb(0, 123, 255);
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 3px;
    cursor: pointer;
  }
</style>