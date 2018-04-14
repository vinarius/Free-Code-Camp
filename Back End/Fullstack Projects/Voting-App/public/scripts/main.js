$(document).ready(() => {

    //ensure footer is always at the 'bottom' of the page even if not enough filler content
    {
        function footerAutoHeight() {
            $("main").css('min-height', 0);
            $("main").css('min-height', (
                $(document).height() -
                $('footer').height()
            ));
        }
        footerAutoHeight();
        $(window).resize(() => {
            footerAutoHeight();
        });
    }

    //login button
    $("#loginNavBtn").click(() => {
        if($("#login-popup-container").hasClass('d-none')){
            $("#login-popup-container").removeClass('d-none').addClass('d-flex');
            // $("#login-popup-container").fadeIn('fast');
        } else {
            $("#login-popup-container").removeClass('d-flex').addClass('d-none');
            // $("#login-popup-container").fadeOut('fast');
        }
    });

}); //end of document.ready