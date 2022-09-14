(function (w) {
  function init() {
    var files = [
      'https://visitor.cloudcourier.cn/js/vendors.bundle.js',
      'https://visitor.cloudcourier.cn/js/index.bundle.js',
    ];

    var s0 = document.getElementsByTagName('script')[0];

    for (var i = 0; i < files.length; i++) {
      var s1 = document.createElement('script');
      s1.src = files[i];
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      s0.parentNode.insertBefore(s1, s0);
    }
  }
  if (document.readyState === 'complete') {
    init();
  } else if (w.attachEvent) {
    w.attachEvent('onload', init);
  } else {
    w.addEventListener('load', init, false);
  }
})(window);
