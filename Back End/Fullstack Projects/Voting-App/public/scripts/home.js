$(document).ready(()=>{

    function renderHTML(paragraph){
        for(let i=0; i<paragraph.length; i++){
            $("#testDiv" + i).html(paragraph[i].username);
        }
    }

    $("#myFormSubmit").click((event)=>{
        event.preventDefault();
        let myDocLoadRequest = new XMLHttpRequest();
        myDocLoadRequest.open('GET', '/api/querydb');
        myDocLoadRequest.onload = () => {
            let text = JSON.parse(myDocLoadRequest.responseText);
            renderHTML(text);
            // console.log(JSON.parse(myDocLoadRequest.responseText));
        };
        myDocLoadRequest.send();
    });


    // $.ajax({
    //     method: "GET",
    //     url: "/",
    //     data:
    // })

}); //end of doc ready