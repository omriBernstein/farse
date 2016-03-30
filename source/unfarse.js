'use strict';

function isArrow (parsed) {
  return parsed.kind === 'ArrowFunction';
}

function isGenerator (parsed) {
  return parsed.kind === 'GeneratorFunction';
}

const GeneratorFunction = (function*(){}).constructor;

function inexactUnfarse (parsed) {
  const constructor = isGenerator(parsed) ? GeneratorFunction : Function;
  return new constructor(...parsed.params, parsed.body);
}

function exactUnfarse (parsed) {
  // beware: uses `eval`
  const gap = isArrow(parsed) ? '=>' : ' ';
  const label = isArrow(parsed) ? '' : `function${isGenerator(parsed)?'*':''} ${parsed.name}`;
  return eval(`(${label}(${parsed.params.join(',')})${gap}{${parsed.body}})`);
};

module.exports = {
  inexact: inexactUnfarse,
  exact: exactUnfarse
};