'use strict';

const chai = require('chai');
chai.use(require('chai-spies'));
const expect = require('chai').expect;

const farse = require('.');

describe('Farse', function () {

  const paddedNewline = /\s*\n\s*/g;
  function simplifyNewlines (str) {
    return str.replace(paddedNewline, '\n');
  }

  describe('parses ordinary functions', function () {

    describe('of various forms', function () {

      it('including empty functions', function () {
        const parsed = farse(function () {});
        expect(parsed).to.eql({
          name: '',
          params: [],
          body: '',
          kind: 'StandardFunction'
        });
      });

      it('including functions with a name', function () {
        const parsed = farse(function foobar () {});
        expect(parsed).to.eql({
          name: 'foobar',
          params: [],
          body: '',
          kind: 'StandardFunction'
        });
      });

      it('including functions with params', function () {
        const parsed = farse(function (a,x,b,y) {});
        expect(parsed).to.eql({
          name: '',
          params: ['a', 'x', 'b', 'y'],
          body: '',
          kind: 'StandardFunction'
        });
      });

      it('including functions with a body', function () {
        const parsed = farse(function () {console.log('floof');return 'bar';});
        expect(parsed).to.eql({
          name: '',
          params: [],
          body: "console.log('floof');return 'bar';",
          kind: 'StandardFunction'
        });
      });

      it('including functions with name, params, and body', function () {
        const parsed = farse(function something (alpha,bravo,charlie) {return alpha+bravo+charlie;});
        expect(parsed).to.eql({
          name: 'something',
          params: ['alpha', 'bravo', 'charlie'],
          body: 'return alpha+bravo+charlie;',
          kind: 'StandardFunction'
        });
      });

    });

    describe('with a possibly confounding body', function () {

      it('including code with brackets', function () {
        const parsed = farse(function () {var x = {}; if (true) {x=5;} return x;});
        expect(parsed.body).to.equal('var x = {}; if (true) {x=5;} return x;');
      });

      it('including strings with closing brackets', function () {
        const parsed = farse(function () {console.log('}');return;});
        expect(parsed.body).to.equal("console.log('}');return;");
      });

      it('including comments with closing brackets', function () {
        const inlineParsed = farse(function () {// }
          return;});
        expect(simplifyNewlines(inlineParsed.body)).to.equal('// }\nreturn;');
        const multilineParsed = farse(function () {/*}*/return;});
        expect(multilineParsed.body).to.equal('/*}*/return;');
      });

    });

    describe('with a possibly confounding parameter list', function () {

      it('including code with parens', function () {
        const parsed = farse(function (foo,bar=Math.random(),baz) {});
        expect(parsed.params).to.eql(['foo', 'bar=Math.random()', 'baz']);
      });

      it('including strings with closing parens', function () {
        const parsed = farse(function (a,b=")",c) {});
        expect(parsed.params).to.eql(['a', 'b=")"', 'c']);
      });

      it('including comments with closing parens', function () {
        const inlineParsed = farse(function (// )
          x,y,z) {});
        expect(inlineParsed.params.map(simplifyNewlines)).to.eql(['// )\nx', 'y', 'z']);
        const multilineParsed = farse(function (x,y/*)*/,z) {});
        expect(multilineParsed.params.map(simplifyNewlines)).to.eql(['x', 'y/*)*/', 'z']);
      });

    });

  });

  describe('parses arrow functions', function () {

    describe('of various forms', function () {

      it('including empty functions', function () {
        const parsed = farse(()=>{});
        expect(parsed).to.eql({
          name: '',
          params: [],
          body: '',
          kind: 'ArrowFunction'
        });
      });

      it('including functions with params', function () {
        const parsed = farse((a,x,b,y)=>{});
        expect(parsed).to.eql({
          name: '',
          params: ['a', 'x', 'b', 'y'],
          body: '',
          kind: 'ArrowFunction'
        });
      });

      it('including functions with a body', function () {
        const parsed = farse(()=>{console.log('floof');return 'bar';});
        expect(parsed).to.eql({
          name: '',
          params: [],
          body: "console.log('floof');return 'bar';",
          kind: 'ArrowFunction'
        });
      });

      it('including functions with params and body', function () {
        const parsed = farse((alpha,bravo,charlie)=>{return alpha+bravo+charlie;});
        expect(parsed).to.eql({
          name: '',
          params: ['alpha', 'bravo', 'charlie'],
          body: 'return alpha+bravo+charlie;',
          kind: 'ArrowFunction'
        });
      });

    });

    describe('with syntax permutations', function () {

      it('including parens but no brackets', function () {
        const parsed = farse((foo,bar)=>foo-bar);
        expect(parsed).to.eql({
          name: '',
          params: ['foo', 'bar'],
          body: 'return foo-bar;',
          kind: 'ArrowFunction'
        });
      });

      it('including brackets but no parens', function () {
        const parsed = farse(n=>{return n*100;});
        expect(parsed).to.eql({
          name: '',
          params: ['n'],
          body: 'return n*100;',
          kind: 'ArrowFunction'
        });
      });

      it('including neither parens nor brackets', function () {
        const parsed = farse(obj=>obj.prop);
        expect(parsed).to.eql({
          name: '',
          params: ['obj'],
          body: 'return obj.prop;',
          kind: 'ArrowFunction'
        });
      });

    });

    describe('with a possibly confounding body', function () {

      it('including code with brackets', function () {
        const parsed = farse(()=>{var x = {}; if (true) {x=5;} return x;});
        expect(parsed.body).to.equal('var x = {}; if (true) {x=5;} return x;');
      });

      it('including strings with closing brackets', function () {
        const parsed = farse(()=>{console.log('}');return;});
        expect(parsed.body).to.equal("console.log('}');return;");
      });

      it('including comments with closing brackets', function () {
        const inlineParsed = farse(()=>{// }
          return;});
        expect(simplifyNewlines(inlineParsed.body)).to.equal('// }\nreturn;');
        const multilineParsed = farse(()=>{/*}*/return;});
        expect(multilineParsed.body).to.equal('/*}*/return;');
      });

    });

    describe('with a possibly confounding parameter list', function () {

      it('including code with parens', function () {
        const parsed = farse((foo,bar=Math.random(),baz)=>{});
        expect(parsed.params).to.eql(['foo', 'bar=Math.random()', 'baz']);
      });

      it('including strings with closing parens', function () {
        const parsed = farse((a,b=")",c)=>{});
        expect(parsed.params).to.eql(['a', 'b=")"', 'c']);
      });

      it('including comments with closing parens', function () {
        const inlineParsed = farse((// )
          x,y,z)=>{});
        expect(inlineParsed.params.map(simplifyNewlines)).to.eql(['// )\nx', 'y', 'z']);
        const multilineParsed = farse(function (x,y/*)*/,z) {});
        expect(multilineParsed.params.map(simplifyNewlines)).to.eql(['x', 'y/*)*/', 'z']);
      });

    });

  });

  describe('parses generator functions', function () {

    describe('of various forms', function () {

      it('including empty generator functions', function () {
        const parsed = farse(function* () {});
        expect(parsed).to.eql({
          name: '',
          params: [],
          body: '',
          kind: 'GeneratorFunction'
        });
      });

      it('including generator functions with a name', function () {
        const parsed = farse(function* foobar () {});
        expect(parsed).to.eql({
          name: 'foobar',
          params: [],
          body: '',
          kind: 'GeneratorFunction'
        });
      })

      it('including generator functions with params', function () {
        const parsed = farse(function* (a,x,b,y) {});
        expect(parsed).to.eql({
          name: '',
          params: ['a', 'x', 'b', 'y'],
          body: '',
          kind: 'GeneratorFunction'
        });
      });

      it('including generator functions with a body', function () {
        const parsed = farse(function* () {console.log('floof');return 'bar';});
        expect(parsed).to.eql({
          name: '',
          params: [],
          body: "console.log('floof');return 'bar';",
          kind: 'GeneratorFunction'
        });
      });

      it('including generator functions with name, params, and body', function () {
        const parsed = farse(function* something (alpha,bravo,charlie) {return alpha+bravo+charlie;});
        expect(parsed).to.eql({
          name: 'something',
          params: ['alpha', 'bravo', 'charlie'],
          body: 'return alpha+bravo+charlie;',
          kind: 'GeneratorFunction'
        });
      });

    });

    describe('with a possibly confounding body', function () {

      it('including code with brackets', function () {
        const parsed = farse(function* () {var x = {}; if (true) {x=5;} return x;});
        expect(parsed.body).to.equal('var x = {}; if (true) {x=5;} return x;');
      });

      it('including strings with closing brackets', function () {
        const parsed = farse(function* () {console.log('}');return;});
        expect(parsed.body).to.equal("console.log('}');return;");
      });

      it('including comments with closing brackets', function () {
        const inlineParsed = farse(function* () {// }
          return;});
        expect(simplifyNewlines(inlineParsed.body)).to.equal('// }\nreturn;');
        const multilineParsed = farse(function* () {/*}*/return;});
        expect(multilineParsed.body).to.equal('/*}*/return;');
      });

    });

    describe('with a possibly confounding parameter list', function () {

      it('including code with parens', function () {
        const parsed = farse(function* (foo,bar=Math.random(),baz) {});
        expect(parsed.params).to.eql(['foo', 'bar=Math.random()', 'baz']);
      });

      it('including strings with closing parens', function () {
        const parsed = farse(function* (a,b=")",c) {});
        expect(parsed.params).to.eql(['a', 'b=")"', 'c']);
      });

      it('including comments with closing parens', function () {
        const inlineParsed = farse(function* (// )
          x,y,z) {});
        expect(inlineParsed.params.map(simplifyNewlines)).to.eql(['// )\nx', 'y', 'z']);
        const multilineParsed = farse(function* (x,y/*)*/,z) {});
        expect(multilineParsed.params.map(simplifyNewlines)).to.eql(['x', 'y/*)*/', 'z']);
      });

    });

  });

});

