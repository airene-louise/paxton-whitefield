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
})({"6VH5x":[function(require,module,exports) {
/**
 * Handles the logic for option swatches
 * 
 * document.addEventListener("swatchesReady", function() {
 *   new SwatchGroup({
 *     wrapper: ".some-swatch-wrapper",
 *     productData: {{ product | json }},
 *     swatchData: {{ product.metafields.swatches | json }},
 *     [OPTIONAL] allowUnavailableSelections: true
 *   });
 * });
 * 
 * If you assign the swatch group to a variable, you can access the
 * selectSwatchesFromUrl function.
 * e.g. let swatchGroup = new SwatchGroup({...});
 *      swatchGroup.selectSwatchesFromUrl();
 */ var _defineProperty = require("@swc/helpers/_/_define_property");
var _utilsJs = require("./utils.js");
const ThemeVars = window.ThemeVars;
class SwatchGroup {
    /**
   * Adds the swatch markup to the DOM and sets up event listeners
   */ addSwatchesToDOM() {
        const { wrapper, productData } = this;
        const productOptions = {
            option1: (0, _utilsJs.makeArrayUnique)(productData.variants.map((variant)=>variant.option1)),
            option2: (0, _utilsJs.makeArrayUnique)(productData.variants.map((variant)=>variant.option2)),
            option3: (0, _utilsJs.makeArrayUnique)(productData.variants.map((variant)=>variant.option3))
        };
        Object.keys(productOptions).forEach((optionPosition)=>{
            const optionName = productData.options[parseInt(optionPosition.replace("option", "")) - 1]; // e.g. Colour
            const optionValues = productOptions[optionPosition]; // e.g. ['Red', 'Blue', 'Green']
            if (optionName && optionValues.length) {
                const { markup, selector } = this.generateSwatches(optionName, optionPosition, optionValues);
                wrapper.insertAdjacentHTML("beforeend", markup);
                if (optionValues.length > 8 || this.swatchDropdown) wrapper.querySelector(".swatch-group__dropdown").addEventListener("change", this.handleDropdownChange.bind(this));
                else wrapper.querySelectorAll(selector).forEach((swatch)=>{
                    swatch.addEventListener("click", this.handleSwatchClick.bind(this));
                });
            }
        });
    }
    /**
   * Generates the markup for the swatches for a given option
   * @param {string} optionName - The name of the option e.g. Colour
   * @param {string} optionPosition - The position of the option e.g. option1
   * @param {array} optionValues - The values of the option e.g. ['Red', 'Blue', 'Green']
   * @returns {object} - An object containing the markup and a selector for this set of swatches
   */ generateSwatches(optionName, optionPosition, optionValues) {
        const selector = `swatch-${optionPosition}`;
        let markup;
        if (optionValues.length > 8 || this.swatchDropdown) {
            const dropdownItemsMarkup = optionValues.map((optionValue)=>{
                const variant = this.productData.variants.find((variant)=>variant[`option${optionPosition.replace("option", "")}`] === optionValue && variant.available);
                return variant ? `<option value="${variant.id}" data-option-value="${optionValue}">${optionValue}</option>` : "";
            }).join("\n");
            markup = `
        <div class="swatch-group__dropdown-wrapper">
          <select id="${selector}" class="swatch-group__dropdown">
            ${dropdownItemsMarkup}
          </select>
          <svg width="9" height="6" viewBox="0 0 9 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.5 1L4.5 5L8.5 1" stroke="black"/>
          </svg>
        </div>
      `;
        } else {
            const swatchItemsMarkup = optionValues.map((optionValue)=>{
                const swatchBackground = this.getSwatchBackground(optionValue);
                let swatchType;
                if (swatchBackground) swatchType = swatchBackground.includes("http") ? "image" : "colour";
                else swatchType = "text";
                const swatchBackgroundCss = swatchType === "image" ? `background-image: url(${swatchBackground});` : `background-color: ${swatchBackground};`;
                return `
          <div 
            data-selector="${selector}"
            style="${swatchBackgroundCss}" 
            data-option-index="${optionPosition}" 
            data-option-value="${optionValue}" 
            class="swatch-group__swatch swatch-group__swatch--${swatchType}">
            ${swatchType === "text" ? `<span>${optionValue}</span>` : ""}
          </div>
        `;
            }).join("\n");
            markup = `
        <div class="swatch-group">
          <div class="swatch-group__swatches">${swatchItemsMarkup}</div>
        </div>
      `;
        }
        return {
            markup,
            selector: optionValues.length > 8 ? `#${selector}` : `[data-selector="${selector}"]`
        };
    }
    /**
   * Handles the change event on a dropdown item
   *  - Sets the selected option for this swatch group
   *  - Updates the variant selector if a variant is selected and emits an event
   * @param {Event} event - The change event
   */ handleDropdownChange(event) {
        const dropdown = event.currentTarget;
        const optionValue = dropdown.selectedOptions[0].dataset.optionValue;
        const variantId = dropdown.value;
        const optionIndex = dropdown.id.replace("swatch-", "");
        this.selectedOptions[optionIndex] = optionValue;
        this.setSelectedVariant(this.getSelectedVariant());
        this.setUrlParams(this.getSelectedVariant());
    }
    /**
   * Handles the click event on a swatch item
   *  - Sets the selected option for this swatch group
   *  - Visibly selects the swatch item
   *  - Marks swatches that would be unavailable with this selection
   *  - Updates the variant selector if a variant is selected and emits an event
   * @param {object} event - The click event
   */ handleSwatchClick(event) {
        const swatchItem = event.currentTarget;
        const { optionIndex, optionValue } = swatchItem.dataset;
        this.selectedOptions[optionIndex] = optionValue;
        this.visiblySelectSwatch(swatchItem);
        this.setSelectedVariant(this.getSelectedVariant());
        this.setUrlParams(this.getSelectedVariant());
    }
    /**
   * Visibly selects a swatch item with a class and deselects all other sibling swatch items
   * @param {object} swatch - The swatch item to visibly select
   * @returns {function | void} - Either a console error or nothing
   */ visiblySelectSwatch(swatch) {
        if (!swatch) return console.error("SwatchGroup: Could not visibly select swatch, swatch does not exist.");
        const swatchClass = swatch.classList[0];
        const swatchSiblings = swatch.parentNode.querySelectorAll(`.${swatchClass}`);
        swatchSiblings.forEach((swatchSibling)=>{
            swatchSibling.classList.remove("selected");
        });
        swatch.classList.add("selected");
    }
    /**
   * Combines a recently selected swatch with all other relevant swatches
   * If this combination would be an unavailable variant, marks the swatch as unavailable
   * Otherwise marks the swatch as available
   * @param {object} selectedSwatch - The swatch that was just selected
   */ markUnavailableSwatches(selectedSwatch) {
        const swatchClass = selectedSwatch.classList[0];
        const allSwatches = this.wrapper.querySelectorAll(`.${swatchClass}`);
        allSwatches.forEach((swatch)=>{
            if (selectedSwatch.dataset.optionIndex != swatch.dataset.optionIndex) {
                const temporarySelections = {
                    ...this.selectedOptions
                };
                temporarySelections[swatch.dataset.optionIndex] = swatch.dataset.optionValue;
                const variant = this.getSelectedVariant(temporarySelections);
                if (variant && variant.dataset.available != "true") {
                    swatch.classList.add("unavailable");
                    if (!this.allowUnavailableSelections) swatch.classList.add("disabled");
                } else swatch.classList.remove("unavailable", "disabled");
            }
        });
    }
    /**
   * Gets the variant that matches some specific option selections
   * @param {object} selections - An object containing the selected options, defaults to the user's selections
   * @returns {HTMLElement} - The variant <option> that matches the selected options
   */ getSelectedVariant(selections = this.selectedOptions) {
        const variants = Array.from(this.variantSelector.querySelectorAll("option"));
        const selectedVariant = variants.find((variant)=>{
            return (variant.dataset["option-1"] === selections.option1 || variant.dataset["option-1"] == "null") && (variant.dataset["option-2"] === selections.option2 || variant.dataset["option-2"] == "null") && (variant.dataset["option-3"] === selections.option3 || variant.dataset["option-3"] == "null");
        });
        return selectedVariant;
    }
    /**
   * Sets the selected variant for the variant selector
   * Emits a variantChanged event if a variant is selected
   * @param {object} variant - The variant <option> to select
   */ setSelectedVariant(variant) {
        if (this.variantSelector && variant) {
            this.variantSelector.value = variant.value;
            this.variantName = variant.dataset.name;
            document.querySelector(".product__name").value = this.variantName;
            const variantChangedEvent = new CustomEvent("variantChanged", {
                detail: {
                    wrapper: this.wrapper,
                    variantName: this.variantName,
                    variant: this.variantSelector.value,
                    variantMediaPosition: variant.dataset.mediaPosition,
                    available: variant.dataset.available == "true"
                }
            });
            document.querySelector(".product__info-wrapper [data-price]").innerHTML = toMoneyString(variant.dataset.price);
            document.dispatchEvent(variantChangedEvent);
        }
    }
    /**
   * Get cheapest variant
   * @returns {string} - The cheapest variant id
   */ getCheapestVariant() {
        const variants = this.productData.variants.filter((variant)=>variant.available);
        const cheapestVariant = variants.reduce((prev, curr)=>{
            return prev.price < curr.price ? prev : curr;
        });
        return cheapestVariant === null || cheapestVariant === void 0 ? void 0 : cheapestVariant.id;
    }
    /**
   * Selects swatches in this swatch group based on a variant URL parameter
   * @returns {boolean} - Whether or not swatches were selected
   */ selectCheapestVariant() {
        const variantId = this.getCheapestVariant();
        if (!variantId) return false;
        const variantSelection = Array.from(this.variantSelector.querySelectorAll("option")).find((option)=>option.value == variantId);
        if (variantSelection && (variantSelection.dataset.available == "true" || this.allowUnavailableSelections)) {
            this.selectedOptions = {
                option1: variantSelection.dataset["option-1"].replace("null", ""),
                option2: variantSelection.dataset["option-2"].replace("null", ""),
                option3: variantSelection.dataset["option-3"].replace("null", "")
            };
            this.setSelectedVariant(variantSelection);
            Object.keys(this.selectedOptions).forEach((optionIndex)=>{
                const swatch = this.wrapper.querySelector(`[data-option-value="${this.selectedOptions[optionIndex]}"]`);
                if (swatch) {
                    this.visiblySelectSwatch(swatch);
                    this.markUnavailableSwatches(swatch);
                }
            });
            return true;
        }
        return false;
    }
    /**
   * Sets the URL parameter with the selected variant ID
   * @param {object} variant - The selected variant
   */ setUrlParams(variant) {
        if (variant) {
            const baseUrl = window.location.href;
            const params = {
                variant: variant.value
            };
            const getUriWithParam = (baseUrl, params)=>{
                const newUrl = new URL(baseUrl);
                const urlParams = new URLSearchParams(newUrl.search);
                for(const key in params)if (params[key] !== undefined) urlParams.set(key, params[key]);
                newUrl.search = urlParams.toString();
                return newUrl.toString();
            };
            window.history.pushState({}, "", getUriWithParam(baseUrl, params));
        }
    }
    /**
   * Gets the background colour or image of a swatch item
   * Defaults to the data from ThemeVars if this product doesn't have specific data for this swatch value
   * @param {string} swatchValue - The value of the swatch e.g. Red
   * @returns {string} - The background colour or image of the swatch item
   */ getSwatchBackground(swatchValue) {
        return this.swatchData.hasOwnProperty(swatchValue) ? this.swatchData[swatchValue] : ThemeVars.swatches[swatchValue];
    }
    /**
   * Selects swatches in this swatch group based on a variant URL parameter
   * @returns {boolean} - Whether or not swatches were selected
   */ selectSwatchesFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const variant = urlParams.get("variant");
        const variantSelection = Array.from(this.variantSelector.querySelectorAll("option")).find((option)=>option.value == variant);
        if (variantSelection && (variantSelection.dataset.available == "true" || this.allowUnavailableSelections)) {
            this.selectedOptions = {
                option1: variantSelection.dataset["option-1"].replace("null", ""),
                option2: variantSelection.dataset["option-2"].replace("null", ""),
                option3: variantSelection.dataset["option-3"].replace("null", "")
            };
            this.setSelectedVariant(variantSelection);
            Object.keys(this.selectedOptions).forEach((optionIndex)=>{
                const swatch = this.wrapper.querySelector(`[data-option-value="${this.selectedOptions[optionIndex]}"]`);
                if (swatch) {
                    this.visiblySelectSwatch(swatch);
                    this.markUnavailableSwatches(swatch);
                }
            });
            return true;
        }
        return false;
    }
    constructor(args){
        (0, _defineProperty._)(this, "selectedOptions", {});
        (0, _defineProperty._)(this, "variantSelector", null);
        (0, _defineProperty._)(this, "allowUnavailableSelections", false);
        const { wrapper, productData, swatchData, allowUnavailableSelections, swatchDropdown } = args;
        // Handle basic errors
        if (!wrapper) return console.error("SwatchGroup: Could not create swatch group, requires a wrapper.");
        if (!productData) return console.error("SwatchGroup: Could not create swatch group, requires a productData object.");
        if (!swatchData) return console.error("SwatchGroup: Could not create swatch group, requires a swatchData object.");
        if (!document.querySelector(wrapper)) return console.error("SwatchGroup: Could not create swatch group, wrapper does not exist.");
        if (!ThemeVars) return console.error("SwatchGroup: Could not create swatch group, theme variables do not exist.");
        if (!ThemeVars.hasOwnProperty("swatches")) return console.error("SwatchGroup: Swatches are not enabled in the current theme's settings.");
        // Add product and swatch data
        this.wrapper = document.querySelector(wrapper);
        this.productData = productData;
        this.swatchData = swatchData;
        if (swatchDropdown != null) this.swatchDropdown = swatchDropdown;
        else this.swatchDropdown = false;
        if (allowUnavailableSelections) this.allowUnavailableSelections = allowUnavailableSelections;
        // Generate random key for variant selector
        const variantSelectorKey = Math.random().toString(36).substring(2, 10);
        // Add swatches markup to DOM and set up event listeners
        const variantSelectorMarkup = `
      <select style="display: none;" name="id" id="variant-selector-${this.productData.id}" data-key="${variantSelectorKey}">
        <option value="" selected disabled></option>
        ${this.productData.variants.map((variant)=>`<option 
          data-option-1="${variant.option1}" 
          data-option-2="${variant.option2}" 
          data-option-3="${variant.option3}" 
          data-price="${variant.price}"
          data-name="${variant.name}"
          data-available="${variant.available}"
					${variant.featured_media ? `data-media-position="${variant.featured_media.position}"` : ""}
          value="${variant.id}">${variant.title}</option>`).join("")}
      </select>`;
        this.wrapper.insertAdjacentHTML("beforeend", variantSelectorMarkup);
        this.variantSelector = document.querySelector(`[data-key="${variantSelectorKey}"]`);
        this.addSwatchesToDOM();
        const allSwatches = this.wrapper.querySelectorAll(".swatch-group__swatch");
        allSwatches.forEach((swatch)=>{
            const temporarySelections = {
                ...this.selectedOptions
            };
            temporarySelections[swatch.dataset.optionIndex] = swatch.dataset.optionValue;
            const variant = this.getSelectedVariant(temporarySelections);
            if (variant && variant.dataset.available != "true") {
                swatch.classList.add("unavailable");
                if (!this.allowUnavailableSelections) swatch.classList.add("disabled");
            } else swatch.classList.remove("unavailable", "disabled");
        });
        this.selectCheapestVariant();
    }
}
window.SwatchGroup = SwatchGroup;
document.dispatchEvent(new CustomEvent("swatchesReady"));

},{"@swc/helpers/_/_define_property":"86pby","./utils.js":"fP4IO"}]},[], null, "parcelRequiree216")

