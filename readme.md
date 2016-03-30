[![Coverage Status](https://coveralls.io/repos/github/omriBernstein/farse/badge.svg?branch=master)](https://coveralls.io/github/omriBernstein/farse?branch=master)

# About

Use case—you've got an [arrow](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)/[generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*)/normal function and you want: its name, an array of its declared arguments, its body, and/or what kind of function it is.

# Why?

There are wonderful Javascript parsers out there (see for example [acorn](https://github.com/ternjs/acorn) or [esprima](https://github.com/jquery/esprima)). They are generalists. This function parser is meant to be [universal](https://medium.com/@mjackson/universal-javascript-4761051b7ae9#.h2zujh9og), small in scope, and small in size.

# Getting started

If using it from node, go ahead and:

```bash
npm install farse
```

...then from your Javascript source do:

```js
const farse = require('farse');
```

When using from the browser, download it, then in your html include a `<script>` pointing to the correct file. The script will make `farse` a global variable.

For example you might run:

```bash
npm install farse
``` 

...and then you might put this in your html (assuming the `node_modules` directory is statically served to the client):

```html
<script src="/farse/dist/farse.min.js"></script>
```

...and now `farse` would be a global variable available to any subsequent client scripts.

# Methods

This library's got three functions:

* [`farse`](#farse): for parsing a function.
* [`farse.inverse.inexact`](#farseinverseinexact): for taking the result of parsing a function and turning it back into a function.
* [`farse.inverse.exact`](#farseinverseexact): similar, but with important differences (see below).

In general, I recommend you default to using `farse.inverse.inexact` over `farse.inverse.exact`. The `.inexact` version, though less precise, is slightly safer because it uses the `Function` constructor instead of `eval`. See the documentation below for more details.

## `farse`

### About

*Input...*
```js
<Function>
```
*Output...*
```js
{
  name: <String>,
  params: [<String>],
  body: <String>,
  kind: <'StandardFunction','ArrowFunction','GeneratorFunction'>
}
```

Takes any function and returns a parsed object with the name, parameters, body, and "kind" of that function. The kind designates whether the original function is a standard function, an arrow function, or a generator function.

### Examples

An empty function:

```js
farse(function () {});
/*
{
  name: '',
  params: [],
  body: '',
  kind: 'StandardFunction'
}
*/
```

A more complicated function with some complex es6ish parameter declarations:

```js
farse(function foo (x=(":"+")"), {y}) {
  return x + y + 100;
});
/*
{
  name: 'foo',
  params: ['x=(":"+")")', ' {y}'],
  body: '\n  return x + y + 100;\n',
  kind: 'StandardFunction'
}
*/
```

An arrow function:

```js
farse(a=>a*1000);
/*
{
  name: '',
  params: ['a'],
  body: 'return a*100;',
  kind: 'ArrowFunction'
}
*/
```

A generator:

```js
farse(function* doThings (bar) {
  yield bar + 10;
  return bar - 10;
});
/*
{
  name: 'doThings',
  params: ['bar'],
  body: '\n  yield bar + 10;\n  return bar - 10;\n',
  kind: 'GeneratorFunction'
}
*/
```

## `farse.inverse.inexact`

**Note: Employ caution with this method because it utilizes the `Function` constructor.**

*Input...*
```js
{
  params: [<String>],
  body: <String>,
  kind: <'StandardFunction','ArrowFunction','GeneratorFunction'>
}
```
*Output...*
```js
<Function>
```

Takes an object representing a parsed function (e.g. the result of `farse`ing a function) and spits back a function that is a behavioral copy of the original. That is, it takes the same inputs and returns the same outputs. However, the resulting function will not share the original's name, and if the parsed `.kind` is `'ArrowFunction'` the result will nevertheless come back as an standard/ordinary function. This method uses the `Function` constructor to do its work, so is somewhat safer than its `.exact` alternative which uses `eval`.

##`farse.inverse.exact`

**Note: Employ caution with this method because it utilizes `eval`.**

*Input...*
```js
{
  name: <String>,
  params: [<String>],
  body: <String>,
  kind: <'StandardFunction','ArrowFunction','GeneratorFunction'>
}
```
*Output...*
```js
<Function>
```

Takes an object representing a parsed function (e.g. the result of `farse`ing a function) and returns a function that is not only a behavioral copy of the original, but also shares its `.name`. Furthermore if the original was an arrow function, the clone will also be an arrow function.

# Similar libraries

* [parse-function](https://www.npmjs.com/package/parse-function)
* [function-regex](https://www.npmjs.com/package/function-regex)

# Contributing

Pull requests / issues / comments / hate mail welcome!

If you'd like to run the tests, download this repo, open a terminal, navigate to it, then run:

```bash
npm install
```

...and once that's done:

```bash
npm test
```
