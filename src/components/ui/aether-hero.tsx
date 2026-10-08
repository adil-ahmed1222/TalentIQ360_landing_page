import { useEffect, useRef } from 'react';

// The fragment shader supplied for the AetherHero background.
const fragmentSource = `#version 300 es
precision highp float;
out vec4 O;
uniform float time;
uniform vec2 resolution;
#define FC gl_FragCoord.xy
#define R resolution
#define T time
#define S smoothstep
#define MN min(R.x,R.y)
float pattern(vec2 uv) {
  float d=.0;
  for (float i=.0; i<3.; i++) {
    uv.x+=sin(T*(1.+i)+uv.y*1.5)*.2;
    d+=.005/abs(uv.x);
  }
  return d;
}
vec3 scene(vec2 uv) {
  vec3 col=vec3(0.012,0.016,0.04);
  uv=vec2(atan(uv.x,uv.y)*2./6.28318,-log(length(uv))+T);
  vec3 deep=vec3(0.0,0.1,0.52);
  vec3 electric=vec3(0.08,0.26,0.96);
  vec3 purple=vec3(0.42,0.2,0.94);
  for (float i=.0; i<3.; i++) {
    float p=pattern(uv+i*6./MN);
    vec3 tint=mix(deep,electric,step(1.,i));
    tint=mix(tint,purple,step(2.,i));
    col+=tint*p;
  }
  return col;
}
void main() {
  vec2 uv=(FC-.5*R)/MN;
  vec2 p=uv;
  vec3 col=vec3(0.015,0.02,0.045);
  float s=12., e=9e-4;
  float grid=e/(sin(uv.x*s)*cos(uv.y*s));
  col+=vec3(0.2,0.4,0.98)*clamp(grid,0.,1.1);
  uv.y+=R.x>R.y?.5:.5*(R.y/R.x);
  col+=scene(uv);
  float vig=smoothstep(1.25,.2,length(p));
  col=mix(vec3(0.012,0.015,0.035),col,.42+.58*vig);
  O=vec4(clamp(col,0.,1.),1.);
}`;

const vertexSource = `#version 300 es
precision highp float;
in vec2 position;
void main(){ gl_Position = vec4(position, 0.0, 1.0); }
`;

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Aether shader:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function AetherHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext('webgl2', { alpha: false, antialias: false, powerPreference: 'low-power' });
    if (!canvas || !gl) return;

    const vertex = compile(gl, gl.VERTEX_SHADER, vertexSource);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
    if (!vertex || !fragment) {
      if (vertex) gl.deleteShader(vertex);
      if (fragment) gl.deleteShader(fragment);
      return;
    }

    const program = gl.createProgram();
    if (!program) { gl.deleteShader(vertex); gl.deleteShader(fragment); return; }
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Aether program:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return;
    }

    const buffer = gl.createBuffer();
    if (!buffer) { gl.deleteProgram(program); return; }
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    gl.useProgram(program);
    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const time = gl.getUniformLocation(program, 'time');
    const resolution = gl.getUniformLocation(program, 'resolution');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    let frame = 0;
    const draw = (now: number) => {
      gl.useProgram(program);
      gl.uniform2f(resolution, canvas.width, canvas.height);
      gl.uniform1f(time, reducedMotion.matches ? 0 : now * 0.00055);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!reducedMotion.matches) frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    const onMotionChange = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(draw); };
    reducedMotion.addEventListener('change', onMotionChange);

    return () => {
      cancelAnimationFrame(frame);
      reducedMotion.removeEventListener('change', onMotionChange);
      observer.disconnect();
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, []);

  return <canvas ref={canvasRef} className="aether-canvas" aria-hidden="true" />;
}