$(document).ready(()=>{

    let myForm = document.querySelector('form');
    myForm.addEventListener('submit', (e)=>{
        e.preventDefault();
        let firstName = $("#firstName");
        let lastName = $("#lastName");
        let checkedBtn = $(".formBtn:checked").val();
        let myObj = {
            firstName: firstName.val(),
            lastName: lastName.val(),
            gender: checkedBtn
        };
        $.ajax({
            type: 'POST',
            url: '/api/querydb',
            data: myObj,
            success: function(res){
                console.log(res);
            },
            error: function(){
                alert('error occured in ajax');
            }
        });
    });

}); //end of doc ready

//instead of logging the response to the client console,
//work with the data and append it as html to the front end