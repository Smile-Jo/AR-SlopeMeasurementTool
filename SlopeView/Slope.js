import * as THREE from 'three';
import { MindARThree } from 'mindar-image-three';

document.addEventListener('DOMContentLoaded', () => {
  console.log("JavaScript Loaded and DOM Ready!"); // Debugging log

  const startButton = document.getElementById('startButton');
  startButton.addEventListener('click', async () => {
    console.log("Start Button Clicked!"); // Debugging log

    // 입력된 가로, 세로 길이를 가져옴
    const baseLength = parseFloat(document.getElementById('baseLength').value);
    const heightLength = parseFloat(document.getElementById('heightLength').value);

    // 입력 값 유효성 검사
    if (isNaN(baseLength) || isNaN(heightLength) || baseLength <= 0 || heightLength <= 0) {
      alert('가로 길이와 세로 길이를 정확히 입력해주세요.');
      return;
    }

    // MindAR 초기화
    const mindarThree = new MindARThree({
      container: document.getElementById('container'),
      imageTargetSrc: './Target.mind'
    });

    const { renderer, scene, camera } = mindarThree;

    // AR object 생성
    const geometry1 = new THREE.PlaneGeometry(baseLength, 1);
    const geometry2 = new THREE.PlaneGeometry(heightLength, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.5 });
    const plane1 = new THREE.Mesh(geometry1, material);
    const plane2 = new THREE.Mesh(geometry2, material);

    plane2.position.set(baseLength / 2, 0, heightLength / 2);
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
});
