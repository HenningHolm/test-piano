# Web Piano

A modern, interactive web-based piano application built with Svelte 5, TypeScript, PIXI.js, and Tone.js. Features real-time MIDI visualization, interactive gameplay modes, and comprehensive piano controls.

![Web Piano Screenshot](screenshot.png)

## 🎹 Features

- **Interactive Piano Keyboard**: Visual piano with keyboard and MIDI input support
- **MIDI File Support**: Load and play standard MIDI files with visual note falling
- **Multiple Play Modes**: 
  - Play Along: Notes fall automatically with tempo
  - Wait for Input: Pauses until correct keys are pressed
- **Real-time Visualization**: Notes cascade down with particle effects
- **Loop Selection**: Click-drag to create practice loops
- **Hand Selection**: Toggle left/right hand parts independently
- **Tempo Control**: Adjust playback speed
- **Navigation**: Mini-map tracker for quick song navigation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Modern web browser with Web Audio API support

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/web-piano.git
cd web-piano/SveltePiano

# Install dependencies
npm install

# Start development server
npm run dev
```

### Usage

1. **Load a MIDI file**: Use the upload button or select a predefined song
2. **Choose play mode**: Select "Play Along" or "Wait for Input"
3. **Select hands**: Toggle left/right hand parts
4. **Start playing**: Click play button or press spacebar
5. **Navigation**: Click on tracker to jump to positions
6. **Loop practice**: Drag on tracker to create practice loops

## 🏗️ Architecture Overview

### Core Game Engine (`src/game/`)

The application is built around a central game engine that coordinates all systems:

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   Engine    │◄──►│     Song     │◄──►│    Notes    │
│ (Singleton) │    │ (MIDI Data)  │    │ (Sprites)   │
└─────────────┘    └──────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   Tracker   │    │    Piano     │    │ Particles   │
│ (Mini-map)  │    │ (Audio Out)  │    │ (Effects)   │
└─────────────┘    └──────────────┘    └─────────────┘
```

#### Engine.ts - Central Controller
**Singleton pattern** that manages the entire application state.

```typescript
class Engine extends EventFactory {
  static instance: Engine | null = null
  
  // Core systems
  pixi: Application        // PIXI.js rendering engine
  song: Song | null       // Current loaded MIDI song
  emitterContainer        // Particle effects container
  
  // Game state
  tempo: number | null
  keysBeingPressed: Set<number>  // Active keys for wait-input mode
  mode: string            // 'playAlong' | 'waitInput'
  leftHand: boolean       // Enable/disable left hand
  rightHand: boolean      // Enable/disable right hand
}
```

**Key Methods:**
- `placeSong(midi, fileName)`: Loads MIDI data and creates visual elements
- `gameLoop()`: Main update cycle (runs every frame)
- `start/pause/stop()`: Playback controls
- `stepForward/stepBackward()`: Manual navigation
- `enableLooping(limits, callback)`: Practice loop functionality

#### Song.ts - MIDI Data Container
Wraps MIDI data and converts it to playable game objects.

```typescript
class Song {
  durationTicks: number    // Total song length in MIDI ticks
  notes: Note[]           // All playable notes as sprites
  tracker: Tracker        // Mini-map visualization
  container: Container    // PIXI container for rendering
  
  // Position management (getter/setter)
  position: number        // Current playback position
}
```

**MIDI Processing Pipeline:**
1. Raw MIDI file → `@tonejs/midi` parser
2. MIDI events → `Note` objects with visual properties
3. Notes positioned based on timing and pitch
4. Tracker generated for navigation

#### Note.ts - Individual Note Logic
Each note is a PIXI Sprite with game logic and visual behavior.

```typescript
class Note extends Sprite {
  // MIDI properties
  note: MidiNote          // Original MIDI data {midi, ticks, durationTicks}
  hand: 'left' | 'right'  // Determined by track index
  
  // Visual properties
  defaultColor: string    // Color based on pitch (D3 Magma scale)
  particle: Promise<Emitter> // Fire particle effect
  
  // Game state
  isNoteOn: boolean       // Currently being triggered
  isPlayed: boolean       // Has been played by user
  hitPosition: number     // Y-coordinate where note triggers
}
```

