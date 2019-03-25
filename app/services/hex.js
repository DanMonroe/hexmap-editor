import Service from '@ember/service';
import { Hex } from '../objects/hex';
import {assert} from '@ember/debug';

export default class HexService extends Service {

  generateMapFromHexSize(size) {
    let map = [];
    let rows = (size * 2) + 1;
    let cols = (size * 2) + 1;
    let mapArraySize = rows;

    for (let row = 0; row < rows; row++) {
      map[row] = [];
      for (let col = 0; col < cols; col++) {
        map[row][col] = null;
      }
    }

    for (let row = 0; row < rows; row++) {
      let startCol = Math.max(size - row, 0);
      let endCol = cols - Math.max(row-size, 0)

      for (let col = startCol; col < endCol; col++) {

        let id = ( col * mapArraySize) + row;
        let mapObj = {
          id: id,
          col: col,
          row: row
        };
          // t: 0
        // path: {}

// console.log('id', id, mapObj);

        map[row][col] = mapObj;
      }
    }

    return map;
  }

  createHexesFromMap(map) {
    assert('Map array MUST be odd lengths to have a hexagonal shape.',(map.length % 2 === 1) && (map[0].length % 2 === 1));

    let hexes = [];
    let size = ((map.length -1) / 2);

    for (let q_column = -size; q_column <= size; q_column++) {

      let r1 = Math.max(-size, -q_column-size);
      let r2 = Math.min(size, -q_column+size);

      for (let row = r1; row <= r2; row++) {

        let mapObject = map[row+size][q_column+size];
        mapObject.q = q_column;
        mapObject.r = row;
        mapObject.s = -q_column-row;

        // console.log(row+size, q_column+size, mapObject);

        hexes.push(new Hex({
          id:mapObject.id,
          q:q_column,
          r:row,
          s:-q_column-row,
          map:mapObject
        }));
      }
    }
    return hexes;
  }

  generateHexShape(size) {
    let hexes = [];
    let id = 0;
    for (let q = -size; q <= size; q++) {
      let r1 = Math.max(-size, -q-size);
      let r2 = Math.min(size, -q+size);
      for (let r = r1; r <= r2; r++) {
        hexes.push(new Hex({q:q, r:r, s:-q-r, id:id}));
        id++;
      }
    }
    return hexes;
  }

  exportMapFromMapArray (mapArray) {
    let mapLength = mapArray.length;
    // mapLength is a square array

    let mapText = '\n[';
    for (let row = 0; row < mapLength; row++) {
      mapText += '[\n';
      for (let col = 0; col < mapLength; col++) {
        if (col > 0) {
          mapText += ',';
        }
        let mapObj = mapArray[row][col];
        if(mapObj === null) {
          mapText += 'null\n';
        } else {
          mapText += `{id: ${mapObj.id},col: ${mapObj.col},row: ${mapObj.row}}`
          // mapText += JSON.stringify(mapObj);
        }

        mapText += '\n';
      }
      mapText += ']\n';
    }
    mapText += '\n]';

    return mapText;
  }

  drawHex(ctx, layout, hex, fillStyle) {
    let corners = layout.polygonCorners(hex);
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    if (fillStyle) {
      ctx.fillStyle = fillStyle;
    }
    ctx.moveTo(corners[5].x, corners[5].y);
    for (let i = 0; i < 6; i++) {
      ctx.lineTo(corners[i].x, corners[i].y);
    }
    ctx.stroke();
  }

  drawHexLabel(ctx, layout, hex) {
    let center = layout.hexToPixel(hex);
// console.log('center', center);
    ctx.fillStyle = this.colorForHex(hex);
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    // ctx.fillText((hex.map.id + " " + hex.map.t), center.x, center.y-7);
    // ctx.fillText((hex.q + "," + hex.r), center.x, center.y+8);
    ctx.fillText((hex.id + ": " + hex.q + "," + hex.r + "," + hex.s), center.x, center.y);
    // ctx.fillText(hex.len() === 0? "0: q,r,s" : (hex.id + ": " + hex.q + "," + hex.r + "," + hex.s), center.x, center.y);
  }

  colorForHex(hex) {
    // Match the color style used in the main article
    if (hex.q === 0 && hex.r === 0 && hex.s === 0) {
      return "hsl(0, 50%, 0%)";
    } else if (hex.q === 0) {
      return "hsl(90, 70%, 35%)";
    } else if (hex.r === 0) {
      return "hsl(200, 100%, 35%)";
    } else if (hex.s === 0) {
      return "hsl(300, 40%, 50%)";
    } else {
      return "hsl(0, 0%, 50%)";
    }
  }
}
