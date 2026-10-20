import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Property } from '../../types';
import { formatPrice } from '../../data/initialData';
import { 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Layers, 
  Home, 
  Compass, 
  Calendar, 
  Eye, 
  MapPin, 
  Info,
  ChevronDown,
  Sparkles
} from 'lucide-react';

interface Property3DViewerProps {
  property: Property;
  onBookVisit?: (property: Property) => void;
  onLaunchAIAnalysis?: (property: Property) => void;
}

type ViewMode = 'exterior' | 'interior' | 'floorplan';

export const Property3DViewer: React.FC<Property3DViewerProps> = ({
  property,
  onBookVisit,
  onLaunchAIAnalysis
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasMountRef = useRef<HTMLDivElement>(null);
  
  const [viewMode, setViewMode] = useState<ViewMode>('exterior');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsCollapsed, setControlsCollapsed] = useState(false);
  const [lightingPreset, setLightingPreset] = useState<'day' | 'sunset' | 'blueprint'>('day');
  const [cameraDistance, setCameraDistance] = useState('18m');
  const [activeFloor, setActiveFloor] = useState<number>(1);

  // Three.js instances stored in refs to prevent remounting
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const lightsGroupRef = useRef<THREE.Group | null>(null);
  const reqIdRef = useRef<number>(0);

  // Build Procedural Scene for Selected Mode
  const buildSceneGeometry = (scene: THREE.Scene, mode: ViewMode, preset: string) => {
    if (modelGroupRef.current) {
      scene.remove(modelGroupRef.current);
      // Clean up geometries and materials
      modelGroupRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.geometry?.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else {
            mesh.material?.dispose();
          }
        }
      });
    }

    const group = new THREE.Group();
    modelGroupRef.current = group;

    // Materials with PBR properties
    const concreteMat = new THREE.MeshStandardMaterial({
      color: preset === 'blueprint' ? 0x1e3a8a : 0xf1f5f9,
      roughness: 0.85,
      metalness: 0.05
    });

    const darkAccentMat = new THREE.MeshStandardMaterial({
      color: preset === 'blueprint' ? 0x172554 : 0x1e293b,
      roughness: 0.4,
      metalness: 0.3
    });

    const woodParquetMat = new THREE.MeshStandardMaterial({
      color: preset === 'blueprint' ? 0x3b82f6 : 0xd97706,
      roughness: 0.65,
      metalness: 0.05
    });

    const glassBalconyMat = new THREE.MeshPhysicalMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.45,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.6,
      ior: 1.5
    });

    const lawnMat = new THREE.MeshStandardMaterial({
      color: preset === 'blueprint' ? 0x0f172a : 0x15803d,
      roughness: 0.95,
      metalness: 0.0
    });

    const drivewayMat = new THREE.MeshStandardMaterial({
      color: preset === 'blueprint' ? 0x1e293b : 0x64748b,
      roughness: 0.9,
      metalness: 0.1
    });

    const warmLightMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xfef08a,
      emissiveIntensity: 0.6
    });

    if (mode === 'exterior') {
      // Ground Plot & Lawn
      const groundGeo = new THREE.BoxGeometry(26, 0.4, 22);
      const ground = new THREE.Mesh(groundGeo, lawnMat);
      ground.position.y = -0.2;
      ground.receiveShadow = true;
      group.add(ground);

      // Paved Driveway & Walkway
      const driveGeo = new THREE.BoxGeometry(6, 0.42, 10);
      const driveway = new THREE.Mesh(driveGeo, drivewayMat);
      driveway.position.set(6, -0.19, 6);
      driveway.receiveShadow = true;
      group.add(driveway);

      // Main Architecture - Villa / Multi-Level Contemporary Block
      // Level 1: Ground Floor
      const groundFloorGeo = new THREE.BoxGeometry(12, 3.2, 10);
      const groundFloor = new THREE.Mesh(groundFloorGeo, concreteMat);
      groundFloor.position.set(0, 1.6, 0);
      groundFloor.castShadow = true;
      groundFloor.receiveShadow = true;
      group.add(groundFloor);

      // Level 1 Large Glass Entrance Panel
      const entranceGlassGeo = new THREE.BoxGeometry(4, 2.6, 0.2);
      const entranceGlass = new THREE.Mesh(entranceGlassGeo, glassBalconyMat);
      entranceGlass.position.set(0, 1.4, 5.05);
      group.add(entranceGlass);

      // Level 2: First Floor Cantilever Cantilevered Wing (architectural modernism)
      const firstFloorGeo = new THREE.BoxGeometry(14, 3.0, 9);
      const firstFloor = new THREE.Mesh(firstFloorGeo, darkAccentMat);
      firstFloor.position.set(0.8, 4.7, -0.4);
      firstFloor.castShadow = true;
      firstFloor.receiveShadow = true;
      group.add(firstFloor);

      // Level 2 Balcony & Terraces
      const balconyFloorGeo = new THREE.BoxGeometry(5.5, 0.3, 3.5);
      const balconyFloor = new THREE.Mesh(balconyFloorGeo, concreteMat);
      balconyFloor.position.set(-2, 3.35, 5.25);
      balconyFloor.castShadow = true;
      group.add(balconyFloor);

      // Balcony Glass Railing
      const railingGeo = new THREE.BoxGeometry(5.5, 1.1, 0.1);
      const railing = new THREE.Mesh(railingGeo, glassBalconyMat);
      railing.position.set(-2, 4.0, 6.95);
      group.add(railing);

      const sideRailingGeo = new THREE.BoxGeometry(0.1, 1.1, 3.5);
      const sideRailing = new THREE.Mesh(sideRailingGeo, glassBalconyMat);
      sideRailing.position.set(-4.7, 4.0, 5.25);
      group.add(sideRailing);

      // Roof Canopy with Pergola Slats
      const roofGeo = new THREE.BoxGeometry(15, 0.4, 10);
      const roof = new THREE.Mesh(roofGeo, concreteMat);
      roof.position.set(0.8, 6.4, -0.4);
      roof.castShadow = true;
      group.add(roof);

      // Pergola Beams
      for (let i = -2; i <= 2; i++) {
        const slatGeo = new THREE.BoxGeometry(0.2, 0.3, 3.8);
        const slat = new THREE.Mesh(slatGeo, darkAccentMat);
        slat.position.set(-2 + i * 0.9, 6.6, 5.2);
        group.add(slat);
      }

      // Large Ribbon Windows (Glossy Reflective Glass)
      const window1Geo = new THREE.BoxGeometry(5, 1.6, 0.2);
      const window1 = new THREE.Mesh(window1Geo, glassBalconyMat);
      window1.position.set(3, 4.8, 4.15);
      group.add(window1);

      // Swimming pool / Water body feature
      const poolGeo = new THREE.BoxGeometry(5, 0.2, 4);
      const poolMat = new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        roughness: 0.1,
        metalness: 0.1,
        transmission: 0.8
      });
      const pool = new THREE.Mesh(poolGeo, poolMat);
      pool.position.set(-6, 0.05, 3);
      group.add(pool);

      // Pool Deck
      const deckGeo = new THREE.BoxGeometry(7, 0.1, 6);
      const deck = new THREE.Mesh(deckGeo, woodParquetMat);
      deck.position.set(-6, 0.02, 3);
      group.add(deck);

      // Exterior trees / landscape foliage
      for (const [x, z] of [[-9, -6], [-9, 7], [9, -7], [10, 2]]) {
        const trunkGeo = new THREE.CylinderGeometry(0.2, 0.3, 2, 8);
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.set(x, 1, z);
        trunk.castShadow = true;
        group.add(trunk);

        const foliageGeo = new THREE.DodecahedronGeometry(1.2, 1);
        const foliageMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.8 });
        const foliage = new THREE.Mesh(foliageGeo, foliageMat);
        foliage.position.set(x, 2.6, z);
        foliage.castShadow = true;
        group.add(foliage);
      }

    } else if (mode === 'interior') {
      // Interior Open-Concept Living, Dining, & Kitchen
      // Wooden Parquet Flooring
      const floorGeo = new THREE.BoxGeometry(16, 0.3, 14);
      const floor = new THREE.Mesh(floorGeo, woodParquetMat);
      floor.position.y = -0.15;
      floor.receiveShadow = true;
      group.add(floor);

      // Back Perimeter Wall with Picture Window
      const backWallGeo = new THREE.BoxGeometry(16, 4.5, 0.4);
      const backWall = new THREE.Mesh(backWallGeo, concreteMat);
      backWall.position.set(0, 2.1, -6.8);
      backWall.receiveShadow = true;
      group.add(backWall);

      // Left Wall
      const leftWallGeo = new THREE.BoxGeometry(0.4, 4.5, 14);
      const leftWall = new THREE.Mesh(leftWallGeo, concreteMat);
      leftWall.position.set(-7.8, 2.1, 0);
      leftWall.receiveShadow = true;
      group.add(leftWall);

      // Designer Sofa Sectional (Contemporary Lounge)
      const sofaBaseGeo = new THREE.BoxGeometry(5.2, 0.5, 2.4);
      const fabricMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });
      const sofaBase = new THREE.Mesh(sofaBaseGeo, fabricMat);
      sofaBase.position.set(-2.5, 0.4, 0);
      sofaBase.castShadow = true;
      group.add(sofaBase);

      const sofaBackGeo = new THREE.BoxGeometry(5.2, 1.2, 0.6);
      const sofaBack = new THREE.Mesh(sofaBackGeo, fabricMat);
      sofaBack.position.set(-2.5, 1.1, -0.9);
      sofaBack.castShadow = true;
      group.add(sofaBack);

      const sofaChaiseGeo = new THREE.BoxGeometry(2.0, 0.5, 2.2);
      const sofaChaise = new THREE.Mesh(sofaChaiseGeo, fabricMat);
      sofaChaise.position.set(-4.1, 0.4, 1.5);
      sofaChaise.castShadow = true;
      group.add(sofaChaise);

      // Modern Coffee Table (Glass + Walnut Frame)
      const coffeeTableGeo = new THREE.BoxGeometry(3.0, 0.45, 1.8);
      const coffeeTable = new THREE.Mesh(coffeeTableGeo, darkAccentMat);
      coffeeTable.position.set(-2.2, 0.35, 1.8);
      coffeeTable.castShadow = true;
      group.add(coffeeTable);

      // Large Format TV & Media Credenza on Wall
      const tvConsoleGeo = new THREE.BoxGeometry(5.5, 0.6, 0.8);
      const tvConsole = new THREE.Mesh(tvConsoleGeo, darkAccentMat);
      tvConsole.position.set(-2.5, 0.45, -6.2);
      group.add(tvConsole);

      const tvScreenGeo = new THREE.BoxGeometry(4.2, 2.4, 0.1);
      const tvScreenMat = new THREE.MeshBasicMaterial({ color: 0x090d16 });
      const tvScreen = new THREE.Mesh(tvScreenGeo, tvScreenMat);
      tvScreen.position.set(-2.5, 2.3, -6.5);
      group.add(tvScreen);

      // Kitchen Island with Marble Countertop
      const islandBaseGeo = new THREE.BoxGeometry(4.2, 1.3, 1.8);
      const islandBase = new THREE.Mesh(islandBaseGeo, darkAccentMat);
      islandBase.position.set(4.2, 0.8, -1.5);
      islandBase.castShadow = true;
      group.add(islandBase);

      const marbleCounterGeo = new THREE.BoxGeometry(4.5, 0.15, 2.1);
      const marbleMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.1 });
      const marbleCounter = new THREE.Mesh(marbleCounterGeo, marbleMat);
      marbleCounter.position.set(4.2, 1.5, -1.5);
      marbleCounter.castShadow = true;
      group.add(marbleCounter);

      // Barstools
      for (let b = -1.2; b <= 1.2; b += 1.2) {
        const stoolLegGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.0, 8);
        const stoolLeg = new THREE.Mesh(stoolLegGeo, darkAccentMat);
        stoolLeg.position.set(4.2 + b, 0.5, -0.1);
        group.add(stoolLeg);

        const stoolSeatGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 16);
        const stoolSeat = new THREE.Mesh(stoolSeatGeo, woodParquetMat);
        stoolSeat.position.set(4.2 + b, 1.05, -0.1);
        group.add(stoolSeat);
      }

      // Modern Pendant Light over Island
      const pendantCordGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.8);
      const pendantCord = new THREE.Mesh(pendantCordGeo, darkAccentMat);
      pendantCord.position.set(4.2, 3.4, -1.5);
      group.add(pendantCord);

      const pendantShadeGeo = new THREE.ConeGeometry(0.4, 0.5, 16);
      const pendantShade = new THREE.Mesh(pendantShadeGeo, warmLightMat);
      pendantShade.position.set(4.2, 2.4, -1.5);
      group.add(pendantShade);

    } else if (mode === 'floorplan') {
      // Architectural Floor Plan 3D Cutaway
      // Floor Slab
      const slabGeo = new THREE.BoxGeometry(18, 0.2, 14);
      const slabMat = new THREE.MeshStandardMaterial({
        color: preset === 'blueprint' ? 0x0f172a : 0xe2e8f0,
        roughness: 0.9
      });
      const slab = new THREE.Mesh(slabGeo, slabMat);
      slab.position.y = -0.1;
      slab.receiveShadow = true;
      group.add(slab);

      // Blueprint Grid Floor Overlay
      const gridHelper = new THREE.GridHelper(18, 18, 0x3b82f6, 0x94a3b8);
      gridHelper.position.y = 0.02;
      group.add(gridHelper);

      // Wall Extrusions (Cutaway height 1.4m so rooms are crystal clear)
      const wallMat = new THREE.MeshStandardMaterial({
        color: preset === 'blueprint' ? 0x2563eb : 0x334155,
        roughness: 0.5
      });

      const wallSpecs = [
        // Exterior Boundary
        { size: [18, 1.4, 0.3], pos: [0, 0.7, -7] },
        { size: [18, 1.4, 0.3], pos: [0, 0.7, 7] },
        { size: [0.3, 1.4, 14], pos: [-9, 0.7, 0] },
        { size: [0.3, 1.4, 14], pos: [9, 0.7, 0] },
        // Interior Room Dividers
        { size: [0.25, 1.4, 8], pos: [0, 0.7, -3] }, // Living vs Master Bed
        { size: [8, 1.4, 0.25], pos: [-4.5, 0.7, 1] }, // Living vs Kitchen
        { size: [0.25, 1.4, 6], pos: [4, 0.7, 4] }, // Master vs Guest Bed
        { size: [5, 1.4, 0.25], pos: [6.5, 0.7, 1] } // Bed 1 vs Attached Bath
      ];

      wallSpecs.forEach((w) => {
        const geo = new THREE.BoxGeometry(w.size[0], w.size[1], w.size[2]);
        const mesh = new THREE.Mesh(geo, wallMat);
        mesh.position.set(w.pos[0], w.pos[1], w.pos[2]);
        mesh.castShadow = true;
        group.add(mesh);
      });

      // Cutaway Furniture Blocks indicating room types:
      // Master Bedroom Bed
      const bedGeo = new THREE.BoxGeometry(2.4, 0.6, 2.8);
      const bed = new THREE.Mesh(bedGeo, woodParquetMat);
      bed.position.set(5.5, 0.3, -4.5);
      group.add(bed);

      // Living Room Sofa Block
      const sofaGeo = new THREE.BoxGeometry(3.6, 0.45, 1.6);
      const sofa = new THREE.Mesh(sofaGeo, darkAccentMat);
      sofa.position.set(-4.5, 0.3, -3.5);
      group.add(sofa);

      // Kitchen Counter U-Shape
      const k1 = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.6, 0.8), darkAccentMat);
      k1.position.set(-6.5, 0.3, 4.5);
      group.add(k1);

      const k2 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 2.5), darkAccentMat);
      k2.position.set(-8.2, 0.3, 3.2);
      group.add(k2);
    }

    scene.add(group);
  };

  // Setup Lights according to preset
  const configureLighting = (scene: THREE.Scene, preset: 'day' | 'sunset' | 'blueprint') => {
    if (lightsGroupRef.current) {
      scene.remove(lightsGroupRef.current);
    }

    const lights = new THREE.Group();
    lightsGroupRef.current = lights;

    if (preset === 'day') {
      const hemiLight = new THREE.HemisphereLight(0xffffff, 0xcfd8dc, 0.9);
      lights.add(hemiLight);

      const dirLight = new THREE.DirectionalLight(0xfffbeb, 1.5);
      dirLight.position.set(15, 22, 14);
      dirLight.castShadow = true;
      dirLight.shadow.mapSize.width = 1024;
      dirLight.shadow.mapSize.height = 1024;
      dirLight.shadow.camera.near = 0.5;
      dirLight.shadow.camera.far = 60;
      dirLight.shadow.camera.left = -16;
      dirLight.shadow.camera.right = 16;
      dirLight.shadow.camera.top = 16;
      dirLight.shadow.camera.bottom = -16;
      lights.add(dirLight);

      const fillLight = new THREE.DirectionalLight(0xdbeafe, 0.4);
      fillLight.position.set(-15, 10, -10);
      lights.add(fillLight);
    } else if (preset === 'sunset') {
      const hemiLight = new THREE.HemisphereLight(0xfef08a, 0x7c2d12, 0.7);
      lights.add(hemiLight);

      const sunLight = new THREE.DirectionalLight(0xf97316, 2.2);
      sunLight.position.set(22, 8, 12);
      sunLight.castShadow = true;
      lights.add(sunLight);
    } else {
      // Blueprint tech wireframe mode
      const ambientLight = new THREE.AmbientLight(0x38bdf8, 1.2);
      lights.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0x60a5fa, 1.0);
      dirLight.position.set(10, 20, 10);
      lights.add(dirLight);
    }

    scene.add(lights);
  };

  // Initialize Three.js viewport
  useEffect(() => {
    if (!canvasMountRef.current) return;

    // Detect software rendering guard
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    const container = canvasMountRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 520;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(lightingPreset === 'blueprint' ? 0x090d16 : 0xf8fafc);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(14, 12, 16);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Procedural RoomEnvironment reflection map
    try {
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
      pmremGenerator.dispose();
    } catch (e) {
      console.warn('RoomEnvironment fallback', e);
    }

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // Prevent going beneath ground
    controls.minDistance = 5;
    controls.maxDistance = 45;
    controls.target.set(0, 2.5, 0);
    controlsRef.current = controls;

    // Build lighting & model
    configureLighting(scene, lightingPreset);
    buildSceneGeometry(scene, viewMode, lightingPreset);

    // Animation Loop
    let running = true;
    const animate = () => {
      if (!running) return;
      controls.update();
      renderer.render(scene, camera);
      reqIdRef.current = requestAnimationFrame(animate);
    };
    animate();

    // Resize observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    });
    resizeObserver.observe(container);

    return () => {
      running = false;
      cancelAnimationFrame(reqIdRef.current);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      container.innerHTML = '';
    };
  }, []);

  // Update Scene when viewMode or lightingPreset changes
  useEffect(() => {
    if (sceneRef.current && cameraRef.current && controlsRef.current) {
      sceneRef.current.background = new THREE.Color(
        lightingPreset === 'blueprint' ? 0x090d16 : 0xf8fafc
      );
      configureLighting(sceneRef.current, lightingPreset);
      buildSceneGeometry(sceneRef.current, viewMode, lightingPreset);

      // Adjust camera smoothly for each mode
      if (viewMode === 'exterior') {
        cameraRef.current.position.set(16, 12, 18);
        controlsRef.current.target.set(0, 2.5, 0);
      } else if (viewMode === 'interior') {
        cameraRef.current.position.set(0, 6, 11);
        controlsRef.current.target.set(0, 1.5, 0);
      } else if (viewMode === 'floorplan') {
        cameraRef.current.position.set(0, 22, 1);
        controlsRef.current.target.set(0, 0, 0);
      }
      controlsRef.current.update();
    }
  }, [viewMode, lightingPreset]);

  // Reset Camera View
  const handleResetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      if (viewMode === 'exterior') {
        cameraRef.current.position.set(16, 12, 18);
        controlsRef.current.target.set(0, 2.5, 0);
      } else if (viewMode === 'interior') {
        cameraRef.current.position.set(0, 6, 11);
        controlsRef.current.target.set(0, 1.5, 0);
      } else {
        cameraRef.current.position.set(0, 22, 1);
        controlsRef.current.target.set(0, 0, 0);
      }
      controlsRef.current.update();
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error('Fullscreen request failed', err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'w-full'
      }`}
    >
      {/* Top Header Information & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <Home className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-slate-900">{property.title}</h3>
              <span className="text-xs font-medium text-slate-500">·</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                {property.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {property.location} · {property.area} · {property.bedrooms} Beds · {property.bathrooms} Baths
            </p>
          </div>
        </div>

        {/* View mode segmented tabs (Single line controls) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setViewMode('exterior')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                viewMode === 'exterior'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Exterior
            </button>
            <button
              onClick={() => setViewMode('interior')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                viewMode === 'interior'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Interior
            </button>
            <button
              onClick={() => setViewMode('floorplan')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                viewMode === 'floorplan'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Floor Plan
            </button>
          </div>

          <button
            onClick={handleResetCamera}
            title="Reset Camera Angle"
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen 3D'}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main 3D Viewport with Grid Canvas */}
      <div className="relative w-full h-[540px] bg-slate-50">
        <div ref={canvasMountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Floating Minimal Spec Indicator (Top Left, Non-obstructive) */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs border border-slate-200/80 rounded-lg px-3 py-2 text-xs shadow-xs pointer-events-none">
          <div className="font-semibold text-slate-900 tabular-nums">{formatPrice(property.price)}</div>
          <div className="text-[11px] text-slate-500">
            {viewMode.toUpperCase()} VIEW · ROTATE: DRAG · ZOOM: SCROLL
          </div>
        </div>

        {/* Collapsible Bottom Dock (SKILL Section 5 Ergonomic Bottom Dock) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 pointer-events-auto">
          <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl shadow-lg p-2.5 transition-all">
            <div className="flex items-center justify-between gap-3 text-xs">
              {/* Lighting atmosphere selector */}
              <div className="flex items-center gap-1">
                <span className="text-slate-500 font-medium text-[11px] mr-1 hidden sm:inline">Scene:</span>
                <button
                  onClick={() => setLightingPreset('day')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    lightingPreset === 'day' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Daylight
                </button>
                <button
                  onClick={() => setLightingPreset('sunset')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    lightingPreset === 'sunset' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Sunset
                </button>
                <button
                  onClick={() => setLightingPreset('blueprint')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    lightingPreset === 'blueprint' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Blueprint
                </button>
              </div>

              {/* Action Buttons connected directly to booking & AI flows */}
              <div className="flex items-center gap-2">
                {onLaunchAIAnalysis && (
                  <button
                    onClick={() => onLaunchAIAnalysis(property)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors whitespace-nowrap"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>AI Intelligence</span>
                  </button>
                )}
                
                {onBookVisit && (
                  <button
                    onClick={() => onBookVisit(property)}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs transition-colors whitespace-nowrap"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book a Visit</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Property Details Footer Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 border-t border-slate-200 bg-slate-50/70 p-4 text-xs">
        <div className="p-2">
          <div className="text-slate-500">Configuration</div>
          <div className="font-semibold text-slate-900 mt-0.5">{property.type} · {property.bedrooms} BHK</div>
        </div>
        <div className="p-2">
          <div className="text-slate-500">Super Built-up Area</div>
          <div className="font-semibold text-slate-900 tabular-nums mt-0.5">{property.area}</div>
        </div>
        <div className="p-2">
          <div className="text-slate-500">Seller / Agency</div>
          <div className="font-semibold text-slate-900 mt-0.5">{property.seller}</div>
        </div>
        <div className="p-2">
          <div className="text-slate-500">Plot Dimensions</div>
          <div className="font-semibold text-slate-900 tabular-nums mt-0.5">
            {property.plotDimensions ? `${property.plotDimensions.lengthFt} ft × ${property.plotDimensions.widthFt} ft` : 'Survey pending'}
          </div>
        </div>
      </div>
    </div>
  );
};
