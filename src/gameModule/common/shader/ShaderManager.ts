/**
 * Created by Kurt on 2018/6/1.
 */
class ShaderManager {
    private static _instance:ShaderManager;
    private intervalKey:number = 0;

    public static get instance():ShaderManager {
        if (!ShaderManager._instance)
            ShaderManager._instance = new ShaderManager();
        return ShaderManager._instance;
    }

    public play(displayObj:egret.DisplayObject, customFilter:egret.CustomFilter, speedTime:number) {
        displayObj.filters = [customFilter];
        ShaderManager._instance.startInterval(speedTime);
    }

    public stop(displayObj:egret.DisplayObject) {
        displayObj.filters = null;
        egret.clearInterval(ShaderManager.instance.intervalKey);
    }

    private startInterval(speedTime:number):void {
        this.intervalKey = egret.setInterval(function () {
            customFilter1.uniforms.customUniform += 0.1;
            if (customFilter1.uniforms.customUniform > Math.PI * 2) {
                customFilter1.uniforms.customUniform = 0.0;
            }
            customFilter2.uniforms.time += 0.008;
            if (customFilter2.uniforms.time > 1) {
                customFilter2.uniforms.time = 0.0;
            }
            customFilter3.uniforms.time += 0.01;
            if (customFilter3.uniforms.time > 1) {
                customFilter3.uniforms.time = 0.0;
            }
            customFilter4.uniforms.offset += 0.01;
            if (customFilter4.uniforms.offset > 1) {
                customFilter4.uniforms.offset = 0.0;
            }
        }, this, speedTime);
    }

}



let vertexSrc =
    "attribute vec2 aVertexPosition;\n" +
    "attribute vec2 aTextureCoord;\n" +
    "attribute vec2 aColor;\n" +

    "uniform vec2 projectionVector;\n" +

    "varying vec2 vTextureCoord;\n" +
    "varying vec4 vColor;\n" +

    "const vec2 center = vec2(-1.0, 1.0);\n" +

    "void main(void) {\n" +
    "   gl_Position = vec4( (aVertexPosition / projectionVector) + center , 0.0, 1.0);\n" +
    "   vTextureCoord = aTextureCoord;\n" +
    "   vColor = vec4(aColor.x, aColor.x, aColor.x, aColor.x);\n" +
    "}";
let fragmentSrc1 =
    "precision lowp float;\n" +
    "varying vec2 vTextureCoord;\n" +
    "varying vec4 vColor;\n" +
    "uniform sampler2D uSampler;\n" +

    "uniform float customUniform;\n" +

    "void main(void) {\n" +
    "vec2 uvs = vTextureCoord.xy;\n" +
    "vec4 fg = texture2D(uSampler, vTextureCoord);\n" +
    "fg.rgb += sin(customUniform + uvs.x * 2. + uvs.y * 2.) * 0.2;\n" +
    "gl_FragColor = fg * vColor;\n" +
    "}";


var fragmentSrc2 = [
    "precision lowp float;",

    "varying vec2 vTextureCoord;",
    // "varying vec4 vColor;",

    "uniform float time;",
    "uniform sampler2D uSampler;",

    "void main() {",
    "vec3 p = (vec3(vTextureCoord.xy,.0) - 0.5) * abs(sin(time/10.0)) * 50.0;",
    "float d = sin(length(p)+time), a = sin(mod(atan(p.y, p.x) + time + sin(d+time), 3.1416/3.)*3.), v = a + d, m = sin(length(p)*4.0-a+time);",
    "float _r = -v*sin(m*sin(-d)+time*.1);",
    "float _g = v*m*sin(tan(sin(-a))*sin(-a*3.)*3.+time*.5);",
    "float _b = mod(v,m);",
    "float _a = 1.0;",
    "if(_r < 0.1 && _g < 0.1 && _b < 0.1) {",
    "_a = 0.0;",
    "}",
    "gl_FragColor = vec4(_r * _a, _g * _a, _b * _a, _a);",
    "}"
].join("\n");

let fragmentSrc3 = [
    "precision lowp float;\n" +
    "varying vec2 vTextureCoord;",
    "varying vec4 vColor;\n",
    "uniform sampler2D uSampler;",

    "uniform vec2 center;",
    "uniform vec3 params;", // 10.0, 0.8, 0.1"
    "uniform float time;",

    "void main()",
    "{",
    "vec2 uv = vTextureCoord.xy;",
    "vec2 texCoord = uv;",

    "float dist = distance(uv, center);",

    "if ( (dist <= (time + params.z)) && (dist >= (time - params.z)) )",
    "{",
    "float diff = (dist - time);",
    "float powDiff = 1.0 - pow(abs(diff*params.x), params.y);",

    "float diffTime = diff  * powDiff;",
    "vec2 diffUV = normalize(uv - center);",
    "texCoord = uv + (diffUV * diffTime);",
    "}",

    "gl_FragColor = texture2D(uSampler, texCoord);",
    "}"
].join("\n");

let fragmentSrc4 = [
    "precision lowp float;\n" +
    "varying vec2 vTextureCoord;",
    "varying vec4 vColor;\n",
    "uniform sampler2D uSampler;",

    "uniform float lineWidth;",
    "uniform float offset;",

    "void main()",
    "{",
    "vec2 uv = vTextureCoord.xy;",
    "vec2 texCoord = uv;",

    "float modPart = mod(vTextureCoord.y, lineWidth);",
    "float solidPart = (1.0 - offset) * lineWidth;",

    "if(modPart > solidPart) {",
    "gl_FragColor = texture2D(uSampler, texCoord);",
    "} else {",
    "gl_FragColor = vec4(0., 0., 0., 0.);",
    "}",


    "}"
].join("\n");
let customFilter1 = new egret.CustomFilter(
    vertexSrc,
    fragmentSrc1,
    {
        customUniform: 0
    }
);

let customFilter2 = new egret.CustomFilter(
    vertexSrc,
    fragmentSrc2,
    {
        time: 0
    }
);

let customFilter3 = new egret.CustomFilter(
    vertexSrc,
    fragmentSrc3,
    {
        center: {x: 0.5, y: 0.5},
        params: {x: 10, y: 0.8, z: 0.1},
        time: 0
    }
);

let customFilter4 = new egret.CustomFilter(
    vertexSrc,
    fragmentSrc4,
    {
        lineWidth: 0.1,
        offset: 0
    }
);
