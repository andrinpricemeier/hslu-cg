precision mediump float;
varying vec3 vVertexColor;
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform bool uEnableTexture;
uniform bool uEnableLighting;
uniform vec3 uLightPosition;
uniform vec3 uLightColor;
varying vec3 vNormalEye;
varying vec3 vVertexPositionEye3;
const float ambientFactor = 1.0;
const float shininess = 7.0;
const vec3 specularMaterialColor = vec3(0.4, 0.4, 0.4);

void main() {
    vec3 baseColor = vVertexColor;
    if (uEnableTexture) {
        baseColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t)).rgb;
    }
    if (uEnableLighting) {
        vec3 ambientColor = ambientFactor * baseColor.rgb;

        vec3 lightDirectionEye = normalize(uLightPosition - vVertexPositionEye3);
        vec3 normal = normalize(vNormalEye);

        float diffuseFactor = 1.0;
        float cosTheta = clamp(dot(normal, lightDirectionEye), 0.0, 1.0);
        vec3 diffuseColor = baseColor.rgb * uLightColor * diffuseFactor * cosTheta;

        vec3 specularColor = vec3(0, 0, 0);
        if (diffuseFactor > 0.0) {
            vec3 reflectionDir = normalize(reflect(lightDirectionEye, normal));
            vec3 eyeDir = normalize(vVertexPositionEye3);
            float cosPhi = dot(reflectionDir, eyeDir);
            float specularFactor = 1.0;
            specularColor = specularFactor * uLightColor * specularMaterialColor * pow(cosPhi, shininess);
        }

        vec3 color = ambientColor + diffuseColor + specularColor;
        gl_FragColor = vec4(color, 1.0);
    } else {
        gl_FragColor = vec4(baseColor, 1.0);
    }
}