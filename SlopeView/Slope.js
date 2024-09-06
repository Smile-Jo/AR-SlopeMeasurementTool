import * as THREE from 'three';
import { MindARThree } from 'mindar-image-three';

document.addEventListener('DOMContentLoaded', () => {
  console.log("JavaScript Loaded and DOM Ready!"); // Debugging log

  const startButton = document.getElementById('startButton');
  startButton.addEventListener('click', async () => {
    console.log("Start Button Clicked!"); // Debugging log

    // Hide the input container when AR starts
    document.querySelector('.input-container').style.display = 'none';

    // 입력된 가로, 세로 길이를 가져옴
    const baseLength = parseFloat(document.getElementById('baseLength').value);
    const heightLength = parseFloat(document.getElementById('heightLength').value);

    // 입력 값 유효성 검사
    if (isNaN(baseLength) || isNaN(heightLength) || baseLength <= 0 || heightLength <= 0) {
      alert('가로 길이와 세로 길이를 정확히 입력해주세요.');
      return;
    }

    // 빗변 길이 계산
    const hypotenuseLength = Math.sqrt(baseLength * baseLength + heightLength * heightLength);

    // MindAR 초기화
    const mindarThree = new MindARThree({
      container: document.getElementById('container'),
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
    plane3.position.set(baseLength / 2, 0, heightLength / 2); // Adjust position for hypotenuse connection
    plane3.rotation.z = -Math.atan2(heightLength, baseLength); // Use the z-axis for the hypotenuse rotation

    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(plane1);
    anchor.group.add(plane2);
    anchor.group.add(plane3); // plane3 추가

    // AR 시작
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  });
});
