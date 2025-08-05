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
})({"lp4O8":[function(require,module,exports) {
/**
 * This file handles logic relating to collection products infinite loading.
 */ const ThemeVars = window.ThemeVars;
const Quickshop = window.Quickshop;
const InfiniteLoading = {
    config: {
        gridSection: "products_grid",
        productsGridQuery: ".collection__products-grid",
        loadMoreButtonQuery: "[data-load-more]",
        paginatePagesQuery: "[data-paginate-pages]",
        productsViewedQuery: ".collection__viewed-products",
        paginateItemsCountQuery: "[data-paginate-items]" // Query of the hidden element that renders the paginate.items in the frontend
    },
    state: {
        page: 1,
        pages: 1
    },
    /**
   * Initializes the object if the collection has more than 1 page
   *  - Adds an event listener on the scroll event to load the pages
   *  - Adds an event listener on the filters to reset result pagination
   */ init: function() {
        this.setPaginationPages();
        if (this.state.pages > 1) {
            const loadMoreButton = document.querySelector(this.config.loadMoreButtonQuery);
            if (loadMoreButton) loadMoreButton.addEventListener("click", this.loadNextPage.bind(this));
            document.addEventListener("filtersApplied", this.resetPagination.bind(this));
        }
    },
    setPaginationPages: function() {
        const paginatePagesElement = document.querySelector(this.config.paginatePagesQuery);
        if (paginatePagesElement) this.state.pages = parseInt(paginatePagesElement.dataset.paginatePages);
    },
    /**
   * Loads a new page if the scroll is near the footer/bottom
   */ loadNextPage: async function() {
        this.state.page++;
        await this.loadPage();
        if (this.state.page === this.state.pages) {
            const loadMoreButton = document.querySelector(this.config.loadMoreButtonQuery);
            if (loadMoreButton) loadMoreButton.remove();
        }
        Quickshop.init();
    },
    /**
   * Sets page state to 1 and adds event listener on scroll
   */ resetPagination: function() {
        this.state.page = 1;
        window.addEventListener("scroll", this.boundLoadNextPage);
    },
    /**
   * Fetches the current page filtered if applied.
   */ loadPage: async function() {
        let filters = window.location.search + "&";
        if (filters == "&") filters = "?";
        const pageMarkup = await fetch(`${filters}section_id=${this.config.gridSection}&page=${this.state.page}`).then((response)=>response.text());
        if (pageMarkup) this.updateGrid(pageMarkup);
    },
    /**
   * Updates the grid section with the markup returned from the API.
   * @param {String} markup - The new grid markup
   * @returns {void}
   */ updateGrid: function(markup) {
        const currentGridElement = document.querySelector(this.config.productsGridQuery);
        if (!currentGridElement) return console.error("replaceGrid: Could not find grid element.");
        const hiddenElements = currentGridElement.querySelectorAll(".hide");
        for(let i = 0; i < hiddenElements.length; i++)hiddenElements[i].classList.remove("hide");
        let newGridElement = document.createElement("div");
        newGridElement.innerHTML = markup;
        newGridElement = newGridElement.querySelector(`.shopify-section.${this.config.gridSection}`);
        const productCards = newGridElement.querySelectorAll(".product-card");
        const promoBannerElement = !!currentGridElement.querySelector(".promo-banner");
        if (promoBannerElement && this.state.page !== this.state.pages) {
            productCards[productCards.length - 1].classList.add("hide");
            productCards[productCards.length - 2].classList.add("hide");
        }
        for(let i = 0; i < productCards.length; i++)currentGridElement.appendChild(productCards[i].cloneNode(true));
        Quickshop.init();
    }
};
if (ThemeVars && ThemeVars.template.name == "collection") InfiniteLoading.init();

},{}]},[], null, "parcelRequiree216")

