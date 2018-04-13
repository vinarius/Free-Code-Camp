$(document).ready(()=>{

    function renderHTML(paragraph){
        for(let i=0; i<paragraph.length; i++){
            $("#testDiv" + i).html(paragraph[i].username);
        }
    }

    let myForm = document.getElementById("myForm");
    let request = new XMLHttpRequest();

    myForm.addEventListener('submit', (event)=>{
        event.preventDefault();
        let formData = new FormData(myForm);
        request.open('POST', '/api/querydb');
        request.send(formData);
        request.onload = (data) => {
            console.log(JSON.parse(request.responseText));
        }
    });

    // $("#myFormSubmit").click((event)=>{
    //     event.preventDefault();
    //     let myFormObj = new FormData();
    //     myFormObj.append()
    //     let myDocLoadRequest = new XMLHttpRequest();
    //     myDocLoadRequest.open('POST', '/api/querydb');
    //     myDocLoadRequest.onload = () => {
    //         // let text = JSON.parse(myDocLoadRequest.responseText);
    //         // renderHTML(text);
    //         // console.log(JSON.parse(myDocLoadRequest.responseText));

    //     };
    //     myDocLoadRequest.send("foo=bar&lorem=ipsum");
    // });


    // $.ajax({
    //     method: "GET",
    //     url: "/",
    //     data:
    // })

}); //end of doc ready