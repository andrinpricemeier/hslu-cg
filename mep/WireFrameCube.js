export function WireFrameCube(gl, color) {
  function defineVertices(gl) {
    // define the vertices of the cube
    var vertices = [
      0.3, 0.3, 0.3, // 0, front-left-bottom
      0.3, 0.7, 0.3, // 1, front-left-top
      0.7, 0.3, 0.3, // 2, front-right-bottom
      0.7, 0.7, 0.3, // 3, front-right-top
      
      0, 0.3, 0.7, // 4, back-left-bottom
      0, 0.7, 0.7, // 5, back-left-top
      1, 0.3, 0.7, // 6, back-right-bottom
      1, 0.7, 0.7, // 7, back-right-top
    ];
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    return buffer;
  }
  function defineEdges(gl) {
    // define the edges for the cube , there are 12 edges in a cube
    var vertexIndices = [
      0, 2,
      0, 1,
      0, 4,
      1, 3,
      1, 5,
      2, 3,
      2, 6,
      3, 7,
      4, 5,
      4, 6,
      6, 7,
      5, 7
    ];
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(vertexIndices),
      gl.STATIC_DRAW
    );
    return buffer;
  }
  return {
    bufferVertices: defineVertices(gl),
    bufferEdges: defineEdges(gl),
    color: color,
    draw: function (gl, aVertexPositionId, aVertexColorId) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertices);
      gl.vertexAttribPointer(aVertexPositionId, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(aVertexPositionId);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferEdges);
      gl.drawElements(gl.LINES, 24 /* Anzahl Indices */, gl.UNSIGNED_SHORT, 0);
    },
  };
}
