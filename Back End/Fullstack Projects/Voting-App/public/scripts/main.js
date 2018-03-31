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

}); //end of document.ready