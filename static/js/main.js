/* smooth it up */
$(function() {
  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });
});

var loadedForm = false;

$(document).ready(function() {
  $("#c").css({ top: $("#gallery").position().top });
  $("#c").css({ height: $("#gallery").height() });
  $("#c").attr({ height: $("#gallery").height() });

  $(".spec_tbl tr").children('td').addClass('light');
  $(".spec_tbl tr").children('td:first-child').removeClass('light');
  $('body').css('opacity', '.1');
  $('html,body').animate({
    opacity: 1,
    scrollTop: $("#index-banner").offset().top
  }, 1500, () => {
    if (!loadedForm) {
      Cognito.load("forms", { id: "1" });
      loadedForm = true;
    }
  });
});

$(window).on('scroll', function() {
  var y_scroll_pos = window.pageYOffset;
  var y_scroll_bot = window.height - y_scroll_pos;
  var scroll_pos_test = 64; // top nav height

  if (y_scroll_pos < scroll_pos_test) {
    // hide action button
    $('#connect').fadeOut();
  } else {
    $('#connect').fadeIn();
  }

  var atBottom = $(window).scrollTop() >= (
    $(document).height() - $(window).height() - 150
  );

  var atButton = $(window).scrollTop() >= (
    $("#explain").position().top - $(window).height()
  );

  var atGallery = $(window).scrollTop() >= (
    $("#gallery").position().top - $(window).height()
  );

  if (atBottom) {
    $('.fixed-action-btn').openFAB();
  } else {
    $('.fixed-action-btn').closeFAB();
  }

  if (atButton) {
    $('#explain').addClass("animated fadeIn");
  } else {
    $('#explain').removeClass("animated fadeIn");
  }

  if (atGallery) {
    $('.card').each(function(i) {
      $(this).css("animation-delay", i*1+"s");
      $(this).addClass("animated fadeIn");
    });
  } else {
    $('.card').removeClass("animated fadeIn");
  }
});

var partNum = 70;


var c = document.getElementById('c');
var ctx = c.getContext('2d');

var w = window.innerWidth;
var h = $("#gallery").height();

var mouse = {
  x: w / 2,
  y: 0
};

document.addEventListener('mousemove', function(e){
    mouse.x = e.clientX || e.pageX;
    mouse.y = e.clientY || e.pageY
}, false);

var particles = [];
for(i = 0; i < partNum; i++) {
  particles.push(new particle);
}

function particle() {
  this.x = Math.random() * w - w / 5;
  this.y = Math.random() * h;

  this.r = Math.random() * 7.5 + 3.25;
}

var draw = function() {
  c.width = w;
  c.height = h;


  for(t = 0; t < particles.length; t++) {
    var p = particles[t];
    var nowX = p.r + mouse.x / 4.6;
    var nowY = p.r + mouse.y / 4.6;
    var color = colors[t];

    if(p.r < 10) {
      nowX = p.x + mouse.x / 0.5;
      nowY = p.y + mouse.y / 0.5;
    };
    if(p.r < 9) {
      nowX = p.x + mouse.x / 2;
      nowY = p.y + mouse.y / 2;
    };
    if(p.r < 8) {
      nowX = p.x + mouse.x / 3.5;
      nowY = p.y + mouse.y / 3.5;
    };
    if(p.r < 7) {
      nowX = p.x + mouse.x / 5;
      nowY = p.y + mouse.y / 5;
    };
    if(p.r < 6) {
      nowX = p.x + mouse.x / 6.5;
      nowY = p.y + mouse.y / 6.5;
    };
    if(p.r < 5) {
      nowX = p.x + mouse.x / 8;
      nowY = p.y + mouse.y / 8;
    };
    if(p.r < 4) {
      nowX = p.x + mouse.x / 9.5;
      nowY = p.y + mouse.y / 9.5;
    };
    if(p.r < 3) {
      nowX = p.x + mouse.x / 11;
      nowY = p.y + mouse.y / 11;
    };
    if(p.r < 2) {
      nowX = p.x + mouse.x / 12.5;
      nowY = p.y + mouse.y / 12.5;
    };
    if(p.r < 1) {
      nowX = p.x + mouse.x / 15;
      nowY = p.y + mouse.y / 15;
    };

    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(nowX, nowY, p.r, Math.PI * 2, false);
    ctx.fill();
  }
}

var colors = randomColor({hue: 'yellow', count: particles.length});

setInterval(draw, 33);
