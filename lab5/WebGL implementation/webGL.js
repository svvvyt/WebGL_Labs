'use strict';
function main() {
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  var width = window.innerWidth;
  var height = window.innerHeight;
  const canvas = document.getElementById('canvas');

  canvas.setAttribute('width', width);
  canvas.setAttribute('height', height);

  const gl = canvas.getContext('webgl');
  if (!gl) {
    return;
  }

  const ext = gl.getExtension('WEBGL_depth_texture');
  if (!ext) {
    return alert('need WEBGL_depth_texture');
  }

  // setup GLSL programs
  const textureProgramInfo = webglUtils.createProgramInfo(gl, [
    '3d-vertex-shader',
    '3d-fragment-shader',
  ]);
  const colorProgramInfo = webglUtils.createProgramInfo(gl, [
    'color-vertex-shader',
    'color-fragment-shader',
  ]);

  // Buffers for geometric figures

  // sphere buffer
  const sphereBufferInfo = primitives.createSphereBufferInfo(
    gl,
    1.3, // radius
    32, // subdivisions around
    24 // subdivisions down
  );

  // plane buffer
  const planeBufferInfo = primitives.createPlaneBufferInfo(
    gl,
    20, // width
    20, // height
    1, // subdivisions across
    1 // subdivisions down
  );

  // cube buffer
  const cubeBufferInfo = primitives.createCubeBufferInfo(
    gl,
    2 // size
  );

  const cubeLinesBufferInfo = webglUtils.createBufferInfoFromArrays(gl, {
    position: [
      -1, -1, -1, 1, -1, -1, -1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, 1, 1,
      1, 1, 1,
    ],
    indices: [
      0, 1, 1, 3, 3, 2, 2, 0,

      4, 5, 5, 7, 7, 6, 6, 4,

      0, 4, 1, 5, 3, 7, 2, 6,
    ],
  });

  // cone buffer
  const coneBufferInfo = primitives.createTruncatedConeBufferInfo(
    gl,
    1,
    0,
    1,
    100,
    2 // subdivisions down
  );

  // cylinder buffer
  const cylinderBufferInfo = primitives.createTruncatedConeBufferInfo(
    gl,
    1,
    1,
    1,
    100,
    2 // subdivisions down
  );

  // make a 8x8 checkerboard texture
  const checkerboardTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, checkerboardTexture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0, // mip level
    gl.LUMINANCE, // internal format
    8, // width
    8, // height
    0, // border
    gl.LUMINANCE, // format
    gl.UNSIGNED_BYTE, // type
    new Uint8Array([
      // data
      0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
      0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
      0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
      0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
      0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
      0xff, 0xff, 0xff, 0xff,
    ])
  );

  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  const depthTexture = gl.createTexture();
  const depthTextureSize = 512;
  gl.bindTexture(gl.TEXTURE_2D, depthTexture);
  gl.texImage2D(
    gl.TEXTURE_2D, // target
    0, // mip level
    gl.DEPTH_COMPONENT, // internal format
    depthTextureSize, // width
    depthTextureSize, // height
    0, // border
    gl.DEPTH_COMPONENT, // format
    gl.UNSIGNED_INT, // type
    null
  ); // data
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const depthFramebuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER, // target
    gl.DEPTH_ATTACHMENT, // attachment point
    gl.TEXTURE_2D, // texture target
    depthTexture, // texture
    0
  );

  function degToRad(d) {
    return (d * Math.PI) / 180;
  }

  const settings = {
    camera_position_X: 6,
    camera_position_Y: 10,
    camera_position_Z: 10,
    scene_position_X: 2.5,
    scene_position_Y: 7.5,
    scene_position_Z: 5,
    targetX: 2.5,
    targetY: 0,
    targetZ: 3.5,
    projWidth: 1,
    projHeight: 1,
    fieldOfView: 120,
    bias: -0.006,
  };

  webglLessonsUI.setupUI(document.querySelector('#ui'), settings, [
    {
      type: 'slider',
      key: 'camera_position_X',
      min: -30,
      max: 30,
      change: render,
      precision: 2,
      step: 0.001,
    },
    {
      type: 'slider',
      key: 'camera_position_Y',
      min: 1,
      max: 30,
      change: render,
      precision: 2,
      step: 0.001,
    },
    {
      type: 'slider',
      key: 'camera_position_Z',
      min: -30,
      max: 30,
      change: render,
      precision: 2,
      step: 0.001,
    },
    {
      type: 'slider',
      key: 'scene_position_X',
      min: -10,
      max: 10,
      change: render,
      precision: 2,
      step: 0.001,
    },
    {
      type: 'slider',
      key: 'scene_position_Y',
      min: 1,
      max: 20,
      change: render,
      precision: 2,
      step: 0.001,
    },
    {
      type: 'slider',
      key: 'scene_position_Z',
      min: -10,
      max: 10,
      change: render,
      precision: 2,
      step: 0.001,
    },
    {
      type: 'slider',
      key: 'targetX',
      min: -10,
      max: 10,
      change: render,
      precision: 2,
      step: 0.001,
    },
    {
      type: 'slider',
      key: 'targetY',
      min: -10,
      max: 10,
      change: render,
      precision: 2,
      step: 0.001,
    },
    {
      type: 'slider',
      key: 'targetZ',
      min: -10,
      max: 20,
      change: render,
      precision: 2,
      step: 0.001,
    },
    {
      type: 'slider',
      key: 'projWidth',
      min: 0,
      max: 2,
      change: render,
      precision: 2,
      step: 0.001,
    },
    {
      type: 'slider',
      key: 'projHeight',
      min: 0,
      max: 2,
      change: render,
      precision: 2,
      step: 0.001,
    },
    { type: 'slider', key: 'fieldOfView', min: 1, max: 179, change: render },
    {
      type: 'slider',
      key: 'bias',
      min: -0.01,
      max: 0.00001,
      change: render,
      precision: 4,
      step: 0.0001,
    },
  ]);

  const fieldOfViewRadians = degToRad(80);

  const planeUniforms = {
    u_colorMult: [0.7, 0.7, 0.7, 1], // grey
    u_color: [1, 0, 0, 1],
    u_texture: checkerboardTexture,
    u_world: m4.translation(0, 0, 0),
  };
  const sphereUniforms = {
    u_colorMult: [0.7, 0.7, 0.7, 1], // grey
    u_color: [0, 0, 1, 1],
    u_texture: checkerboardTexture,
    u_world: m4.scale(m4.translation(2.75, 1.3, 2.75), 1, 1, 1), // (x, y, z) - координаты, далее три числа размеры
  };

  const cubeUniforms = {
    u_colorMult: [0.7, 0.7, 0.7, 1], // grey
    u_color: [0, 0, 1, 1],
    u_texture: checkerboardTexture,
    u_world: m4.scale(m4.translation(-1.5, 1, 2), 1, 1, 1),
  };

  const coneUniforms = {
    u_colorMult: [0.7, 0.7, 0.7, 1], // grey
    u_color: [0, 0, 1, 1],
    u_texture: checkerboardTexture,
    u_world: m4.scale(m4.translation(-1, 1, -1), 1.5, 5, 1.5), // (x, y, z) - координаты, далее три числа размеры
  };

  const cylinderUniforms = {
    u_colorMult: [0.7, 0.7, 0.7, 1], // grey
    u_color: [0, 0, 1, 1],
    u_texture: checkerboardTexture,
    u_world: m4.scale(m4.translation(1.5, 1, 0), 1, 4, 1), // (x, y, z) - координаты
  };

  function drawScene(
    projectionMatrix,
    cameraMatrix,
    textureMatrix,
    lightWorldMatrix,
    programInfo
  ) {
    // Make a view matrix from the camera matrix.
    const viewMatrix = m4.inverse(cameraMatrix);

    gl.useProgram(programInfo.program);

    // set uniforms that are the same for both the sphere and plane
    // note: any values with no corresponding uniform in the shader
    // are ignored.
    webglUtils.setUniforms(programInfo, {
      u_view: viewMatrix,
      u_projection: projectionMatrix,
      u_bias: settings.bias,
      u_textureMatrix: textureMatrix,
      u_projectedTexture: depthTexture,
      u_shininess: 150,
      u_innerLimit: Math.cos(degToRad(settings.fieldOfView / 2 - 10)),
      u_outerLimit: Math.cos(degToRad(settings.fieldOfView / 2)),
      u_lightDirection: lightWorldMatrix.slice(8, 11).map((v) => -v),
      u_lightWorldPosition: [
        settings.scene_position_X,
        settings.scene_position_Y,
        settings.scene_position_Z,
      ],
      u_viewWorldPosition: cameraMatrix.slice(12, 15),
    });

    // ------ Draw the sphere --------
    webglUtils.setBuffersAndAttributes(gl, programInfo, sphereBufferInfo);
    webglUtils.setUniforms(programInfo, sphereUniforms);
    webglUtils.drawBufferInfo(gl, sphereBufferInfo);

    // ------ Draw the cube --------
    webglUtils.setBuffersAndAttributes(gl, programInfo, cubeBufferInfo);
    webglUtils.setUniforms(programInfo, cubeUniforms);
    webglUtils.drawBufferInfo(gl, cubeBufferInfo);

    // ------ Draw the plane --------
    webglUtils.setBuffersAndAttributes(gl, programInfo, planeBufferInfo);
    webglUtils.setUniforms(programInfo, planeUniforms);
    webglUtils.drawBufferInfo(gl, planeBufferInfo);

    // ------ Draw the cone --------
    webglUtils.setBuffersAndAttributes(gl, programInfo, coneBufferInfo);
    webglUtils.setUniforms(programInfo, coneUniforms);
    webglUtils.drawBufferInfo(gl, coneBufferInfo);

    // ------ Draw the cylinder --------
    webglUtils.setBuffersAndAttributes(gl, programInfo, cylinderBufferInfo);
    webglUtils.setUniforms(programInfo, cylinderUniforms);
    webglUtils.drawBufferInfo(gl, cylinderBufferInfo);
  }

  // Draw the scene.
  function render() {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    // first draw from the POV of the light
    const lightWorldMatrix = m4.lookAt(
      [
        settings.scene_position_X,
        settings.scene_position_Y,
        settings.scene_position_Z,
      ], // position
      [settings.targetX, settings.targetY, settings.targetZ], // target
      [0, 1, 0] // up
    );
    const lightProjectionMatrix = settings.orthographic
      ? m4.orthographic(
          -settings.projWidth / 2, // left
          settings.projWidth / 2, // right
          -settings.projHeight / 2, // bottom
          settings.projHeight / 2, // top
          0.5, // near
          10
        ) // far
      : m4.perspective(
          degToRad(settings.fieldOfView),
          settings.projWidth / settings.projHeight,
          0.5, // near
          10
        ); // far

    // draw to the depth texture
    gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer);
    gl.viewport(0, 0, depthTextureSize, depthTextureSize);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    drawScene(
      lightProjectionMatrix,
      lightWorldMatrix,
      m4.identity(),
      lightWorldMatrix,
      colorProgramInfo
    );

    // now draw scene to the canvas projecting the depth texture into the scene
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let textureMatrix = m4.identity();
    textureMatrix = m4.translate(textureMatrix, 0.5, 0.5, 0.5);
    textureMatrix = m4.scale(textureMatrix, 0.5, 0.5, 0.5);
    textureMatrix = m4.multiply(textureMatrix, lightProjectionMatrix);
    // use the inverse of this world matrix to make
    // a matrix that will transform other positions
    // to be relative this this world space.
    textureMatrix = m4.multiply(textureMatrix, m4.inverse(lightWorldMatrix));

    // Compute the projection matrix
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const projectionMatrix = m4.perspective(
      fieldOfViewRadians,
      aspect,
      1,
      2000
    );

    // Compute the camera's matrix using look at.
    const cameraPosition = [
      settings.camera_position_X,
      settings.camera_position_Y,
      settings.camera_position_Z,
    ];
    const target = [0, 0, 0];
    const up = [0, 1, 0];
    const cameraMatrix = m4.lookAt(cameraPosition, target, up);

    drawScene(
      projectionMatrix,
      cameraMatrix,
      textureMatrix,
      lightWorldMatrix,
      textureProgramInfo
    );

    // ------ Draw the frustum ------
    {
      const viewMatrix = m4.inverse(cameraMatrix);

      gl.useProgram(colorProgramInfo.program);

      // Setup all the needed attributes.
      webglUtils.setBuffersAndAttributes(
        gl,
        colorProgramInfo,
        cubeLinesBufferInfo
      );

      // scale the cube in Z so it's really long
      // to represent the texture is being projected to
      // infinity
      const mat = m4.multiply(
        lightWorldMatrix,
        m4.inverse(lightProjectionMatrix)
      );

      // Set the uniforms we just computed
      webglUtils.setUniforms(colorProgramInfo, {
        u_color: [1, 1, 1, 1],
        u_view: viewMatrix,
        u_projection: projectionMatrix,
        u_world: mat,
      });

      // calls gl.drawArrays or gl.drawElements
      webglUtils.drawBufferInfo(gl, cubeLinesBufferInfo, gl.LINES);
    }
  }
  render();
}
main();
