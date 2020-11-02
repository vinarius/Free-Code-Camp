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

    function subtitleContainerAutoHeight(){
        let subtitleContainer = document.getElementsByClassName('subtitle-container');
        let titleDiv = document.getElementsByClassName('instrument-subcontainer-title');
        for(let i=0; i<subtitleContainer.length; i++){
            let titleHeight = window.getComputedStyle(titleDiv[i], null);
            let mutateTitle = titleHeight.height;
            mutateTitle = mutateTitle.substring(0, (mutateTitle.length - 2));
            mutateTitle = Number(mutateTitle);
            let overallContainerHeight = document.getElementsByClassName('instrument-subcontainer')[0].offsetHeight;
            let result = overallContainerHeight - mutateTitle;
            document.getElementById(`subtitle-container${i}`).setAttribute('style', `height: 0px`);
            document.getElementById(`subtitle-container${i}`).setAttribute('style', `height: ${result}px`);
        }
    }

    //on page load
    footerAutoHeight();
    subtitleContainerAutoHeight();

    //on window resize
    window.addEventListener('resize', ()=>{
        footerAutoHeight();
        subtitleContainerAutoHeight();
    });

}); //end of document ready