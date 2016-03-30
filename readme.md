[![Coverage Status](https://coveralls.io/repos/github/omriBernstein/farse/badge.svg?branch=master)](https://coveralls.io/github/omriBernstein/farse?branch=master)

# About

Use case—you've got an [arrow](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)/[generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*)/normal function and you want: its name, an array of its declared arguments, its body, and/or what kind of function it is.

# Getting started

If using it from node, go ahead and:

```bash
npm install farse
```

...then from your Javascript source do:

```js
const farse = require('farse');
```

**Note: Browser-compatible version on its way**

# Examples

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
