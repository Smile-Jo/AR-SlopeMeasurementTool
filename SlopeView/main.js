import * as THREE from 'three';
import { MindARThree } from 'mindar-image-three';

document.addEventListener('DOMContentLoaded', () => {
  const start = async () => {
    // 학생들이 입력한 길이 값을 받아옴
    const baseLength = parseFloat(document.getElementById('baseLength').value);
    const heightLength = parseFloat(document.getElementById('heightLength').value);

    // MindAR 초기화
    const mindarThree = new MindARThree({
      container: document.body,
      imageTargetSrc: './Target.mind'
    });
    const { renderer, scene, camera } = mindarThree;

    // AR object (if needed)
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({color: 0x00ffff, transparent: true, opacity: 0.5});
    const plane = new THREE.Mesh(geometry, material);

    // 원기둥 그리기
    const cylinderGeometry = new THREE.CylinderGeometry(0.05, 0.05, heightLength, 32);
    const cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);

    // 도형의 위치를 타겟 이미지 바로 위로 설정
    const zOffset = 0.01; // 타겟 이미지에서 떨어진 높이 (0.01은 1cm)
    triangle.position.set(0, 0, zOffset);
    cylinder.position.set(baseLength / 2, heightLength / 2, zOffset);
    cylinder.rotation.z = Math.atan2(heightLength, baseLength);

    // 앵커에 삼각형과 원기둥 추가
    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(cylinder);
    anchor.group.add(plane);

    // AR 시작
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  };

  // 스타트 버튼 이벤트 리스너
  document.getElementById('startButton').addEventListener('click', start);
});
