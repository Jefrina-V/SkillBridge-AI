import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OverallAnalysis, SkillGapItem } from '../types';
import { Sparkles, Compass, Eye, RotateCw, ZoomIn, ZoomOut, CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';

interface ThreeSkillGalaxyProps {
  analysis: OverallAnalysis;
  onSelectSkill?: (skillName: string) => void;
  onOpenEvidence?: (gap: SkillGapItem) => void;
}

interface NodeData {
  name: string;
  category: string;
  status: 'covered' | 'partial' | 'missing';
  similarity: number;
  priority: number;
  gapItem?: SkillGapItem;
  mesh: THREE.Mesh;
  halo: THREE.Mesh;
  originalPos: THREE.Vector3;
  angle: number;
  radius: number;
  speed: number;
  elevation: number;
}

export const ThreeSkillGalaxy: React.FC<ThreeSkillGalaxyProps> = ({
  analysis,
  onSelectSkill,
  onOpenEvidence
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<NodeData | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'missing' | 'partial' | 'covered'>('all');
  const [isRotating, setIsRotating] = useState(true);

  // Store references for animation loop
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const nodesRef = useRef<NodeData[]>([]);
  const frameIdRef = useRef<number | null>(null);
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2(-999, -999));
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const rotationGroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 450;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020617, 0.002);
    sceneRef.current = scene;

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 35, 120);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x38bdf8, 2, 200);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    const dirLight1 = new THREE.DirectionalLight(0x818cf8, 1.2);
    dirLight1.position.set(50, 80, 50);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 0.8);
    dirLight2.position.set(-50, -40, -50);
    scene.add(dirLight2);

    // 5. Rotation group for interactive dragging
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);
    rotationGroupRef.current = mainGroup;

    // 6. Central Glowing Core (University Syllabus Hub)
    const coreGeometry = new THREE.SphereGeometry(7, 32, 32);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x0369a1,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: false
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    mainGroup.add(coreMesh);

    // Core Wireframe Rings
    const ringGeo1 = new THREE.TorusGeometry(12, 0.3, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.4 });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    mainGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(18, 0.25, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x818cf8, wireframe: true, transparent: true, opacity: 0.3 });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    mainGroup.add(ring2);

    // 7. Background Starfield / Particle Constellation
    const particleCount = 600;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const colorSky = new THREE.Color(0x38bdf8);
    const colorIndigo = new THREE.Color(0x818cf8);
    const colorRose = new THREE.Color(0xf43f5e);

    for (let i = 0; i < particleCount; i++) {
      const radius = 60 + Math.random() * 160;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = (radius * Math.sin(phi) * Math.sin(theta)) * 0.6;
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);

      const chosen = Math.random() > 0.6 ? colorSky : Math.random() > 0.5 ? colorIndigo : colorRose;
      particleColors[i * 3] = chosen.r;
      particleColors[i * 3 + 1] = chosen.g;
      particleColors[i * 3 + 2] = chosen.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    mainGroup.add(particles);

    // 8. Generate 3D Nodes for all Analysis Skills
    const nodeItems: NodeData[] = [];
    const skillList = analysis.gaps.length > 0 ? analysis.gaps : [
      { id: '1', skillName: 'React', category: 'Frontend', status: 'missing', similarityScore: 0.35, priorityScore: 92 },
      { id: '2', skillName: 'TypeScript', category: 'Frontend', status: 'missing', similarityScore: 0.40, priorityScore: 88 },
      { id: '3', skillName: 'JavaScript', category: 'Frontend', status: 'covered', similarityScore: 0.95, priorityScore: 20 },
      { id: '4', skillName: 'Next.js', category: 'Frontend', status: 'missing', similarityScore: 0.25, priorityScore: 90 },
      { id: '5', skillName: 'HTML / CSS', category: 'Frontend', status: 'covered', similarityScore: 0.98, priorityScore: 15 },
      { id: '6', skillName: 'REST APIs', category: 'Backend', status: 'partial', similarityScore: 0.68, priorityScore: 74 },
      { id: '7', skillName: 'Git / GitHub', category: 'Tools', status: 'missing', similarityScore: 0.45, priorityScore: 82 },
      { id: '8', skillName: 'SQL / Relational', category: 'Database', status: 'covered', similarityScore: 0.90, priorityScore: 25 },
      { id: '9', skillName: 'Docker', category: 'DevOps', status: 'missing', similarityScore: 0.20, priorityScore: 85 },
      { id: '10', skillName: 'Unit Testing', category: 'Testing', status: 'missing', similarityScore: 0.30, priorityScore: 86 }
    ] as any[];

    const totalNodes = skillList.length;
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x334155,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });

    skillList.forEach((gap, index) => {
      const angle = (index / totalNodes) * Math.PI * 2;
      // Distance from center: Covered items are closer to core, missing items are further out
      const baseRadius = gap.status === 'covered' ? 24 + (index % 3) * 3
        : gap.status === 'partial' ? 38 + (index % 3) * 4
        : 52 + (index % 4) * 4;

      const elevation = Math.sin(angle * 2) * 14;
      const speed = 0.002 + ((index % 3) * 0.001);

      // Color based on status
      let colorHex = 0xef4444; // red for missing
      let emissiveHex = 0x991b1b;
      if (gap.status === 'covered') {
        colorHex = 0x10b981; // emerald
        emissiveHex = 0x065f46;
      } else if (gap.status === 'partial') {
        colorHex = 0xf59e0b; // amber
        emissiveHex = 0x92400e;
      }

      // Sphere size scaled slightly by priority
      const size = gap.priorityScore ? 1.8 + (gap.priorityScore / 100) * 1.5 : 2.5;

      const sphereGeo = new THREE.SphereGeometry(size, 24, 24);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        emissive: emissiveHex,
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.7
      });

      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      sphereMesh.position.set(
        Math.cos(angle) * baseRadius,
        elevation,
        Math.sin(angle) * baseRadius
      );
      (sphereMesh as any).userData = { skillName: gap.skillName, index };
      mainGroup.add(sphereMesh);

      // Outer wireframe glowing halo
      const haloGeo = new THREE.SphereGeometry(size * 1.45, 12, 12);
      const haloMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        wireframe: true,
        transparent: true,
        opacity: 0.3
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      haloMesh.position.copy(sphereMesh.position);
      mainGroup.add(haloMesh);

      // Connection line to central core
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        sphereMesh.position
      ]);
      const line = new THREE.Line(lineGeo, lineMaterial);
      mainGroup.add(line);

      nodeItems.push({
        name: gap.skillName,
        category: gap.category || 'Skill',
        status: gap.status,
        similarity: gap.similarityScore,
        priority: gap.priorityScore || 50,
        gapItem: gap,
        mesh: sphereMesh,
        halo: haloMesh,
        originalPos: sphereMesh.position.clone(),
        angle,
        radius: baseRadius,
        speed,
        elevation
      });
    });

    nodesRef.current = nodeItems;

    // 9. Raycasting for hover / interaction
    const raycaster = new THREE.Raycaster();
    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDraggingRef.current && rotationGroupRef.current) {
        const deltaX = event.clientX - prevMouseRef.current.x;
        const deltaY = event.clientY - prevMouseRef.current.y;
        rotationGroupRef.current.rotation.y += deltaX * 0.008;
        rotationGroupRef.current.rotation.x += deltaY * 0.008;
        prevMouseRef.current = { x: event.clientX, y: event.clientY };
      }
    };

    const handleMouseDown = (event: MouseEvent) => {
      isDraggingRef.current = true;
      prevMouseRef.current = { x: event.clientX, y: event.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleClick = () => {
      if (hoveredNode && onSelectSkill) {
        onSelectSkill(hoveredNode.name);
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('click', handleClick);

    // 10. Resize handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 450;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // 11. Animation Loop
    let time = 0;
    const animate = () => {
      time += 0.01;
      frameIdRef.current = requestAnimationFrame(animate);

      // Core rotation
      coreMesh.rotation.y += 0.008;
      coreMesh.rotation.x += 0.004;
      ring1.rotation.z += 0.006;
      ring2.rotation.x += 0.005;

      // Gentle ambient galaxy rotation if not dragging
      if (isRotating && !isDraggingRef.current && mainGroup) {
        mainGroup.rotation.y += 0.002;
      }

      // Orbit individual skill nodes
      nodesRef.current.forEach((node) => {
        node.angle += node.speed;
        const x = Math.cos(node.angle) * node.radius;
        const z = Math.sin(node.angle) * node.radius;
        const y = node.elevation + Math.sin(time + node.angle) * 1.5;

        node.mesh.position.set(x, y, z);
        node.halo.position.set(x, y, z);
        node.halo.rotation.x += 0.01;
        node.halo.rotation.y += 0.01;
      });

      // Raycasting check
      raycaster.setFromCamera(mouseRef.current, camera);
      const meshesToTest = nodesRef.current.map(n => n.mesh);
      const intersects = raycaster.intersectObjects(meshesToTest);

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object as THREE.Mesh;
        const matched = nodesRef.current.find(n => n.mesh === hitMesh);
        if (matched) {
          setHoveredNode(matched);
          container.style.cursor = 'pointer';
          matched.halo.scale.set(1.4, 1.4, 1.4);
        }
      } else {
        setHoveredNode(null);
        container.style.cursor = 'default';
        nodesRef.current.forEach(n => {
          n.halo.scale.set(1, 1, 1);
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [analysis]);

  // Apply node visibility filter
  useEffect(() => {
    nodesRef.current.forEach(node => {
      const matchFilter = selectedFilter === 'all' || node.status === selectedFilter;
      node.mesh.visible = matchFilter;
      node.halo.visible = matchFilter;
    });
  }, [selectedFilter]);

  const handleZoom = (delta: number) => {
    if (cameraRef.current) {
      cameraRef.current.position.z = Math.max(50, Math.min(180, cameraRef.current.position.z + delta));
    }
  };

  const handleResetCamera = () => {
    if (cameraRef.current && rotationGroupRef.current) {
      cameraRef.current.position.set(0, 35, 120);
      cameraRef.current.lookAt(0, 0, 0);
      rotationGroupRef.current.rotation.set(0, 0, 0);
    }
  };

  return (
    <div className="relative bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Top 3D Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 px-3.5 py-2 rounded-xl flex items-center space-x-2 pointer-events-auto shadow-md">
          <Sparkles className="h-4 w-4 text-sky-400 animate-pulse" />
          <span className="text-xs font-bold text-white tracking-wide">
            Interactive 3D Skill Galaxy
          </span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            • Drag to orbit • Hover nodes
          </span>
        </div>

        {/* Filter Pills */}
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 p-1 rounded-xl flex items-center space-x-1 pointer-events-auto shadow-md">
          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors ${
              selectedFilter === 'all' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({analysis.gaps.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('missing')}
            className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center space-x-1 ${
              selectedFilter === 'missing' ? 'bg-rose-500 text-white' : 'text-rose-400 hover:text-rose-200'
            }`}
          >
            <XCircle className="h-3 w-3" />
            <span>Missing Gaps</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('partial')}
            className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center space-x-1 ${
              selectedFilter === 'partial' ? 'bg-amber-500 text-white' : 'text-amber-400 hover:text-amber-200'
            }`}
          >
            <AlertTriangle className="h-3 w-3" />
            <span>Partial</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('covered')}
            className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center space-x-1 ${
              selectedFilter === 'covered' ? 'bg-emerald-500 text-white' : 'text-emerald-400 hover:text-emerald-200'
            }`}
          >
            <CheckCircle2 className="h-3 w-3" />
            <span>Covered</span>
          </button>
        </div>

        {/* Quick View Controls */}
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 p-1 rounded-xl flex items-center space-x-1 pointer-events-auto shadow-md">
          <button
            type="button"
            onClick={() => setIsRotating(!isRotating)}
            title={isRotating ? 'Pause rotation' : 'Resume rotation'}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <RotateCw className={`h-3.5 w-3.5 ${isRotating ? 'text-sky-400' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => handleZoom(-15)}
            title="Zoom In"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleZoom(15)}
            title="Zoom Out"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={handleResetCamera}
            title="Reset view"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Compass className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        className="w-full h-[460px] sm:h-[500px] cursor-grab active:cursor-grabbing select-none"
      />

      {/* Hovered Skill Detail Floating Overlay */}
      {hoveredNode && (
        <div className="absolute bottom-4 left-4 z-30 max-w-sm w-full bg-slate-900/95 backdrop-blur-md border border-slate-800 p-4 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-2 text-xs">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm text-white">{hoveredNode.name}</span>
                <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                  {hoveredNode.category}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Target Role: {analysis.jobRole}
              </p>
            </div>

            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                hoveredNode.status === 'covered'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : hoveredNode.status === 'partial'
                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                  : 'bg-rose-950 text-rose-300 border border-rose-800'
              }`}
            >
              {hoveredNode.status.toUpperCase()}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[11px]">
            <div>
              <span className="text-slate-400 block">Cosine Similarity:</span>
              <span className="font-mono font-bold text-sky-400">
                {(hoveredNode.similarity * 100).toFixed(0)}%
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Priority Impact:</span>
              <span className="font-mono font-bold text-rose-400">
                {hoveredNode.priority}/100
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            {hoveredNode.gapItem && onOpenEvidence && (
              <button
                type="button"
                onClick={() => onOpenEvidence(hoveredNode.gapItem!)}
                className="inline-flex items-center space-x-1 text-sky-400 hover:text-sky-300 font-semibold text-[11px] hover:underline"
              >
                <Info className="h-3 w-3" />
                <span>View Full Evidence</span>
              </button>
            )}

            {onSelectSkill && (
              <button
                type="button"
                onClick={() => onSelectSkill(hoveredNode.name)}
                className="ml-auto inline-flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors"
              >
                <span>Study Resources</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3D Scene Legend at Bottom Right */}
      <div className="absolute bottom-4 right-4 z-20 hidden sm:flex items-center space-x-4 bg-slate-900/80 backdrop-blur-sm border border-slate-800 px-3.5 py-2 rounded-xl text-[11px] text-slate-300 pointer-events-none">
        <div className="flex items-center space-x-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
          <span>Covered (&ge;80%)</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
          <span>Partial (60-79%)</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
          <span>Missing Gap (&lt;60%)</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-sky-500 shadow-sm shadow-sky-500/50" />
          <span>Syllabus Core</span>
        </div>
      </div>
    </div>
  );
};
