class Game {
  static SELL = {
    levelOnly: 0.5,
    levelTile: 0.75,
    tileData: {
      upgrades: {
        pick: 0.5,
      },
    },
  };

  constructor(initialTickTime) {
    this.tickTime = initialTickTime;
    this.running = false;
    this.boards = [];
    this.data = {
      levels: 0,
    };
  }

  play() {
    this.running = true;
  }

  pause() {
    this.running = false;
  }

  init(boards) {
    this.boards = boards;
    this.bindTileClickHandlers();

    window.setInterval(this.updateShopButton.bind(this), INTERVAL_LEVEL_COUNTER_UPDATE);
    window.setTimeout(this.clock.bind(this), this.tickTime);
  }

  bindTileClickHandlers() {
    for (const board of this.boards) {
      for (let index = 0; index < Math.pow(board.width, 2); ++index) {
        $(board.elem.children(".tile")[index]).onNClicks(
          this.onTileSingleClick(board, index),
          this.onTileDoubleClick(board, index),
        );
      }
    }
  }

  // Sell tile levels
  onTileSingleClick(board, index) {
    return function (event, elem) {
      let tile = board.getTileByIndex(index);
      if (!tile) return;

      this.data.levels += Math.round(tile.level * Game.SELL.levelOnly);
      tile.level = 0;
    }.bind(this);
  }

  // Sell entire tile
  onTileDoubleClick(board, index) {
    return function (event, elem) {
      let tile = board.getTileByIndex(index);
      if (!tile) return;

      const dataPrices = applyMap(tile.data, Game.SELL.tileData);

      const levelWorth = tile.level * Game.SELL.levelTile;
      const dataWorth = sumItems(objectValues(dataPrices));

      this.data.levels += Math.round(levelWorth + dataWorth);

      board.removeTileByIndex(index);
    }.bind(this);
  }

  clock() {
    this.tick();

    window.setTimeout(this.clock.bind(this), this.tickTime);
  }

  tick() {
    if (!this.running) {
      return;
    }

    this.incrementRandomTile();
  }

  incrementRandomTile() {
    for (const board of this.boards) {
      let idx = board.chooseRandomTile();
      let tile = board.getTileByIndex(idx);

      if (!tile) {
        board.setTileByIndex(idx, 0, {upgrades: {pick: PROB_RANDTICK_TILE_RANDTICK_SPAWNED}});
      }
      else if (tile.level < MAX_LEVEL_RANDTICK) {
        ++tile.level;
      }

      board.update();
    }
  }

  download() {
    const out = {
      tickTime: this.tickTime,
      running: this.running,
      boards: this.boards,
      data: this.data,
    };
    console.log(out);

    const blob = new Blob([JSON.stringify(out, null, "  ")]);
    const time = getCurrentTimeISO8601();

    downloadBlob(blob, `exponential-save-${time}.json`);
  }

  updateShopButton() {
    const level = (this.data.levels >>> 0).toString(2).length;

    $("span#level").text(this.data.levels ? level : 0);
    $("span#real").text(this.data.levels);
  }
}
