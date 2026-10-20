import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Property } from '../../types';
import { 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Layers, 
  Building2, 
  Compass, 
  Grid, 
  Ruler, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface Plot3DViewerProps {
  property?: Property;
  initialLengthFt?: number;
  initialWidthFt?: number;
  initialFSI?: number;
  onMassingChange?: (data: { coverageSqFt: number; totalBuiltUpSqFt: number; maxFloors: number }) => void;
}

export const Plot3DViewer: React.FC<Plot3DViewerProps> = ({
  property,
  initialLengthFt = 80,
  initialWidthFt = 60,
  initialFSI = 2.0,
  onMassingChange
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasMountRef = useRef<HTMLDivElement>(null);

  const [is2DMode, setIs2DMode] = useState(false);
  const [showMassing, setShowMassing] = useState(true);
  const [showSetbacks, setShowSetbacks] = useState(true);
  const [massingFloors, setMassingFloors] = useState(4);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Plot geometry dimensions
  const lengthFt = property?.plotDimensions?.lengthFt || initialLengthFt;
  const widthFt = property?.plotDimensions?.widthFt || initialWidthFt;
  const plotAreaSqFt = lengthFt * widthFt;
  const plotAreaSqM = Math.round(plotAreaSqFt * 0.092903);

  // Setback metrics (typical municipal zoning requirement: Front 4m, Rear 3m, Sides 2m)
  const frontSetbackFt = 15;
  const rearSetbackFt = 10;
  const sideSetbackFt = 8;
  const buildableLengthFt = Math.max(10, lengthFt - (frontSetbackFt + rearSetbackFt));
  const buildableWidthFt = Math.max(10, widthFt - (sideSetbackFt * 2));
  const footprintSqFt = Math.round(buildableLengthFt * buildableWidthFt);
  const totalBuiltUpSqFt = footprintSqFt * massingFloors;

  // Three.js instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const plotGroupRef = useRef<THREE.Group | null>(null);
  const reqIdRef = useRef<number>(0);

  const buildPlotScene = (scene: THREE.Scene, is2D: boolean, massing: boolean, setbacks: boolean, floors: number) => {
    if (plotGroupRef.current) {
      scene.remove(plotGroupRef.current);
      plotGroupRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const m = child as THREE.Mesh;
          m.geometry?.dispose();
          if (Array.isArray(m.material)) m.material.forEach((mat) => mat.dispose());
          else m.material?.dispose();
        }
      });
    }

    const group = new THREE.Group();
    plotGroupRef.current = group;

    // Scale conversion: 1 Three.js unit = 5 feet
    const scale = 0.2;
    const l = lengthFt * scale;
    const w = widthFt * scale;

    // Surrounding Environment Ground
    const envGeo = new THREE.PlaneGeometry(l + 16, w + 16);
    const envMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.9 });
    const env = new THREE.Mesh(envGeo, envMat);
    env.rotation.x = -Math.PI / 2;
    env.position.y = -0.05;
    env.receiveShadow = true;
    group.add(env);

    // Front Access Road (12m / 40ft road standard)
    const roadWidth = 8;
    const roadGeo = new THREE.PlaneGeometry(l + 16, roadWidth);
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, -0.04, (w / 2) + (roadWidth / 2));
    group.add(road);

    // Road White Centerline Dash
    const centerLineGeo = new THREE.PlaneGeometry(l + 16, 0.2);
    const centerLineMat = new THREE.MeshBasicMaterial({ color: 0xf8fafc });
    const centerLine = new THREE.Mesh(centerLineGeo, centerLineMat);
    centerLine.rotation.x = -Math.PI / 2;
    centerLine.position.set(0, -0.03, (w / 2) + (roadWidth / 2));
    group.add(centerLine);

    // Plot Boundary Slab
    const plotGeo = new THREE.BoxGeometry(l, 0.1, w);
    const plotMat = new THREE.MeshStandardMaterial({
      color: 0xecfdf5,
      roughness: 0.7,
      metalness: 0.05
    });
    const plotMesh = new THREE.Mesh(plotGeo, plotMat);
    plotMesh.position.y = 0;
    plotMesh.receiveShadow = true;
    group.add(plotMesh);

    // Boundary Perimeter Wire / Line
    const edges = new THREE.EdgesGeometry(plotGeo);
    const edgeLine = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x059669, linewidth: 2 }));
    edgeLine.position.y = 0;
    group.add(edgeLine);

    // Boundary Corner Pegs (Survey Markers)
    const pegGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.6, 8);
    const pegMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4 });
    const halfL = l / 2;
    const halfW = w / 2;
    const corners = [
      [-halfL, halfW],
      [halfL, halfW],
      [halfL, -halfW],
      [-halfL, -halfW]
    ];
    corners.forEach(([cx, cz]) => {
      const peg = new THREE.Mesh(pegGeo, pegMat);
      peg.position.set(cx, 0.3, cz);
      group.add(peg);
    });

    // Setback Envelope (Buildable footprint)
    if (setbacks) {
      const bL = buildableLengthFt * scale;
      const bW = buildableWidthFt * scale;
      const setbackGeo = new THREE.PlaneGeometry(bL, bW);
      const setbackMat = new THREE.MeshBasicMaterial({
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide
      });
      const setbackMesh = new THREE.Mesh(setbackGeo, setbackMat);
      setbackMesh.rotation.x = -Math.PI / 2;
      // Front setback pushes building back towards negative Z
      const zOffset = ((frontSetbackFt - rearSetbackFt) * scale) / 2;
      setbackMesh.position.set(0, 0.06, -zOffset);
      group.add(setbackMesh);

      const setbackEdges = new THREE.EdgesGeometry(new THREE.BoxGeometry(bL, 0.05, bW));
      const setbackLine = new THREE.LineSegments(
        setbackEdges,
        new THREE.LineDashedMaterial({ color: 0x2563eb, dashSize: 0.5, gapSize: 0.2 })
      );
      setbackLine.computeLineDistances();
      setbackLine.position.set(0, 0.07, -zOffset);
      group.add(setbackLine);
    }

    // Conceptual Massing Extrusion (Land Development Preview)
    if (massing && !is2D) {
      const bL = buildableLengthFt * scale;
      const bW = buildableWidthFt * scale;
      const floorHeight = 0.65;
      const totalHeight = floors * floorHeight;
      const zOffset = ((frontSetbackFt - rearSetbackFt) * scale) / 2;

      // Transparent Glazed Massing Volume
      const massingGeo = new THREE.BoxGeometry(bL, totalHeight, bW);
      const massingMat = new THREE.MeshPhysicalMaterial({
        color: 0x60a5fa,
        transparent: true,
        opacity: 0.45,
        roughness: 0.1,
        metalness: 0.2,
        transmission: 0.5,
        ior: 1.4
      });
      const massingMesh = new THREE.Mesh(massingGeo, massingMat);
      massingMesh.position.set(0, totalHeight / 2 + 0.1, -zOffset);
      massingMesh.castShadow = true;
      group.add(massingMesh);

      // Floor Slabs (Levels representation)
      for (let f = 1; f <= floors; f++) {
        const slabGeo = new THREE.BoxGeometry(bL + 0.08, 0.04, bW + 0.08);
        const slabMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });
        const slabMesh = new THREE.Mesh(slabGeo, slabMat);
        slabMesh.position.set(0, f * floorHeight + 0.1, -zOffset);
        group.add(slabMesh);
      }
    }

    scene.add(group);
  };

  useEffect(() => {
    if (!canvasMountRef.current) return;
    const container = canvasMountRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 480;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf8fafc);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(16, 18, 22);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = is2DMode ? 0.001 : Math.PI / 2 - 0.02;
    controls.minDistance = 6;
    controls.maxDistance = 60;
    controls.target.set(0, 1, 0);
    controlsRef.current = controls;

    // Lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xcfd8dc, 0.8);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfffbeb, 1.4);
    dirLight.position.set(18, 24, 18);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    buildPlotScene(scene, is2DMode, showMassing, showSetbacks, massingFloors);

    let running = true;
    const animate = () => {
      if (!running) return;
      controls.update();
      renderer.render(scene, camera);
      reqIdRef.current = requestAnimationFrame(animate);
    };
    animate();

    const resizeObserver = new ResizeObserver(() => {
      if (!container || !renderer || !camera) return;
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
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

  // Update when controls change
  useEffect(() => {
    if (sceneRef.current && cameraRef.current && controlsRef.current) {
      buildPlotScene(sceneRef.current, is2DMode, showMassing, showSetbacks, massingFloors);

      if (is2DMode) {
        cameraRef.current.position.set(0, 28, 0.001);
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.maxPolarAngle = 0.001;
      } else {
        controlsRef.current.maxPolarAngle = Math.PI / 2 - 0.02;
      }
      controlsRef.current.update();
    }
  }, [is2DMode, showMassing, showSetbacks, massingFloors, lengthFt, widthFt]);

  const handleReset = () => {
    if (cameraRef.current && controlsRef.current) {
      if (is2DMode) {
        cameraRef.current.position.set(0, 28, 0.001);
        controlsRef.current.target.set(0, 0, 0);
      } else {
        cameraRef.current.position.set(16, 18, 22);
        controlsRef.current.target.set(0, 1, 0);
      }
      controlsRef.current.update();
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'w-full'
      }`}
    >
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <Ruler className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Interactive 3D Cadastral Plot & Massing Engine
            </h3>
            <p className="text-xs text-slate-500">
              {lengthFt} ft Length × {widthFt} ft Width · Area: {plotAreaSqFt.toLocaleString()} sq.ft ({plotAreaSqM} m²)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* 2D / 3D Mode Toggle */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setIs2DMode(false)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                !is2DMode ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3D Elevation
            </button>
            <button
              onClick={() => setIs2DMode(true)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                is2DMode ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2D Cadastral Plan
            </button>
          </div>

          <button
            onClick={handleReset}
            title="Reset View"
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3D Canvas Area */}
      <div className="relative w-full h-[480px] bg-slate-50">
        <div ref={canvasMountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Minimal Plot Dimensions Overlay */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs border border-slate-200 rounded-lg p-3 text-xs shadow-xs pointer-events-none">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Supplied Dimensions</div>
          <div className="font-bold text-slate-900 tabular-nums text-sm mt-0.5">
            {lengthFt} ft × {widthFt} ft
          </div>
          <div className="text-slate-600 mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            Survey Perimeter: {((lengthFt + widthFt) * 2)} ft
          </div>
          <div className="text-slate-600 mt-0.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            Buildable Footprint: {footprintSqFt.toLocaleString()} sq.ft
          </div>
        </div>

        {/* Interactive Massing Dock */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 pointer-events-auto">
          <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl shadow-lg p-3">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
                  <input
                    type="checkbox"
                    checked={showSetbacks}
                    onChange={(e) => setShowSetbacks(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600"
                  />
                  <span>Municipal Setbacks</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
                  <input
                    type="checkbox"
                    checked={showMassing}
                    onChange={(e) => setShowMassing(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600"
                  />
                  <span>Massing Envelope</span>
                </label>
              </div>

              {showMassing && !is2DMode && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Storeys:</span>
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md">
                    {[2, 3, 4, 6].map((f) => (
                      <button
                        key={f}
                        onClick={() => setMassingFloors(f)}
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                          massingFloors === f ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        G+{f - 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cadastral Specs Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 border-t border-slate-200 bg-slate-50/70 p-4 text-xs">
        <div className="p-2">
          <div className="text-slate-500">Gross Plot Area</div>
          <div className="font-semibold text-slate-900 tabular-nums mt-0.5">{plotAreaSqFt.toLocaleString()} sq.ft</div>
        </div>
        <div className="p-2">
          <div className="text-slate-500">Max Ground Coverage</div>
          <div className="font-semibold text-slate-900 tabular-nums mt-0.5">{Math.round((footprintSqFt / plotAreaSqFt) * 100)}% ({footprintSqFt.toLocaleString()} sq.ft)</div>
        </div>
        <div className="p-2">
          <div className="text-slate-500">Estimated FSI Built-up</div>
          <div className="font-semibold text-slate-900 tabular-nums mt-0.5">{totalBuiltUpSqFt.toLocaleString()} sq.ft (at G+{massingFloors - 1})</div>
        </div>
        <div className="p-2">
          <div className="text-slate-500">Access Road Frontage</div>
          <div className="font-semibold text-slate-900 mt-0.5">40 ft (12m) Asphalt Road</div>
        </div>
      </div>
    </div>
  );
};
