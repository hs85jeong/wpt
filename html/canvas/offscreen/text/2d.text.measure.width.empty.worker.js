// DO NOT EDIT! This test has been generated by /html/canvas/tools/gentest.py.
// OffscreenCanvas test in a worker:2d.text.measure.width.empty
// Description:The empty string has zero width
// Note:

importScripts("/resources/testharness.js");
importScripts("/html/canvas/resources/canvas-tests.js");

promise_test(async t => {

  var canvas = new OffscreenCanvas(100, 50);
  var ctx = canvas.getContext('2d');

  var f = new FontFace("CanvasTest", "url('/fonts/CanvasTest.ttf')");
  let fonts = (self.fonts ? self.fonts : document.fonts);
  await f.load();
  fonts.add(f);

      ctx.font = '50px CanvasTest';
      _assertSame(ctx.measureText("").width, 0, "ctx.measureText(\"\").width", "0");
  t.done();
}, "The empty string has zero width");
done();
