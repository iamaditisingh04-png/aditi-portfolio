import * as THREE from 'three'

/** Procedural (original) textures, generated once and reused. */
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

export function glowTexture(): THREE.Texture {
  if (!cache.has('glow')) {
    cache.set(
      'glow',
      canvasTexture(128, (ctx, size) => {
        const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
        gradient.addColorStop(0, 'rgba(255, 250, 226, 1)')
        gradient.addColorStop(0.35, 'rgba(255, 238, 190, 0.55)')
        gradient.addColorStop(0.72, 'rgba(255, 230, 170, 0.14)')
        gradient.addColorStop(1, 'rgba(255, 230, 170, 0)')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, size, size)
      }),
    )
  }
  return cache.get('glow')!
}

export function mistTexture(): THREE.Texture {
  if (!cache.has('mist')) {
    cache.set(
      'mist',
      canvasTexture(256, (ctx, size) => {
        const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
        gradient.addColorStop(0, 'rgba(255, 255, 250, 0.85)')
        gradient.addColorStop(0.45, 'rgba(240, 255, 250, 0.32)')
        gradient.addColorStop(1, 'rgba(240, 255, 250, 0)')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, size, size)
      }),
    )
  }
  return cache.get('mist')!
}

/** A long, soft vertical shaft of sunlight. */
export function shaftTexture(): THREE.Texture {
  if (!cache.has('shaft')) {
    cache.set(
      'shaft',
      canvasTexture(128, (ctx, size) => {
        ctx.clearRect(0, 0, size, size)
        const horizontal = ctx.createLinearGradient(0, 0, size, 0)
        horizontal.addColorStop(0, 'rgba(255, 244, 210, 0)')
        horizontal.addColorStop(0.4, 'rgba(255, 246, 214, 0.5)')
        horizontal.addColorStop(0.6, 'rgba(255, 246, 214, 0.5)')
        horizontal.addColorStop(1, 'rgba(255, 244, 210, 0)')
        ctx.fillStyle = horizontal
        ctx.fillRect(0, 0, size, size)

        const vertical = ctx.createLinearGradient(0, 0, 0, size)
        vertical.addColorStop(0, 'rgba(0,0,0,0)')
        vertical.addColorStop(0.35, 'rgba(0,0,0,0.85)')
        vertical.addColorStop(0.8, 'rgba(0,0,0,0.35)')
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

/** Mottled meadow detail that breaks up flat vertex-coloured ground. */
export function groundTexture(): THREE.Texture {
  if (!cache.has('ground')) {
    const texture = canvasTexture(512, (ctx, size) => {
      const rand = makeRandom(9182)
      ctx.fillStyle = '#e2e6d2'
      ctx.fillRect(0, 0, size, size)

      for (let i = 0; i < 1500; i += 1) {
        const x = rand() * size
        const y = rand() * size
        const radius = 5 + rand() * 30
        const tone = rand()
        const rgb = tone > 0.64 ? '112,134,86' : tone > 0.3 ? '152,170,110' : '92,114,74'
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
        gradient.addColorStop(0, `rgba(${rgb},${0.05 + rand() * 0.1})`)
        gradient.addColorStop(1, `rgba(${rgb},0)`)
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fill()
      }

      for (let i = 0; i < 3200; i += 1) {
        const light = rand() > 0.45
        ctx.fillStyle = light
          ? `rgba(255,250,224,${0.04 + rand() * 0.1})`
          : `rgba(64,86,52,${0.04 + rand() * 0.12})`
        ctx.fillRect(rand() * size, rand() * size, 1 + rand() * 2.2, 1 + rand() * 2.2)
      }
    })
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(26, 26)
    texture.anisotropy = 4
    cache.set('ground', texture)
  }
  return cache.get('ground')!
}

/** Sandy, pebbled creek bed seen through the water. */
export function pebbleTexture(): THREE.Texture {
  if (!cache.has('pebble')) {
    const texture = canvasTexture(512, (ctx, size) => {
      const rand = makeRandom(4451)
      const base = ctx.createLinearGradient(0, 0, size, size)
      base.addColorStop(0, '#cdbf9d')
      base.addColorStop(0.5, '#c2b491')
      base.addColorStop(1, '#cfc2a2')
      ctx.fillStyle = base
      ctx.fillRect(0, 0, size, size)

      const palette = ['#d9cdaa', '#b8b195', '#a89f86', '#c97850', '#8f9b7c', '#e0d6ba']
      for (let i = 0; i < 520; i += 1) {
        const x = rand() * size
        const y = rand() * size
        const rx = 3 + rand() * 12
        const ry = rx * (0.55 + rand() * 0.55)
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(rand() * Math.PI)
        ctx.beginPath()
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2)
        ctx.fillStyle = palette[Math.floor(rand() * palette.length)]
        ctx.globalAlpha = 0.5 + rand() * 0.45
        ctx.fill()
        ctx.globalAlpha = 0.25
        ctx.strokeStyle = '#7f7862'
        ctx.lineWidth = 0.8
        ctx.stroke()
        ctx.restore()
      }
    })
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(2, 10)
    cache.set('pebble', texture)
  }
  return cache.get('pebble')!
}

/** Soft cumulus puff made of overlapping radial gradients. */
export function cloudTexture(): THREE.Texture {
  if (!cache.has('cloud')) {
    const texture = canvasTexture(256, (ctx, size) => {
      const rand = makeRandom(7723)
      ctx.clearRect(0, 0, size, size)
      for (let i = 0; i < 7; i += 1) {
        const x = size * (0.24 + rand() * 0.52)
        const y = size * (0.42 + rand() * 0.22)
        const radius = size * (0.16 + rand() * 0.16)
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
        gradient.addColorStop(0, 'rgba(255, 253, 246, 0.72)')
        gradient.addColorStop(0.55, 'rgba(252, 253, 248, 0.28)')
        gradient.addColorStop(1, 'rgba(250, 252, 248, 0)')
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
