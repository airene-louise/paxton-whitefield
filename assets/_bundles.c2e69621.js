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
})({"OEros":[function(require,module,exports) {
/**
 * This file provides utilities for creating a "bundle" of products that can be added to the cart.
 * 
 * Example usage:
 * var myBundle = new Bundle();
 * myBundle.addProduct(handle, variantId);
 * myBundle.addProduct(handle, variantId2, quantity, {"Gift Message": "Happy Birthday!"});
 * myBundle.removeProduct(variantId); 
 * myBundle.addToCart();
 * 
 * var myBundleProducts = myBundle.products;
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
var _cart = require("./_cart");
var _cartDefault = parcelHelpers.interopDefault(_cart);
class Bundle {
    /**
   * Adds a product to the current bundle.
   * @param {String} handle - The handle of the product to add.
   * @param {String} id - The ID of the variant to add.
   * @param {Integer} quantity - The quantity of the item to add. Defaults to 1.
   * @param {Object} properties - Optional properties to add to the cart item.
   * @returns {Bundle} - Returns the current bundle.
   */ async addProduct(handle, id, quantity = 1, properties = {}) {
        const productJson = await fetch(`/products/${handle}.js`).then((response)=>response.json());
        if (productJson.variants) productJson.variants = productJson.variants.filter((variant)=>variant.id.toString() === id.toString());
        const product = {
            data: productJson,
            quantity,
            properties
        };
        this.products.push(product);
        document.dispatchEvent(new CustomEvent("bundleProductsChanged", {
            detail: this.products
        }));
        return this;
    }
    /**
   * Removes all products that match the query (handle or variant ID) from the bundle.
   * Removes all products if no arguments are provided.
   * @param {String} query - The handle or variant ID of the product to remove.
   * @returns {Bundle} - Returns the current bundle.
   */ removeProduct(query) {
        if (query) this.products = this.products.filter((product)=>{
            return product.data.handle !== query && product.data.variants[0].id.toString() !== query.toString();
        });
        else this.products = [];
        document.dispatchEvent(new CustomEvent("bundleProductsChanged", {
            detail: this.products
        }));
        return this;
    }
    /**
   * Sets the quantity of a product in the bundle.
   * @param {String} query - The handle or variant ID of the product to change.
   * @param {Integer} quantity - The new quantity of the product.
   * @returns {Bundle} - Returns the current bundle.
   */ setQuantity(query, quantity) {
        if (!query) return console.error("setQuantity: query (either handle or variant id) is required.");
        if (!quantity) return console.error("setQuantity: quantity is required.");
        this.products = this.products.map((product)=>{
            if (product.data.handle === query || product.data.variants[0].id.toString() === query.toString()) product.quantity = quantity;
            return product;
        });
        document.dispatchEvent(new CustomEvent("bundleProductsChanged", {
            detail: this.products
        }));
        return this;
    }
    /** 
   * Removes a product from the bundle at a specific index.
   * @param {Integer} index - The index of the product to remove.
   * @returns {Bundle} - Returns the current bundle.
   */ removeProductAtIndex(index) {
        if (!index) return console.error("removeProductAtIndex: index is required.");
        this.products.splice(index, 1);
        document.dispatchEvent(new CustomEvent("bundleProductsChanged", {
            detail: this.products
        }));
        return this;
    }
    /**
   * Adds the bundle to the cart.
   * Note: Cart dispatches it's own "itemsAddedToCart" event if successful.
   */ addToCart() {
        const products = this.products.reduce((accumulator, product)=>{
            const existingProduct = accumulator.find((p)=>p.data.handle === product.data.handle);
            if (existingProduct) existingProduct.quantity += product.quantity;
            else accumulator.push(product);
            return accumulator;
        }, []);
        const productsWithIds = products.map((product)=>{
            return {
                id: product.data.variants[0].id,
                quantity: product.quantity,
                properties: product.properties
            };
        });
        (0, _cartDefault.default).addMultipleItems(productsWithIds);
    }
    constructor(){
        this.products = [];
    }
}
window.Bundle = Bundle;
document.dispatchEvent(new CustomEvent("bundlesReady"));

},{"./_cart":"lMAlE","@parcel/transformer-js/src/esmodule-helpers.js":"3Oqqe"}]},[], null, "parcelRequiree216")

