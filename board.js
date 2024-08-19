class Board {
  static numBoards = 0;

  constructor(width) {
    this.board = Board.numBoards++;
    this.width = width;
    $("#board").useTemplate({});
    this.elem = $("#boards").children(".board").last();
    this.tiles = {}; // { pos number: tile Tile }
  }

  chooseRandomTile() {
    let probTab = [];

    for (let i = 0; i < this.width**2; ++i) {
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
  static UPGRADES = {
    pick:  {name: "Pick Me", price: (n) => 2**3 * n, desc: "Tile is more likely to be random-ticked."},
    dense: {name: "Dense",   price: (n) => 2**4 * n, desc: "Upgrade level...\n2: tile levels worth 2x\n4: tile levels worth 3x\n8: tile levels worth 4x\netc..."},
  };

  static UPGRADES_DEFAULT = {
    pick:  0,
    dense: 0,
  };

  constructor(level, data, elem) {
    this.level = level;
    this.elem = elem;

    this.data = {
      upgrades: {...Tile.UPGRADES_DEFAULT}, ...data,
    };
    console.log(this.data);
  }

  getUpgrades() {
    return Object.entries(this.data.upgrades).map(
      ([k, v]) => {
        const ug = Tile.UPGRADES[k];
        return new UpgradeData(ug.price(v), ug.name, k, v).get();
      }
    );
  }

  getUpgradeMap() {
    const ugs = this.getUpgrades();
    return ugs.map(
      (ug) => applyFnMap(ug, ([k, v]) => [`.upgrade-${k}`, v])
    );
  }

  doUpgrade(id) {
    ++this.data.upgrades[id];
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