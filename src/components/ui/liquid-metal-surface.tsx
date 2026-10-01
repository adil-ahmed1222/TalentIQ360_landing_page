import { liquidMetalFragmentShader, ShaderMount } from '@paper-design/shaders';
import { useEffect, useRef } from 'react';

/** The supplied liquid-metal shader, mounted only while its button is visible. */
export function LiquidMetalSurface() {
  const surface = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const element = surface.current;
    if (!element) return;
    let mount: ShaderMount | undefined;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting && !mount) {
        try {
          mount = new ShaderMount(element, liquidMetalFragmentShader, {
            u_repetition: 4, u_softness: 0.5, u_shiftRed: 0.3,
            u_shiftBlue: 0.3, u_distortion: 0, u_contour: 0,
            u_angle: 45, u_scale: 8, u_shape: 1,
            u_offsetX: 0.1, u_offsetY: -0.1,
          }, undefined, reducedMotion.matches ? 0 : 0.6);
        } catch (error) {
          console.warn('Liquid metal effect unavailable:', error);
        }
      } else if (!entry?.isIntersecting && mount) {
        mount.dispose();
        mount = undefined;
      }
    });
    observer.observe(element);
    const onMotionChange = () => mount?.setSpeed(reducedMotion.matches ? 0 : 0.6);
    reducedMotion.addEventListener('change', onMotionChange);
    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener('change', onMotionChange);
      mount?.dispose();
    };
  }, []);
  return <span ref={surface} className="liquid-metal-surface" aria-hidden="true" />;
}