import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { Layout } from '../objects/layout';
import { Point } from '../objects/point';
import { inject as service } from '@ember/service';

export default class EditorComponent extends Component {

  @service ('hex') hexService;

  @tracked hexSize = 3;
  @tracked currentHexes = [];
  @tracked mapArray = [];

  @action
  generateHex() {
    console.log('generate', this.hexSize);

    this.mapArray = this.hexService.generateMapFromHexSize(this.hexSize);

    let newHexes = this.hexService.createHexesFromMap(this.mapArray);
    // let newHexes = this.hexService.generateHexShape(+this.hexSize);

    console.log('newHexes', newHexes);
    // let flat = Layout.FLAT;

    let layout = new Layout({
      orientation: Layout.FLAT,
      size: new Point({x:48, y:48}),
      origin: new Point({x:0, y:0})
    });

    let canvas = document.getElementById('hexcanvas');
    if (!canvas) { return; }

    let context = canvas.getContext('2d');
    let width = canvas.width;
    let height = canvas.height;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.translate(0, 0);

    // Store the current transformation matrix
//     context.save();
//
// // Use the identity matrix while clearing the canvas
//     context.setTransform(1, 0, 0, 1, 0, 0);
//     context.clearRect(0, 0, canvas.width, canvas.height);

// Restore the transform
//     context.restore();

    context.fillStyle = "hsl(60, 10%, 85%)";
    context.fillRect(0, 0, width, height);
    context.translate(width/2, height/2);
    newHexes.forEach((hex) => {
      this.hexService.drawHex(context, layout, hex);
      this.hexService.drawHexLabel(context, layout, hex);
      // if (withLabels) this.drawHexLabel(ctx, layout, hex);
      // if (withTiles) this.drawHexTile(ctx, layout, hex);
    });

    this.currentHexes = newHexes;
  }

  @action
  updateHexSize(event) {
    this.hexSize = +event.target.value;
  }

  @action
  exportHexes() {
    console.log('export', this.currentHexes);

    let mapText = this.hexService.exportMapFromMapArray(this.mapArray);

    document.getElementById('maparray').innerText = mapText;
  }
}
