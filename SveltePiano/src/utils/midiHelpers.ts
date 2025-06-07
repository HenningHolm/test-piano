/**
 * Convert MIDI number to octave and pitch
 * @param midi MIDI number (0-127)
 * @returns Object with octave and pitch
 */
export function midiToOctavePitch(midi: number): { octave: number; pitch: string } {
  const octave = Math.floor((midi - 12) / 12)
  const pitchIndex = (midi - 12) % 12
  const pitchNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  const pitch = pitchNames[pitchIndex]
  return { octave, pitch }
}

/**
 * Convert octave and pitch to MIDI number
 * @param octave Octave number
 * @param pitch Pitch name (C, C#, D, etc.)
 * @returns MIDI number
 */
export function octavePitchToMidi(octave: number, pitch: string): number {
  const pitchNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  const pitchIndex = pitchNames.indexOf(pitch)
  if (pitchIndex === -1) {
    throw new Error(`Invalid pitch: ${pitch}`)
  }
  return (octave + 1) * 12 + pitchIndex
}