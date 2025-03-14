# MiniQ

A lightweight JavaScript library for DOM manipulation with a jQuery-like API. MiniQ provides a simple and intuitive way to work with the DOM, handle events, make AJAX requests, and more.

## Features

- **Lightweight:** Small footprint, no dependencies
- **Familiar API:** jQuery-like syntax for easy adoption
- **Modern JavaScript:** Built with contemporary JavaScript practices
- **Extensible:** Easy to add custom functionality
- **MIT Licensed:** Free to use in personal and commercial projects

## Installation

### Direct Download

Download the `miniq.js` file and include it in your HTML:

```html
<script src="path/to/miniq.js"></script>
```

### CDN (Coming Soon)

```html
<!-- Replace with actual CDN URL when available -->
<script src="https://cdn.example.com/miniq/1.0.0/miniq.min.js"></script>
```

### npm (Coming Soon)

```
npm install miniq
```

## Basic Usage

```javascript
// Select elements by CSS selector
MQ('.my-class');

// Chain methods
MQ('#my-element')
  .addClass('active')
  .css('color', 'blue')
  .on('click', function() {
    console.log('Clicked!');
  });
```

## API Overview

### Selectors

```javascript
// Select by CSS selector
MQ('.my-class');
MQ('#my-id');
MQ('div.container');

// Create a collection from a DOM element
MQ(document.getElementById('myElement'));

// Create a collection from an array of elements
MQ([elem1, elem2, elem3]);
```

### DOM Manipulation

```javascript
// Classes
MQ('.box').addClass('active');
MQ('.box').removeClass('active');
MQ('.box').toggleClass('active');
const hasClass = MQ('.box').hasClass('active');

// Styles
MQ('#element').css('color', 'blue');
MQ('#element').css({
  color: 'blue',
  backgroundColor: '#eee'
});

// Content
MQ('#element').html('<strong>New content</strong>');
MQ('#element').text('New text');

// Attributes
MQ('a').attr('href', 'https://example.com');
MQ('a').removeAttr('target');

// Visibility
MQ('.box').show();
MQ('.box').hide();
MQ('.box').toggle();
```

### DOM Traversal

```javascript
// Find descendants
MQ('.container').find('p');

// Get parent elements
MQ('p').parent();

// Get child elements
MQ('.container').children();
```

### Event Handling

```javascript
// Add event listener
MQ('#button').on('click', function() {
  console.log('Button clicked!');
});

// Remove event listener
MQ('#button').off('click', handlerFunction);

// Click shorthand
MQ('#button').click(function() {
  console.log('Button clicked!');
});
```

### AJAX

```javascript
// GET request
MQ.get('https://api.example.com/data', function(response) {
  console.log(response);
});

// POST request
MQ.post('https://api.example.com/data', 
  { name: 'John', age: 30 },
  function(response) {
    console.log(response);
  }
);

// Advanced AJAX options
MQ.ajax({
  method: 'POST',
  url: 'https://api.example.com/data',
  data: JSON.stringify({ name: 'John', age: 30 }),
  headers: {
    'Content-Type': 'application/json'
  },
  success: function(response) {
    console.log('Success:', response);
  },
  error: function(xhr, status) {
    console.error('Error:', status);
  }
});
```

## Extending MiniQ

You can easily add your own methods to MiniQ:

```javascript
// Add a new method to all MiniQ collections
MQ.fn.Collection.prototype.highlight = function(color) {
  return this.each(function(el) {
    const originalColor = MQ(el).css('background-color');
    
    // Store original color
    el._originalBgColor = originalColor;
    
    // Set highlight color
    MQ(el).css('background-color', color || '#ffff99');
  });
};

// Usage
MQ('p').highlight('#ffcc00');
```

## Complete Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>MiniQ Demo</title>
    <style>
        .box {
            border: 1px solid #ccc;
            padding: 15px;
            margin-bottom: 15px;
        }
        .highlight {
            background-color: #ffffcc;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="box" id="box1">
            <h3>Box 1</h3>
            <p>Test content.</p>
            <button class="toggle-btn">Toggle Highlight</button>
        </div>
        
        <div class="box" id="box2">
            <h3>Box 2</h3>
            <p>More content.</p>
            <button class="toggle-btn">Toggle Highlight</button>
        </div>
    </div>

    <script src="miniq.js"></script>
    <script>
        MQ('.toggle-btn').on('click', function() {
            MQ(this).parent().toggleClass('highlight');
        });
    </script>
</body>
</html>
```

## Browser Support

MiniQ is designed to work with modern browsers including:
- Chrome
- Firefox
- Safari
- Edge

## License

MiniQ is released under the MIT License. See the LICENSE file for details.

## Author

Created by Ramu Srinivasan (ramusesan@gmail.com)