**Note Lifecycle:**
1. **Initialization**: Calculate position, size, and color from MIDI data
2. **Update Loop**: Move with song position, check for trigger conditions
3. **Note On**: Trigger audio, visual effects when hitting play line
4. **Note Off**: Clean up when note passes play line

**Color System:**
```typescript
const colorScale = scaleSequential()
  .domain([24, OCTAVE_AMOUNT * 12])  // MIDI note range
  .interpolator(interpolateMagma)     // D3 color scale
```

#### Piano.ts - Audio Engine
Wrapper around `@tonejs/piano` for real-time audio synthesis.

```typescript
class PianoWrapper {
  private piano: Piano
  
  async load(): Promise<void>              // Load piano samples
  keyDown({midi, velocity}): void          // Trigger note
  keyUp({midi, velocity}): void            // Release note
  get loaded(): boolean                    // Check if ready
  setVolume(volume: number): void          // Adjust output level
}
```

**Audio Pipeline:**
1. MIDI events (from game or user input) → Piano wrapper
2. `@tonejs/piano` → Web Audio API synthesis
3. Real-time audio output with velocity sensitivity

**Known Issue - Velocity Sensitivity:**
```typescript
// @tonejs/piano is sensitive to velocity values
// Values like 0 and 127 can cause errors
// Solution: Normalize or omit velocity parameter
```

#### Tracker.ts - Navigation & Mini-map
Provides song overview and navigation controls.

```typescript
class Tracker {
  horizontalRatio: number  // Converts song position ↔ pixels
  verticalRatio: number   // Converts MIDI notes ↔ pixels  
  cursor: Sprite          // Current position indicator
  container: Container    // Visual elements
  
  // Interaction
  enableListener()        // Click navigation
  dragObjects: [Sprite, Sprite, Graphics] // Loop selection UI
}
```

**Features:**
- **Visual Overview**: All notes shown as gray rectangles
- **Click Navigation**: Jump to any song position
- **Drag Selection**: Create practice loops by dragging
- **Real-time Cursor**: Shows current playback position

#### EventFactory.ts - Communication System
Simple pub/sub system for loose coupling between components.

```typescript
class EventFactory {
  private _events: Record<string, EventListener[]> = {}
  
  on<T>(name: string, listener: EventListener<T>): void
  emit<T>(name: string, data?: T): void
  removeListener<T>(name: string, listener: EventListener<T>): void
}
```

**Usage Pattern:**
```typescript
// Subscribe to events
engine.on('tempoChange', (newTempo) => updateUI(newTempo))

// Emit events
engine.emit('tempoChange', 120)
```

### Visual Effects (`src/game/`)

#### FireParticle.ts - Particle System
Creates colored particle effects for each note using `@barvynkoa/particle-emitter`.

```typescript
class FireParticle {
  async fetchAssets()     // Load particle textures
  initialize(container, definitions, color): Emitter
}
```

**Particle Behavior:**
- Color-matched to note's pitch color
- Triggered on note activation
- Fire-like upward movement with fade
- Configurable lifetime, speed, and opacity

#### drag.ts - Interaction Handler
Manages drag interactions for loop selection in the tracker.

```typescript
function drag(tracker: Tracker): [Sprite, Sprite, Graphics] {
  // Returns UI elements: [firstCursor, secondCursor, selectedArea]
  // Handles: pointerdown, pointermove, pointerup events
  // Coordinates: Engine's looping system
}
```

### Utilities (`src/utils/`)

#### helpers.ts - Utility Functions
```typescript
// File loading
readFile(fileName: string): Promise<Midi>

// Animation timing
bpm2px(bpm: number, deltaTime: number): number

// Iterator utilities  
makeRangeIterator<T>(start: number, array: T[]): Generator<T>
```

#### keyboardMapping.ts - Key Bindings
Maps keyboard keys to MIDI notes for computer keyboard playing.