describe('Unfarse (`farse.inverse`)', function () {

  describe('`.inexact`', function () {

    describe('turns a `farse`d result back into a working copy of the original function without using `eval`', function () {

      beforeEach(function () {
        chai.spy.on(global, 'eval');
      });

      it('for ordinary functions', function () {
        const fn = farse.inverse.inexact({
          name: '',
          params: ['a', 'b'],
          body: 'return a+b;',
          kind: 'StandardFunction'
        });
        expect(fn).to.be.a.function;
        expect(fn(10,20)).to.equal(30);
        expect(eval).not.to.have.been.called();
      });

      it('for arrow functions', function () {
        const fn = farse.inverse.inexact({
          name: '',
          params: ['a', 'b'],
          body: 'return a+b;',
          kind: 'ArrowFunction'
        });
        expect(fn).to.be.a.function;
        expect(fn(10,20)).to.equal(30);
        expect(eval).not.to.have.been.called();
      });

      it('for generator functions', function () {
        const fn = farse.inverse.inexact({
          name: '',
          params: ['a', 'b'],
          body: 'yield a+b; return a-b;',
          kind: 'GeneratorFunction'
        });
        expect(fn).to.be.a.function;
        const iter = fn(10,20);
        expect(iter.next).to.be.a.function;
        expect(iter.next()).to.eql({
          done: false,
          value: 30
        });
        expect(iter.next()).to.eql({
          done: true,
          value: -10
        });
        expect(eval).not.to.have.been.called();
      });

    });

  });

  describe('`.exact`', function () {

    describe('turns a `farse`d result back into a more exact clone of the original function', function () {

      describe('for ordinary functions', function () {

        let fn;
        beforeEach(function () {
          fn = farse.inverse.exact({
            name: 'foobar',
            params: ['a', 'b'],
            body: 'return a+b;',
            kind: 'StandardFunction'
          });
        });

        it('copies the behavior', function () {
          expect(fn).to.be.a.function;
          expect(fn(10,20)).to.equal(30);
        });

        it('copies length', function () {
          expect(fn.length).to.equal(2);
        });

        it('copies name', function () {
          expect(fn.name).to.equal('foobar');
        });

      });

      describe('for arrow functions', function () {

        let fn;
        beforeEach(function () {
          fn = farse.inverse.exact({
            name: '',
            params: ['a', 'b'],
            body: 'return a+b;',
            kind: 'ArrowFunction'
          });
        });

        it('copies the behavior', function () {
          expect(fn).to.be.a.function;
          expect(fn(10,20)).to.equal(30);
        });

        it('copies length', function () {
          expect(fn.length).to.equal(2);
        });

        it('copies the fact that it\'s an arrow function', function () {
          expect(fn.toString().startsWith('function')).to.equal(false);
        });

      });

      describe('for generator functions', function () {

        let fn;
        beforeEach(function () {
          fn = farse.inverse.exact({
            name: 'foobar',
            params: ['a', 'b'],
            body: 'yield a+b; return a-b;',
            kind: 'GeneratorFunction'
          });
        });

        it('copies the behavior', function () {
          expect(fn).to.be.a.function;
          const iter = fn(10,20);
          expect(iter.next).to.be.a.function;
          expect(iter.next()).to.eql({
            done: false,
            value: 30
          });
          expect(iter.next()).to.eql({
            done: true,
            value: -10
          });
        });

        it('copies length', function () {
          expect(fn.length).to.equal(2);
        });

        it('copies name', function () {
          expect(fn.name).to.equal('foobar');
        });

      });

    });

  });

});
