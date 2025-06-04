<script lang="ts">
  import { onMount } from 'svelte'
  import initialize from '../game/Sketch'

  interface Props {
    onEngineReady: (engine: any) => void
  }

  let { onEngineReady }: Props = $props()
  let canvas: HTMLCanvasElement

  onMount(async () => {
    const engine = await initialize(canvas)
    onEngineReady(engine)
  })
</script>

<div id="sheet">
  <canvas bind:this={canvas} style="height: 100%; width: 100%;"></canvas>
</div>