import { readonly, ref } from 'vue'
import horseSprite from '../assets/horse_sprite.png'

const loaded = ref(false)

const img = new Image()
img.src = horseSprite
img.onload = () => {
  loaded.value = true
}
// If the image is already cached by the browser
if (img.complete) {
  loaded.value = true
}

export function useSpriteLoader() {
  return { loaded: readonly(loaded) }
}
