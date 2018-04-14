$(document).ready(() => {

    let isTestDataPresent = false;

    let myForm = document.querySelector('form');
    myForm.addEventListener('submit', (e) => {
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
            success: function (res) {
                console.log(res);
                for (let prop in res) {
                    console.log(res[prop]);
                    $("#testDiv").append("<li>" + res[prop] + "</li>")
                }
            },
            error: function () {
                alert('error occured in ajax');
            }
        });
    });

    $("#queryButton").click(() => {
        console.log('before:', isTestDataPresent);
        if (!isTestDataPresent) {
            $.ajax({
                type: 'GET',
                url: '/api/queryAll',
                success: function (res) {
                    isTestDataPresent = !isTestDataPresent;
                    console.log('After:', isTestDataPresent);
                    for (let prop in res) {
                        $("#queryUl").append("<li>" + res[prop].firstName + ", " + res[prop].lastName + ", " + res[prop].gender + "</li>");
                    }
                },
                error: function () {
                    alert("error querying db");
                }
            });
        }
    });

}); //end of doc ready