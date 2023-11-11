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
    aVertexPositionId : -1,
    aVertexPositionId2 : -1,
    colorId1 : -1,
    colorId2: -1
};

// we keep all the parameters for drawing a specific object together
var rectangleObject = {
    buffer: -1,
    buffer2: -1
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
    ctx.shaderProgram = loadAndCompileShaders(gl, 'VertexShader.glsl', 'FragmentShader.glsl');
    setUpAttributesAndUniforms();
    setUpBuffers();

    // set the clear color here
    gl.clearColor(0.5,0.5,0.6,1);
    
    // add more necessary commands here
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms(){
    "use strict";
    // finds the index of the variable in the program
    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition")
    ctx.colorId = gl.getUniformLocation(ctx.shaderProgram, "color");
    ctx.aVertexPositionId2 = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition2")
    ctx.colorId2 = gl.getUniformLocation(ctx.shaderProgram, "color2");
}

/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */
function setUpBuffers(){
    "use strict";
    rectangleObject.buffer = gl.createBuffer();
    var vertices = [
        0, 0,
        0.2, 0,
        0.2, 0.2,
        0, 0.2,        
        0.5, 0,
        0.6, 0,
        0.6, 0.3,
        0.5, 0.3
    ];
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer) ;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices) , gl.STATIC_DRAW);

    rectangleObject.buffer2 = gl.createBuffer();
    var vertices2 = [
        0.4, 0,
        0.4, 0,
        0.4, 0.4,
        0, 0.4
    ];
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer2) ;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices2) , gl.STATIC_DRAW);
}

/**
 * Draw the scene.
 */
function draw() {
    "use strict";
    console.log("Drawing");
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform4fv(ctx.colorId, [0, 1, 0, 1]);
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer) ;
    gl.vertexAttribPointer(ctx.aVertexPositionId, 2, gl.FLOAT , false , 0, 0) ;
    gl.enableVertexAttribArray(ctx.aVertexPositionId);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    gl.uniform4fv(ctx.colorId, [0, 0, 1, 1]);
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
}