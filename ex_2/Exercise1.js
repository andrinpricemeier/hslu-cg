//
// Computer Graphics
//
// WebGL Exercises
//

// Register function to call after document has loaded
window.onload = startup;

// the gl object is saved globally
var gl;

// we keep all local parameters for the program in a single object
var ctx = {
  shaderProgram: -1,
  aVertexPositionId: -1,
  aVertexTextureCoord: -1,
};

// we keep all the parameters for drawing a specific object together
var rectangleObject = {
  buffer: -1,
  textureBuffer: -1,
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

  // set the clear color here
  gl.clearColor(0.5, 0.5, 0.6, 1);

  // add more necessary commands here
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms() {
  console.log("set attributes");
  ("use strict");
  ctx.aVertexPositionId = gl.getAttribLocation(
    ctx.shaderProgram,
    "aVertexPosition"
  );
  console.log(ctx.aVertexPositionId);
  ctx.aVertexTextureCoord = gl.getAttribLocation(
    ctx.shaderProgram,
    "aVertexTextureCoord"
  );
}

/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */
function setUpBuffers() {
  "use strict";
  console.log("start up buffers");
  rectangleObject.textureBuffer = gl.createBuffer();
  var textureCoord = [
      0.0, 0.0, 
      0.0, 1.0, 
      1.0, 1.0, 
      1.0, 0.0
    ];
  gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.textureBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(textureCoord),
    gl.STATIC_DRAW
  );

  rectangleObject.buffer = gl.createBuffer();
  var vertices = [
      -0.5, -0.5, 
      -0.5, 0.5,
       0.5, 0.5, 
       0.5, -0.5];
  gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

/**
 * Draw the scene.
 */
function draw() {
  "use strict";
  console.log("Drawing");
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, lennaTxt.textureObj);
  gl.uniform1i(ctx.uSampler2DId, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
  gl.vertexAttribPointer(ctx.aVertexPositionId, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(ctx.aVertexPositionId);

  gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.textureBuffer);
  gl.vertexAttribPointer(ctx.aVertexTextureCoord, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(ctx.aVertexTextureCoord);

  console.log(ctx.aVertexPositionId);
  console.log(ctx.aVertexTextureCoord);

  gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
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
    draw();
  };
  // setting the src will trigger onload
  image.src = "lena512.png";
}
