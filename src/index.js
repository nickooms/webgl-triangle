import "./style";
import { render } from "preact";
import { useRef, useEffect } from "preact/hooks";
import WebGLUtil from "./utils/webgl";

const webGL = new WebGLUtil();

// Define coordinates
const coordinates = [-1, -1, 0, 1, 1, -1];

// Write vertex shaders
const vertexShader = `#version 300 es
  precision mediump float;
  in vec2 position;

  void main () {
      gl_Position = vec4(position.x, position.y, 0.0, 1.0); // x,y,z,w
  }
`;

// Write fragment shaders
const fragmentShader = `#version 300 es
  precision mediump float;
  out vec4 color;

  void main () {
      color = vec4(0.7, 0.89, 0.98, 1.0); // r,g,b,a
  }
`;

export default function App() {
  const canvas = useRef();

  useEffect(() => {
    const gl = webGL.getGLContext(canvas.current, [0.47, 0.7, 0.78, 1]);
    const vs = webGL.getShader(gl, vertexShader, gl.VERTEX_SHADER);
    const fs = webGL.getShader(gl, fragmentShader, gl.FRAGMENT_SHADER);
    const program = webGL.getProgram(gl, vs, fs);
    const buffer = webGL.createAndBindBuffer(
      gl,
      gl.ARRAY_BUFFER,
      gl.STATIC_DRAW,
      new Float32Array(coordinates)
    );

    webGL.linkGPUAndCPU(gl, {
      program,
      gpuVariable: "position",
      channel: gl.ARRAY_BUFFER,
      buffer,
      dims: 2,
      dataType: gl.FLOAT,
      normalize: gl.FALSE,
      stride: 0,
      offset: 0
    });

    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }, []);

  return <canvas style={{ width: "100vw", height: "100vh" }} ref={canvas} />;
}

if (typeof window !== "undefined") {
  render(<App />, document.getElementById("root"));
}
