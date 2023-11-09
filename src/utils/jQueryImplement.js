import $ from "jquery";

const body = $("body");


export const toggleMobileMenu = () => {
   body.on("click", ".toggleMobileMenu", function (e) {
      e.preventDefault();
      body.toggleClass('mmenu-active');
   })
};

export const closeMobileMenu = () => {
   body.on('click', '.mmenu-btn', function (e) {
      var $parent = $(this).closest('li'),
         $targetUl = $parent.find('ul').eq(0);

      if (!$parent.hasClass('open')) {
         $targetUl.slideDown(300, function () {
            $parent.addClass('open');
         });
      } else {
         $targetUl.slideUp(300, function () {
            $parent.removeClass('open');
         });
      }
      e.stopPropagation();
      e.preventDefault();

   }).on('click', '.mobile-menu-toggler', function (e) {
      body.toggleClass('mmenu-active');
      $(this).toggleClass('active');
      e.preventDefault();

   }).on('click', '.mobile-menu-overlay, .mobile-menu-close, .btn_menu_close', function (e) {
      body.removeClass('mmenu-active');
      $('.menu-toggler').removeClass('active');
      e.preventDefault();
   });

   // Add Mobile menu icon arrows to items with children
   $('.mobile-menu').find('li').each(function () {
      var $this = $(this);
      if ($this.find('ul').length) {
         $('<span/>', {
            'class': 'mmenu-btn'
         }).appendTo($this.children('a'));
      }
   });


   // Scroll Top Button - Show
   var $scrollTop = $('#scroll-top');

   $(window).on('load scroll', function () {
      if ($(window).scrollTop() >= 400) {
         $scrollTop.addClass('show');
      } else {
         $scrollTop.removeClass('show');
      }
   });

   // On click animate to top
   $scrollTop.on('click', function (e) {
      $('html, body').animate({
         'scrollTop': 0
      }, 800);
      e.preventDefault();
   });


};





