```typescript
export default {
  'Tab': { midi: 36, octave: 2, pitch: 'C' },
  '1': { midi: 37, octave: 2, pitch: 'C#' },
  // ... complete keyboard mapping
} as { [key: string]: { midi: number; octave: number; pitch: string } }
```

## 🎨 Svelte Components (`src/components/`)

### Application Structure

```
App.svelte
├── TheKeyboard.svelte          # Main piano keyboard
│   └── KeyOctave.svelte       # Single octave container
│       └── Key.svelte         # Individual piano key
├── Panel/
│   ├── PanelPlayer.svelte     # Playback controls
│   ├── PanelSongSelect.svelte # MIDI file selection
│   ├── PanelMode.svelte       # Game mode settings
│   ├── PanelMidiInput.svelte  # MIDI device input
│   └── PanelTemplate.svelte   # Reusable panel wrapper
└── PixiCanvas.svelte          # PIXI.js rendering surface
```

### Component Details

#### App.svelte - Root Component
```svelte
<script lang="ts">
  // Context setup
  const engineStore = {
    get: () => Engine.instance,
    set: (engine) => Engine.instance = engine
  }
  
  setContext('engine', engineStore)
</script>

<!-- Layout -->
<div class="app">
  <PixiCanvas />          <!-- Game rendering -->
  <div class="controls">  
    <Panel components />   <!-- UI controls -->
  </div>
  <TheKeyboard />         <!-- Piano interface -->
</div>
```

#### PixiCanvas.svelte - Rendering Surface
```svelte
<script lang="ts">
  import { initialize } from '../game/Sketch'
  
  let canvas: HTMLCanvasElement
  let engine: Engine
  
  onMount(async () => {
    engine = await initialize(canvas)
    engineContext.set(engine)
  })
</script>

<canvas bind:this={canvas}></canvas>
```

**Responsibilities:**
- Initialize PIXI.js application
- Create Engine instance
- Provide rendering surface
- Handle canvas sizing

#### TheKeyboard.svelte - Piano Interface
```svelte
<script lang="ts">
  // Keyboard layout
  const octaveRange = $derived(
    Array.from({ length: octaveAmount }, (_, i) => startingOctave + i)
  )
  
  // Event handling
  onMount(() => {
    window.addEventListener('keydown', handleKeydown)
    window.addEventListener('note-on', handleNoteOn)   // From MIDI/game
    window.addEventListener('note-off', handleNoteOff)
  })
</script>
```

**Features:**
- Responsive layout based on screen width
- Computer keyboard input mapping
- MIDI device input support
- Visual feedback for pressed keys
- Integration with game note events

#### Panel Components
**PanelTemplate.svelte** - Reusable wrapper:
```svelte
<script lang="ts">
  interface Props {
    title: string
  }
  
  let { title, children }: Props = $props()
</script>

<div class="panel">
  <h3>{title}</h3>
  {@render children()}
</div>
```

**PanelPlayer.svelte** - Playback controls:
- Play/Pause/Stop buttons
- Step forward/backward
- Loading state management
- Piano sample loading coordination

**PanelSongSelect.svelte** - File management:
- MIDI file upload (drag & drop)
- Predefined song selection
- File parsing and validation

**PanelMode.svelte** - Game settings:
- Play mode selection (playAlong/waitInput)
- Left/right hand toggles
- Visual indicators

**PanelMidiInput.svelte** - Device management:
- MIDI device detection
- Input source selection
- Real-time MIDI event handling

### State Management

#### Context-based Architecture
```typescript
// Engine context for global state
const engineContext = getContext('engine')

// Usage in components
const engine = engineContext.get()
engine.start()
```

#### Svelte 5 Runes
```svelte
<script lang="ts">
  // Reactive state
  let isPlaying = $state(false)
  let tempo = $state(120)
  
  // Derived values
  const canPlay = $derived(engine?.song && piano.loaded)
  
  // Effects
  $effect(() => {
    if (tempo) engine?.tempoChange(tempo)
  })
</script>
```

