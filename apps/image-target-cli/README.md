# Image Target CLI

This CLI tool allows the creation of image targets in the format supported by the
[Offline Engine](https://8th.io/xrjs).

Note that this is a work in progress, only flat image targets are currently supported.

## Usage

```
git clone https://github.com/8thwall/8thwall.git
cd ./8thwall/apps/image-target-cli
npm install
node ./src/index.js
```

You will be prompted to enter an image path, select crop, and choose a folder/image target name. You can either use a default centered crop, or choose your crop dimensions according to this diagram:

![Diagram showing an original image dimension of 2000x2000, then a crop being applied by offsetting the top left corner by the top and left parameters, and reducing the width and height of the crop using width and height parameters](./docs/flat-diagram.jpg)

On generation, the following will be outputted:

- Metadata within a json file
- Original image
- Cropped image
- Thumbnail image (263x350)
- Luminance image (grayscale, 480x640)

Generated image targets can be loaded into the engine by adding this code to your project:

```
const onxrloaded = () => {
  XR8.XrController.configure({
    imageTargetData: [
      require('../image-targets/target1.json'),
      require('../image-targets/target2.json'),
    ],
  })
}
window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
```

The `imagePath` field of the json data will tell the engine where to load the tracked image, which
will have its features extracted and compared to the camera feed.
