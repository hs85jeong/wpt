// DO NOT EDIT! This test has been generated by /html/canvas/tools/gentest.py.
// OffscreenCanvas test in a worker:2d.text.draw.align.start.rtl
// Description:textAlign start with rtl is the right edge
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
      ctx.direction = 'rtl';
      ctx.fillStyle = '#f00';
      ctx.fillRect(0, 0, 100, 50);
      ctx.fillStyle = '#0f0';
      ctx.textAlign = 'start';
      ctx.fillText('DD', 100, 37.5);
      _assertPixelApprox(canvas, 5,5, 0,255,0,255, 2);
      _assertPixelApprox(canvas, 95,5, 0,255,0,255, 2);
      _assertPixelApprox(canvas, 25,25, 0,255,0,255, 2);
      _assertPixelApprox(canvas, 75,25, 0,255,0,255, 2);
      _assertPixelApprox(canvas, 5,45, 0,255,0,255, 2);
      _assertPixelApprox(canvas, 95,45, 0,255,0,255, 2);
  t.done();
}, "textAlign start with rtl is the right edge");
done();
