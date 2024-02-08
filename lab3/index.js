window.onload = function () {
  var width = window.innerWidth;
  var height = window.innerHeight;

  var canvas = document.getElementById('canvas');
  canvas.setAttribute('width', width);
  canvas.setAttribute('height', height);

  var object = {
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,

    positionX: 0,
    positionY: 0,
    positionZ: 0,

    directLight_intensity: 1,
    pointLight_intensity: 1,
  };

  var gui = new dat.GUI();
  gui.add(object, 'rotationX').min(-0.1).max(0.1).step(0.001);
  gui.add(object, 'rotationY').min(-0.1).max(0.1).step(0.001);
  gui.add(object, 'rotationZ').min(-0.1).max(0.1).step(0.001);

  gui.add(object, 'positionX').min(-5).max(5).step(0.1);
  gui.add(object, 'positionY').min(-5).max(5).step(0.1);
  gui.add(object, 'positionZ').min(-5).max(5).step(0.1);

  gui.add(object, 'directLight_intensity').min(1).max(5).step(0.01);
  gui.add(object, 'pointLight_intensity').min(1).max(5).step(0.01);

  var renderer = new THREE.WebGLRenderer({ canvas: canvas });
  renderer.setClearColor(0xdbd5d8);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 5000);
  camera.position.set(0, 100, 1000);

  const color = 0xffffff;
  const intensity = 0.6;
  const directionalLight = new THREE.DirectionalLight(color, intensity);
  directionalLight.position.set(0, 200, 0);
  scene.add(directionalLight);

  const color2 = 0xffffff;
  const intensity2 = 1;
  const pointLight = new THREE.PointLight(color2, intensity2);
  pointLight.position.set(200, 20, 0);
  scene.add(pointLight);

  var planeGeometry = new THREE.PlaneGeometry(800, 800, 800);
  var planeMaterial = new THREE.MeshPhongMaterial({ color: 0x317873 });
  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.position.z = -50;
  plane.position.y = -150;
  plane.rotation.set(-1.7, 0.0, 0.0);
  scene.add(plane);

  var coneMesh = new THREE.ConeGeometry(100, 200, 50);
  var coneMaterial = new THREE.MeshPhongMaterial({ color: 0x7f70ac });
  var cone = new THREE.Mesh(coneMesh, coneMaterial);
  cone.position.z = -50;
  cone.position.y = -50;
  cone.position.x = -100;
  cone.rotation.set(0.0, 0.0, 0.0);
  scene.add(cone);

  var cubeMesh = new THREE.BoxGeometry(100, 100, 100);
  var cubeMaterial = new THREE.MeshPhongMaterial({ color: 0xe34234 });
  var cube = new THREE.Mesh(cubeMesh, cubeMaterial);
  cube.position.z = -50;
  cube.position.y = -100;
  cube.position.x = 100;
  cube.rotation.set(0.0, 0.6, 0.0);
  scene.add(cube);

  var sphereMesh = new THREE.SphereGeometry(50, 32, 32);
  var sphereMaterial = new THREE.MeshPhongMaterial({ color: 0xf28500 });
  var sphere = new THREE.Mesh(sphereMesh, sphereMaterial);
  sphere.position.z = -50;
  sphere.position.y = 0;
  sphere.position.x = 100;
  sphere.rotation.set(0.0, 0.0, 0.0);
  scene.add(sphere);

  function loop() {
    scene.rotation.x += object.rotationX;
    scene.rotation.y += object.rotationY;
    scene.rotation.z += object.rotationZ;

    scene.position.x += object.positionX;
    scene.position.y += object.positionY;
    scene.position.z += object.positionZ;

    directionalLight.intensity = object.directLight_intensity;
    pointLight.intensity = object.pointLight_intensity;

    renderer.render(scene, camera);
    requestAnimationFrame(function () {
      loop();
    });
  }

  loop();

  renderer.render(scene, camera);
};
