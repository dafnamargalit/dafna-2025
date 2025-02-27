declare module "*.glb" {
    import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
    const value: GLTF;
    export default value;
  }