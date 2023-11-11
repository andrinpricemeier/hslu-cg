attribute vec2 aVertexPosition;

void main () {
    gl_Position = vec4(aVertexPosition[0], aVertexPosition[1], 0, 1);
}