## 🎵 Game Modes

### Play Along Mode
- **Behavior**: Notes fall continuously at set tempo
- **User Input**: Optional - can play along for practice
- **Progression**: Automatic based on tempo
- **Use Case**: Listening, casual playing, learning songs

### Wait for Input Mode  
- **Behavior**: Pauses when notes reach play line
- **User Input**: Required - must press correct keys to continue
- **Progression**: User-controlled based on correct input
- **Use Case**: Learning, practice, skill building

**Implementation:**
```typescript
// In Note.update()
if (this.engine.mode === 'waitInput' && !this.engine.keysBeingPressed.has(this.note.midi)) {
  keysToBePressed.add(this.note.midi)
  this.engine.pause()  // Stop until input received
}
```

## 🎮 Input Systems

### Computer Keyboard
Mapped to piano keys via `keyboardMapping.ts`:
```
Tab → C2,  1 → C#2,  q → D2,  2 → D#2, ...
z → G3,    s → G#3,  x → A3,  d → A#3, ...
```

### MIDI Input Devices
Real-time MIDI device support:
```typescript
// MIDI setup
navigator.requestMIDIAccess().then(midiAccess => {
  const inputs = midiAccess.inputs.values()
  for (const input of inputs) {
    input.onmidimessage = handleMidiMessage
  }
})

// MIDI message handling
function handleMidiMessage(message) {
  const [command, note, velocity] = message.data
  if (command === 144 && velocity > 0) {  // Note on
    dispatchEvent(new CustomEvent('note-on', { detail: { midi: note, velocity } }))
  }
}
```

### Mouse/Touch Navigation
- **Tracker clicking**: Jump to song positions
- **Drag selection**: Create practice loops
- **Button controls**: Play/pause/stop/step

## 📊 Performance Considerations

### PIXI.js Optimization
- **Object pooling**: Reuse sprites instead of creating/destroying
- **Culling**: Only render visible notes
- **Batch rendering**: Group similar operations
- **Texture atlasing**: Combine small textures

### Audio Optimization
- **Sample caching**: `@tonejs/piano` preloads samples
- **Voice limiting**: Manage polyphony to prevent audio dropouts
- **Gain staging**: Proper volume levels to avoid clipping

### Memory Management
- **Event cleanup**: Remove listeners on component unmount
- **Particle cleanup**: Stop emitters when notes end
- **Container cleanup**: Remove sprites from containers

## 🐛 Known Issues & Limitations

### Audio System
**Issue**: `@tonejs/piano` velocity sensitivity
```typescript
// Problem: Some velocity values (0, 127) cause errors
// Workaround: Normalize or omit velocity parameter
if (velocity !== undefined) {
  const normalized = Math.max(0.01, Math.min(0.99, velocity / 127))
  piano.keyDown({ midi, velocity: normalized })
} else {
  piano.keyDown({ midi })  // Use library default
}
```

**Issue**: Volume jump on first note
- **Cause**: Audio context not activated until user interaction
- **Impact**: First note plays at higher volume
- **Solution**: Ensure audio context is resumed before playing

### Performance Issues
**Issue**: Large MIDI files cause frame drops
- **Cause**: Too many sprites rendered simultaneously
- **Solution**: Implement note culling and object pooling

**Issue**: Particle effects impact performance
- **Cause**: Each note creates particle emitter
- **Solution**: Limit concurrent particles, reuse emitters

### Browser Compatibility
**Limitation**: Web Audio API required
- **Impact**: No audio on older browsers
- **Solution**: Graceful degradation, visual-only mode

**Limitation**: File API for MIDI upload
- **Impact**: Limited file handling on older browsers
- **Fallback**: Predefined songs only

### MIDI Input
**Issue**: MIDI device detection inconsistent
- **Cause**: Browser security restrictions
- **Workaround**: Refresh device list, user permission required

## 🔧 Suggested Improvements

