import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

/* The brief references an AetherHero source file, but no shader source was attached.
   This original, lightweight field is a visual substitute until that source is provided. */
function Field() {
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uResolution: { value: new THREE.Vector2(1, 1) } }), []);
  useFrame(({ clock, size }) => {
    if (!material.current) return;
    const time = material.current.uniforms['uTime'];
    if (time) time.value = clock.elapsedTime;
    const resolution = material.current.uniforms['uResolution'];
    if (resolution) resolution.value.set(size.width, size.height);
  });
  return <mesh>
    <planeGeometry args={[2, 2]} />
    <shaderMaterial ref={material} uniforms={uniforms} depthWrite={false}
      vertexShader={`void main() { gl_Position = vec4(position, 1.0); }`}
      fragmentShader={`
        uniform float uTime;
        uniform vec2 uResolution;
        float line(vec2 p, float offset) {
          float y = sin(p.x * 5.2 + offset + uTime * .22) * .085 + sin(p.x * 12. + offset * 2. - uTime * .13) * .025;
          return exp(-abs(p.y-y-offset*.025)*95.);
        }
        void main() {
          vec2 uv = gl_FragCoord.xy / uResolution.xy;
          vec2 p = (gl_FragCoord.xy - .5*uResolution.xy) / min(uResolution.x,uResolution.y);
          vec3 bg = mix(vec3(.024,.038,.092), vec3(.018,.028,.061), uv.y);
          float veil = exp(-length((p-vec2(.32,-.16))*vec2(.95,1.5))*2.5);
          bg += vec3(.035,.092,.19)*veil;
          float glow = 0.;
          for(int i=0; i<19; i++) {
            float f = float(i);
            float x = p.x + f*.018;
            float ribbon = line(vec2(x, p.y - .08*sin(x*1.8+uTime*.12)), f*.13-1.2);
            glow += ribbon * (.36 + .3*sin(f*.33+uTime*.14));
          }
          bg += vec3(.055,.21,.48)*glow*.16;
          bg += vec3(.20,.10,.42)*glow*.08;
          float grid = (1.-smoothstep(.002,.005,abs(fract(p.x*15.)-.5)))*.014;
          bg += vec3(grid);
          gl_FragColor = vec4(bg,1.);
        }
      `}
    />
  </mesh>;
}

export default function AetherHero() {
  return <div className="aether-canvas" aria-hidden="true"><Canvas orthographic camera={{ position: [0, 0, 1], zoom: 1 }} dpr={[1, 1.5]} gl={{ antialias: false, powerPreference: 'low-power' }}><Field /></Canvas></div>;
}
