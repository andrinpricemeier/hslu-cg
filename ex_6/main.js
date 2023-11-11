import { SolidCube } from "./solidCubeWithNormals.js";
window.onload = startup;
var gl;
var ctx = {
  shaderProgram: -1,
  aVertexPositionId: -1,
  aVertexColorId: -1,
  uModelViewMatrixId: -1,
  uProjectionMatrixId: -1,
  aVertexTextureCoord: -1,
  uSampler2DId: -1,
  uEnableTextureId: -1,
  uEnableLightingId: -1,
  uLightPositionId: -1,
  uLightColorId: -1,
  uNormalMatId: -1,
  vColorId: -1
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
  gl.clearColor(0.1, 0.1, 0.1, 1);
}

function setUpAttributesAndUniforms() {
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
  ctx.aVertexTextureCoord = gl.getAttribLocation(
    ctx.shaderProgram,
    "aVertexTextureCoord"
  );
  ctx.uSampler2DId = gl.getUniformLocation(ctx.shaderProgram, "uSampler");
  ctx.uEnableTextureId = gl.getUniformLocation(
    ctx.shaderProgram,
    "uEnableTexture"
  );
  ctx.uEnableLightingId = gl.getUniformLocation(
    ctx.shaderProgram,
    "uEnableLighting"
  );
  ctx.uLightPositionId = gl.getUniformLocation(
    ctx.shaderProgram,
    "uLightPosition"
  );
  ctx.uLightColorId = gl.getUniformLocation(ctx.shaderProgram, "uLightColor");
  ctx.uNormalMatId = gl.getUniformLocation(ctx.shaderProgram, "uNormalMat");
}

function draw() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.uniform3fv(
    ctx.uLightPositionId,
    new Float32Array([0, 10, -10])
  );
  gl.uniform3fv(ctx.uLightColorId, new Float32Array([1.0, 1.0, 1.0]));
  const modelViewMatrix = mat4.create();
  mat4.lookAt(modelViewMatrix, [0, 0, 0], [0, 0, 0], [0, 1, 0]);
  //mat4.rotate(modelViewMatrix, modelViewMatrix, angle, [1, 1, 0]);
  gl.uniformMatrix4fv(ctx.uModelViewMatrixId, false, modelViewMatrix);
  const normalMatrix = mat3.create();
  mat3.normalFromMat4(normalMatrix, modelViewMatrix);
  gl.uniformMatrix3fv(ctx.uNormalMatId, false, normalMatrix);
  gl.uniform1f(ctx.uEnableLightingId, 1);
  gl.uniform1f(ctx.uEnableTextureId, 0);
  const projectionMatrix = mat4.create();
  /*mat4.perspective(
    projectionMatrix,
    glMatrix.toRadian(40),
    gl.drawingBufferWidth / gl.drawingBufferHeight,
    0.1,
    30.0
  );*/
  
  mat4.ortho(projectionMatrix, -1.0, 1.0, -1.0, 1.0, -10, 10);
  gl.uniformMatrix4fv(ctx.uProjectionMatrixId, false, projectionMatrix);

  const cube = SolidCube(gl, [1.0, 0.0, 0.0], [1.0, 0.0, 0.0], [1.0, 0.0, 0.0], [1.0, 0.0, 0.0], [1.0, 0.0, 0.0], [1.0, 0.0, 0.0]);
  cube.draw(gl, ctx.aVertexPositionId, ctx.aVertexColorId, ctx.aVertexTextureCoord, ctx.uNormalMatId);
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
  angle += timeElapsed * angularSpeed;
  if (angle > 2.0 * Math.PI) {
    angle -= 2.0 * Math.PI;
  }
  draw();
  window.requestAnimationFrame(drawAnimated);
}
