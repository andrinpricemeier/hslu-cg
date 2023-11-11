//
// DI Computer Graphics
//
// WebGL Exercises
//
import { WireFrameCube } from "./WireFrameCube.js";
// Register function to call after document has loaded
window.onload = startup;

// the gl object is saved globally
var gl;

// we keep all local parameters for the program in a single object
var ctx = {
  shaderProgram: -1,
  aVertexPositionId: -1,
  uColorId: -1,
  uModelViewMatrixId: -1,
  uProjectionMatrixId: -1,
};

// we keep all the parameters for drawing a specific object together
var rectangleObject = {
  buffer: -1,
  edgeBuffer: -1,
};

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
  "use strict";
  var canvas = document.getElementById("myCanvas");
  gl = createGLContext(canvas);
  initGL();
  draw();
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
  setUpBuffers();
  gl.frontFace(gl.CCW);
  gl.cullFace(gl.BACK);
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0.1, 0.1, 0.1, 1);
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
  ctx.uColorId = gl.getUniformLocation(ctx.shaderProgram, "uColor");
  ctx.uModelViewMatrixId = gl.getUniformLocation(
    ctx.shaderProgram,
    "uModelViewMatrix"
  );
  ctx.uProjectionMatrixId = gl.getUniformLocation(
    ctx.shaderProgram,
    "uProjectionMatrix"
  );
}

/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */
function setUpBuffers() {
  "use strict";
}

/**
 * Draw the scene.
 */
function draw() {
  "use strict";
  console.log("Drawing");
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const matrix = mat4.create();
  mat4.lookAt(matrix, [0.5, 0.5, -1], [0.5, 0.5, 0], [0, 1, 0]);
  gl.uniformMatrix4fv(ctx.uModelViewMatrixId, false, matrix);
  const projectionMatrix = mat4.create();
  //mat4.ortho(projectionMatrix, -0.5, 0.5, 0.0, 1.0, 2, 50);
  /*mat4.perspective(
    projectionMatrix,
    glMatrix.toRadian(120),
    gl.drawingBufferWidth / gl.drawingBufferHeight,
    1,
    10
  );*/
  mat4.frustum(
    projectionMatrix,
    -0.2,
    0.2,
    -0.2,
    0.2,
    0.2,
    50
  );
  gl.uniformMatrix4fv(ctx.uProjectionMatrixId, false, projectionMatrix);

  const cube = WireFrameCube(gl, [1.0, 1.0, 1.0, 0.5]);
  cube.draw(gl, ctx.aVertexPositionId, ctx.uColorId);
}
