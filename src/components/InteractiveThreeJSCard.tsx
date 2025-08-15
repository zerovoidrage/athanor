'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useAuth } from '@/contexts/AuthContext';

interface InteractiveThreeJSCardProps {
  width?: number | string;
  height?: number | string;
}

const InteractiveThreeJSCard: React.FC<InteractiveThreeJSCardProps> = ({ width = '100%', height = '100%' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cardGroupRef = useRef<THREE.Group | null>(null);

  const { displayName } = useAuth();

  // UI state
  const [isDragging, setIsDragging] = useState(false);

  // Runtime refs (чтобы не плодить рендеры)
  const isDraggingRef = useRef(false);
  const autoRotationRef = useRef(true);
  const lastPointerRef = useRef({ x: 0, y: 0 });

  // Инерция: угловые скорости
  const velocityRef = useRef({ vx: 0, vy: 0 }); // ротируем по x/y
  const lastUpdateTsRef = useRef<number>(0);

  // Настройки
  const BASE_AUTOROTATE_Y = 0.3; // градусы/кадр эквивалент (ниже конвертим в радианы с учётом dt)
  const DRAG_SENSITIVITY = 0.006; // чем больше, тем быстрее крутится от мыши
  const DAMPING = 0.93; // затухание инерции (0.9-0.97 комфортно)

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const w = container.clientWidth;
    const h = container.clientHeight;

    // Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000);
    camera.position.z = 5;

    // Lights - как в vault (без источников света, только ambient)
    scene.add(new THREE.AmbientLight(0xffffff, 1.5));

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // Card
    const group = new THREE.Group();
    cardGroupRef.current = group;
    scene.add(group);

    const texLoader = new THREE.TextureLoader();

    // front
    const front = texLoader.load('/img/threejs/cards/angel/frontside.png', (t) => {
      t.minFilter = THREE.LinearFilter;
      t.magFilter = THREE.LinearFilter;
      t.generateMipmaps = false;
    });

    // back — канвас с displayName
    const makeBackTexture = (
      cardW: number,
      cardH: number,
      renderer?: THREE.WebGLRenderer | null
    ) => {
      // 1) Совпадающий аспект с гранью карточки
      const CARD_ASPECT = cardW / cardH; // ~0.63 (портрет)

      // 2) Базовое разрешение + учёт DPR для резкости текста
      const BASE_H = 1024;                       // "эталонная" высота
      const BASE_W = Math.round(BASE_H * CARD_ASPECT); // ширина под аспект
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      const canvas = document.createElement('canvas');
      canvas.width  = Math.max(2, Math.round(BASE_W * dpr));
      canvas.height = Math.max(2, Math.round(BASE_H * dpr));
      const ctx = canvas.getContext('2d')!;

      // 3) Рисуем в "CSS-координатах", не растягивая глифы
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // один раз, чтобы всё было чётко
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Фон
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, BASE_W, BASE_H);

      // Текст (размер привязываем к высоте, чтобы не зависеть от итогового размера текстуры)
      if (displayName) {
        const fontPx = Math.round(BASE_H * 0.0625); // ≈64px при BASE_H=1024
        ctx.fillStyle = '#fff';
        ctx.font = `300 ${fontPx}px "SuisseIntl", Arial, sans-serif`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';

        const x = 24; // сдвинули на 6 пикселей левее
        const y = BASE_H - 32;
        ctx.fillText(displayName, x, y);
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = false; // для NPOT ок
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;

      // Чуть больше резкости под углами
      if (renderer) {
        tex.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
      }

      tex.needsUpdate = true;
      return tex;
    };

    const cardH = 3;
    const cardW = cardH / 1.586;
    const cardThickness = 0.015; // еще более тонкая карточка
    
    // Используем стандартную BoxGeometry (закругления добавим позже)
    const geom = new THREE.BoxGeometry(cardW, cardH, cardThickness);

    // Создаем текстуру задней стороны с правильными параметрами
    const back = makeBackTexture(cardW, cardH, rendererRef.current);

    const matFront = new THREE.MeshBasicMaterial({ map: front, transparent: true });
    const matBack = new THREE.MeshBasicMaterial({ map: back, transparent: true });
    const matSide = new THREE.MeshBasicMaterial({ color: 0x000000, opacity: 0.95, transparent: true });

    const mesh = new THREE.Mesh(geom, [
      matSide, matSide, matSide, matSide, // 4 боковые
      matFront, // front
      matBack   // back
    ]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);

    // Helpers
    const toRad = (deg: number) => (deg * Math.PI) / 180;

    // Pointer handlers
    const onDown = (x: number, y: number) => {
      isDraggingRef.current = true;
      setIsDragging(true);
      lastPointerRef.current = { x, y };
      // инерцию сбрасывать не будем: ощущение "подхватил вращение"
    };

    const onMove = (x: number, y: number) => {
      if (!isDraggingRef.current || !cardGroupRef.current) return;
      const dx = x - lastPointerRef.current.x;
      const dy = y - lastPointerRef.current.y;

      // обновим угловую скорость (для инерции после отпускания)
      velocityRef.current.vy = dx * DRAG_SENSITIVITY;      // вокруг Y от горизонтали
      velocityRef.current.vx = dy * DRAG_SENSITIVITY;      // вокруг X от вертикали

      cardGroupRef.current.rotation.y += velocityRef.current.vy;
      cardGroupRef.current.rotation.x += velocityRef.current.vx;

      // опционально: легкий clamp по X, чтобы не переворачивалась слишком резко
      const maxTilt = Math.PI / 2 - 0.05;
      cardGroupRef.current.rotation.x = Math.max(-maxTilt, Math.min(maxTilt, cardGroupRef.current.rotation.x));

      lastPointerRef.current = { x, y };
    };

    const onUp = () => {
      isDraggingRef.current = false;
      setIsDragging(false);
    };

    // Mouse
    const mousedown = (e: MouseEvent) => onDown(e.clientX, e.clientY);
    const mousemove = (e: MouseEvent) => onMove(e.clientX, e.clientY);
    const mouseup = () => onUp();

    // Touch
    const touchstart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      onDown(e.touches[0].clientX, e.touches[0].clientY);
    };
    const touchmove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      e.preventDefault();
      onMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const touchend = () => onUp();

    renderer.domElement.addEventListener('mousedown', mousedown);
    document.addEventListener('mousemove', mousemove);
    document.addEventListener('mouseup', mouseup);
    renderer.domElement.addEventListener('touchstart', touchstart, { passive: false });
    document.addEventListener('touchmove', touchmove, { passive: false });
    document.addEventListener('touchend', touchend);

    // Animation loop с dt
    const clock = new THREE.Clock();
    const animate = () => {
      const dt = clock.getDelta(); // секунды с прошлого кадра

      // Автовращение по Y (всегда)
      if (cardGroupRef.current) {
        const rotYPerSec = toRad(BASE_AUTOROTATE_Y * 60); // конверт в рад/сек примерно из "на кадр"
        cardGroupRef.current.rotation.y += rotYPerSec * dt;
      }

      // Инерция (если недавно отпускали)
      if (!isDraggingRef.current && cardGroupRef.current) {
        cardGroupRef.current.rotation.y += velocityRef.current.vy;
        cardGroupRef.current.rotation.x += velocityRef.current.vx;

        // затухание
        velocityRef.current.vx *= DAMPING;
        velocityRef.current.vy *= DAMPING;

        // лёгкий clamp по X
        const maxTilt = Math.PI / 2 - 0.05;
        cardGroupRef.current.rotation.x = Math.max(-maxTilt, Math.min(maxTilt, cardGroupRef.current.rotation.x));
      }

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // Resize
    const onResize = () => {
      if (!rendererRef.current || !mountRef.current) return;
      const nw = mountRef.current.clientWidth;
      const nh = mountRef.current.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('mousedown', mousedown);
      document.removeEventListener('mousemove', mousemove);
      document.removeEventListener('mouseup', mouseup);
      renderer.domElement.removeEventListener('touchstart', touchstart);
      document.removeEventListener('touchmove', touchmove as any);
      document.removeEventListener('touchend', touchend);

      container.removeChild(renderer.domElement);
      renderer.dispose();
      scene.clear();
    };
  }, [displayName]);

  return (
    <div
      ref={mountRef}
      style={{
        width: typeof width === 'string' ? width : `${width}px`,
        height: typeof height === 'string' ? height : `${height}px`,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
    />
  );
};

export default InteractiveThreeJSCard;
