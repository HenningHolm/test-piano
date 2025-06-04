# Svelte Piano Player

This project is a MIDI piano player built with Svelte. It allows users to play piano notes using their keyboard or MIDI devices, and provides visual feedback through a customizable interface.

## Features

- Interactive piano interface with individual keys
- MIDI input and output support
- Audio playback using Tone.js
- Visualizer for audio output and MIDI activity
- Responsive design

## Project Structure

```
svelte-piano-player
├── src
│   ├── app.html          # Main HTML template
│   ├── app.js            # Entry point of the application
│   ├── components         # Svelte components
│   │   ├── Piano.svelte
│   │   ├── PianoKey.svelte
│   │   ├── MidiControls.svelte
│   │   └── Visualizer.svelte
│   ├── lib               # Library files for audio and MIDI handling
│   │   ├── audio.js
│   │   ├── midi.js
│   │   └── utils.js
│   ├── stores            # Svelte stores for state management
│   │   └── piano.js
│   └── styles            # Global styles
│       └── global.css
├── static
│   └── favicon.png       # Favicon for the application
├── package.json          # npm configuration file
├── svelte.config.js      # Svelte configuration
├── vite.config.js        # Vite configuration
└── README.md             # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd svelte-piano-player
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000` to see the application in action.

## Usage

- Click on the piano keys to play notes.
- Connect a MIDI device to play notes using the device.
- Use the MIDI controls to select devices and manage settings.
- Visualize audio output and MIDI activity through the visualizer.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.