'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import ProjectInfoCard from '@/components/ui/ProjectInfoCard';
import { useAbyss } from '@/contexts/AbyssContext';
import { useOverlay } from '@/contexts/OverlayContext';

// Массив путей к изображениям (вынесен на уровень модуля)
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

interface CardData {
  id: number;
  name: string;
  imageIndex: number;
  category: string;
  raised: string;
  days: number;
  gsScore: number;
}

export default function CardsScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cardsRef = useRef<THREE.Group[]>([]);
  const animationRef = useRef<number | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const cameraLerpTargetRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 8));
  
  // Состояние для зума и выбранного проекта
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomTarget, setZoomTarget] = useState<THREE.Group | null>(null);
  const [selectedProject, setSelectedProject] = useState<{ name: string; imageIndex: number } | null>(null);
  const [showInfoCard, setShowInfoCard] = useState(false);
  
  // Состояние для анимации появления карточек
  const [cardsVisible, setCardsVisible] = useState(false);
  
  // Рефы для зума (для обработчиков событий)
  const isZoomedRef = useRef(false);
  const zoomTargetRef = useRef<THREE.Group | null>(null);

  // Получаем выбранную категорию из контекста (только для мокового переключения)
  const { selectedCategory } = useAbyss();
  const { setOverlayOpen } = useOverlay();

  // Данные карточек с названиями Web3 проектов (возвращаем к исходным 9 карточкам)
  const cardsData: CardData[] = [
    { id: 1, name: "quantumforge", imageIndex: 1, category: "AI", raised: "$45.2k", days: 12, gsScore: 87 },
    { id: 2, name: "datasphere", imageIndex: 2, category: "AI", raised: "$32.8k", days: 8, gsScore: 92 },
    { id: 3, name: "omnibase", imageIndex: 3, category: "DeFi", raised: "$67.5k", days: 15, gsScore: 78 },
    { id: 4, name: "blockchain", imageIndex: 4, category: "DeFi", raised: "$89.1k", days: 22, gsScore: 85 },
    { id: 5, name: "smartcontract", imageIndex: 5, category: "DeFi", raised: "$23.4k", days: 5, gsScore: 91 },
    { id: 6, name: "gamehub", imageIndex: 6, category: "Gaming", raised: "$156.7k", days: 18, gsScore: 94 },
    { id: 7, name: "neuralverse", imageIndex: 7, category: "AI", raised: "$78.3k", days: 11, gsScore: 89 },
    { id: 8, name: "visionai", imageIndex: 8, category: "AI", raised: "$112.5k", days: 14, gsScore: 96 },
    { id: 9, name: "cryptoflex", imageIndex: 9, category: "Other", raised: "$54.8k", days: 9, gsScore: 82 }
  ];

  // Всегда показываем все карточки (моковое переключение)
  const filteredCardsData = cardsData;

  // Создание текстуры для текста
  const createTextTexture = useCallback((text: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const paddingX = 150; // поля по краям
    const paddingY = 60;  // поля сверху/снизу
    const fontFamily = 'SuisseIntl, Arial, sans-serif';

    // подбираем размер шрифта, чтобы текст влез по ширине
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

  // Функция для получения корня карточки
  const getCardRoot = (obj: THREE.Object3D | null): THREE.Object3D | null => {
    while (obj) {
      if ((obj as any).userData?.isCardGroup) return obj;
      obj = obj.parent;
    }
    return null;
  };

  // Создание карточки
  const createCard = useCallback((cardData: CardData, position: THREE.Vector3) => {
    const cardGroup = new THREE.Group();
    
    // Создаем квадратную карточку
    const geometry = new THREE.PlaneGeometry(0.6, 0.6);
    
    // Загружаем изображение
    const textureLoader = new THREE.TextureLoader();
    const imagePath = imagePaths[cardData.imageIndex - 1] || imagePaths[0];
    
    textureLoader.load(imagePath, (texture) => {
      texture.anisotropy = 16;
      texture.colorSpace = THREE.SRGBColorSpace;
      // включи мипмапы (даёт чище края)
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;

      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.FrontSide,
        alphaTest: 0.2,           // порезать полупрозрачные пиксели по краям
        premultipliedAlpha: false, // для обычных PNG со straight alpha
        opacity: 0                // начинаем с прозрачности для fade-in
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(0, 0, 0.01);
      mesh.renderOrder = 2; 
      cardGroup.add(mesh);
      
      // Подпись под карточкой (всегда)
      const label = createTextTexture(cardData.name);
      if (label) {
        const SCALE = 2;                       // коэффициент увеличения
        const baseHeight = 0.14;
        const desiredHeight = baseHeight * SCALE;
        const desiredWidth = desiredHeight * label.aspect;

        const labelGeo = new THREE.PlaneGeometry(desiredWidth, desiredHeight);
        const labelMat = new THREE.MeshBasicMaterial({
          map: label.texture,
          transparent: true,
          side: THREE.DoubleSide,
          depthTest: false,
          opacity: 0
        });

        const labelMesh = new THREE.Mesh(labelGeo, labelMat);
        labelMesh.position.set(0, -0.55 - (desiredHeight - baseHeight) * 0.35, 0.05);
        labelMesh.renderOrder = 10;
        cardGroup.add(labelMesh);
      }
      
    }, undefined, (error) => {
      console.error('Error loading image:', imagePath, error);
      
      // Fallback карточка с текстом
      const fallbackMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x333333,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0                // начинаем с прозрачности для fade-in
      });
      const fallbackMesh = new THREE.Mesh(geometry, fallbackMaterial);
      cardGroup.add(fallbackMesh);
      
      // Добавляем текст
      const textLabel = createTextTexture(cardData.name);
      if (textLabel) {
        const SCALE = 2;
        const baseHeight = 0.14;
        const desiredHeight = baseHeight * SCALE;
        const desiredWidth = desiredHeight * textLabel.aspect;

        const textGeometry = new THREE.PlaneGeometry(desiredWidth, desiredHeight);
        const textMaterial = new THREE.MeshBasicMaterial({
          map: textLabel.texture,
          transparent: true,
          side: THREE.DoubleSide,
          depthTest: false,
          opacity: 0
        });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(0, -0.5 - (desiredHeight - baseHeight) * 0.35, 0.05);
        textMesh.renderOrder = 10;
        cardGroup.add(textMesh);
      }
    });
    
    // Устанавливаем позицию
    cardGroup.position.copy(position);
    
    // Сохраняем данные карточки
    cardGroup.userData = {
      originalPosition: position.clone(),
      cardData: cardData,
      name: cardData.name,
      imageIndex: cardData.imageIndex,
      isCardGroup: true
    };
    
    return cardGroup;
  }, [createTextTexture]);

  const handleCloseInfoCard = () => {
    isZoomedRef.current = false;
    zoomTargetRef.current = null;
    setIsZoomed(false);
    setZoomTarget(null);
    setSelectedProject(null);
    setShowInfoCard(false);
    cameraLerpTargetRef.current.set(0, 0, 8);
    setOverlayOpen(false);
  };

  // Инициализация сцены
  const initScene = useCallback(() => {
    if (!containerRef.current) return;
    
    // Сбрасываем состояние анимации
    setCardsVisible(false);
    
    // Очищаем предыдущую сцену
    if (sceneRef.current) {
      while (sceneRef.current.children.length > 0) {
        sceneRef.current.remove(sceneRef.current.children[0]);
      }
    }

    // Создаем сцену
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Настройка камеры
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 8);
    cameraRef.current = camera;

    // Создаем рендерер
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current?.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Функция для получения позиции карточки в сетке
    const getGridPosition = (index: number, totalItems: number) => {
      // Шаблоны позиций для разного количества карточек
      const gridPatterns: { [key: number]: [number, number][] } = {
        1: [[0.5, 0.5]],
        2: [[0.25, 0.5], [0.75, 0.5]],
        3: [[0.166, 0.5], [0.5, 0.5], [0.834, 0.5]],
        4: [[0.18, 0.82], [0.82, 0.82], [0.18, 0.18], [0.82, 0.18]],
        5: [[0.18, 0.82], [0.82, 0.82], [0.5, 0.5], [0.18, 0.18], [0.82, 0.18]],
        6: [[0.18, 0.82], [0.5, 0.82], [0.82, 0.82], [0.18, 0.18], [0.5, 0.18], [0.82, 0.18]],
        7: [
          [0.0, 0.0], [0.5, 0.0], [1.0, 0.0],
          [0.0, 0.5], [0.5, 0.5], [1.0, 0.5],
          [0.5, 1.0]
        ],
        8: [
          [0.0, 0.0], [0.5, 0.0], [1.0, 0.0],
          [0.3, 0.5], [0.7, 0.5],
          [0.0, 1.0], [0.5, 1.0], [1.0, 1.0]
        ],
        9: [
          [0.0, 0.0], [0.5, 0.0], [1.0, 0.0],
          [0.0, 0.5], [0.5, 0.5], [1.0, 0.5],
          [0.0, 1.0], [0.5, 1.0], [1.0, 1.0]
        ]
      };

      const pattern = gridPatterns[totalItems] || gridPatterns[9];
      const [normX, normY] = pattern[index];
      
      // Добавляем хаос для более естественного расположения
      const chaosFactor = 0.09;
      const dx = (Math.random() - 0.5) * chaosFactor;
      const dy = (Math.random() - 0.5) * chaosFactor;
      
      // Адаптивное масштабирование в зависимости от размера экрана
      const aspectRatio = window.innerWidth / window.innerHeight;
      let scaleX, scaleY;
      
      if (aspectRatio > 1.5) {
        scaleX = 11;
        scaleY = 5.5;
      } else if (aspectRatio > 1.2) {
        scaleX = 9;
        scaleY = 5;
      } else if (aspectRatio > 0.8) {
        scaleX = 7;
        scaleY = 4.5;
      } else {
        scaleX = 6;
        scaleY = 7.5;
      }
      
      // Преобразуем в координаты Three.js с адаптивным масштабированием
      const finalX = (normX + dx - 0.5) * scaleX;
      const finalY = (0.5 - normY - dy) * scaleY;
      const finalZ = (Math.random() - 0.5) * 2;
      
      return new THREE.Vector3(finalX, finalY, finalZ);
    };

    // Создаем группу для всех карточек
    const group = new THREE.Group();
    scene.add(group);
    groupRef.current = group;
    
    // Создаем карточки в разных позициях
    const cards: THREE.Group[] = [];
    
    // Создаем позиции для 9 карточек
    const positions = cardsData.map((_, index) => getGridPosition(index, 9));

    cardsData.forEach((cardData, index) => {
      const card = createCard(cardData, positions[index]);
      
      // Масштабируем карточки в зависимости от глубины (Z-координаты)
      const z = positions[index].z;
      const scale = Math.max(0.8, Math.min(1.2, 1 + z * 0.1));
      card.scale.set(scale, scale, scale);
      
      group.add(card);
      cards.push(card);
    });

    cardsRef.current = cards;

    // Обработчик движения мыши для parallax эффекта
    let mouseX = 0;
    let mouseY = 0;
    let parallaxX = 0;
    let parallaxY = 0;
    
    // Переменные для raycasting
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    const handleMouseMove = (event: MouseEvent) => {
      // Вычисляем parallax
      parallaxX = (event.clientX / window.innerWidth - 0.5) * 2;
      parallaxY = -(event.clientY / window.innerHeight - 0.5) * 2;

      // Отключаем hover эффекты во время зума
      if (isZoomedRef.current) {
        cards.forEach(card => {
          card.scale.set(1, 1, 1);
        });
        if (rendererRef.current) {
          rendererRef.current.domElement.style.cursor = 'default';
        }
        return;
      }

      // Проверяем, находится ли мышь над UI элементом
      const uiElements = [document.getElementById('header'), document.getElementById('filterBar')];
      const isMouseOverUI = uiElements.some(element => element && element.contains(event.target as Node));

      // Если мышь над UI, устанавливаем курсор по умолчанию и пропускаем Three.js hover эффекты
      if (isMouseOverUI) {
        if (rendererRef.current) {
          rendererRef.current.domElement.style.cursor = 'default';
        }
        cards.forEach(card => {
          card.scale.set(1, 1, 1);
        });
        return;
      }

      // Raycasting для hover эффектов
      if (cameraRef.current && sceneRef.current) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        raycaster.setFromCamera(mouse, cameraRef.current);
        const intersects = raycaster.intersectObjects(groupRef.current?.children ?? [], true);

        cards.forEach(card => {
          const isHovered = intersects.find(i => getCardRoot(i.object) === card);
          if (isHovered) {
            card.scale.set(1.05, 1.05, 1);
            if (rendererRef.current) {
              rendererRef.current.domElement.style.cursor = 'pointer';
            }
          } else {
            card.scale.set(1, 1, 1);
          }
        });
        
        if (intersects.length === 0 && rendererRef.current) {
          rendererRef.current.domElement.style.cursor = 'default';
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    // Обработчик кликов
    const handleClick = (event: MouseEvent) => {
      // Проверяем, не кликнули ли мы по UI элементу
      const path = (event.composedPath?.() ?? []) as Element[];
      if (path.some(el => (el as HTMLElement).dataset?.ui === 'true')) return;
      
      event.preventDefault();
      
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      if (cameraRef.current && sceneRef.current) {
        raycaster.setFromCamera(mouse, cameraRef.current);
        const intersects = raycaster.intersectObjects(groupRef.current?.children ?? [], true);
        
        const hit = intersects.find(intersect => getCardRoot(intersect.object));
        const cardRoot = hit ? getCardRoot(hit.object) as THREE.Group | null : null;
        
        if (!cardRoot) {
          if (isZoomedRef.current) {
            // zoom out при клике на пустое место
            isZoomedRef.current = false;
            zoomTargetRef.current = null;
            setIsZoomed(false);
            setZoomTarget(null);
            setSelectedProject(null);
            setShowInfoCard(false);
            cameraLerpTargetRef.current.set(0, 0, 8);
            setOverlayOpen(false);
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
          cameraLerpTargetRef.current.set(0, 0, 8);
          setOverlayOpen(false);
          return;
        }
        
        // zoom in на новую карточку
        zoomTargetRef.current = cardRoot;
        isZoomedRef.current = true;
        setIsZoomed(true);
        setZoomTarget(cardRoot);
        setSelectedProject({ 
          name: (cardRoot as any).userData.name, 
          imageIndex: (cardRoot as any).userData.imageIndex 
        });
        setShowInfoCard(true);
        setOverlayOpen(true);
        
        // Zoom к карточке (безопасно относительно направления камеры)
        const worldPosition = new THREE.Vector3();
        cardRoot.getWorldPosition(worldPosition);
        
        cameraRef.current!.updateMatrixWorld(true);
        const dir = new THREE.Vector3();
        cameraRef.current!.getWorldDirection(dir);
        cameraLerpTargetRef.current.copy(worldPosition).add(dir.multiplyScalar(-2.5));
      }
    };
    
    window.addEventListener('click', handleClick);

    // Обработчик изменения размера окна
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
        
        // Пересчитываем позиции карточек при изменении размера экрана
        cards.forEach((card, index) => {
          const newPosition = getGridPosition(index, cards.length);
          card.position.copy(newPosition);
          card.userData.originalPosition = newPosition.clone();
        });
        
        // Если в данный момент зум, обновляем позицию зума согласно ТЗ
        if (isZoomedRef.current && zoomTargetRef.current) {
          const p = new THREE.Vector3();
          zoomTargetRef.current.getWorldPosition(p);
          
          const dir = new THREE.Vector3();
          cameraRef.current!.getWorldDirection(dir);
          cameraLerpTargetRef.current.copy(p).add(dir.multiplyScalar(-2.5));
        }
      }
    };

    window.addEventListener('resize', handleResize);

    // Обработчик клавиши Escape
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isZoomedRef.current) {
        isZoomedRef.current = false;
        zoomTargetRef.current = null;
        setIsZoomed(false);
        setZoomTarget(null);
        setSelectedProject(null);
        setShowInfoCard(false);
        cameraLerpTargetRef.current.set(0, 0, 8);
        setOverlayOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Анимация
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      // Parallax эффект
      if (groupRef.current) {
        const k = isZoomedRef.current ? 0.25 : 1; // 25% амплитуды в зуме
        groupRef.current.position.x += (parallaxX * k - groupRef.current.position.x) * 0.02;
        groupRef.current.position.y += (parallaxY * k - groupRef.current.position.y) * 0.02;
      }

      // Если ЗУМ активен — каждый кадр обновляем цель камеры, чтобы карточка была в центре
      if (isZoomedRef.current && zoomTargetRef.current && cameraRef.current) {
        const pos = new THREE.Vector3();
        zoomTargetRef.current.getWorldPosition(pos);

        const dir = new THREE.Vector3();
        cameraRef.current.updateMatrixWorld(true);
        cameraRef.current.getWorldDirection(dir);

        const distance = 2.5; // можешь подрегулировать
        // цель лерпа: точка на оси взгляда перед карточкой
        cameraLerpTargetRef.current.copy(pos).add(dir.multiplyScalar(-distance));
      }

      // Лерп камеры — чуть мягче
      if (cameraRef.current) {
        cameraRef.current.position.lerp(cameraLerpTargetRef.current, 0.08);
        cameraRef.current.rotation.set(0, 0, 0); // фронтально
      }

      // Анимация появления карточек (fade-in)
      if (groupRef.current && !cardsVisible) {
        const cards = groupRef.current.children;
        let allVisible = true;
        
        cards.forEach((card) => {
          if (card instanceof THREE.Group) {
            card.children.forEach((child) => {
              if (child instanceof THREE.Mesh && child.material) {
                const material = child.material as THREE.MeshBasicMaterial;
                if (material.opacity < 1) {
                  material.opacity = Math.min(1, material.opacity + 0.02);
                  allVisible = false;
                }
              }
            });
          }
        });
        
        if (allVisible) {
          setCardsVisible(true);
        }
      }

      // Убираем вращение карточек
      cards.forEach((card) => {
        card.rotation.z = 0;
        card.rotation.x = 0;
        card.rotation.y = 0;
      });

      // Убираем вращение сцены
      scene.rotation.z = 0;

      // Рендеринг сцены
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    // Cleanup функция
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [createCard]);

  // Инициализация при монтировании
  useEffect(() => {
    const timer = setTimeout(() => {
      const cleanup = initScene();
      return () => {
        if (cleanup) cleanup();
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        if (rendererRef.current) {
          rendererRef.current.dispose();
        }
      };
    }, 100);

    return () => {
      clearTimeout(timer);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [initScene]);

  // Дополнительная инициализация при возвращении на страницу
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && containerRef.current && !rendererRef.current) {
        console.log('Page became visible, reinitializing scene...');
        setTimeout(() => {
          const cleanup = initScene();
          if (cleanup) {
            return () => cleanup();
          }
        }, 200);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [initScene]);

  return (
    <>
      <div 
        ref={containerRef} 
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
