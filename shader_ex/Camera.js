export class Camera {
    constructor(matrixId, normalMatrixId) {
        this.matrixId = matrixId;
        this.normalMatrixId = normalMatrixId;
    }

    draw(gl) {
        const viewMatrix = mat4.create();
        mat4.lookAt(viewMatrix, [-2, 2, 5], [0, 0, 0], [0, 1, 0]);
        gl.uniformMatrix4fv(this.matrixId, false, viewMatrix);  
        const normalMatrix = mat3.create();
        mat3.normalFromMat4(normalMatrix, viewMatrix);
        gl.uniformMatrix3fv(this.normalMatrixId, false, normalMatrix);
    }
}