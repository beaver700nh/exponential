$.fn.useTemplate = function ($elem) {
  const $out = $elem ?? $(this).parent();
  $out.append($(this).html());
}

$.fn.onNClicks = function (...callbacks) {
  $(this).dblclick((e) => e.preventDefault());
  $(this).data("clickInfo", {repeats: 0, timer: null});

  $(this).click(
    function (event) {
      let info = $(this).data("clickInfo");

      ++info.repeats;
      clearTimeout(info.timer);

      info.timer = window.setTimeout(
        function (clicked) {
          callbacks[info.repeats - 1]?.(event, clicked);
          info.repeats = 0;
        },
        TIME_BETWEEN_DOUBLE_CLICK, this
      );
    }
  );
}

$.fn.doErrorFlash = function (duration) {
  const old = $(this).css("background-color");

  $(this).css("background-color", "var(--error)");

  window.setTimeout(() => $(this).css("background-color", old), duration);
}

class Vec2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  copyFrom(other) {
    this.x = other.x;
    this.y = other.y;

    return this;
  }

  flatten(width) {
    return width * this.y + this.x;
  }

  static add(u, v) {
    return Vec2(u.x + v.x, u.y + v.y);
  }
}

function isPrimitive(thing) {
  return thing !== Object(thing);
}

function sumItems(iterable) {
  return iterable.reduce(
    (acc, val) => acc + val, 0
  );
}

function weightedRandom(probTable) {
  let weights = [];

  for (const [i, prob] of Object.entries(probTable)) {
    weights.push(prob.weight + (weights[i - 1] || 0));
  }

  let random = Math.random() * weights[weights.length - 1];

  for (const [i, weight] of Object.entries(weights)) {
    if (weight > random) {
      return probTable[i].item;
    }
  }
}

function applyMap(thing, map) {
  let out = {};

  for (let [key, val] of Object.entries(thing)) {
    if (isPrimitive(val)) {
      out[key] = val * map[key];
    }
    else {
      out[key] = applyMap(val, map[key]);
    }
  }

  return out;
}

function objectValues(thing) {
  let values = [];

  for (const value of Object.values(thing)) {
    if (isPrimitive(value)) {
      values.push(value);
    }
    else {
      values.push(...objectValues(value));
    }
  }

  return values;
}

function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob);

  const link = $("<a />", {href: url, download: name});

  link.appendTo("body");
  link[0].dispatchEvent(
    new MouseEvent(
      "click", {
        bubbles: true,
        cancelable: true,
        view: window,
      }
    )
  );

  window.setTimeout(
    () => {
      URL.revokeObjectURL(url);
      link.remove();
    }, 100
  );
}

function getCurrentTimeISO8601() {
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60000;
  const shifted = new Date(date.getTime() - offset);

  return shifted.toISOString().replace(/([-:]|\..*$)/g, "");
}
