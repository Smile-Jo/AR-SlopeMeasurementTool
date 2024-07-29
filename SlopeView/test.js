import * as THREE from 'three';
import { MindARThree } from 'mindar-image-three';

document.addEventListener('DOMContentLoaded', async () => {
  // MindAR 초기화
  const mindarThree = new MindARThree({
    container: document.body,
    imageTargetSrc: './Target.mind'
  });
  const { renderer, scene, camera } = mindarThree;

  // AR object (if needed)
  const geometry = new THREE.PlaneGeometry(1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.5 });
  const plane1 = new THREE.Mesh(geometry, material);
  const plane2 = new THREE.Mesh(geometry, material);
  plane2.position.set(0.5, 0, 0.5);
  plane2.rotation.y = THREE.MathUtils.degToRad(90);

  const anchor = mindarThree.addAnchor(0);
  anchor.group.add(plane1);
  anchor.group.add(plane2);

  // AR 시작
  await mindarThree.start();
  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
});
