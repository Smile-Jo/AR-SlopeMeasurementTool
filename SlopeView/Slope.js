import * as THREE from 'three';
import { MindARThree } from 'mindar-image-three';

function captureScreenshot() {
  const videoElement = document.getElementById('video'); // 비디오 요소 가져오기

  // 비디오의 원본 비율을 사용한 캔버스 크기 설정
  const canvas = document.createElement('canvas');
  const videoWidth = videoElement.videoWidth;
  const videoHeight = videoElement.videoHeight;
  canvas.width = videoWidth;
  canvas.height = videoHeight;
  const context = canvas.getContext('2d');

  // 비디오 프레임을 캔버스에 그리기 (비율 그대로 유지)
  context.drawImage(videoElement, 0, 0, videoWidth, videoHeight);

  // 캔버스의 나머지 DOM 요소들을 html2canvas로 그리기
  html2canvas(document.body, {
    backgroundColor: null,
  }).then(domCanvas => {
    // 비디오 위에 나머지 DOM 요소들을 그리기
    context.drawImage(domCanvas, 0, 0, videoWidth, videoHeight);

    // 캔버스를 이미지로 변환하여 다운로드
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'screenshot.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}



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

document.getElementById('captureButton').addEventListener('click', captureScreenshot);