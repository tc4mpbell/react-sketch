/*eslint no-unused-vars: 0*/

import FabricCanvasTool from "./fabrictool";

const fabric = require("fabric").fabric;

class Polygon extends FabricCanvasTool {
  makePathStr() {
    let pathArr = ["M", this.points[0][0], this.points[0][1]];
    this.points.forEach((pt, ix) => {
      if (ix == 0) return;
      pathArr.push("L");
      pathArr.push(pt[0]);
      pathArr.push(pt[1]);
    });

    if (this._tempPts.length >= 0) {
      pathArr.push("L");
      pathArr.push(this._tempPts[0]);
      pathArr.push(this._tempPts[1]);
    }

    pathArr.push("z");

    return pathArr.join(" ");
  }

  constructor(props) {
    super(props);

    this.points = [];
    this._tempPts = []; // stores the temp endpt when moving the mouse around while drawing
    this._path = null;

    fabric.util.addListener(window, "dblclick", () => this.finishPath());
  }

  finishPath() {
    this.points = [];
    this._tempPts = [];
    this._path = null;
  }

  configureCanvas(props) {
    let canvas = this._canvas;
    canvas.isDrawingMode = canvas.selection = false;
    canvas.forEachObject(o => (o.selectable = o.evented = false));
    this._width = props.lineWidth;
    this._color = props.lineColor;
    this._fill = props.fillColor;
  }

  doMouseDown(o) {
    this.isDown = true;
    let canvas = this._canvas;
    var pointer = canvas.getPointer(o.e);

    this.points.push([pointer.x, pointer.y]);

    if (this._path) {
      canvas.remove(this._path);
    }

    this._path = new fabric.Path(this.makePathStr());
    this._path.set({
      fill: this._fill,
      strokeWidth: this._width,
      stroke: this._color
      // opacity: 0.5
    });
    canvas.add(this._path);
  }

  doMouseMove(o) {
    if (!this._path) return;

    let canvas = this._canvas;
    var pointer = canvas.getPointer(o.e);

    this._tempPts = [pointer.x, pointer.y];

    canvas.remove(this._path);

    this._path = new fabric.Path(this.makePathStr());
    this._path.set({
      fill: this._fill,
      strokeWidth: this._width,
      stroke: this._color
    });
    canvas.add(this._path);

    canvas.renderAll();
  }

  doMouseUp(o) {
    this.isDown = false;
  }

  doMouseOut(o) {
    // this.finishPath();
    this.isDown = false;
  }
}

export default Polygon;
