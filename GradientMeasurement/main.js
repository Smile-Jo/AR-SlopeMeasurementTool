document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    const {THREE, MindARThree} = window.MINDAR.IMAGE; // Use THREE from MindAR

    const mindarThree = new MindARThree({
      container: document.body, // The container where the AR will be rendered
      imageTargetSrc: '../assets/targets/course-banner.mind', // Path to your image target
      alpha: true // Set the background to be transparent
    });

    const {renderer, scene, camera} = mindarThree;

    renderer.setClearColor(0x000000, 0); // Transparent background

    // AR object (if needed)
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({color: 0x00ffff, transparent: true, opacity: 0.5});
    const plane = new THREE.Mesh(geometry, material);
    const anchor = mindarThree.addAnchor(0); // Anchor index should match your image target index
    anchor.group.add(plane);

    await mindarThree.start(); // Start the MindAR session

    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  start();
});
