/** Total rows in the horse sprite sheet (one row = one horse) */
export const SPRITE_ROWS = 20

/** Total columns in the sprite sheet (one column = one animation frame) */
export const SPRITE_COLS = 5

/**
 * Aspect ratio of a single sprite frame: frame_width / frame_height.
 * Source image: 3061 × 7850 px  →  frame: (3061/5) × (7850/20)
 */
export const SPRITE_ASPECT = 3061 / SPRITE_COLS / (7850 / SPRITE_ROWS) // ≈ 1.5598
