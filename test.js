'use strict';

const expect = require('chai').expect;

const farse = require('.');

describe('Farse', function () {

  describe('parses ordinary functions', function () {

    describe('of various forms', function () {

      it('including empty functions');

      it('including functions with a name');

      it('including functions with params');

      it('including functions with a body');

      it('including functions with name, params, and body');

    });

    describe('with a possibly confounding body', function () {

      it('including strings with closing brackets');

      it('including comments with closing brackets');

    });

    describe('with a possibly confounding parameter list', function () {

      it('including strings with closing parens');

      it('including comments with closing parens');

    });

  });

  describe('parses arrow functions', function () {

    describe('of various forms', function () {

      it('including empty functions');

      it('including functions with params');

      it('including functions with a body');

      it('including functions with params and body');

    });

    describe('with syntax permutations', function () {

      it('including parens and brackets');

      it('including parens but no brackets');

      it('including brackets but no parens');

      it('including neither parens nor brackets');

    });

    describe('with a possibly confounding body', function () {

      it('including strings with closing brackets');

      it('including comments with closing brackets');

    });

    describe('with a possibly confounding parameter list', function () {

      it('including strings with closing parens');

      it('including comments with closing parens');

    });

  });

  describe('parses generator functions', function () {

    describe('of various forms', function () {

      it('including empty generator functions');

      it('including generator functions with params');

      it('including generator functions with a body');

      it('including generator functions with params and body');

    });

    describe('with a possibly confounding body', function () {

      it('including strings with closing brackets');

      it('including comments with closing brackets');

    });

    describe('with a possibly confounding parameter list', function () {

      it('including strings with closing parens');

      it('including comments with closing parens');

    });

  });

});
