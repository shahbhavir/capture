(function () {
  // The width and height of the captured photo. We will set the
  // width to the value defined here, but the height will be
  // calculated based on the aspect ratio of the input stream.

  var canvasWidth = 320;    // We will scale the photo width to this
  var canvasHeight = 240;     // This will be computed based on the input stream

  // |streaming| indicates whether or not we're currently streaming
  // video from the camera. Obviously, we start at false.

  var streaming = false;

  // The various HTML elements we need to configure or control. These
  // will be set by the startup() function.

  var video = null;
  var canvas = null;
  var photo = null;
  var startbutton = null;
  var guideLines = null;

  // Rectangular guidelines

  var sx = 20; // x position from image source
  var sy = 60; // y position from image source
  var sWidth = 260; // width from image source
  var sHeight = 80; // height from image source

  function startup() {
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    photo = document.getElementById('photo');
    startbutton = document.getElementById('startbutton');
    guideLines = document.getElementById('guide-rect');

    navigator.getMedia = (navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia);

    navigator.getMedia(
      {
        video: true,
        audio: false
      },
      function (stream) {
        if (navigator.mozGetUserMedia) {
          video.mozSrcObject = stream;
        } else {
          var vendorURL = window.URL || window.webkitURL;
          video.src = vendorURL.createObjectURL(stream);
        }
        video.play();
      },
      function (err) {
        console.log("An error occured! " + err);
      }
    );

    video.addEventListener('canplay', function (ev) {
      if (!streaming) {
        video.setAttribute('width', canvasWidth);
        video.setAttribute('height', canvasHeight);
        canvas.setAttribute('width', canvasWidth);
        canvas.setAttribute('height', canvasHeight);
        streaming = true;
      }
    }, false);

    startbutton.addEventListener('click', function (ev) {
      takepicture();
      ev.preventDefault();
    }, false);

    clearphoto();

    guideLines.setAttribute(
      'style',
      'left: ' + sx + 'px;' +
      'top: ' + sy + 'px;' +
      'width: ' + sWidth + 'px;' +
      'height: ' + sHeight + 'px;'
    );
  }

  // Fill the photo with an indication that none has been
  // captured.

  function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
  }

  // Capture a photo by fetching the current contents of the video
  // and drawing it into a canvas, then converting that to a PNG
  // format data URL. By drawing it on an offscreen canvas and then
  // drawing that to the screen, we can change its size and/or apply
  // other changes before drawing it.

  function takepicture() {
    var context = canvas.getContext('2d');
    if (canvasWidth && canvasHeight) {
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      var videoWidth = video.videoWidth;
      var videoHeight = video.videoHeight;
      var vidToCanvScale = videoWidth / canvasWidth;
      context.drawImage(
        video,
        sx * vidToCanvScale, sy * vidToCanvScale, sWidth * vidToCanvScale, sHeight * vidToCanvScale,
        0, 0, canvasWidth, canvasHeight
      );

      var data = canvas.toDataURL('image/png');
      photo.setAttribute('src', data);
    } else {
      clearphoto();
    }
  }

  // Set up our event listener to run the startup process
  // once loading is complete.
  window.addEventListener('load', startup, false);
})();