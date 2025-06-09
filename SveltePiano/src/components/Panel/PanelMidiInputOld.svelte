<script lang="ts">
  import { onMount } from 'svelte'
  import PanelTemplate from './PanelTemplate.svelte'
  import { musicEvents } from '../../game/EventBroker'

  let availableInputs = $state<string[]>([])
  let selectedInput = $state<string | null>(null)
  let midiDevice = $state<any>(null)

  onMount(() => {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess()
        .then(midiAccess => {
          console.log('MIDI ready!')
          updateDeviceList(midiAccess)
          midiAccess.onstatechange = () => updateDeviceList(midiAccess)
        })
        .catch(err => console.log('Something went wrong', err))
    }
  })

  function updateDeviceList(midiAccess: any) {
    const inputs = midiAccess.inputs.values()
    availableInputs = []
    for (const input of inputs) {
      availableInputs.push(input.name)
    }
    if (availableInputs.length > 0) {
      selectedInput = availableInputs[0]
    }
  }

  function selectMidiInput(inputName: string) {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess()
        .then(midiAccess => {
          const inputs = midiAccess.inputs.values()
          for (const input of inputs) {
            if (input.name === inputName) {
              if (midiDevice) {
                midiDevice.onmidimessage = null
              }
              
              midiDevice = input
              setupMidiListeners(input)
              break
            }
          }
        })
    }
  }

  function setupMidiListeners(device: any) {
    device.onmidimessage = (message: any) => {
      const [command, note, velocity] = message.data
      if (command === 144 && velocity > 0) { // Note on
        // Send bare MIDI nummer - la Note.ts beregne octave/pitch
        musicEvents.emit('note-on', { midi: note, velocity })
      } else if (command === 128 || (command === 144 && velocity === 0)) { // Note off
        // Send bare MIDI nummer - la Note.ts beregne octave/pitch  
        musicEvents.emit('note-off', { midi: note })
      }
    }
  }

  function refreshMidiDevices() {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess()
        .then(midiAccess => updateDeviceList(midiAccess))
        .catch(err => console.log('Error refreshing MIDI devices', err))
    }
  }

  $effect(() => {
    if (selectedInput) {
      selectMidiInput(selectedInput)
    }
  })
</script>

<PanelTemplate title="Midi Input">
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