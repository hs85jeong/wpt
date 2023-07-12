// DO NOT EDIT! This test has been generated by /html/canvas/tools/gentest.py.
// OffscreenCanvas test in a worker:2d.text.measure.fontBoundingBox
// Description:Testing fontBoundingBox measurements
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
      ctx.direction = 'ltr';
      ctx.align = 'left'
      // approx_equals because font metrics may be rounded slightly differently by different platforms/browsers.
      assert_approx_equals(ctx.measureText('A').fontBoundingBoxAscent, 50 * 1745 / 1024, 1, "unexpected fontBoundingBoxAscent");
      assert_approx_equals(ctx.measureText('A').fontBoundingBoxDescent, 50 * 805 / 1024, 1, "unexpected fontBoundingBoxDescent");

      assert_approx_equals(ctx.measureText('ABCD').fontBoundingBoxAscent, 50 * 1745 / 1024, 1, "unexpected fontBoundingBoxAscent");
      assert_approx_equals(ctx.measureText('ABCD').fontBoundingBoxDescent, 50 * 805 / 1024, 1, "unexpected fontBoundingBoxDescent");
  t.done();
}, "Testing fontBoundingBox measurements");
done();
