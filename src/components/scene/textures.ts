
import * as THREE from 'three'

/** Original soft textures for the sunset tulip meadow. */
function canvasTexture(
  size: number,
  draw: (ctx: CanvasRenderingContext2D, size: number) => void,
): THREE.Texture {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size

  const ctx = canvas.getContext('2d')
  if (ctx) draw(ctx, size)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.needsUpdate = true

  return texture
}

function makeRandom(seed: number) {
  let state = seed

  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

const cache = new Map<string, THREE.Texture>()

/** Warm, diffused sunset glow. */
export function glowTexture(): THREE.Texture {
  if (!cache.has('glow')) {
    cache.set(
      'glow',
      canvasTexture(128, (ctx, size) => {
        const gradient = ctx.createRadialGradient(
          size / 2,
          size / 2,
          0,
          size / 2,
          size / 2,
          size / 2,
        )

        gradient.addColorStop(0, 'rgba(255, 246, 220, 1)')
        gradient.addColorStop(0.3, 'rgba(255, 211, 173, 0.58)')
        gradient.addColorStop(0.7, 'rgba(255, 173, 157, 0.16)')
        gradient.addColorStop(1, 'rgba(255, 173, 157, 0)')

        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, size, size)
      }),
    )
  }

  return cache.get('glow')!
}

/** Soft peach-pink atmospheric haze. */
export function mistTexture(): THREE.Texture {
  if (!cache.has('mist')) {
    cache.set(
      'mist',
      canvasTexture(256, (ctx, size) => {
        const gradient = ctx.createRadialGradient(
          size / 2,
          size / 2,
          0,
          size / 2,
          size / 2,
          size / 2,
        )

        gradient.addColorStop(0, 'rgba(255, 235, 220, 0.7)')
        gradient.addColorStop(0.4, 'rgba(255, 204, 195, 0.3)')
        gradient.addColorStop(1, 'rgba(255, 190, 190, 0)')

        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, size, size)
      }),
    )
  }

  return cache.get('mist')!
}

/** Soft vertical golden-pink sunset light shaft. */
export function shaftTexture(): THREE.Texture {
  if (!cache.has('shaft')) {
    cache.set(
      'shaft',
      canvasTexture(128, (ctx, size) => {
        ctx.clearRect(0, 0, size, size)

        const horizontal = ctx.createLinearGradient(0, 0, size, 0)
        horizontal.addColorStop(0, 'rgba(255, 215, 180, 0)')
        horizontal.addColorStop(0.4, 'rgba(255, 224, 190, 0.4)')
        horizontal.addColorStop(0.6, 'rgba(255, 224, 190, 0.4)')
        horizontal.addColorStop(1, 'rgba(255, 215, 180, 0)')

        ctx.fillStyle = horizontal
        ctx.fillRect(0, 0, size, size)

        const vertical = ctx.createLinearGradient(0, 0, 0, size)
        vertical.addColorStop(0, 'rgba(0,0,0,0)')
        vertical.addColorStop(0.35, 'rgba(0,0,0,0.8)')
        vertical.addColorStop(0.8, 'rgba(0,0,0,0.3)')
        vertical.addColorStop(1, 'rgba(0,0,0,0)')

        ctx.globalCompositeOperation = 'destination-in'
        ctx.fillStyle = vertical
        ctx.fillRect(0, 0, size, size)
        ctx.globalCompositeOperation = 'source-over'
      }),
    )
  }

  return cache.get('shaft')!
}

/** Subtle, even meadow texture without rocky or mottled patches. */
export function groundTexture(): THREE.Texture {
  if (!cache.has('ground')) {
    const texture = canvasTexture(512, (ctx, size) => {
      const rand = makeRandom(9182)

      const base = ctx.createLinearGradient(0, 0, size, size)
      base.addColorStop(0, '#82975d')
      base.addColorStop(0.5, '#91a466')
      base.addColorStop(1, '#788d55')

      ctx.fillStyle = base
      ctx.fillRect(0, 0, size, size)

      // Very fine grass-like strokes, not stones or flower patches.
      for (let i = 0; i < 1800; i += 1) {
        const x = rand() * size
        const y = rand() * size
        const length = 2 + rand() * 5

        ctx.strokeStyle =
          rand() > 0.5
            ? 'rgba(225, 222, 164, 0.09)'
            : 'rgba(49, 77, 43, 0.08)'

        ctx.lineWidth = 0.6 + rand() * 0.7
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x + (rand() - 0.5) * 2, y - length)
        ctx.stroke()
      }
    })

    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(18, 18)
    texture.anisotropy = 4

    cache.set('ground', texture)
  }

  return cache.get('ground')!
}

/** Smooth pond-bed texture. Kept for compatibility with existing imports. */
export function pebbleTexture(): THREE.Texture {
  if (!cache.has('pebble')) {
    const texture = canvasTexture(256, (ctx, size) => {
      const gradient = ctx.createLinearGradient(0, 0, size, size)

      gradient.addColorStop(0, '#456e68')
      gradient.addColorStop(0.5, '#547e76')
      gradient.addColorStop(1, '#3d655f')

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, size, size)

      // Gentle underwater light variations.
      for (let i = 0; i < 70; i += 1) {
        const x = Math.random() * size
        const y = Math.random() * size
        const radius = 8 + Math.random() * 24

        const glow = ctx.createRadialGradient(x, y, 0, x, y, radius)
        glow.addColorStop(0, 'rgba(180, 213, 174, 0.12)')
        glow.addColorStop(1, 'rgba(180, 213, 174, 0)')

        ctx.fillStyle = glow
        ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2)
      }
    })

    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(2, 8)

    cache.set('pebble', texture)
  }

  return cache.get('pebble')!
}

/** Wispy, warm sunset clouds. */
export function cloudTexture(): THREE.Texture {
  if (!cache.has('cloud')) {
    const texture = canvasTexture(256, (ctx, size) => {
      const rand = makeRandom(7723)
      ctx.clearRect(0, 0, size, size)

      for (let i = 0; i < 8; i += 1) {
        const x = size * (0.2 + rand() * 0.6)
        const y = size * (0.35 + rand() * 0.3)
        const radius = size * (0.13 + rand() * 0.16)

        const gradient = ctx.createRadialGradient(
          x,
          y,
          0,
          x,
          y,
          radius,
        )

        gradient.addColorStop(0, 'rgba(255, 237, 224, 0.58)')
        gradient.addColorStop(0.5, 'rgba(255, 215, 207, 0.25)')
        gradient.addColorStop(1, 'rgba(255, 205, 200, 0)')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fill()
      }
    })

    cache.set('cloud', texture)
  }

  return cache.get('cloud')!
}
