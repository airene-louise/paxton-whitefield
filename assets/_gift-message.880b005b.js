// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"fOCDi":[function(require,module,exports) {
var _ThemeVars_giftMessage;
const { ThemeVars } = window;
const GiftMessage = {
    config: {
        giftMessageCanvasId: "giftCanvas",
        giftMessageInputId: "giftMessage",
        giftMessageImage: (ThemeVars === null || ThemeVars === void 0 ? void 0 : (_ThemeVars_giftMessage = ThemeVars.giftMessage) === null || _ThemeVars_giftMessage === void 0 ? void 0 : _ThemeVars_giftMessage.image) || null
    },
    state: {
        canvas: null,
        ctx: null,
        textInput: null,
        image: null
    },
    init () {
        const { giftMessageCanvasId, giftMessageInputId } = this.config;
        this.state.canvas = document.getElementById(giftMessageCanvasId);
        this.state.textInput = document.getElementById(giftMessageInputId);
        if (!this.state.canvas || !this.state.textInput) {
            console.error("GiftMessage: Canvas or input element not found");
            return;
        }
        this.state.ctx = this.state.canvas.getContext("2d");
        if (this.config.giftMessageImage) {
            this.state.image = new Image();
            this.state.image.src = this.config.giftMessageImage;
            this.state.image.onload = ()=>this.drawCanvas();
        } else this.drawCanvas();
        this.state.textInput.addEventListener("input", ()=>this.drawCanvas());
    },
    drawCanvas () {
        const { canvas, ctx, textInput, image } = this.state;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (image) ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        const textContainerWidth = canvas.width - 20;
        const textX = canvas.width / 2;
        const lineHeight = 50;
        const yPosition = 120;
        const fontStack = '40px "Libre Baskerville", "Times New Roman", serif';
        this.drawAndMeasureText(ctx, textInput.value, fontStack, textX, yPosition, textContainerWidth, lineHeight);
    },
    wrapText (context, text, x, y, maxWidth, lineHeight) {
        const paragraphs = text.split("\n");
        let line = "";
        paragraphs.forEach((paragraph)=>{
            const words = paragraph.split(" ");
            words.forEach((word)=>{
                const testLine = line + word + " ";
                const { width: testWidth } = context.measureText(testLine);
                if (testWidth > maxWidth && words.indexOf(word) > 0) {
                    context.fillText(line, x, y);
                    line = word + " ";
                    y += lineHeight;
                } else line = testLine;
            });
            context.fillText(line, x, y);
            line = "";
            y += lineHeight;
        });
        context.fillText(line, x, y);
    },
    drawAndMeasureText (ctx, text, font, x, y, maxWidth, lineHeight) {
        ctx.font = font;
        this.wrapText(ctx, text, x, y, maxWidth, lineHeight);
        const words = text.split(" ");
        let line = "";
        let newY = y;
        words.forEach((word, n)=>{
            const testLine = line + word + " ";
            const { width: testWidth } = ctx.measureText(testLine);
            if (testWidth > maxWidth && n > 0) {
                line = word + " ";
                newY += lineHeight;
            } else line = testLine;
        });
        newY += lineHeight;
        return newY;
    }
};
if (ThemeVars.template.name === "cart") GiftMessage.init();

},{}]},[], null, "parcelRequiree216")

