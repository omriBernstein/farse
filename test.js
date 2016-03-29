'use strict';

const expect = require('chai').expect;

describe('Farse', function () {

  describe('parses ordinary functions', function () {

    it('without a body');

    it('with a body');

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

    it('without a body');

    it('with a body');

    it('with parens and brackets');

    it('with parens but no brackets');

    it('without parens but with brackets');

    it('with neither parens nor brackets');

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

    it('without a body');

    it('with a body');

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
