class Hacker {
  static infiniteMoney(amount) {
    game.data.levels = amount;
  }

  static tickWarp(speed, time) {
    const old = game.tickTime;
    game.tickTime = Math.round(1 / speed);

    window.setTimeout(() => game.tickTime = old, time);
  }
}