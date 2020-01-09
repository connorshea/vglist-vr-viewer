## aframe-stupid-vglist-vr-viewer-component

[![Version](http://img.shields.io/npm/v/aframe-stupid-vglist-vr-viewer-component.svg?style=flat-square)](https://npmjs.org/package/aframe-stupid-vglist-vr-viewer-component)
[![License](http://img.shields.io/npm/l/aframe-stupid-vglist-vr-viewer-component.svg?style=flat-square)](https://npmjs.org/package/aframe-stupid-vglist-vr-viewer-component)

A stupid VR viewer for your vglist library.

For [A-Frame](https://aframe.io).

### API

| Property | Description | Default Value |
| -------- | ----------- | ------------- |
|          |             |               |

### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.9.2/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-stupid-vglist-vr-viewer-component@1.0.0/dist/aframe-stupid-vglist-vr-viewer-component.min.js"></script>
</head>

<body>
  <a-scene>
    <a-entity stupid-vglist-vr-viewer="foo: bar"></a-entity>
  </a-scene>
</body>
```

#### npm

Install via npm:

```bash
npm install aframe-stupid-vglist-vr-viewer-component
```

Then require and use.

```js
require('aframe');
require('aframe-stupid-vglist-vr-viewer-component');
```
