"use client"

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Maximize2, Minimize2, ZoomIn, ZoomOut, Info } from 'lucide-react'

interface Hotspot {
  id: string
  x: number
  y: number
  title: string
  description: string
  icon?: string
}

interface Viewer360Props {
  imageUrl: string
  hotspots?: Hotspot[]
  title?: string
}

export function Viewer360({ imageUrl, hotspots = [], title }: Viewer360Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const sphereRef = useRef<THREE.Mesh | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const isDraggingRef = useRef(false)
  const previousMousePositionRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.set(0, 0, 0.1)
    cameraRef.current = camera

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Create sphere geometry (inverted for inside view)
    const geometry = new THREE.SphereGeometry(500, 60, 40)
    geometry.scale(-1, 1, 1) // Invert the sphere

    // Load texture
    const textureLoader = new THREE.TextureLoader()
    textureLoader.load(
      imageUrl,
      (texture) => {
        const material = new THREE.MeshBasicMaterial({ map: texture })
        const sphere = new THREE.Mesh(geometry, material)
        scene.add(sphere)
        sphereRef.current = sphere
        setIsLoading(false)
      },
      undefined,
      (error) => {
        console.error('Error loading 360 image:', error)
        setIsLoading(false)
      }
    )

    // Mouse controls
    let lon = 0
    let lat = 0
    let phi = 0
    let theta = 0

    const onMouseDown = (event: MouseEvent) => {
      isDraggingRef.current = true
      previousMousePositionRef.current = {
        x: event.clientX,
        y: event.clientY,
      }
    }

    const onMouseMove = (event: MouseEvent) => {
      if (!isDraggingRef.current) return

      const deltaX = event.clientX - previousMousePositionRef.current.x
      const deltaY = event.clientY - previousMousePositionRef.current.y

      lon -= deltaX * 0.1
      lat += deltaY * 0.1
      lat = Math.max(-85, Math.min(85, lat))

      previousMousePositionRef.current = {
        x: event.clientX,
        y: event.clientY,
      }
    }

    const onMouseUp = () => {
      isDraggingRef.current = false
    }

    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      const fov = camera.fov + event.deltaY * 0.05
      camera.fov = Math.max(30, Math.min(100, fov))
      camera.updateProjectionMatrix()
    }

    renderer.domElement.addEventListener('mousedown', onMouseDown)
    renderer.domElement.addEventListener('mousemove', onMouseMove)
    renderer.domElement.addEventListener('mouseup', onMouseUp)
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false })

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)

      phi = THREE.MathUtils.degToRad(90 - lat)
      theta = THREE.MathUtils.degToRad(lon)

      camera.position.x = 100 * Math.sin(phi) * Math.cos(theta)
      camera.position.y = 100 * Math.cos(phi)
      camera.position.z = 100 * Math.sin(phi) * Math.sin(theta)

      camera.lookAt(scene.position)
      renderer.render(scene, camera)
    }
    animate()

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    // Fullscreen handling
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
      handleResize()
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)

    // Cleanup
    return () => {
      renderer.domElement.removeEventListener('mousedown', onMouseDown)
      renderer.domElement.removeEventListener('mousemove', onMouseMove)
      renderer.domElement.removeEventListener('mouseup', onMouseUp)
      renderer.domElement.removeEventListener('wheel', onWheel)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
      geometry.dispose()
    }
  }, [imageUrl])

  const toggleFullscreen = () => {
    if (!containerRef.current) return

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  const zoomIn = () => {
    if (!cameraRef.current) return
    cameraRef.current.fov = Math.max(30, cameraRef.current.fov - 5)
    cameraRef.current.updateProjectionMatrix()
  }

  const zoomOut = () => {
    if (!cameraRef.current) return
    cameraRef.current.fov = Math.min(100, cameraRef.current.fov + 5)
    cameraRef.current.updateProjectionMatrix()
  }

  return (
    <div className="relative w-full h-full bg-black" ref={containerRef}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading 360° View...</p>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
        <Button
          size="icon"
          variant="secondary"
          onClick={zoomIn}
          className="bg-black/50 hover:bg-black/70 backdrop-blur-sm"
        >
          <ZoomIn className="h-4 w-4 text-white" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          onClick={zoomOut}
          className="bg-black/50 hover:bg-black/70 backdrop-blur-sm"
        >
          <ZoomOut className="h-4 w-4 text-white" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          onClick={toggleFullscreen}
          className="bg-black/50 hover:bg-black/70 backdrop-blur-sm"
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4 text-white" />
          ) : (
            <Maximize2 className="h-4 w-4 text-white" />
          )}
        </Button>
      </div>

      {/* Instructions */}
      {!isLoading && (
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white text-xs space-y-1">
            <p>🖱️ Drag to rotate • 🔍 Scroll to zoom • F for fullscreen</p>
          </div>
        </div>
      )}

      {/* Hotspot Info */}
      {selectedHotspot && (
        <div className="absolute top-4 left-4 z-20 max-w-xs">
          <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 text-white">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold">{selectedHotspot.title}</h4>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setSelectedHotspot(null)}
                className="h-6 w-6 text-white"
              >
                ×
              </Button>
            </div>
            <p className="text-sm text-white/80">{selectedHotspot.description}</p>
          </div>
        </div>
      )}

      {/* Hotspot Markers */}
      {hotspots.map((hotspot) => (
        <button
          key={hotspot.id}
          className="absolute z-10 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
          style={{
            left: `${hotspot.x}%`,
            top: `${hotspot.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
          onClick={() => setSelectedHotspot(hotspot)}
        >
          <Info className="h-4 w-4 text-white" />
        </button>
      ))}
    </div>
  )
}
