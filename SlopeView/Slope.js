import * as THREE from 'three';
import { MindARThree } from 'mindar-image-three';

document.addEventListener('DOMContentLoaded', () => {
  console.log("JavaScript Loaded and DOM Ready!");

  const startButton = document.getElementById('startButton');
  startButton.addEventListener('click', async () => {
    console.log("Start Button Clicked!");

    // Hide the input container when AR starts
    document.querySelector('.input-container').style.display = 'none';

    // Get the input values
    const baseLength = parseFloat(document.getElementById('baseLength').value);
    const heightLength = parseFloat(document.getElementById('heightLength').value);

    // Validate input values
    if (isNaN(baseLength) || isNaN(heightLength) || baseLength <= 0 || heightLength <= 0) {
      alert('Please enter valid base and height values.');
      return;
    }

    // Hypotenuse length calculation
    const hypotenuseLength = Math.sqrt(baseLength * baseLength + heightLength * heightLength);

    // Initialize MindAR
    const mindarThree = new MindARThree({
      container: document.getElementById('container'),  // AR rendering container
      imageTargetSrc: './Target.mind' // Target file for image recognition
    });
    const { renderer, scene, camera } = mindarThree;

    // AR objects
    // 직각삼각형 모양 정의
    const shape1 = new THREE.Shape();
    shape.moveTo(-(baseLength / 2), -(1 / 2));  // 첫 번째 꼭짓점
    shape.lineTo(baseLength / 2, -(1 / 2));  // 두 번째 꼭짓점 (직각점)
    shape.lineTo(baseLength / 2, heightLength -(1/2));  // 세 번째 꼭짓점
    shape.lineTo(-(baseLength / 2), -(1 / 2));  // 삼각형 닫기

    const shape2 = new THREE.Shape();
    shape.moveTo(-(baseLength / 2), 1 / 2);  // 첫 번째 꼭짓점
    shape.lineTo(baseLength / 2, 1 / 2);  // 두 번째 꼭짓점 (직각점)
    shape.lineTo(baseLength / 2, heightLength + 1 / 2);  // 세 번째 꼭짓점
    shape.lineTo(-(baseLength / 2), + 1 / 2);  // 삼각형 닫기

    const geometry1 = new THREE.PlaneGeometry(baseLength, 1);
    const geometry2 = new THREE.PlaneGeometry(heightLength, 1);
    const geometry3 = new THREE.PlaneGeometry(hypotenuseLength, 1); // Hypotenuse plane
    const geometry4 = new THREE.ShapeGeometry(shape1);
    const geometry5 = new THREE.ShapeGeometry(shape2);

    const material = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.5 });
    const plane1 = new THREE.Mesh(geometry1, material);
    const plane2 = new THREE.Mesh(geometry2, material);
    const plane3 = new THREE.Mesh(geometry3, material); // Hypotenuse plane
    const triangle1 = new THREE.Mesh(geometry4, material);
    const triangle2 = new THREE.Mesh(geometry5, material);

    // Set plane positions
    plane2.position.set(baseLength / 2, 0, heightLength / 2); // plane1's end to start, vertically placed
    plane2.rotation.y = THREE.MathUtils.degToRad(90); // 90 degree rotation along the y-axis

    plane3.position.set(0, 0, heightLength / 2); // Position plane3 correctly
    plane3.rotation.y = -Math.atan2(heightLength, baseLength); // Rotate the hypotenuse

    triangle1.rotation.x = THREE.MathUtils.degToRad(90);
    triangle2.rotation.x = THREE.MathUtils.degToRad(90);

    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(plane1);
    anchor.group.add(plane2);
    anchor.group.add(plane3);
    anchor.group.add(triangle1);
    anchor.group.add(triangle2);

    // Start AR and show the camera feed as the background
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  });
});
