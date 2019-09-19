/*eslint no-unused-vars: 0*/

import FabricCanvasTool from "./fabrictool";

const fabric = require("fabric").fabric;

class Polygon extends FabricCanvasTool {
  constructor(props) {
    super(props);

    this.points = [];

    fabric.util.addListener(window, "dblclick", () => {
      this._lines.push(this.line);
      this.line = null;

      //create path from this.points

      let pathStr = `M ${this.points[0][0]} ${this.points[0][1]}`;
      this.points.forEach((pt, ix) => {
        if (ix == 0) return;
        pathStr += ` L ${pt[0]} ${pt[1]} `;
      });

      let path = new fabric.Path(pathStr + " z");
      path.set({ fill: "red", stroke: "green", opacity: 0.5 });

      this._canvas.add(path);

      this.points = [];
    });
  }

  configureCanvas(props) {
    let canvas = this._canvas;
    canvas.isDrawingMode = canvas.selection = false;
    canvas.forEachObject(o => (o.selectable = o.evented = false));
    this._width = props.lineWidth;
    this._color = props.lineColor;

    // canvas.add(this.path);

    this._lines = [];

    this._lineCounter = 0;
  }

  doMouseDown(o) {
    // capture starting point
    // draw line between SP and current
    // mousedown: capture endpoint, push line to lines array
    // start new line.

    // array of points
    // when click, add to array of points
    // draw line
    // when dblclick, draw path over points
    // erase lines

    if (this.line) {
      this._lines.push(this.line);
      this.line = null;
    }

    this.isDown = true;
    let canvas = this._canvas;
    var pointer = canvas.getPointer(o.e);
    var points = [pointer.x, pointer.y, pointer.x, pointer.y];
    this.line = new fabric.Line(points, {
      strokeWidth: this._width,
      fill: this._color,
      stroke: this._color,
      originX: "center",
      originY: "center",
      selectable: false,
      evented: false
    });

    this.points.push([pointer.x, pointer.y]);
    console.log("Added line", [pointer.x, pointer.y], this.points);

    canvas.add(this.line);
  }

  doMouseMove(o) {
    // if (!this.isDown) return;
    if (!this.line) return;

    let canvas = this._canvas;
    var pointer = canvas.getPointer(o.e);
    this.line.set({ x2: pointer.x, y2: pointer.y });
    this.line.setCoords();
    canvas.renderAll();
  }

  doMouseUp(o) {
    this.isDown = false;
  }

  doMouseOut(o) {
    this.isDown = false;
  }
}

export default Polygon;
