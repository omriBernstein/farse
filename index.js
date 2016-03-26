'use strict';

const openClose = {
  '(': ')',
  '[': ']',
  '{': '}',
  '"': '"',
  "'": "'",
  '//': '\n',
  '/*': '*/'
};
function closeOf (prev, ch) {
  return prev === '/' ? openClose[prev+ch] : openClose[ch];
}

function parsingContext (stack) {
  const last = stack[stack.length-1];
  if (last === '"' || last === "'") return 'String';
  else if (last === '*/' || last === '\n') return 'Comment';
  else return 'Code';
}

function peach (str, iter) {
  const stack = [];
  function matchesLast (str) {
    return str === stack[stack.length-1];
  }
  let prev;
  for (let ch of str) {
    iter(ch, stack);
    if (parsingContext(stack) === 'String') {
      if (prev !== '\\' && matchesLast(ch)) stack.pop();
    } else if (parsingContext(stack) === 'Comment') {
      if (matchesLast(ch) || matchesLast(prev+ch)) stack.pop();
    } else {
      if (matchesLast(ch)) stack.pop();
      else {
        let close = closeOf(prev, ch);
        if (close) stack.push(close);
      }
    }
    prev = ch;
  }
}

function parseParamStr (str) {
  const params = [];
  let curParam = '';
  peach(str, function (ch, stack) {
    if (parsingContext(stack) === 'Code' && ch === ',') {
      params.push(curParam);
      curParam = '';
    } else {
      curParam += ch;
    }
  });
  params.push(curParam);
  return params;
}

function parseArrow (source) {
  let left = '', right = '', hitArrow = false;
  let prev;
  peach(source, function (ch, stack) {
    if (hitArrow) right += ch;
    else if (stack.length === 0 && prev + ch === '=>') {
      left = left.slice(0,-1);
      hitArrow = true;
    } else left += ch;
    prev = ch;
  });
  left = left.trim();
  const paramStr = left.startsWith('(') ? left.slice(1,-1) : left;
  right = right.trim();
  const body = right.startsWith('{') ? right.slice(1,-1) : `return ${right};`;
  return {
    name: '',
    params: parseParamStr(paramStr),
    body: body,
    kind: 'ArrowFunction'
  };
}

function parseNormal (source) {
  source = source.slice(8).trimLeft(); // drop 'function' part
  let name = '', paramStr = '', bodyStr = '', kind = 'StandardFunction';
  if (source.startsWith('*')) {
    kind = 'GeneratorFunction';
    source = source.slice(1);
  }
  while (source[0] !== '(') {
    name += source[0];
    source = source.slice(1);
  }
  peach(source, function (ch, stack) {
    if (stack[0] === ')') paramStr += ch;
    else if (stack[0] === '}') bodyStr += ch;
  });
  return {
    name: name.trim(),
    params: parseParamStr(paramStr.slice(0,-1)),
    body: bodyStr.slice(0,-1),
    kind
  };
}

function farse (fn) {
  const source = Function.prototype.toString.call(fn);
  return source.startsWith('function') ? parseNormal(source) : parseArrow(source);
}

module.exports = farse;