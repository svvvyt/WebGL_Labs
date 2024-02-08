window.onload = function () {
  var width = window.innerWidth;
  var height = window.innerHeight;
  var canvas = document.getElementById('canvas');

  canvas.setAttribute('width', width);
  canvas.setAttribute('height', height);

  var ball = {
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,

    positionX: 0,
    positionY: 0,
    positionZ: 0,

    scaleX: 0,
    scaleY: 0,
    scaleZ: 0,
  };

  var gui = new dat.GUI();
  gui.add(ball, 'rotationX').min(-0.1).max(0.1).step(0.001);
  gui.add(ball, 'rotationY').min(-0.1).max(0.1).step(0.001);
  gui.add(ball, 'rotationZ').min(-0.1).max(0.1).step(0.001);

  gui.add(ball, 'positionX').min(-5).max(5).step(0.1);
  gui.add(ball, 'positionY').min(-5).max(5).step(0.1);
  gui.add(ball, 'positionZ').min(-5).max(5).step(0.1);

  gui.add(ball, 'scaleX').min(-0.1).max(0.1).step(0.001);
  gui.add(ball, 'scaleY').min(-0.1).max(0.1).step(0.001);
  gui.add(ball, 'scaleZ').min(-0.1).max(0.1).step(0.001);

  var renderer = new THREE.WebGLRenderer({ canvas: canvas });
  renderer.setClearColor(0xecedd1); //(0x9ACEEB);

  var scene = new THREE.Scene();

  var camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 5000);
  camera.position.set(0, 0, 1000);

  var light = new THREE.AmbientLight(0xffffff);
  scene.add(light);

  var box = new THREE.BoxGeometry(200, 200, 200, 6, 6, 6);
  var sphere = new THREE.SphereGeometry(200, 20, 20);
  var material = new THREE.MeshNormalMaterial({
    color: 0x0095dd,
  });
  var mesh = new THREE.Mesh(box, material);
  scene.add(mesh);

  function loop() {
    mesh.rotation.x += ball.rotationX;
    mesh.rotation.y += ball.rotationY;
    mesh.rotation.z += ball.rotationZ;

    mesh.position.x += ball.positionX;
    mesh.position.y += ball.positionY;
    mesh.position.z += ball.positionZ;

    mesh.scale.x += ball.scaleX;
    mesh.scale.y += ball.scaleY;
    mesh.scale.z += ball.scaleZ;

    renderer.render(scene, camera);
    requestAnimationFrame(function () {
      loop();
    });
  }
  loop();
};
