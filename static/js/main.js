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

  if (atBottom) {
    $('.fixed-action-btn').openFAB();
  } else {
    $('.fixed-action-btn').closeFAB();
  }
});
