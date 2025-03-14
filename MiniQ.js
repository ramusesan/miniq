/*!
 * MiniQ v1.0.0
 * A lightweight JavaScript library for DOM manipulation
 * 
 * Copyright (c) 2025 Ramu Srinivasan (ramusesan@gmail.com)
 * Released under the MIT License
 * https://opensource.org/licenses/MIT
 */

// MiniQ - A simplified jQuery alternative
(function(window) {
  // Define our MiniQ namespace
  const MiniQ = {
    // Version information
    version: '1.0.0',
    
    // Initialize and return a MiniQ object
    init: function(selector) {
      // Create a new instance of MiniQ.Collection
      return new MiniQ.Collection(selector);
    },
    
    // Utility functions
    utils: {
      // Helper to check if object is array-like
      isArrayLike: function(obj) {
        return Array.isArray(obj) || obj instanceof NodeList;
      },
      
      // Extend objects (for options)
      extend: function(target, ...sources) {
        sources.forEach(source => {
          for (let key in source) {
            if (source.hasOwnProperty(key)) {
              target[key] = source[key];
            }
          }
        });
        return target;
      }
    },
    
    // AJAX functionality
    ajax: function(options) {
      const xhr = new XMLHttpRequest();
      
      // Set default options
      options = MiniQ.utils.extend({
        method: 'GET',
        url: '',
        data: null,
        headers: {},
        contentType: 'application/x-www-form-urlencoded',
        success: () => {},
        error: () => {},
        complete: () => {}
      }, options);
      
      xhr.open(options.method, options.url);
      
      // Set headers
      if (options.contentType) {
        xhr.setRequestHeader('Content-Type', options.contentType);
      }
      
      for (const header in options.headers) {
        xhr.setRequestHeader(header, options.headers[header]);
      }
      
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          let response = xhr.responseText;
          
          // Auto-parse JSON
          if (xhr.getResponseHeader('Content-Type')?.includes('application/json')) {
            try {
              response = JSON.parse(response);
            } catch (e) {
              // Keep original response if parsing fails
            }
          }
          
          options.success(response, xhr.status, xhr);
        } else {
          options.error(xhr, xhr.status);
        }
        options.complete(xhr, xhr.status);
      };
      
      xhr.onerror = function() {
        options.error(xhr, xhr.status);
        options.complete(xhr, xhr.status);
      };
      
      xhr.send(options.data);
      
      return xhr;
    },
    
    // GET request shorthand
    get: function(url, success) {
      return MiniQ.ajax({
        url,
        success
      });
    },
    
    // POST request shorthand
    post: function(url, data, success) {
      return MiniQ.ajax({
        method: 'POST',
        url,
        data,
        success
      });
    }
  };

  // Collection constructor - stores and manipulates DOM elements
  MiniQ.Collection = function(selector) {
    // Initialize empty array
    this.elements = [];
    
    // Handle if selector is already a DOM element
    if (selector instanceof HTMLElement) {
      this.elements = [selector];
    } 
    // Handle if selector is a string (CSS selector)
    else if (typeof selector === 'string') {
      this.elements = Array.from(document.querySelectorAll(selector));
    } 
    // Handle if selector is an array or array-like object
    else if (MiniQ.utils.isArrayLike(selector)) {
      this.elements = Array.from(selector);
    }
  };

  // Collection prototype methods
  MiniQ.Collection.prototype = {
    // Set constructor reference
    constructor: MiniQ.Collection,
    
    // UTILITY METHODS
    // ---------------
    
    // Iterate through elements and apply a function
    each: function(callback) {
      this.elements.forEach((el, i) => callback.call(el, el, i));
      return this;
    },
    
    // Get the number of elements
    size: function() {
      return this.elements.length;
    },
    
    // Get element at specified index
    get: function(index) {
      return this.elements[index];
    },
    
    // Get all elements as an array
    toArray: function() {
      return [...this.elements];
    },
    
    // DOM MANIPULATION METHODS
    // -----------------------
    
    // Class manipulation
    addClass: function(className) {
      return this.each(el => el.classList.add(className));
    },
    
    removeClass: function(className) {
      return this.each(el => el.classList.remove(className));
    },
    
    toggleClass: function(className) {
      return this.each(el => el.classList.toggle(className));
    },
    
    hasClass: function(className) {
      return this.elements.some(el => el.classList.contains(className));
    },
    
    // Style manipulation
    css: function(prop, value) {
      if (typeof prop === 'object') {
        const styles = prop;
        return this.each(el => {
          for (const key in styles) {
            el.style[key] = styles[key];
          }
        });
      }
      
      if (value === undefined) {
        return this.elements[0] ? getComputedStyle(this.elements[0])[prop] : null;
      }
      
      return this.each(el => el.style[prop] = value);
    },
    
    // Content manipulation
    html: function(content) {
      if (content === undefined) {
        return this.elements[0] ? this.elements[0].innerHTML : null;
      }
      return this.each(el => el.innerHTML = content);
    },
    
    text: function(content) {
      if (content === undefined) {
        return this.elements[0] ? this.elements[0].textContent : null;
      }
      return this.each(el => el.textContent = content);
    },
    
    // Attribute manipulation
    attr: function(name, value) {
      if (typeof name === 'object') {
        const attrs = name;
        return this.each(el => {
          for (const key in attrs) {
            el.setAttribute(key, attrs[key]);
          }
        });
      }
      
      if (value === undefined) {
        return this.elements[0] ? this.elements[0].getAttribute(name) : null;
      }
      
      return this.each(el => el.setAttribute(name, value));
    },
    
    removeAttr: function(name) {
      return this.each(el => el.removeAttribute(name));
    },
    
    // DOM TRAVERSAL METHODS
    // --------------------
    
    find: function(selector) {
      const result = [];
      this.each(el => {
        const found = el.querySelectorAll(selector);
        result.push(...found);
      });
      return new MiniQ.Collection(result);
    },
    
    parent: function() {
      const parents = this.elements.map(el => el.parentElement).filter(Boolean);
      return new MiniQ.Collection(parents);
    },
    
    children: function() {
      const children = [];
      this.each(el => {
        children.push(...el.children);
      });
      return new MiniQ.Collection(children);
    },
    
    // EVENT HANDLING METHODS
    // --------------------
    
    on: function(event, callback) {
      return this.each(el => {
        el.addEventListener(event, callback);
        
        // Store event handlers to support off() method
        if (!el._miniQEvents) el._miniQEvents = {};
        if (!el._miniQEvents[event]) el._miniQEvents[event] = [];
        el._miniQEvents[event].push(callback);
      });
    },
    
    off: function(event, callback) {
      return this.each(el => {
        if (!callback && el._miniQEvents && el._miniQEvents[event]) {
          // Remove all handlers for this event
          el._miniQEvents[event].forEach(handler => {
            el.removeEventListener(event, handler);
          });
          el._miniQEvents[event] = [];
        } else if (callback) {
          // Remove specific handler
          el.removeEventListener(event, callback);
          
          // Update stored handlers
          if (el._miniQEvents && el._miniQEvents[event]) {
            el._miniQEvents[event] = el._miniQEvents[event].filter(
              handler => handler !== callback
            );
          }
        }
      });
    },
    
    // Click event shorthand
    click: function(callback) {
      if (callback) {
        return this.on('click', callback);
      } else {
        return this.each(el => el.click());
      }
    },
    
    // DISPLAY METHODS
    // --------------
    
    show: function() {
      return this.css('display', 'block');
    },
    
    hide: function() {
      return this.css('display', 'none');
    },
    
    toggle: function() {
      return this.each(el => {
        const display = getComputedStyle(el).display;
        if (display === 'none') {
          el.style.display = 'block';
        } else {
          el.style.display = 'none';
        }
      });
    }
  };

  // Expose the MiniQ function globally with our MQ shorthand
  window.MQ = window.MiniQ = MiniQ.init;
  
  // Expose the full MiniQ object
  window.MQ.fn = MiniQ;
  
  // Expose AJAX methods directly on MQ
  window.MQ.ajax = MiniQ.ajax;
  window.MQ.get = MiniQ.get;
  window.MQ.post = MiniQ.post;
})(window);
