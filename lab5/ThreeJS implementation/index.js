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

    pointLight_intensity: 1,

    pointLight_mapSize_width: 512,
    pointLight_mapSize_height: 512,

    pointLight_shadow_cam_near: 0.5,
    pointLight_shadow_cam_far: 700,

    pointLight_shadow_bias: 0,
  };

  var gui = new dat.GUI();
  gui.add(object, 'rotationX').min(-0.1).max(0.1).step(0.001);
  gui.add(object, 'rotationY').min(-0.1).max(0.1).step(0.001);
  gui.add(object, 'rotationZ').min(-0.1).max(0.1).step(0.001);

  gui.add(object, 'positionX').min(-5).max(5).step(0.1);
  gui.add(object, 'positionY').min(-5).max(5).step(0.1);
  gui.add(object, 'positionZ').min(-5).max(5).step(0.1);

  gui.add(object, 'pointLight_intensity').min(0).max(5).step(0.01);

  gui.add(object, 'pointLight_mapSize_width').min(400).max(700).step(1);
  gui.add(object, 'pointLight_mapSize_height').min(400).max(700).step(1);

  gui.add(object, 'pointLight_shadow_cam_near').min(-5).max(5).step(0.01);
  gui.add(object, 'pointLight_shadow_cam_far').min(250).max(950).step(1);

  gui.add(object, 'pointLight_shadow_bias').min(-1).max(1).step(0.0001);

  var renderer = new THREE.WebGLRenderer({ canvas: canvas });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0xdbd5d8);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 5000);
  camera.position.set(0, 100, 1000);

  // point light from the left
  const pointLight_color = 0xffffff;
  const pointLight_intensity = 1;
  const pointLight = new THREE.PointLight(
    pointLight_color,
    pointLight_intensity
  );
  pointLight.position.set(-500, 100, 50);
  pointLight.castShadow = true;
  scene.add(pointLight);

  //Set up shadow properties for the light
  pointLight.shadow.bias = 0;
  pointLight.shadow.mapSize.width = 512; // default
  pointLight.shadow.mapSize.height = 512; // default
  pointLight.shadow.camera.near = 0.5; // default
  pointLight.shadow.camera.far = 500; // default

  // plane
  var planeGeometry = new THREE.PlaneGeometry(800, 800, 800);
  var planeMaterial = new THREE.MeshPhongMaterial({ color: 0xf1ecea });
  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.receiveShadow = true;
  plane.position.z = -50;
  plane.position.y = -150;
  plane.rotation.set(-1.7, 0.0, 0.0);
  scene.add(plane);

  // cone
  var coneMesh = new THREE.ConeGeometry(60, 225, 50);
  var coneMaterial = new THREE.MeshPhongMaterial({ color: 0xf1ecea });
  var cone = new THREE.Mesh(coneMesh, coneMaterial);
  cone.castShadow = true;
  cone.receiveShadow = true;
  cone.position.z = -100;
  cone.position.y = -35;
  cone.position.x = -10;
  cone.rotation.set(0.0, 0.0, 0.0);
  scene.add(cone);

  // cube
  var cubeMesh = new THREE.BoxGeometry(100, 100, 100);
  var cubeMaterial = new THREE.MeshPhongMaterial({ color: 0xf1ecea });
  var cube = new THREE.Mesh(cubeMesh, cubeMaterial);
  cube.castShadow = true;
  cube.receiveShadow = true;
  cube.position.z = 50;
  cube.position.y = -75;
  cube.position.x = -75;
  cube.rotation.set(0.0, 0.6, 0.0);
  scene.add(cube);

  // sphere
  var sphereMesh = new THREE.SphereGeometry(75, 32, 32);
  var sphereMaterial = new THREE.MeshPhongMaterial({ color: 0xf1ecea });
  var sphere = new THREE.Mesh(sphereMesh, sphereMaterial);
  sphere.castShadow = true;
  sphere.receiveShadow = true;
  sphere.position.z = 90;
  sphere.position.y = -60;
  sphere.position.x = 150;
  sphere.rotation.set(0.0, 0.0, 0.0);
  scene.add(sphere);

  // cylinder
  var cylinderMesh = new THREE.CylinderGeometry(50, 50, 190, 32);
  var cylinderMaterial = new THREE.MeshPhongMaterial({ color: 0xf1ecea });
  var cylinder = new THREE.Mesh(cylinderMesh, cylinderMaterial);
  cylinder.castShadow = true;
  cylinder.receiveShadow = true;
  cylinder.position.z = -50;
  cylinder.position.y = -40;
  cylinder.position.x = 100;
  cylinder.rotation.set(0.0, 0.0, 0.0);
  scene.add(cylinder);

  function loop() {
    scene.rotation.x += object.rotationX;
    scene.rotation.y += object.rotationY;
    scene.rotation.z += object.rotationZ;

    scene.position.x += object.positionX;
    scene.position.y += object.positionY;
    scene.position.z += object.positionZ;

    pointLight.intensity = object.pointLight_intensity;

    pointLight.shadow.mapSize.width = object.pointLight_mapSize_width;
    pointLight.shadow.mapSize.height = object.pointLight_mapSize_height;

    pointLight.shadow.camera.near = object.pointLight_shadow_cam_near;
    pointLight.shadow.camera.far = object.pointLight_shadow_cam_far;

    pointLight.shadow.bias = object.pointLight_shadow_bias;

    renderer.render(scene, camera);
    requestAnimationFrame(function () {
      loop();
    });
  }

  loop();

  renderer.render(scene, camera);
};
