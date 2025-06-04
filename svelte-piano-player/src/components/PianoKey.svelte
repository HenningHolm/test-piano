<script>
  export let note;
  export let isPressed = false;

  function handleMouseDown() {
    isPressed = true;
    dispatch('play', note);
  }

  function handleMouseUp() {
    isPressed = false;
    dispatch('release', note);
  }
</script>

<style>
  .key {
    width: 40px;
    height: 150px;
    background: white;
    border: 1px solid #ccc;
    display: inline-block;
    position: relative;
    cursor: pointer;
    transition: background 0.1s;
  }

  .key:active {
    background: #ddd;
  }

  .key.pressed {
    background: #aaa;
  }
</style>

<div
  class="key {isPressed ? 'pressed' : ''}"
  on:mousedown={handleMouseDown}
  on:mouseup={handleMouseUp}
  on:mouseleave={handleMouseUp}
>
  {note}
</div>