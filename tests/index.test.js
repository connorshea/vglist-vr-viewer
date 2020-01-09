/* global assert, setup, suite, test */
require('aframe');
require('../index.js');
var entityFactory = require('./helpers').entityFactory;

suite('stupid-vglist-vr-viewer component', function () {
  var component;
  var el;

  setup(function (done) {
    el = entityFactory();
    el.addEventListener('componentinitialized', function (evt) {
      if (evt.detail.name !== 'stupid-vglist-vr-viewer') { return; }
      component = el.components['stupid-vglist-vr-viewer'];
      done();
    });
    el.setAttribute('stupid-vglist-vr-viewer', {});
  });

  suite('foo property', function () {
    test('is good', function () {
      assert.equal(1, 1);
    });
  });
});
