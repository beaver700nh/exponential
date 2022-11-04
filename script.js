var game = new Game(500);

function main() {
  $("#btn-load").click(setupFromFile);
  $("#btn-new").click(setupFromScratch);
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
  $("#start").addClass("overlay-hidden");
  $("#start").children("button").prop("disabled", true);

  game.start(boards);
}

$(document).ready(main);
