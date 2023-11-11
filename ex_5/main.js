//
// DI Computer Graphics
//
// WebGL Exercises
//
//
//
import { SolidCube } from "./SolidCube.js";
import { SolidSphere } from "./SolidSphere.js";
// Register function to call after document has loaded
window.onload = startup;

// the gl object is saved globally
var gl;

// we keep all local parameters for the program in a single object
var ctx = {
  shaderProgram: -1,
  aVertexPositionId: -1,
  aVertexColorId: -1,
  uViewMatrixId: -1,
  uModelMatrixId: -1,
  uProjectionMatrixId: -1,
  aVertexTextureCoord: -1,
  uSampler2DId: -1,
  uEnableTextureId: -1,
  uEnableLightningId: -1,
  aVertexNormalId: -1,
  uNormalMatId: -1,
  uLightPositionId: -1,
  uLightColorId: -1
};

let angle = 0;
let angularSpeed = (0.1 * 2 * Math.PI) / 1000.0;

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
  const viewMatrix = mat4.create();
  const newMat = mat4.lookAt(viewMatrix, [10, 10, 30], [0, 0, 0], [0, 1, 0]);
  console.log(newMat);
  initGL();
  loadTexture();
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
  ctx.aVertexColorId = gl.getAttribLocation(ctx.shaderProgram, "aVertexColor");  
  ctx.uViewMatrixId = gl.getUniformLocation(
    ctx.shaderProgram,
    "uViewMatrix"
  ); 
  ctx.uModelMatrixId = gl.getUniformLocation(
    ctx.shaderProgram,
    "uModelMatrix"
  );
  ctx.uProjectionMatrixId = gl.getUniformLocation(
    ctx.shaderProgram,
    "uProjectionMatrix"
  );
  ctx.aVertexNormalId = gl.getAttribLocation(
    ctx.shaderProgram,
    "aVertexNormal"
  );
  ctx.aVertexTextureCoord = gl.getAttribLocation(
    ctx.shaderProgram,
    "aVertexTextureCoord"
  );
  ctx.uSampler2DId = gl.getUniformLocation(ctx.shaderProgram, "uSampler");
  ctx.uEnableTextureId = gl.getUniformLocation(
    ctx.shaderProgram,
    "uEnableTexture"
  ); 
  ctx.uEnableLightningId = gl.getUniformLocation(
    ctx.shaderProgram,
    "uEnableLighting"
  );
  ctx.uNormalMatId = gl.getUniformLocation(
    ctx.shaderProgram,
    "uNormalMatrix"
  );
  ctx.uLightColorId = gl.getUniformLocation(
    ctx.shaderProgram,
    "uLightColor"
  );
  ctx.uLightPositionId = gl.getUniformLocation(
    ctx.shaderProgram,
    "uLightPosition"
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
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  camera1();
  drawQuader();
  drawSphere();

  gl.viewport(100, 150, 300, 400);
}

function camera1() {
  gl.uniform3fv(
    ctx.uLightPositionId,
    [0, 10, 5]
  );
  gl.uniform3fv(ctx.uLightColorId, [1.0, 1.0, 1.0]);
  const viewMatrix = mat4.create();
  mat4.lookAt(viewMatrix, [-2, 2, 5], [0, 0, 0], [0, 1, 0]);
  gl.uniformMatrix4fv(ctx.uViewMatrixId, false, viewMatrix);  
  const normalMatrix = mat3.create();
  mat3.normalFromMat4(normalMatrix, viewMatrix);
  gl.uniformMatrix3fv(ctx.uNormalMatId, false, normalMatrix);
  const projectionMatrix = mat4.create();
  mat4.perspective(
    projectionMatrix,
    glMatrix.toRadian(40),
    gl.drawingBufferWidth / gl.drawingBufferHeight,
    0.1,
    30.0
  );  
  gl.uniform1i(ctx.uEnableLightningId, 1);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, lennaTxt.textureObj);
  gl.uniform1i(ctx.uSampler2DId, 0);
  gl.uniform1i(ctx.uEnableTextureId, 1);
  gl.uniformMatrix4fv(ctx.uProjectionMatrixId, false, projectionMatrix);
}

function drawQuader() {
  const cube = SolidCube(gl, [1.0, 0.0, 0.0], [1.0, 0.0, 0.0], [1.0, 0.0, 0.0], [1.0, 0.0, 0.0], [1.0, 0.0, 0.0], [1.0, 0.0, 0.0]);
  cube.draw(gl, ctx.aVertexPositionId, ctx.aVertexColorId, ctx.aVertexTextureCoord, ctx.aVertexNormalId, ctx.uModelMatrixId, angle);
}

function drawSphere() {
  const sphere = SolidSphere(gl, 100, 100, [0.0, 0.0, 1.0]);
  sphere.draw(gl, ctx.aVertexPositionId, ctx.aVertexColorId, ctx.aVertexNormalId, ctx.uModelMatrixId);
}

// keep texture parameters in an object so we can mix textures and objects
var lennaTxt = {
  textureObj: {},
};
/* *
 * Initialize a texture from an image
 * @param image the loaded image
 * @param textureObject WebGL Texture Object
 */
function initTexture(image, textureObject) {
  // create a new texture
  gl.bindTexture(gl.TEXTURE_2D, textureObject);
  // set parameters for the texture
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    gl.LINEAR_MIPMAP_NEAREST
  );
  gl.generateMipmap(gl.TEXTURE_2D);
  // turn texture off again
  gl.bindTexture(gl.TEXTURE_2D, null);
}
/* *
 * Load an image as a texture
 */
function loadTexture() {
  var image = new Image();
  // create a texture object
  lennaTxt.textureObj = gl.createTexture();
  image.onload = function () {
    initTexture(image, lennaTxt.textureObj);
    // make sure there is a redraw after the loading of the texture
    // draw();
    window.requestAnimationFrame(drawAnimated);
  };
  // setting the src will trigger onload
  image.src = "lena512.png";
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
  angle += timeElapsed * angularSpeed;
  if (angle > 2.0 * Math.PI) {
    angle -= 2.0 * Math.PI;
  }
  draw();
  // request the next frame
  window.requestAnimationFrame(drawAnimated);
}
