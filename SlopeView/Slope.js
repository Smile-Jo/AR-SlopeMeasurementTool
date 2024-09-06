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
    const geometry1 = new THREE.PlaneGeometry(baseLength, 1);
    const geometry2 = new THREE.PlaneGeometry(heightLength, 1);
    const geometry3 = new THREE.PlaneGeometry(hypotenuseLength, 1); // Hypotenuse plane

    const material = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.5 });
    const plane1 = new THREE.Mesh(geometry1, material);
    const plane2 = new THREE.Mesh(geometry2, material);
    const plane3 = new THREE.Mesh(geometry3, material); // Hypotenuse plane

    // Set plane positions
    plane2.position.set(baseLength / 2, 0, heightLength / 2); // plane1's end to start, vertically placed
    plane2.rotation.y = THREE.MathUtils.degToRad(90); // 90 degree rotation along the y-axis

    plane3.position.set(-baseLength / 2, 0, heightLength / 2); // Position plane3 correctly
    plane3.rotation.y = -Math.atan2(heightLength, baseLength); // Rotate the hypotenuse

    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(plane1);
    anchor.group.add(plane2);
    anchor.group.add(plane3);

    // Start AR and show the camera feed as the background
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  });
});
