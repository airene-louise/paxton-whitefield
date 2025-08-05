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
})({"IewQI":[function(require,module,exports) {
/**
 * This file handles logic relating to collection filters.
 * You need to set up storefront filters in Online Store > Navigation.
 * NOTE: You cannot use both storefront filtering and tag filtering at the same time.
 */ var _utilsJs = require("./utils.js");
const ThemeVars = window.ThemeVars;
const Filter = {
    config: {
        gridSection: "products_grid",
        productsGridQuery: ".collection__products-grid",
        paginateItemsQuery: "[data-paginate-items]",
        productsCountQuery: "[data-products-count]",
        filterGroupQuery: ".filter-group",
        activeFilterCountQuery: "[data-active-filters-count]"
    },
    state: {
        filters: {},
        sortBy: false,
        page: false,
        productsCount: 0
    },
    /**
   * Initializes the filter object.
   *  - Will automatically apply filters from the URL.
   *  - Emits an event when init is complete.
   */ init: function() {
        const existingFilters = this.getFiltersFromUrl();
        this.state.sortBy = this.getSortBy();
        this.state.page = this.getPage();
        this.updateProductsCount();
        if (Object.keys(existingFilters).length > 0) {
            this.state.filters = existingFilters;
            this.applyFilters();
        }
        document.dispatchEvent(new CustomEvent("filtersReady"));
    },
    /**
   * Returns the filters from the URL as an object.
   * @returns {Object} The filters from the URL.
   */ getFiltersFromUrl: function() {
        const urlParams = new URLSearchParams(window.location.search);
        const filters = {};
        for (let [key, value] of urlParams)if (key.startsWith("filter")) filters[key] = value;
        return filters;
    },
    /**
   * Check if the url has sort_by parameters
   * @returns {boolean} - Whether or not sorting parameters are set.
   */ getSortBy: function() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get("sort_by") || false;
    },
    /**
   * Check if the url has page parameters
   * @returns {Boolean} - Whether or not the page parameter is set.
   */ getPage: function() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get("page") || false;
    },
    /**
   * Handles a submission of a filter form.
   * @param {Event} event The submit event
   *  - Prevent default behavior
   *  - Converts the filter inputs to an object
   *  - Applies the filters
   */ handleSubmit: function(event) {
        event.preventDefault();
        const form = event.target;
        this.state.filters = (0, _utilsJs.removeEmptyKeys)((0, _utilsJs.getParamsFromForm)(form));
        /*
     * The pagination page needs to be reset when changing filters
     * as the pagination changes depending on the selected filters
     */ this.state.page = false;
        this.applyFilters();
    },
    /**
   * Handles change of any of the form inputs
   * @param {Event} event The change event
   *  - Submits the form when a filter is selected
   */ handleInputChange: function(event) {
        const form = event.target.form;
        const groupList = event.target.closest(this.config.filterGroupQuery);
        const checkedCount = groupList.querySelectorAll("input[type=checkbox]:checked").length;
        const activeFitlersCounter = groupList.querySelectorAll(this.config.activeFilterCountQuery);
        activeFitlersCounter.forEach((counter)=>counter.innerHTML = checkedCount);
        form.requestSubmit();
    },
    /**
   * Handle the change event for the sort by selector.
   * - Gets current selector value.
   * - Adds the the selector value to the url as a new param.
   * @param {Event} event - The change event.
   */ handleSortBy: function(event) {
        const value = event.target.value;
        this.state.sortBy = value;
        this.applyFilters();
    },
    /**
   * Applies the filters to the grid section.
   */ applyFilters: async function() {
        let queryString = (0, _utilsJs.objectToQueryString)(this.state.filters, "?");
        if (this.state.page) queryString += `&page=${this.state.page}`;
        if (this.state.sortBy) queryString += `&sort_by=${this.state.sortBy}`;
        // Get peroducts grid markup
        const sectionMarkup = await fetch(`${queryString}&section_id=${this.config.gridSection}`).then((response)=>response.text());
        if (sectionMarkup) this.replaceGrid(sectionMarkup);
        // Update the URL with filters
        const cleanHref = window.location.pathname.split("?")[0];
        const newUrl = `${cleanHref}${queryString.length > 1 ? queryString : ""}`;
        window.history.pushState({
            "html": document.body.innerHTML,
            "pageTitle": `${document.title} - Filtered Products`
        }, "", newUrl);
        this.updateProductsCount();
        if (document.querySelector(".collection__load-more-wrapper")) {
            if (parseInt(this.state.productsCount) < 13) document.querySelector(".collection__load-more-wrapper").style.display = "none";
            else document.querySelector(".collection__load-more-wrapper").style.display = "block";
        }
        let loadCards = document.querySelectorAll(".product-card");
        Quickshop.init();
        loadCards.forEach(function(card) {
            const swatches = card.querySelectorAll(".product-card__swatches .swatch");
            const cardImg = card.querySelector(".product-card__original-image .product-card__image");
            const swatchTitle = card.querySelector(".product-card__swatches .swatch-title");
            const quickAdd = card.querySelector(".quick-add");
            swatches.forEach((swatch)=>{
                swatch.addEventListener("click", function(e) {
                    swatches.forEach((swatch)=>{
                        swatch.classList.remove("selected");
                    });
                    swatch.classList.add("selected");
                    const imageUrl = e.target.getAttribute("data-img");
                    const selectedSwatch = e.target.getAttribute("data-title");
                    const selectedVariant = e.target.getAttribute("data-variant-id");
                    if (imageUrl.includes("no-image-") === false) {
                        cardImg.setAttribute("src", imageUrl);
                        cardImg.setAttribute("srcSet", imageUrl);
                    }
                    swatchTitle.innerHTML = selectedSwatch;
                    quickAdd.setAttribute("data-quick-add", selectedVariant);
                });
            });
            const save = card.querySelector(".save");
            if (quickAdd) quickAdd.addEventListener("click", function() {
                const id = quickAdd.getAttribute("data-quick-add");
                Cart.addItem(id, 1);
            });
            if (save) save.addEventListener("click", function() {
                const id = save.getAttribute("data-wishlist");
                Wishlist.addProduct(id);
            });
        });
        document.dispatchEvent(new CustomEvent("filtersApplied"));
    },
    /**
   * Clears all filters on the grid section.
   */ clearAllFilters: async function() {
        // Clear filters and pagination
        this.state.filters = {};
        this.state.page = false;
        // Reset active filters counters
        const activeFitlersCounters = document.querySelectorAll(this.config.activeFilterCountQuery);
        activeFitlersCounters.forEach((counter)=>counter.innerHTML = 0);
        //get all .filter-group and remove class is-open
        const filterGroups = document.querySelectorAll(this.config.filterGroupQuery);
        filterGroups.forEach((group)=>group.classList.remove("is-open"));
        this.applyFilters();
        document.dispatchEvent(new CustomEvent("filtersCleared"));
    },
    /**
   * Replaces the grid section with the markup returned from the API.
   * @param {String} markup - The new grid markup
   * @returns {void}
   */ replaceGrid: function(markup) {
        // Get current products grid
        const currentGridElement = document.querySelector(this.config.productsGridQuery);
        if (!currentGridElement) return console.error("replaceGrid: Could not find grid element.");
        // Create new products grid using markup
        let newGridElement = document.createElement("div");
        newGridElement.innerHTML = markup;
        newGridElement = newGridElement.querySelector(`.shopify-section.${this.config.gridSection}`);
        currentGridElement.innerHTML = newGridElement.innerHTML;
        (0, _utilsJs.reloadScripts)(currentGridElement);
    },
    /**
   * Looks for the paginate items and renders the products count in all
   * counters in the DOM
   */ updateProductsCount: function() {
        const paginateItems = document.querySelector(this.config.paginateItemsQuery);
        if (paginateItems) {
            this.state.productsCount = paginateItems.dataset.paginateItems;
            const productCounters = document.querySelectorAll(this.config.productsCountQuery);
            productCounters.forEach((counter)=>{
                counter.innerHTML = this.state.productsCount;
            });
        }
    }
};
window.Filter = Filter;
if (ThemeVars && ThemeVars.template.name == "collection") Filter.init();

},{"./utils.js":"fP4IO"}]},[], null, "parcelRequiree216")

