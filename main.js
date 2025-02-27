import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import * as THREE from 'three';

// Create player mesh function
const createPlayerMesh = (position, rotation) => {
  const geometry = new THREE.BoxGeometry(1, 2, 1);
  const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
  const player = new THREE.Mesh(geometry, material);
  player.position.set(...position);
  player.rotation.y = rotation;
  return player;
};
// Game component
const Game = () => {
  const mountRef = useRef(null);
  const [playerState, setPlayerState] = useState({
    position: [0, 1, 0],
    rotation: 0,
    isJumping: false,
    canGrapple: true,
    health: 100
  });

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);

    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 10, 15);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.MeshPhongMaterial({ color: 0x90EE90 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Procedurally generate platforms
    const createPlatform = (x, y, z) => {
      const platformGeometry = new THREE.BoxGeometry(3, 0.5, 3);
      const platformMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
      const platform = new THREE.Mesh(platformGeometry, platformMaterial);
      platform.position.set(x, y, z);
      platform.castShadow = true;
      platform.receiveShadow = true;
      scene.add(platform);
    };

    // Generate some random platforms
    for (let i = 0; i < 10; i++) {
      const x = (Math.random() - 0.5) * 30;
      const y = 2 + Math.random() * 8;
      const z = (Math.random() - 0.5) * 30;
      createPlatform(x, y, z);
    }

    // Create player
    const player = createPlayerMesh(playerState.position, playerState.rotation);
    player.castShadow = true;
    scene.add(player);

    // Grappling hook visualization
    const grappleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1);
    const grappleMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc });
    const grappleHook = new THREE.Mesh(grappleGeometry, grappleMaterial);
    grappleHook.visible = false;
    scene.add(grappleHook);

    // Handle keyboard input
    const keys = {};
    window.addEventListener('keydown', (e) => keys[e.key] = true);
    window.addEventListener('keyup', (e) => keys[e.key] = false);

    // Game loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Basic movement
      if (keys['ArrowLeft']) {
        player.position.x -= 0.1;
        player.rotation.y = Math.PI / 2;
      }
      if (keys['ArrowRight']) {
        player.position.x += 0.1;
        player.rotation.y = -Math.PI / 2;
      }
      if (keys['ArrowUp']) {
        player.position.z -= 0.1;
        player.rotation.y = 0;
      }
      if (keys['ArrowDown']) {
        player.position.z += 0.1;
        player.rotation.y = Math.PI;
      }

      // Jump
      if (keys[' '] && !playerState.isJumping) {
        setPlayerState(prev => ({ ...prev, isJumping: true }));
        const jumpAnimation = () => {
          player.position.y += 0.2;
          if (player.position.y < 3) {
            requestAnimationFrame(jumpAnimation);
          } else {
            setTimeout(() => {
              player.position.y = 1;
              setPlayerState(prev => ({ ...prev, isJumping: false }));
            }, 500);
          }
        };
        jumpAnimation();
      }

      // Grappling hook
      if (keys['g'] && playerState.canGrapple) {
        grappleHook.visible = true;
        grappleHook.position.set(
          player.position.x,
          player.position.y + 2,
          player.position.z
        );
        // Simple grapple animation
        const grappleAnimation = () => {
          grappleHook.scale.y += 0.5;
          if (grappleHook.scale.y < 10) {
            requestAnimationFrame(grappleAnimation);
          } else {
            setTimeout(() => {
              grappleHook.visible = false;
              grappleHook.scale.y = 1;
            }, 500);
          }
        };
        grappleAnimation();
        setPlayerState(prev => ({ ...prev, canGrapple: false }));
        setTimeout(() => setPlayerState(prev => ({ ...prev, canGrapple: true })), 2000);
      }

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  // UI overlay
  return (
    <div ref={mountRef}>
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        color: 'white',
        fontFamily: 'Arial',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: '10px',
        borderRadius: '5px'
      }}>
        <div>Health: {playerState.health}</div>
        <div>Grapple Ready: {playerState.canGrapple ? 'Yes' : 'No'}</div>
        <div style={{ marginTop: '10px', fontSize: '12px' }}>
          Controls:<br/>
          Arrows: Move<br/>
          Space: Jump<br/>
          G: Grapple
        </div>
      </div>
    </div>
  );
};

// Mount the game
const container = document.getElementById('renderDiv');
const root = ReactDOM.createRoot(container);
root.render(<Game />);
