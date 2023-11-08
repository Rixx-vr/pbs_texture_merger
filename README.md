# PBS Image Texture Combiner
## Introduction
This project serves as a versatile tool for game developers and artists working with Unity's Standard Shader particularly within the context of Resonite's Physically-Based Shading (PBS) Metallic Materials. It streamlines the process of merging various textures from different materials. The tool also facilitates the creation of composite textures suitable for use with Resonite's Color Splat Materials.

## Metallic Smooth Map
```mermaid

graph LR
  A[Metallic] -->|Red| D{Output Image}
  B[Roughness] -->C[Invert] -->|Alpha| D{Output Image}
```

## Color Splat
```mermaid

graph LR
  A[Texture 1 ] -->|Red| E{Output Image}
  B[Texture 2 ] -->|Green| E{Output Image}
  C[Texture 3 ] -->|Blue| E{Output Image}
  D[Texture 4 ] -->|Alpha| E{Output Image}

```

## Color Splat Metallic Map
```mermaid

graph LR
  A[Metallic 1] -->|Red| G{Output Image}
  B[Roughness 1] -->E[Invert] -->|Green| G{Output Image}
  C[Metallic 2] -->|Blue| G{Output Image}
  D[Roughness 3] -->F[Invert] -->|Alpha| G{Output Image}
```

## Color Splat Normal Map
```mermaid

graph LR
  A[Normal 1] -->B[Red] -->|Red| G{Output Image}
  A[Normal 1] -->C[Gren] -->|Green| G{Output Image}
  D[Normal 2] -->E[Red] -->|Blue| G{Output Image}
  D[Normal 2] -->F[Gren] -->|Alpha| G{Output Image}
```

## License
MIT License

Copyright (c) 2023 Rixx