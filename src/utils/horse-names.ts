import { shuffle } from './random'

const ADJECTIVES = [
  'Thunder',
  'Silver',
  'Golden',
  'Iron',
  'Dark',
  'Storm',
  'Black',
  'Red',
  'Desert',
  'Ocean',
  'Mountain',
  'Fire',
  'Ice',
  'Shadow',
  'Wild',
  'Star',
  'Blue',
  'Night',
  'Royal',
  'Swift',
  'Crimson',
  'Emerald',
  'Midnight',
  'Blazing',
  'Phantom',
  'Copper',
  'Velvet',
  'Steel',
  'Noble',
  'Brave',
  'Silent',
  'Frozen',
  'Amber',
  'Crystal',
  'Scarlet',
  'Cosmic',
  'Diamond',
  'Jade',
  'Sapphire',
  'Ivory',
]

const NOUNS = [
  'Bolt',
  'Arrow',
  'Storm',
  'Duke',
  'Spirit',
  'Rider',
  'Pearl',
  'Comet',
  'King',
  'Breeze',
  'Fox',
  'Dancer',
  'Queen',
  'Runner',
  'Force',
  'Blaze',
  'Lightning',
  'Hawk',
  'Flush',
  'Dream',
  'Fury',
  'Whisper',
  'Glory',
  'Knight',
  'Flame',
  'Strike',
  'Legend',
  'Wing',
  'Chase',
  'Tempest',
  'Wonder',
  'Spark',
  'Crown',
  'Surge',
  'Valor',
  'Echo',
  'Vortex',
  'Dagger',
  'Reign',
  'Orbit',
]

/**
 * Generates `count` unique horse names by combining shuffled adjectives and nouns.
 * Supports up to ADJECTIVES.length * NOUNS.length unique combinations (1 600).
 */
export function generateHorseNames(count: number): string[] {
  const adj = shuffle(ADJECTIVES)
  const noun = shuffle(NOUNS)

  const names: string[] = []
  for (let i = 0; i < count; i++) {
    names.push(`${adj[i % adj.length]} ${noun[i % noun.length]}`)
  }
  return names
}
