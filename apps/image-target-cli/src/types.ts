interface ImageMetadata {
  width: number
  height: number
}

 type TargetMetadata = {
   left: number
   top: number
   width: number
   height: number
   isRotated?: boolean
   originalWidth: number
   originalHeight: number
   // topRadius?: number
   // bottomRadius?: number
   // targetCircumferenceTop?: number

   // cylinderSideLength?: number
   // cylinderCircumferenceTop?: number
   // cylinderCircumferenceBottom?: number

   // arcAngle?: number
   // coniness?: number
 }

type ReferencedResources = {
  originalImage: string
  croppedImage: string
  thumbnailImage: string
  luminanceImage: string
  geometryImage?: string
}

type ImageTargetData = {
  imagePath: string
  metadata: null
  name: string
  type: 'PLANAR' | 'CYLINDER' | 'CONICAL'
  properties: TargetMetadata
  resources: ReferencedResources
  created: number
  updated: number
}
interface CropGeometry {
  top: number
  left: number
  width: number
  height: number
  isRotated?: boolean
  originalWidth: number
  originalHeight: number
}

 type PlanarCropResult = {
   type: 'PLANAR'
   geometry: CropGeometry
 }
 type CylinderCropResult = {
   type: 'CYLINDER'
   geometry: CropGeometry
 }
 type ConicalCropResult = {
   type: 'CONICAL'
   geometry: CropGeometry
 }
 type CropResult =
  | PlanarCropResult
  | CylinderCropResult
  | ConicalCropResult
interface CliInterface {
  prompt(question: string): Promise<string>
  choose<T extends string>(
    question: string,
    options: T[],
    firstIsDefault?: boolean,
  ): Promise<T>
  confirm(question: string, defaultValue?: boolean): Promise<boolean>
  close(): void
  promptInteger(question: string): Promise<number>
  promptFloat(question: string): Promise<number>
}

type Point = {
  x: number
  y: number
}

/**
 * RGB color tuple: [R, G, B]
 */
type Color = [number, number, number]

/**
 * Pixel points describing cone geometry
 */
type ConePixelPoints = {
  tl: Point
  bl: Point
  tr: Point
  apex: Point
  theta?: number
  isFez?: boolean
}

/**
 * Data describing unconified geometry
 */
type UnconifiedData = {
  topRadius: number
  bottomRadius: number
  theta: number
  outputHeight: number
}

export type {
  CliInterface,
  CropGeometry,
  CropResult,
  ImageMetadata,
  ImageTargetData,
  ReferencedResources,
  TargetMetadata,
  Point,
  Color,
  ConePixelPoints,
  UnconifiedData,
}
