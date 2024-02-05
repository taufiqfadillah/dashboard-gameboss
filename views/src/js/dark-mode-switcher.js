(function () {
    "use strict";

    // Save Local
    if (localStorage.getItem('mode') === 'dark') {
        $('html').removeClass('light');
        $('html').addClass('dark');
        $('.content').css('background-image', 'url(/dist/images/background-black.svg)');
        $('.dark-mode-switcher__toggle').addClass("dark-mode-switcher__toggle--active");
    } else {
        $('html').removeClass('dark');
        $('html').addClass('light');
        $('.content').css('background-image', 'url(/dist/images/background.svg)');
        $('.dark-mode-switcher__toggle').removeClass("dark-mode-switcher__toggle--active");
    }
    
    // Dark mode switcher
    $(".dark-mode-switcher").on("click", function () {
        let switcher = $(this).find(".dark-mode-switcher__toggle");
        if ($(switcher).hasClass("dark-mode-switcher__toggle--active")) {
            $(switcher).removeClass("dark-mode-switcher__toggle--active");
            $('html').removeClass('dark');
            $('html').addClass('light');
            $('.content').css('background-image', 'url(/dist/images/background.svg)');
            localStorage.setItem('mode', 'light');
        } else {
            $(switcher).addClass("dark-mode-switcher__toggle--active");
            $('html').removeClass('light');
            $('html').addClass('dark');
            $('.content').css('background-image', 'url(/dist/images/background-black.svg)');
            localStorage.setItem('mode', 'dark');
        }
    });
})();