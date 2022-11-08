class Board {
  static numBoards = 0;

  constructor(width) {
    this.board = Board.numBoards++;
    this.width = width;
    $("#board").useTemplate();
    this.elem = $("#boards").children(".board").last();
    this.tiles = {}; // { pos number: tile Tile }
  }

  chooseRandomTile() {
    let probTab = [];

    for (let i = 0; i < Math.pow(this.width, 2); ++i) {
      let tile = this.getTileByIndex(i);
      let weight = (tile ? tile.data.upgrades.pick : PROB_RANDTICK_TILE_EMPTY);

      probTab.push({weight: weight, item: i});
    }

    return weightedRandom(probTab);
  }

  getTile(x, y) {
    return this.getTileByIndex(new Vec2(x, y).flatten(this.width));
  }

  getTileByIndex(n) {
    return this.tiles[n];
  }

  setTile(x, y, level, data) {
    this.setTileByIndex(new Vec2(x, y).flatten(this.width), level, data);
  }

  setTileByIndex(n, level, data) {
    const elem = this.elem.children().eq(n);
    let t = new Tile(level, data, elem);
  
    if (this.getTileByIndex(n) !== undefined) {
      this.getTileByIndex(n).copyFrom(t);
    }
    else {
      this.tiles[n] = t;
    }
  }

  removeTile(x, y) {
    this.removeTileByIndex(new Vec2(x, y).flatten(this.width));
  }

  removeTileByIndex(n) {
    this.getTileByIndex(n).elem.empty();
    delete this.tiles[n];
  }

  update() {
    for (const [pos, tile] of Object.entries(this.tiles)) {
      tile.update(this.board, this.width, pos.x, pos.y);
    }
  }

  toJSON() {
    return {
      width: this.width,
      tiles: this.tiles,
    };
  }
}

class Tile {
  constructor(level, data, elem) {
    this.level = level;
    this.data = data;
    this.elem = elem;
  }

  copyFrom(other) {
    this.level = other.level;
    this.data = other.data;

    return this;
  }

  update() {
    this.elem.html(this.level);
  }

  toJSON() {
    return {
      level: this.level,
      data: this.data,
    };
  }
}