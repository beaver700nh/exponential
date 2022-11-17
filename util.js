$.fn.useTemplate = function (fillIns, $elem) {
  const $dest = $elem ?? $(this).parent();
  let $copy = $($(this).html());

  for (const [query, content] of Object.entries(fillIns)) {
    $copy.find(query).html(content);
  }

  $dest.append($copy);

  return $copy;
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

  return $(this);
}

$.fn.doErrorFlash = function (duration) {
  const old = $(this).css("background-color");

  $(this).css("background-color", "var(--error)");

  window.setTimeout(() => $(this).css("background-color", old), duration);

  return $(this);
}

$.fn.tileHalo = function (shouldEnable) {
  if (shouldEnable) {
    $("#boards").addClass("no-scroll");

    const rect = this[0].getBoundingClientRect();
    const [x1, x2, y1, y2] = [rect.left, rect.right, rect.top, rect.bottom];
    const X1 = window.innerWidth - rect.left;
    const X2 = window.innerWidth - rect.right;
    const Y1 = window.innerHeight - rect.top;
    const Y2 = window.innerHeight - rect.bottom;

    let hltrs = $(".highlighter");

    hltrs.eq(0).css({ top:  0, left:  0, right: X1, bottom: Y2 });
    hltrs.eq(1).css({ top:  0, left: x1, right:  0, bottom: Y1 });
    hltrs.eq(2).css({ top: y1, left: x2, right:  0, bottom:  0 });
    hltrs.eq(3).css({ top: y2, left:  0, right: X2, bottom:  0 });
    hltrs.eq(4).css({ top: y1, left: x1, right: X2, bottom: Y2 });

    $("#highlighter").removeClass("hidden");
  }
  else {
    $("#boards").removeClass("no-scroll");
    $("#highlighter").addClass("hidden");
  }

  return $(this);
}

$.fn.tileUpgradeGetData = function (which) {
  return $(this).children(`.upgrade-${which}`).text();
}

$.fn.tileUpgradeSetDatas = function (upgrades) {
  for (const [k, v] of Object.entries(upgrades)) {
    $(this).children(`.upgrade-${k}`).text(v);
  }

  return $(this);
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

class UpgradeData {
  constructor(price, button, id, counter) {
    this.data = {price, button, id, counter};
  }

  get(which) {
    if (which !== undefined) {
      return this.data[which];
    }
    else {
      return this.data;
    }
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

function applyFnMap(thing, fn) {
  return Object.fromEntries(Object.entries(thing).map(fn));
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
