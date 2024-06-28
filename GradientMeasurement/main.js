// main.js

let points = []; // 터치된 점들을 저장

// 카메라 시작 함수
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { exact: "environment" } // 후면 카메라 사용
      }
    });
    const videoElement = document.getElementById('video');
    videoElement.srcObject = stream;
  } catch (error) {
    console.error('Error accessing camera:', error);
  }
}

// 화면에 터치 이벤트 리스너 추가
document.addEventListener('touchstart', handleTouch);

function handleTouch(event) {
  // 두 점이 이미 추가된 경우 더 이상 추가하지 않음
  if (points.length >= 2) return;

  // 터치된 위치 좌표 가져오기
  const touch = event.touches[0];
  const touchX = touch.clientX;
  const touchY = touch.clientY;

  // 격자 점 크기 및 간격 (index.html의 .grid-overlay의 background-size와 일치해야 함)
  const gridSize = 50; // 격자 크기
  const tolerance = 20; // 터치 좌표와 격자 점 사이의 허용 오차 증가

  // 터치 좌표를 근접한 격자 점으로 스냅
  const snappedX = Math.round(touchX / gridSize) * gridSize;
  const snappedY = Math.round(touchY / gridSize) * gridSize;

  // 터치 좌표가 격자 점과 충분히 가까운지 확인
  if (Math.abs(touchX - snappedX) <= tolerance && Math.abs(touchY - snappedY) <= tolerance) {
    const existingHighlight = document.querySelector(`.highlight[data-x="${snappedX}"][data-y="${snappedY}"]`);

    if (existingHighlight) {
      // 이미 강조 표시가 있으면 제거하고 points 배열에서도 제거
      existingHighlight.remove();
      points = points.filter(point => point.x !== snappedX || point.y !== snappedY);
    } else {
      // 강조 표시 요소 생성
      const highlight = document.createElement('div');
      highlight.classList.add('highlight');
      highlight.style.position = 'absolute';
      highlight.style.width = '20px';
      highlight.style.height = '20px';
      highlight.style.backgroundColor = 'rgba(255, 0, 0, 0.7)'; // 빨간색 반투명
      highlight.style.borderRadius = '50%';
      highlight.style.top = `${snappedY - 10}px`; // 중심 맞추기 위해 -10
      highlight.style.left = `${snappedX - 10}px`; // 중심 맞추기 위해 -10
      highlight.style.pointerEvents = 'none'; // 이벤트 방해 안 하도록
      highlight.style.zIndex = '15'; // 격자선 위에 강조 표시
      highlight.setAttribute('data-x', snappedX);
      highlight.setAttribute('data-y', snappedY);

      // 강조 표시 요소를 바디에 추가
      document.body.appendChild(highlight);

      // points 배열에 추가
      points.push({ x: snappedX, y: snappedY });

      // 두 점이 모두 추가되면 선분과 직각삼각형 그리기
      if (points.length === 2) {
        drawLineAndTriangle(points[0], points[1]);
        displayDimensions(points[0], points[1]);
      }
    }
  }
}

// 선분과 직각삼각형 그리기 함수
function drawLineAndTriangle(point1, point2) {
  // 선분 그리기
  const line = document.createElement('div');
  line.style.position = 'absolute';
  line.style.backgroundColor = 'rgba(0, 0, 255, 0.7)'; // 파란색 반투명
  line.style.zIndex = '14'; // 강조 표시 아래
  line.style.pointerEvents = 'none';

  // 두 점의 거리 계산
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  const length = Math.sqrt(dx * dx + dy * dy);

  // 선분의 위치 및 크기 설정
  line.style.width = `${length}px`;
  line.style.height = '2px';
  line.style.top = `${point1.y}px`;
  line.style.left = `${point1.x}px`;
  line.style.transformOrigin = '0 0'; // 변환 원점 설정
  line.style.transform = `rotate(${Math.atan2(dy, dx)}rad)`;
  document.body.appendChild(line);

  // 직각삼각형 그리기
  const triangle = document.createElement('div');
  triangle.style.position = 'absolute';
  triangle.style.width = '0';
  triangle.style.height = '0';
  triangle.style.borderStyle = 'solid';
  triangle.style.zIndex = '13'; // 선분 아래
  triangle.style.pointerEvents = 'none';

  if (dx * dy >= 0) { // 우상향 또는 좌하향 대각선
    triangle.style.borderRight = `${Math.abs(dx)}px solid transparent`;
    triangle.style.borderBottom = `${Math.abs(dy)}px solid rgba(0, 255, 0, 0.5)`; // 초록색 반투명
    triangle.style.top = `${Math.min(point1.y, point2.y)}px`;
    triangle.style.left = `${Math.min(point1.x, point2.x)}px`;
    
  } else { // 우하향 또는 좌상향 대각선
    triangle.style.borderLeft = `${Math.abs(dx)}px solid transparent`;
    triangle.style.borderBottom = `${Math.abs(dy)}px solid rgba(0, 255, 0, 0.5)`; // 초록색 반투명
    triangle.style.top = `${Math.min(point1.y, point2.y)}px`;
    triangle.style.left = `${Math.min(point1.x, point2.x)}px`;
  }

  document.body.appendChild(triangle);
}

// dx와 dy를 화면에 표시하는 함수
function displayDimensions(point1, point2) {
  // 두 점의 거리 계산
  const dx = Math.abs(point2.x - point1.x);
  const dy = Math.abs(point2.y - point1.y);

  // 디스플레이 요소 업데이트
  const display = document.getElementById('dimensionDisplay');
  if (display) {
    display.textContent = `가로: ${dx/50}   세로: ${dy/50}`;
    display.style.display = 'block'; // 요소를 표시
  }
}

// 초기화 버튼 클릭 이벤트 리스너 추가
document.getElementById('resetButton').addEventListener('click', resetHighlights);

function resetHighlights() {
  // 모든 강조 표시, 선분, 삼각형 제거
  document.querySelectorAll('.highlight, .triangle, div[style*="rgba(0, 255, 0, 0.5)"], div[style*="rgba(0, 0, 255, 0.7)"]').forEach(el => el.remove());
  points = [];

  // 디스플레이 요소 숨기기
  const display = document.getElementById('dimensionDisplay');
  if (display) {
    display.style.display = 'none';
  }
}

// 페이지 로드 시 카메라 시작
window.addEventListener('load', startCamera);