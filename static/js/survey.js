$(document).ready(function(){
  var slider = document.getElementById('rng_income');
  noUiSlider.create(slider, {
   start: [0, 80000],
   connect: true,
   step: 100,
   range: {
     'min': 0,
     'max': 80000
   },
   format: wNumb({
     decimals: 0
   })
  });

  var tipHandles = slider.getElementsByClassName('noUi-handle'),
    tooltips = [];

  // Add divs to the slider handles.
  for ( var i = 0; i < tipHandles.length; i++ ){
    tooltips[i] = document.createElement('div');
    tipHandles[i].appendChild(tooltips[i]);
  }

  // Add a class for styling
  tooltips[0].className += 'tooltip';
  // Add additional markup
  tooltips[0].innerHTML = '<strong>between</strong><span></span>';
  // Replace the tooltip reference with the span we just added
  tooltips[0] = tooltips[0].getElementsByTagName('span')[0];


  // Add a class for styling
  tooltips[1].className += 'tooltip';
  // Add additional markup
  tooltips[1].innerHTML = '<strong>and</strong><span></span>';
  // Replace the tooltip reference with the span we just added
  tooltips[1] = tooltips[1].getElementsByTagName('span')[0];

  // When the slider changes, write the value to the tooltips.
  slider.noUiSlider.on('update', function( values, handle ){
    tooltips[handle].innerHTML = values[handle];
  });

  $('#prof_sel').material_select();
});

$(".survey_btn").click(function() {
  if ($(this).text() == "Complete") {
    return;
  }

  $(this).fadeOut('400');
  if ($(this).closest(".survey.container").next().css('display') == "none") {
    $(this).closest(".survey.container").next().fadeIn("slow");
    $(this).closest(".survey.container").next().next().fadeIn("slow");
  }
});

$("#address").keypress(function() {
  setTimeout(function(){
    $("#fake_maps").fadeOut('slow');
    $("#fake_maps_sorry").fadeIn('slow');
  }, 5000);
});
