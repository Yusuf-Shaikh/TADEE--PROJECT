(function ($) {
  "use strict";
  $(".input2").each(function () {
    $(this).on("blur", function () {
      if ($(this).val().trim() != "") {
        $(this).addClass("has-val");
      } else {
        $(this).removeClass("has-val");
      }
    });
  });
})(jQuery);

function makePDF() {
  html2pdf(document.body, { 
    filename:     'TADEE.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 1, logging: true, dpi: 192, letterRendering: true },
    jsPDF:        { unit: 'mm', format: 'a3', orientation: 'portrait' }});
}
