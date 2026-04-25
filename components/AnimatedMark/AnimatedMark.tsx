import { useEffect, useRef } from "react";

type Props = {
  src?: string;
  className?: string;
  style?: React.CSSProperties;
  dotSize?: number;
  speed?: number;
};

const VERT = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const FRAG = `
precision mediump float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform float uTime;
uniform vec2 uAspect;
uniform float uDotSize;
uniform vec2 uResolution;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

// 4x4 Bayer matrix, computed so we can do ordered dithering
float bayer4(vec2 p) {
  vec2 q = mod(p, 4.0);
  float x = q.x;
  float y = q.y;
  // 4x4 Bayer pattern, normalized to 0..1
  if (y < 0.5) {
    if (x < 0.5) return  0.0 / 16.0;
    if (x < 1.5) return  8.0 / 16.0;
    if (x < 2.5) return  2.0 / 16.0;
    return              10.0 / 16.0;
  } else if (y < 1.5) {
    if (x < 0.5) return 12.0 / 16.0;
    if (x < 1.5) return  4.0 / 16.0;
    if (x < 2.5) return 14.0 / 16.0;
    return               6.0 / 16.0;
  } else if (y < 2.5) {
    if (x < 0.5) return  3.0 / 16.0;
    if (x < 1.5) return 11.0 / 16.0;
    if (x < 2.5) return  1.0 / 16.0;
    return               9.0 / 16.0;
  } else {
    if (x < 0.5) return 15.0 / 16.0;
    if (x < 1.5) return  7.0 / 16.0;
    if (x < 2.5) return 13.0 / 16.0;
    return               5.0 / 16.0;
  }
}

void main() {
  // Keep silhouette intact — sample the mark at the undisplaced UV
  vec2 uv = vec2(vUv.x, 1.0 - vUv.y);
  vec4 shape = texture2D(uTex, uv);
  if (shape.a < 0.05) { discard; }

  float t = uTime;
  vec2 p = (uv - 0.5) * uAspect;

  // Animated value driving the dither density — flowing noise + radial pulse
  float flow = fbm(p * 2.2 + vec2(t * 0.35, -t * 0.25));
  float pulse = sin(length(p) * 6.0 - t * 1.2) * 0.5 + 0.5;
  float value = mix(flow, pulse, 0.4);
  // Bias so dots tend toward "on" but still vary
  value = smoothstep(0.25, 0.85, value);

  // Ordered dither with a pixelated cell size, in device pixels
  vec2 cell = floor(gl_FragCoord.xy / max(uDotSize, 1.0));
  float threshold = bayer4(cell);

  float on = step(threshold, value);

  // Pair a solid-on state with a dim fallback so the shape never fully disappears
  float alpha = shape.a * mix(0.25, 1.0, on);

  gl_FragColor = vec4(shape.rgb, alpha);
}`;

export default function AnimatedMark({
  src = "/mark.svg",
  className,
  style,
  dotSize = 4,
  speed = 1,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      (canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: true }) as WebGLRenderingContext | null) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) return;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(program, "aPosition");

    const uTex = gl.getUniformLocation(program, "uTex");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uDotSize = gl.getUniformLocation(program, "uDotSize");
    const uAspect = gl.getUniformLocation(program, "uAspect");
    const uResolution = gl.getUniformLocation(program, "uResolution");

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(
      gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
      new Uint8Array([0, 0, 0, 0])
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    let texAspect = 1;
    let textureReady = false;

    const img = new window.Image();
    img.decoding = "async";
    img.onload = () => {
      const ar = img.naturalWidth / img.naturalHeight;
      const long = 1024;
      const off = document.createElement("canvas");
      if (ar >= 1) {
        off.width = long;
        off.height = Math.max(1, Math.round(long / ar));
      } else {
        off.height = long;
        off.width = Math.max(1, Math.round(long * ar));
      }
      const ctx = off.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, off.width, off.height);
      texAspect = ar;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, off);
      textureReady = true;
    };
    img.src = src;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let visible = true;
    const io = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? true;
    });
    io.observe(canvas);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    const start = performance.now();
    let raf = 0;
    const loop = (now: number) => {
      if (!visible || !textureReady) {
        raf = requestAnimationFrame(loop);
        return;
      }
      resize();
      const elapsed = ((now - start) / 1000) * speed * (reducedMotion ? 0 : 1);

      // Contain the texture within the canvas with correct aspect
      const canvasAspect = canvas.width / canvas.height;
      let ax = 1, ay = 1;
      if (canvasAspect > texAspect) {
        ax = canvasAspect / texAspect;
      } else {
        ay = texAspect / canvasAspect;
      }

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.uniform1i(uTex, 0);
      gl.uniform1f(uTime, elapsed);
      gl.uniform1f(uDotSize, dotSize);
      gl.uniform2f(uAspect, ax, ay);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      gl.deleteBuffer(buffer);
      gl.deleteTexture(tex);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [src, dotSize, speed]);

  return <canvas ref={canvasRef} className={className} style={style} aria-hidden="true" />;
}
