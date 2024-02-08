window.onload = function () {
  // initial canvas
  var width = window.innerWidth;
  var height = window.innerHeight;

  var canvas = document.getElementById('canvas');
  canvas.setAttribute('width', width);
  canvas.setAttribute('height', height);

  // gui
  var object = {
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,

    positionX: 0,
    positionY: 0,
    positionZ: 0,

    directLight_intensity: 1,

    pointLight_left_intensity: 1,
    pointLight_right_intensity: 1,
  };

  var gui = new dat.GUI();
  gui.add(object, 'rotationX').min(-0.1).max(0.1).step(0.001);
  gui.add(object, 'rotationY').min(-0.1).max(0.1).step(0.001);
  gui.add(object, 'rotationZ').min(-0.1).max(0.1).step(0.001);

  gui.add(object, 'positionX').min(-5).max(5).step(0.1);
  gui.add(object, 'positionY').min(-5).max(5).step(0.1);
  gui.add(object, 'positionZ').min(-5).max(5).step(0.1);

  gui.add(object, 'directLight_intensity').min(1).max(5).step(0.01);

  gui.add(object, 'pointLight_left_intensity').min(1).max(5).step(0.01);
  gui.add(object, 'pointLight_right_intensity').min(1).max(5).step(0.01);

  // renderer and camera
  var renderer = new THREE.WebGLRenderer({ canvas: canvas });
  renderer.setClearColor(0xae0e52); // background color

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 5000);
  camera.position.set(0, 100, 1100);

  // directional light
  const directionalLight_color = 0xffffff;
  const directionalLight_intensity = 1;
  const directionalLight = new THREE.DirectionalLight(
    directionalLight_color,
    directionalLight_intensity
  );
  directionalLight.position.set(0, 50, 0);
  scene.add(directionalLight);

  // point light from the left
  const pointLight_left_color = 0xffffff;
  const pointLight_left_intensity = 1;
  const pointLight_left = new THREE.PointLight(
    pointLight_left_color,
    pointLight_left_intensity
  );
  pointLight_left.position.set(-500, 100, 50);
  scene.add(pointLight_left);

  // point light from the right
  const pointLight_right_color = 0xffffff;
  const pointLight_right_intensity = 1;
  const pointLight_right = new THREE.PointLight(
    pointLight_right_color,
    pointLight_right_intensity
  );
  pointLight_right.position.set(500, 100, 50);
  scene.add(pointLight_right);

  // bottom plane
  var planeGeometry = new THREE.PlaneGeometry(800, 800, 800);
  const planeTextureLoader = new THREE.TextureLoader();
  const planeTexture = planeTextureLoader.load(
    'https://thumbs.dreamstime.com/z/classic-checkered-tablecloth-texture-25789156.jpg?w=768'
  );
  planeTexture.wrapS = THREE.RepeatWrapping;
  planeTexture.wrapT = THREE.RepeatWrapping;
  const planeHor = 2;
  const planeVer = 2;
  planeTexture.repeat.set(planeHor, planeVer);
  const planeMaterial = new THREE.MeshPhongMaterial({
    map: planeTexture,
  });
  var planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
  planeMesh.position.z = -50;
  planeMesh.position.y = -150;
  planeMesh.rotation.set(-1.6, 0.0, 0.0);
  scene.add(planeMesh);

  // cone
  var coneGeometry = new THREE.ConeGeometry(150, 300, 50);
  const coneTextureLoader = new THREE.TextureLoader();
  const coneTexture = coneTextureLoader.load(
    'https://thumbs.dreamstime.com/z/green-marble-abstract-acrylic-background-marbling-artwork-texture-agate-ripple-pattern-gold-powder-green-marble-abstract-acrylic-123987448.jpg?w=992'
  );
  const coneMaterial = new THREE.MeshPhongMaterial({
    map: coneTexture,
  });
  var coneMesh = new THREE.Mesh(coneGeometry, coneMaterial);
  coneMesh.position.z = -50;
  coneMesh.position.y = 10;
  coneMesh.position.x = -150;
  coneMesh.rotation.set(0.0, 0.6, 0.0); // 0.2
  scene.add(coneMesh);

  // cube
  var cubeGeometry = new THREE.BoxGeometry(100, 100, 100); //(200, 200, 200, 12, 12, 12);
  const cubeTextureLoader = new THREE.TextureLoader();
  const cubeTexture = cubeTextureLoader.load(
    'https://thumbs.dreamstime.com/z/cracked-earth-soil-texture-vector-background-cracked-earth-soil-texture-vector-background-128714270.jpg?w=768'
  );
  const cubeMaterial = new THREE.MeshPhongMaterial({
    map: cubeTexture,
  });
  var cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cubeMesh.position.z = -50;
  cubeMesh.position.y = -90;
  cubeMesh.position.x = 100;
  cubeMesh.rotation.set(0.0, 0.6, 0.0); //0,2
  scene.add(cubeMesh);

  // ball
  var ballGeometry = new THREE.SphereGeometry(50, 32, 32);
  const ballTextureLoader = new THREE.TextureLoader();
  const ballTexture = ballTextureLoader.load(
    'https://thumbs.dreamstime.com/z/world-map-texture-global-satellite-photo-earth-view-space-detailed-flat-continents-oceans-panorama-planet-191724561.jpg?w=992'
  );
  const ballMaterial = new THREE.MeshPhongMaterial({
    map: ballTexture,
  });
  var ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
  ballMesh.position.z = -25;
  ballMesh.position.y = 10;
  ballMesh.position.x = 100;
  ballMesh.rotation.set(0.0, 0.0, 0.0);
  scene.add(ballMesh);

  // loop function
  function loop() {
    scene.rotation.x += object.rotationX;
    scene.rotation.y += object.rotationY;
    scene.rotation.z += object.rotationZ;

    scene.position.x += object.positionX;
    scene.position.y += object.positionY;
    scene.position.z += object.positionZ;

    directionalLight.intensity = object.directLight_intensity;

    pointLight_left.intensity = object.pointLight_left_intensity;
    pointLight_right.intensity = object.pointLight_right_intensity;

    renderer.render(scene, camera);
    requestAnimationFrame(function () {
      loop();
    });
  }
  loop();

  // render
  renderer.render(scene, camera);
};
