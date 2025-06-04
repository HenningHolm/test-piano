<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  
  // Store to manage MIDI devices
  export const midiDevices = writable({
    inputs: [],
    outputs: [],
    selectedInput: null,
    selectedOutput: null
  });

  let inputs = [];
  let outputs = [];
  let selectedInput = null;
  let selectedOutput = null;

  onMount(() => {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
    } else {
      console.error('Web MIDI API is not supported in this browser.');
    }
  });

  function onMIDISuccess(midiAccess) {
    inputs = Array.from(midiAccess.inputs.values());
    outputs = Array.from(midiAccess.outputs.values());
    midiDevices.set({ inputs, outputs, selectedInput, selectedOutput });
  }

  function onMIDIFailure() {
    console.error('Could not access your MIDI devices.');
  }

  function selectInput(event) {
    selectedInput = event.target.value;
    midiDevices.update(devices => ({ ...devices, selectedInput }));
  }

  function selectOutput(event) {
    selectedOutput = event.target.value;
    midiDevices.update(devices => ({ ...devices, selectedOutput }));
  }
</script>

<div class="midi-controls">
  <h2>MIDI Controls</h2>
  <div>
    <label for="midi-inputs">MIDI Inputs:</label>
    <select id="midi-inputs" on:change={selectInput}>
      <option value="">Select Input</option>
      {#each $midiDevices.inputs as input}
        <option value={input.name}>{input.name}</option>
      {/each}
    </select>
  </div>
  <div>
    <label for="midi-outputs">MIDI Outputs:</label>
    <select id="midi-outputs" on:change={selectOutput}>
      <option value="">Select Output</option>
      {#each $midiDevices.outputs as output}
        <option value={output.name}>{output.name}</option>
      {/each}
    </select>
  </div>
</div>

<style>
  .midi-controls {
    margin: 20px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  label {
    margin-right: 10px;
  }

  select {
    margin-bottom: 10px;
  }
</style>