### Performance Enhancements
1. **Note Culling**: Only render notes near viewport
2. **Object Pooling**: Reuse note sprites instead of creating new ones
3. **Texture Atlasing**: Combine particle textures for better GPU performance
4. **Web Workers**: Move heavy computations off main thread

### Feature Additions
1. **Recording**: Capture user performance and playback
2. **Scoring**: Rate accuracy and timing
3. **Metronome**: Visual and audio timing guide
4. **Multi-track**: Show multiple MIDI tracks separately
5. **Transpose**: Change key of loaded songs
6. **Speed Control**: Independent tempo adjustment

### Code Architecture
1. **State Management**: Replace context with dedicated store (Zustand/Redux)
2. **Type Safety**: Improve TypeScript coverage, eliminate `any` types
3. **Testing**: Add unit tests for game logic
4. **Documentation**: Add JSDoc comments for all public APIs

### User Experience
1. **Mobile Support**: Touch-friendly interface
2. **Accessibility**: Keyboard navigation, screen reader support
3. **Themes**: Dark/light mode, color customization
4. **Tutorials**: Interactive onboarding
5. **Settings Persistence**: Save user preferences

### Development Workflow
1. **Build Optimization**: Bundle splitting, tree shaking
2. **Dev Tools**: Debug panel for game state
3. **Hot Reload**: Better development experience
4. **Deployment**: CI/CD pipeline, automated testing

## 📁 Project Structure

```
SveltePiano/
├── src/
│   ├── components/           # Svelte UI components
│   │   ├── Keyboard/        # Piano keyboard components
│   │   │   ├── TheKeyboard.svelte
│   │   │   ├── KeyOctave.svelte
│   │   │   └── Key.svelte
│   │   ├── Panel/           # Control panel components
│   │   │   ├── PanelPlayer.svelte
│   │   │   ├── PanelSongSelect.svelte
│   │   │   ├── PanelMode.svelte
│   │   │   ├── PanelMidiInput.svelte
│   │   │   └── PanelTemplate.svelte
│   │   ├── App.svelte       # Root component
│   │   └── PixiCanvas.svelte # Rendering surface
│   ├── game/                # Core game engine
│   │   ├── Engine.ts        # Central controller
│   │   ├── Song.ts          # MIDI data container
│   │   ├── Note.ts          # Individual note logic
│   │   ├── Piano.ts         # Audio engine
│   │   ├── Tracker.ts       # Navigation system
│   │   ├── EventFactory.ts  # Event system
│   │   ├── FireParticle.ts  # Particle effects
│   │   ├── drag.ts          # Drag interactions
│   │   └── Sketch.ts        # Initialization
│   ├── utils/               # Utility functions
│   │   ├── helpers.ts       # General utilities
│   │   └── keyboardMapping.ts # Key bindings
│   ├── main.ts              # Application entry point
│   └── app.css              # Global styles
├── public/                  # Static assets
│   ├── *.midi              # Sample MIDI files
│   ├── *.png               # Particle textures
│   └── loading.gif         # Loading animation
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript configuration
├── vite.config.js          # Build configuration
└── README.md               # This file
```

## 🛠️ Development

### Prerequisites
- Node.js 18+
- Modern browser with Web Audio API
- MIDI controller (optional)

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables
```bash
# Optional: Custom asset paths
VITE_ASSET_PATH=/custom/path/

# Optional: Enable debug mode
VITE_DEBUG=true
```

### Debugging
1. **Game State**: Access `Engine.instance` in browser console
2. **Performance**: Use browser DevTools Performance tab
3. **Audio**: Check Web Audio tab in DevTools
4. **MIDI**: Monitor MIDI events in console

## 📜 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Development Guidelines
- Use TypeScript for all new code
- Follow existing code style
- Add tests for new features
- Update documentation
- Ensure performance doesn't regress

## 📞 Support

- Issues: [GitHub Issues](https://github.com/your-username/web-piano/issues)
- Discussions: [GitHub Discussions](https://github.com/your-username/web-piano/discussions)
- Email: your-email@example.com

---

**Built with ❤️ using Svelte 5, TypeScript, PIXI.js, and Tone.js**
