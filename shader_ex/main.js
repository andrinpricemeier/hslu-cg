import { SolidCube } from "./SolidCube.js";
import { SolidSphere } from "./SolidSphere.js";
import { Camera } from "./Camera.js";
import { SceneLightning } from "./SceneLightning.js";
window.onload = startup;

var gl;

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
  uViewNormalMatId: -1,
  uModelNormalMatId: -1,
  uLightPositionId: -1,
  uLightColorId: -1
};

let angle = 0;
let angularSpeed = (0.1 * 2 * Math.PI) / 360.0;

function startup() {
  "use strict";
  var canvas = document.getElementById("myCanvas");
  gl = createGLContext(canvas);
  initGL();
  loadTexture();
}

function initGL() {
  "use strict";
  ctx.shaderProgram = loadAndCompileShaders(
    gl,
    "VertexShader.glsl",
    "FragmentShader.glsl"
  );
  setUpAttributesAndUniforms();
  gl.frontFace(gl.CCW);
  gl.cullFace(gl.BACK);
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0.5, 0.5, 0.5, 1);
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
  ctx.uViewNormalMatId = gl.getUniformLocation(
    ctx.shaderProgram,
    "uViewNormalMatrix"
  );
  ctx.uModelNormalMatId = gl.getUniformLocation(
    ctx.shaderProgram,
    "uModelNormalMatrix"
  );
}

function draw() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  drawScene();
  drawQuader();
  drawSphere();
}

function drawScene() {
  const lights = new SceneLightning();
  lights.setup(gl, ctx.shaderProgram);
  const camera = new Camera(ctx.uViewMatrixId, ctx.uViewNormalMatId);
  camera.draw(gl);
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
  gl.uniformMatrix4fv(ctx.uProjectionMatrixId, false, projectionMatrix);
}

function drawQuader() {
  gl.uniform1i(ctx.uEnableTextureId, 1);
  const cube = SolidCube(gl, [1.0, 0.0, 0.0], [1.0, 0.0, 0.0], [1.0, 0.0, 0.0], [1.0, 0.0, 0.0], [1.0, 0.0, 0.0], [1.0, 0.0, 0.0]);
  cube.draw(gl, ctx.aVertexPositionId, ctx.aVertexColorId, ctx.aVertexTextureCoord, ctx.aVertexNormalId, ctx.uModelMatrixId, ctx.uModelNormalMatId, angle);
}

function drawSphere() {
  gl.uniform1i(ctx.uEnableTextureId, 0);
  const sphere = SolidSphere(gl, 100, 100, [0.8, 0.0, 0.0]);
  sphere.draw(gl, ctx.aVertexPositionId, ctx.aVertexColorId, ctx.aVertexNormalId, ctx.uModelMatrixId, ctx.uModelNormalMatId, angle);
}

var lennaTxt = {
  textureObj: {},
};

function initTexture(image, textureObject) {
  gl.bindTexture(gl.TEXTURE_2D, textureObject);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    gl.LINEAR_MIPMAP_NEAREST
  );
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.bindTexture(gl.TEXTURE_2D, null);
}
/* *
 * Load an image as a texture
 */
function loadTexture() {
  var image = new Image();
  lennaTxt.textureObj = gl.createTexture();
  image.onload = function () {
    initTexture(image, lennaTxt.textureObj);
    window.requestAnimationFrame(drawAnimated);
  };
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
  angle += timeElapsed * angularSpeed;
  if (angle > 2.0 * Math.PI) {
    angle -= 2.0 * Math.PI;
  }
  draw();
  window.requestAnimationFrame(drawAnimated);
}
