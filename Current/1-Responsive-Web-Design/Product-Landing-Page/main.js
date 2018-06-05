document.addEventListener('DOMContentLoaded', () => {

    function footerAutoHeight() {
        let footer = document.getElementById('footer');
        let footerComputedCSS = window.getComputedStyle(footer, null);
        let mutatedFooterHeight = footerComputedCSS.height.substring(0, (footerComputedCSS.height.length - 2));
        mutatedFooterHeight = Number(mutatedFooterHeight);
        let customFooterPosition = window.innerHeight - mutatedFooterHeight;
        document.getElementById("main").setAttribute('style', 'min-height: 0px');
        document.getElementById("main").setAttribute('style', `min-height: ${customFooterPosition}px`);
    }

    //on page load
    footerAutoHeight();

    //on window resize
    window.addEventListener('resize', ()=>{
        footerAutoHeight();
    });

}); //end of document ready