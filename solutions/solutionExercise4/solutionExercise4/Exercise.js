//
// DI Computer Graphics
//
// WebGL Exercises
//

// Turn Texture Mapping on and off
// Add Transformation
// Add Transformation for texture
// Add 3D functionality
// (Version without texture mapping for easier solution)

// Register function to call after document has loaded
window.onload = startup;

// the gl object is saved globally
var gl;

// we keep all local parameters for the program in a single object
var ctx = {
  shaderProgram: -1,
  aVertexPositionId: -1,
  aVertexColorId: -1,
  aVertexTextureCoordId: -1,
  uModelViewMatrixId: -1,
  uProjectionMatrixId: -1,
};

// keep texture parameters in an object so we can mix textures and objects
var lennaTxt = {
  textureObject0: {},
};

// parameters that define the scene
var scene = {
  eyePosition: [-2, 2, 5],
  lookAtPosition: [0, 0, 0],
  upVector: [0, 1, 0],
  nearPlane: 0.1,
  farPlane: 30.0,
  fov: 40,
  angle: 0,
  angularSpeed: (0.1 * 2 * Math.PI) / 360.0,
};

var drawingObjects = {
  wiredCube: null,
};

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
  "use strict";
  var canvas = document.getElementById("myCanvas");
  gl = createGLContext(canvas);
  initGL();
  //draw();
  window.requestAnimationFrame (drawAnimated);
}

/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
  "use strict";
  ctx.shaderProgram = loadAndCompileShaders(
    gl,
    "VertexShader.glsl",
    "FragmentShader.glsl"
  );
  setUpAttributesAndUniforms();
  defineObjects();
  gl.frontFace(gl.CCW); // defines how the front face is drawn
  gl.cullFace(gl.BACK); // defines which face should be culled
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);

  gl.clearColor(0.5, 0.5, 0.5, 1);
}

function defineObjects() {
  drawingObjects.wiredCube = new WireFrameCube(gl, [1.0, 1.0, 1.0, 1.0]);
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms() {
  "use strict";
  ctx.aVertexPositionId = gl.getAttribLocation(
    ctx.shaderProgram,
    "aVertexPosition"
  );
  ctx.aVertexColorId = gl.getAttribLocation(ctx.shaderProgram, "aVertexColor");
  ctx.uModelViewMatrixId = gl.getUniformLocation(
    ctx.shaderProgram,
    "uModelViewMatrix"
  );
  ctx.uProjectionMatrixId = gl.getUniformLocation(
    ctx.shaderProgram,
    "uProjectionMatrix"
  );
  console.log(ctx);
}

/**
 * Draw the scene.
 */
function draw() {
  "use strict";
  console.log("Drawing");
  var modelViewMatrix = mat4.create();
  var projectionMatrix = mat4.create();

  gl.clear(gl.COLOR_BUFFER_BIT | gl . DEPTH_BUFFER_BIT);

  // set the matrices from the scene
  mat4.lookAt(
    modelViewMatrix,
    scene.eyePosition,
    scene.lookAtPosition,
    scene.upVector
  );
  //mat4.lookAt(modelViewMatrix, [2, 2, -5], [0, 0, 0], [0, 1, 0]);

  mat4.perspective(
    projectionMatrix,
    glMatrix.toRadian(40),
    gl.drawingBufferWidth / gl.drawingBufferHeight,
    scene.nearPlane,
    scene.farPlane
  );
  //mat4.ortho(projectionMatrix, -2, 2, -2, 2, -10, 10);

  mat4.rotate(modelViewMatrix, modelViewMatrix, scene.angle, [1, 1, 0]);
  gl.uniformMatrix4fv(ctx.uModelViewMatrixId, false, modelViewMatrix);
  gl.uniformMatrix4fv(ctx.uProjectionMatrixId, false, projectionMatrix);

  drawingObjects.wiredCube.draw(gl, ctx.aVertexPositionId, ctx.aVertexColorId);
}

var first = true;
var lastTimeStamp = 0;
function drawAnimated(timeStamp) {
  var timeElapsed = 0;
  if (first) {
    lastTimeStamp = timeStamp;
    first = false;
  } else {
    timeElapsed = timeStamp - lastTimeStamp;
    lastTimeStamp = timeStamp;
  }
  // calculate time since last call
  // move or change objects
  console.log(timeElapsed);
  scene.angle += timeElapsed * scene.angularSpeed;
  if (scene.angle > 2.0 * Math.PI) {
    scene.angle -= 2.0 * Math.PI;
  }
  console.log(scene.angle);
  draw();
  // request the next frame
  window.requestAnimationFrame(drawAnimated);
}
