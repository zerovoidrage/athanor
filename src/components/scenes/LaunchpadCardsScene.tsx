'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import * as THREE from 'three';
import ProjectInfoCard from '@/components/ui/ProjectInfoCard';

// Ограничиваем количество карточек для launchpad
const LAUNCHPAD_CARD_COUNT = 2;

const imagePaths = [
  '/img/threejs/abyss/icon1.jpg',
  '/img/threejs/abyss/icon2.jpg',
  '/img/threejs/abyss/icon3.jpg',
  '/img/threejs/abyss/icon4.jpg',
  '/img/threejs/abyss/icon5.jpg',
  '/img/threejs/abyss/icon6.jpg',
  '/img/threejs/abyss/icon7.jpg',
  '/img/threejs/abyss/icon8.jpg',
  '/img/threejs/abyss/icon9.jpg'
];

const projectNames = [
  'neuralverse',
  'visionai',
  'cryptoflex',
  'blockchain',
  'smartcontract',
  'gamehub',
  'quantumforge',
  'datasphere',
  'omnibase'
];

export default function LaunchpadCardsScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const raycasterRef = useRef<THREE.Raycaster | null>(null);
  const mouseRef = useRef<THREE.Vector2 | null>(null);
  const cameraLerpTargetRef = useRef<THREE.Vector3 | null>(null);
  const isZoomedRef = useRef(false);
  const zoomTargetRef = useRef<THREE.Group | null>(null);
  const cardsRef = useRef<THREE.Group[]>([]);

  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomTarget, setZoomTarget] = useState<THREE.Group | null>(null);
  const [selectedProject, setSelectedProject] = useState<{ name: string; imageIndex: number } | null>(null);
  const [showInfoCard, setShowInfoCard] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const cardsVisibleRef = useRef(false);
  const parallaxRef = useRef({ x: 0, y: 0 }); // нормализованные -1..1

  const createTextTexture = useCallback((text: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const paddingX = 150;
    const paddingY = 60;
    const fontFamily = 'SuisseIntl, Arial, sans-serif';

    let fontSize = (canvas.height - paddingY * 2) * 0.8; // уменьшили на 20%
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';

    const fits = (fs: number) => {
      ctx.font = `${fs}px ${fontFamily}`;
      return ctx.measureText(text).width <= (canvas.width - paddingX * 2);
    };

    while (fontSize > 10 && !fits(fontSize)) fontSize -= 4;

    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 8;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return { texture: tex, aspect: canvas.width / canvas.height };
  }, []);

  const getCardRoot = useCallback((object: THREE.Object3D): THREE.Group | null => {
    let current = object;
    while (current && !current.userData.isCardGroup) {
      current = current.parent!;
    }
    return current as THREE.Group | null;
  }, []);

  const createCard = useCallback((index: number) => {
    const cardGroup = new THREE.Group();
    cardGroup.userData.isCardGroup = true;
    cardGroup.userData.name = projectNames[index % projectNames.length];
    cardGroup.userData.imageIndex = index + 1;

    const geometry = new THREE.PlaneGeometry(0.7, 0.7);
    const textureLoader = new THREE.TextureLoader();
    const imagePath = imagePaths[index % imagePaths.length];
    
    const texture = textureLoader.load(
      imagePath,
      (loadedTexture) => {
        loadedTexture.anisotropy = 16;
        loadedTexture.colorSpace = THREE.SRGBColorSpace;
        loadedTexture.generateMipmaps = true;
        loadedTexture.minFilter = THREE.LinearMipmapLinearFilter;
        loadedTexture.magFilter = THREE.LinearFilter;
      },
      undefined,
      (error) => {
        console.error('LaunchpadCardsScene: Error loading texture', imagePath, error);
      }
    );
    
    texture.anisotropy = 16;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.FrontSide,
      alphaTest: 0.2,
      premultipliedAlpha: false,
      opacity: 0 // для fade-in
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0.01);
    mesh.renderOrder = 2;
    cardGroup.add(mesh);

    // Подпись под карточкой
    const label = createTextTexture(cardGroup.userData.name);
    if (label) {
      const SCALE = 2;                  // если хочешь иначе — поменяй
      const baseHeight = 0.14;
      const desiredHeight = baseHeight * SCALE;
      const desiredWidth  = desiredHeight * label.aspect;

      const labelGeo = new THREE.PlaneGeometry(desiredWidth, desiredHeight);
      const labelMat = new THREE.MeshBasicMaterial({
        map: label.texture,
        transparent: true,
        side: THREE.DoubleSide,
        depthTest: false,               // всегда поверх
        opacity: 0
      });
      const labelMesh = new THREE.Mesh(labelGeo, labelMat);
      labelMesh.position.set(0, -0.55 - (desiredHeight - baseHeight) * 0.35, 0.05);
      labelMesh.renderOrder = 10;
      cardGroup.add(labelMesh);
    }

    return cardGroup;
  }, [createTextTexture]);

  const initScene = useCallback(() => {
    if (!mountRef.current) return;

    // гасим старый цикл и DOM-канвас
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }
    if (rendererRef.current) {
      if (rendererRef.current.domElement.parentElement) {
        rendererRef.current.domElement.parentElement.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current.dispose();
      rendererRef.current = null;
    }

    // сброс флагов fade-in
    cardsVisibleRef.current = false;
    setCardsVisible(false);

    // Очищаем предыдущую сцену
    if (groupRef.current) {
      while (groupRef.current.children.length > 0) {
        groupRef.current.remove(groupRef.current.children[0]);
      }
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mountRef.current!.appendChild(renderer.domElement);

    camera.position.set(0, 0, 8);

    const group = new THREE.Group();
    scene.add(group);

    // адаптивный отступ между двумя карточками
    const aspect = window.innerWidth / window.innerHeight;
    const gap = aspect > 1.2 ? 2.2 : 1.6; // пошире на десктопе, уже на мобиле

    const cards: THREE.Group[] = [];
    for (let i = 0; i < 2; i++) {
      const card = createCard(i);
      const x = (i === 0 ? -gap/2 : gap/2);
      card.position.set(x, 0, 0);
      group.add(card);
      cards.push(card);
    }

    cardsRef.current = cards;

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    groupRef.current = group;
    raycasterRef.current = new THREE.Raycaster();
    mouseRef.current = new THREE.Vector2();
    cameraLerpTargetRef.current = new THREE.Vector3(0, 0, 8);

    // Анимационный цикл
    const animate = () => {
      if (!groupRef.current || !cameraRef.current || !rendererRef.current || !sceneRef.current) {
        animationIdRef.current = requestAnimationFrame(animate);
        return;
      }

      // Parallax: плавно тянем всю группу к смещению мыши
      const k = isZoomedRef.current ? 0.25 : 1;     // 25% амплитуды в зуме
      const amp = 0.6;                               // амплитуда движения сцены (можешь подстроить)
      const tx = parallaxRef.current.x * amp * k;
      const ty = parallaxRef.current.y * amp * k;

      // демпфер
      groupRef.current.position.x += (tx - groupRef.current.position.x) * 0.06;
      groupRef.current.position.y += (ty - groupRef.current.position.y) * 0.06;

      // Обновление цели камеры при зуме
      if (isZoomedRef.current && zoomTargetRef.current && cameraRef.current) {
        const pos = new THREE.Vector3();
        zoomTargetRef.current.getWorldPosition(pos);

        const dir = new THREE.Vector3();
        cameraRef.current.updateMatrixWorld(true);
        cameraRef.current.getWorldDirection(dir);

        const distance = 2.5;
        cameraLerpTargetRef.current!.copy(pos).add(dir.multiplyScalar(-distance));
      }

      // Плавный лерп позиции камеры и фиксация ориентации
      cameraRef.current.position.lerp(cameraLerpTargetRef.current!, 0.08);
      cameraRef.current.rotation.set(0, 0, 0);

      // Fade-in с ref, чтобы не триггерить переинициализацию
      if (groupRef.current && !cardsVisibleRef.current) {
        const children = groupRef.current.children;
        let allVisible = true;

        children.forEach((card) => {
          if (card instanceof THREE.Group) {
            card.children.forEach((child) => {
              if (child instanceof THREE.Mesh && child.material) {
                const mat = child.material as THREE.MeshBasicMaterial;
                if (mat.opacity < 1) {
                  mat.opacity = Math.min(1, mat.opacity + 0.02);
                  allVisible = false;
                }
              }
            });
          }
        });

        if (allVisible) {
          cardsVisibleRef.current = true;   // внутренний флаг
          setCardsVisible(true);            // состояние для UI, но без ребилда initScene
        }
      }

      rendererRef.current.render(sceneRef.current, cameraRef.current);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate(); // <-- запускаем цикл здесь
  }, [createCard]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!mouseRef.current || !raycasterRef.current || !cameraRef.current || !groupRef.current) return;

    // 1) всегда обновляем параллакс (нормализуем к -1..1)
    const w = window.innerWidth;
    const h = window.innerHeight;
    parallaxRef.current.x = (e.clientX / w - 0.5) * 2;   // -1..1
    parallaxRef.current.y = -(e.clientY / h - 0.5) * 2;  // -1..1 (инверсия по Y)

    // 2) если зум — только отключаем hover, но параллакс оставляем активным
    if (isZoomedRef.current) {
      cardsRef.current.forEach(card => card.scale.set(1, 1, 1));
      if (rendererRef.current) rendererRef.current.domElement.style.cursor = 'default';
      return;
    }

    // 3) проверка UI-перекрытий
    const path = e.composedPath();
    const isOverUI = path.some((target: any) => target.hasAttribute && target.hasAttribute('data-ui'));
    if (isOverUI) {
      if (rendererRef.current) rendererRef.current.domElement.style.cursor = 'default';
      cardsRef.current.forEach(card => card.scale.set(1, 1, 1));
      return;
    }

    // 4) hover-луч
    mouseRef.current.x = (e.clientX / w) * 2 - 1;
    mouseRef.current.y = -(e.clientY / h) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
    const intersects = raycasterRef.current.intersectObjects(groupRef.current?.children ?? [], true);

    cardsRef.current.forEach((card) => {
      const isHovered = intersects.find(i => getCardRoot(i.object) === card);
      if (isHovered) {
        card.scale.set(1.05, 1.05, 1.05);
        if (rendererRef.current) rendererRef.current.domElement.style.cursor = 'pointer';
      } else {
        card.scale.set(1, 1, 1);
      }
    });

    if (intersects.length === 0 && rendererRef.current) {
      rendererRef.current.domElement.style.cursor = 'default';
    }
  }, [getCardRoot]);

  const handleClick = useCallback((e: MouseEvent) => {
    if (!mouseRef.current || !raycasterRef.current || !cameraRef.current || !groupRef.current) return;

    // Проверяем, не кликнули ли по UI элементам
    const path = e.composedPath();
    const isOverUI = path.some((target: any) => target.hasAttribute && target.hasAttribute('data-ui'));
    if (isOverUI) return;

    mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
    const intersects = raycasterRef.current.intersectObjects(groupRef.current?.children ?? [], true);

    const hit = intersects.find(i => getCardRoot(i.object));
    const cardRoot = hit ? getCardRoot(hit.object) as THREE.Group | null : null;

    if (!cardRoot) {
      if (isZoomedRef.current) {
        // zoom out
        isZoomedRef.current = false;
        zoomTargetRef.current = null;
        setIsZoomed(false);
        setZoomTarget(null);
        setSelectedProject(null);
        setShowInfoCard(false);
        cameraLerpTargetRef.current!.set(0, 0, 8);
      }
      return;
    }

    // toggle по тому же объекту
    if (zoomTargetRef.current === cardRoot) {
      isZoomedRef.current = false;
      zoomTargetRef.current = null;
      setIsZoomed(false);
      setZoomTarget(null);
      setSelectedProject(null);
      setShowInfoCard(false);
      cameraLerpTargetRef.current!.set(0, 0, 8);
      return;
    }

    // zoom in
    zoomTargetRef.current = cardRoot;
    isZoomedRef.current = true;
    setIsZoomed(true);
    setZoomTarget(cardRoot);
    setSelectedProject({ 
      name: (cardRoot as any).userData.name, 
      imageIndex: (cardRoot as any).userData.imageIndex 
    });
    setShowInfoCard(true);

    const worldPosition = new THREE.Vector3();
    cardRoot.getWorldPosition(worldPosition);
    
    const dir = new THREE.Vector3();
    cameraRef.current!.getWorldDirection(dir);
    cameraLerpTargetRef.current!.copy(worldPosition).add(dir.multiplyScalar(-2.5));
  }, [getCardRoot]);

  const handleResize = useCallback(() => {
    if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;

    rendererRef.current!.setSize(window.innerWidth, window.innerHeight);
    cameraRef.current!.aspect = window.innerWidth / window.innerHeight;
    cameraRef.current!.updateProjectionMatrix();

    if (isZoomedRef.current && zoomTargetRef.current) {
      const p = new THREE.Vector3();
      zoomTargetRef.current.getWorldPosition(p);
      const dir = new THREE.Vector3();
      cameraRef.current!.getWorldDirection(dir);
      cameraLerpTargetRef.current!.copy(p).add(dir.multiplyScalar(-2.5));
    }
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && isZoomedRef.current) {
      isZoomedRef.current = false;
      zoomTargetRef.current = null;
      setIsZoomed(false);
      setZoomTarget(null);
      setSelectedProject(null);
      setShowInfoCard(false);
      cameraLerpTargetRef.current!.set(0, 0, 8);
    }
  }, []);

  const handleCloseInfoCard = useCallback(() => {
    isZoomedRef.current = false;
    zoomTargetRef.current = null;
    setIsZoomed(false);
    setZoomTarget(null);
    setSelectedProject(null);
    setShowInfoCard(false);
    cameraLerpTargetRef.current!.set(0, 0, 8);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      initScene();
    }, 100);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);

      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }

      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }

      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [initScene, handleMouseMove, handleClick, handleResize, handleKeyDown]);



  return (
    <>
      <div
        ref={mountRef}
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: 'auto' }}
      />
      <ProjectInfoCard 
        isVisible={showInfoCard}
        projectData={selectedProject}
        onClose={handleCloseInfoCard}
      />
    </>
  );
}
