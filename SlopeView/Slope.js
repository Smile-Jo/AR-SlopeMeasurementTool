import * as THREE from 'three';
import { MindARThree } from 'mindar-image-three';

document.addEventListener('DOMContentLoaded', async () => {
  const start = async () => {
    // 학생들이 입력한 길이 값을 받아옴
    const baseLength = parseFloat(document.getElementById('baseLength').value);
    const heightLength = parseFloat(document.getElementById('heightLength').value);

    // 빗변 길이 계산
    const hypotenuseLength = Math.sqrt(baseLength * baseLength + heightLength * heightLength);

    // MindAR 초기화
    const mindarThree = new MindARThree({
      container: document.body,
      imageTargetSrc: './Target.mind'
    });
    const { renderer, scene, camera } = mindarThree;

    // AR object 생성
    const geometry1 = new THREE.PlaneGeometry(baseLength, 1);
    const geometry2 = new THREE.PlaneGeometry(heightLength, 1);
    const geometry3 = new THREE.PlaneGeometry(hypotenuseLength, 1); // 빗변 평면

    const material = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.5 });
    const plane1 = new THREE.Mesh(geometry1, material);
    const plane2 = new THREE.Mesh(geometry2, material);
    const plane3 = new THREE.Mesh(geometry3, material); // 빗변 평면

    // plane1의 위치 설정 (기본 위치가 원점(0,0,0)이므로 추가적인 설정 필요 없음)
    
    // plane2의 위치 및 회전 설정
    plane2.position.set(baseLength / 2, 0, heightLength / 2); // plane1의 끝에서 시작하여 수직으로 배치
    plane2.rotation.y = THREE.MathUtils.degToRad(90); // y축 기준 90도 회전

    // plane3의 위치 및 회전 설정 (직각삼각형의 빗변)
    plane3.position.set(0, 0, heightLength / 2); // plane1과 plane2의 끝을 연결
    plane3.rotation.y = -Math.atan2(heightLength, baseLength); // 빗변의 각도 설정

    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(plane1);
    anchor.group.add(plane2);
    anchor.group.add(plane3); // plane3 추가

    // AR 시작
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  };

  // 스타트 버튼 이벤트 리스너
  document.getElementById('startButton').addEventListener('click', start);
});