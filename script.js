var game = new Game(INTERVAL_RANDTICK_INITIAL);

function main() {
  $("#btn-load").click(setupFromFile);
  $("#btn-new").click(setupFromScratch);

  $("#btn-play-pause").click(playPause);

  $("#btn-menu")      .click(() => $("#menu").removeClass("hidden"));
  $("#btn-menu-close").click(() => $("#menu").   addClass("hidden"));

  $("#btn-menu-save").click(game.download.bind(game));

  $("#btn-upgrade-close").click(closeTileUpgradeMenu);
}

function closeTileUpgradeMenu() {
  $("#upgrade-tile").addClass("hidden");
  $("#highlighter").addClass("hidden");
}

function setupFromFile() {
  $("#load-input").trigger("click");
}

function onSetupFileLoad() {
  let reader = new FileReader();

  reader.onload = function () {
    const json = JSON.parse(reader.result);

    $("#boards").children(".board").remove();
    Board.numBoards = 0;

    $("#btn-play-pause").children().addClass("hidden");
    $(json.running ? "span#pause" : "span#play").removeClass("hidden");

    constructObjectsFromJSON(json);
  }

  reader.onerror = function () {
    $(this).doErrorFlash(ERR_FLASH_DUR);
    console.log(reader.error);
  }.bind(this);

  reader.readAsText(this.files[0]);
}

function constructObjectsFromJSON(json) {
  let boards = [];

  for (const b of json.boards) {
    let board = new Board(b.width);

    for (const [p, t] of Object.entries(b.tiles)) {
      board.setTileByIndex(p, t.level, t.data);
    }

    board.update();
    boards.push(board);
  }

  game.tickTime = json.tickTime;
  game.running = json.running;
  game.data = json.data;

  setupFinish(boards);
}

function setupFromScratch() {
  let board = new Board(8);
  board.update();

  game.play();
  setupFinish([board]);
}

function setupFinish(boards) {
  $("#start").addClass("hidden");
  $("#start").children("button").prop("disabled", true);

  game.init(boards);
}

function playPause() {
  if ($("span#play").hasClass("hidden")) {
    game.pause();
  }
  else {
    game.play();
  }

  $(this).children().toggleClass("hidden");
}

$(document).ready(main);
