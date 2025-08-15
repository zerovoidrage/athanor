'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { useAuth } from '@/contexts/AuthContext';

interface ThreeJSCardProps {
  width?: number | string;
  height?: number | string;
}

const ThreeJSCard: React.FC<ThreeJSCardProps> = ({ width = 400, height = 300 }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cardRef = useRef<THREE.Group | null>(null);
  const { displayName } = useAuth();
  
  console.log('ThreeJSCard - displayName:', displayName);

  useEffect(() => {
    if (!mountRef.current) return;

    // Получаем реальные размеры контейнера
    const container = mountRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Создаем сцену
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    


    // Создаем камеру
    const camera = new THREE.PerspectiveCamera(75, containerWidth / containerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Создаем рендерер
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true
    });
    renderer.setSize(containerWidth, containerHeight);
    renderer.setClearColor(0x000000, 0); // Прозрачный фон
    renderer.setPixelRatio(window.devicePixelRatio); // Высокое разрешение
    
    // Включаем корректную цветопередачу и тонмаппинг
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2; // подняли экспозицию
    
    rendererRef.current = renderer;



    // Создаем группу для карточки
    const cardGroup = new THREE.Group();
    cardRef.current = cardGroup;

    // Загружаем текстуры
    const textureLoader = new THREE.TextureLoader();
    
    // Загружаем текстуру для лицевой стороны
    const cardTexture = textureLoader.load('/img/threejs/cards/angel/frontside.png');
    
    // Настройки текстуры для четкости (как у backside)
    cardTexture.colorSpace = THREE.SRGBColorSpace;
    cardTexture.flipY = false;
    cardTexture.wrapS = THREE.RepeatWrapping;
    cardTexture.wrapT = THREE.ClampToEdgeWrapping;
    cardTexture.repeat.set(-1, 1);
    cardTexture.offset.set(1, 0);
    cardTexture.minFilter = THREE.LinearFilter;
    cardTexture.magFilter = THREE.LinearFilter;
    cardTexture.generateMipmaps = false;
    cardTexture.needsUpdate = true;
    
    // Создаем временную текстуру для задней стороны
    const createTempBackTexture = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      // Устанавливаем размеры
      canvas.width = 1024;
      canvas.height = 648; // Пропорции банковской карты
      
      // Рисуем черный фон
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Добавляем надпись с логином пользователя (сверху в левом углу)
      if (displayName) {
        const fontSize = Math.round(canvas.height * 0.04); // 4% от высоты
        ctx.fillStyle = '#ffffff'; // Белый цвет
        ctx.font = `300 ${fontSize}px "SuisseIntl", Arial, sans-serif`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        
        // Позиция: сверху в левом углу с отступами
        const x = canvas.width * 0.05; // 5% от ширины
        const y = canvas.height * 0.05; // 5% от высоты
        
        // Добавляем тень для лучшей читаемости
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        ctx.fillText(displayName, x, y);
      }
      
      const tempTexture = new THREE.CanvasTexture(canvas);
      tempTexture.minFilter = THREE.LinearFilter;
      tempTexture.magFilter = THREE.LinearFilter;
      tempTexture.generateMipmaps = false;
      tempTexture.flipY = false; // Возвращаем в false после смены порядка материалов
      tempTexture.wrapS = THREE.RepeatWrapping; // Разрешаем повторение для отражения
      tempTexture.repeat.set(-1, 1); // Отражаем по горизонтали
      tempTexture.offset.set(1, 0); // Смещаем для правильного отражения
      tempTexture.needsUpdate = true;
      
      return tempTexture;
    };
    
    // Создаем временную текстуру
    const tempBackTexture = createTempBackTexture();
    
    // Создаем материал для задней стороны с временной текстурой (ДО загрузки backside.png)
    const backMaterial = new THREE.MeshBasicMaterial({ 
      map: tempBackTexture,
      transparent: false,
      color: 0xffffff,
    });
    
    // Создаем композитную текстуру для задней стороны (backside.png + надпись)
    const createCompositeBackTexture = (texture: THREE.Texture) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      // Устанавливаем размеры как у backside.png
      canvas.width = texture.image.width;
      canvas.height = texture.image.height;
      
      // Рисуем backside.png как фон
      ctx.drawImage(texture.image, 0, 0);
      
      // Добавляем надпись с логином пользователя (сверху в левом углу)
      if (displayName) {
        const fontSize = Math.round(canvas.height * 0.036); // 4% от высоты
        ctx.fillStyle = '#ffffff'; // Белый цвет
        ctx.font = `300 ${fontSize}px "SuisseIntl", Arial, sans-serif`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        
        // Позиция: сверху в левом углу с отступами
        const x = canvas.width * 0.256; // 5% от ширины
        const y = canvas.height * 0.08; // 5% от высоты
        
        // Добавляем тень для лучшей читаемости
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        ctx.fillText(displayName, x, y);
      }
      
      const compositeTexture = new THREE.CanvasTexture(canvas);
      compositeTexture.minFilter = THREE.LinearFilter;
      compositeTexture.magFilter = THREE.LinearFilter;
      compositeTexture.generateMipmaps = false;
      compositeTexture.flipY = false; // Возвращаем в false после смены порядка материалов
      compositeTexture.needsUpdate = true;
      
      return compositeTexture;
    };
    
    // backside: обновляем map ПОСЛЕ загрузки
    textureLoader.load('/img/threejs/cards/angel/backside.png', (backsideTexture) => {
      backsideTexture.colorSpace = THREE.SRGBColorSpace;
      backsideTexture.flipY = false;
      backsideTexture.wrapS = THREE.RepeatWrapping;
      backsideTexture.repeat.set(-1, 1);
      backsideTexture.offset.set(1, 0);
      backsideTexture.minFilter = THREE.LinearFilter;
      backsideTexture.magFilter = THREE.LinearFilter;
      backsideTexture.generateMipmaps = false;

      const compositeBackTexture = createCompositeBackTexture(backsideTexture);
      compositeBackTexture.flipY = false;
      compositeBackTexture.wrapS = THREE.RepeatWrapping;
      compositeBackTexture.repeat.set(-1, 1);
      compositeBackTexture.offset.set(1, 0);
      backMaterial.map = compositeBackTexture;
      backMaterial.needsUpdate = true;
    });

    // Создаем материал для лицевой стороны с текстурой
    const frontMaterial = new THREE.MeshBasicMaterial({ 
      map: cardTexture,
      transparent: false,
      color: 0xffffff,
    });

    // Создаем материалы для боковых сторон (черные края)
    const sideMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x000000,
      transparent: false
    });

    // Создаем геометрию карточки с закруглениями
    const cardHeight = 3.5; // Увеличили размер карточки
    const cardWidth = cardHeight / 1.586; // Пропорции банковской карты
    const cornerRadius = 0.8; // Радиус скругления — большие закругления для боковых сторон
    const segments = 12; // Кол-во сегментов для сглаживания
    const thickness = 0.04; // Толщина карточки


    const cardGeometry = new RoundedBoxGeometry(cardWidth, cardHeight, thickness, segments, cornerRadius);

    // Создаем меш карточки
    const cardMesh = new THREE.Mesh(cardGeometry, [
      sideMaterial, // правая сторона
      sideMaterial, // левая сторона
      sideMaterial, // верхняя сторона
      sideMaterial, // нижняя сторона
      backMaterial,  // передняя сторона (поменяли местами)
      frontMaterial  // задняя сторона (поменяли местами)
    ]);

    // RoundedBoxGeometry уже создает скругленные углы, дополнительная обработка не нужна

    // Добавляем карточку в группу
    cardGroup.add(cardMesh);

    // Добавляем группу в сцену
    scene.add(cardGroup);

    // Добавляем рендерер в DOM
    mountRef.current.appendChild(renderer.domElement);

    // Анимация вращения
    const animate = () => {
      requestAnimationFrame(animate);

      if (cardGroup) {
        cardGroup.rotation.y += 0.01; // Плавное вращение по горизонтали
        cardGroup.rotation.x = Math.sin(Date.now() * 0.001) * 0.1; // Легкое покачивание
      }

      renderer.render(scene, camera);
    };

    animate();

    // Обработка изменения размера
    const handleResize = () => {
      if (renderer && mountRef.current) {
        const newWidth = mountRef.current.clientWidth;
        const newHeight = mountRef.current.clientHeight;
        
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    // Очистка при размонтировании
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [width, height, displayName]); // Добавляем displayName как зависимость

  return (
    <div 
      ref={mountRef} 
      style={{ 
        width: typeof width === 'string' ? width : `${width}px`, 
        height: typeof height === 'string' ? height : `${height}px`,
        overflow: 'hidden'
      }}
    />
  );
};

export default ThreeJSCard;
