var game = new Game(500);

function main() {
  $("#btn-load").click(setupFromFile);
  $("#btn-new").click(setupFromScratch);

  $("#btn-play-pause").click(playPause);

  $("#btn-menu")      .click(() => $("#menu").removeClass("hidden"));
  $("#btn-menu-close").click(() => $("#menu").   addClass("hidden"));

  $("#btn-menu-save").click(game.download.bind(game));
}

function setupFromFile() {
  alert("Error: Not supported yet.");

  setupFinish([]);
}

function setupFromScratch() {
  let board = new Board(8);
  board.update();

  setupFinish([board]);
}

function setupFinish(boards) {
  $("#start").addClass("hidden");
  $("#start").children("button").prop("disabled", true);

  game.start(boards);
}

function playPause() {
  if ($("#play").hasClass("hidden")) {
    game.pause();
  }
  else {
    game.play();
  }

  $(this).children().toggleClass("hidden");
}

$(document).ready(main);
