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

    // 삼각형 그리기
    const triangleShape = new THREE.Shape();
    triangleShape.moveTo(0, 0);
    triangleShape.lineTo(baseLength, 0);
    triangleShape.lineTo(0, heightLength);
    triangleShape.lineTo(0, 0);
    const geometry = new THREE.ShapeGeometry(triangleShape);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide });
    const triangle = new THREE.Mesh(geometry, material);

    // 원기둥 그리기
    const cylinderGeometry = new THREE.CylinderGeometry(0.05, 0.05, heightLength, 32);
    const cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);

    // 앵커에 삼각형과 원기둥 추가
    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(triangle);
    anchor.group.add(cylinder);

    // AR 시작
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  };

  // 스타트 버튼 이벤트 리스너
  document.getElementById('startButton').addEventListener('click', start);
});
