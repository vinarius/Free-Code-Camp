$(document).ready(() => {

    function getPollsCreated() {
        $.ajax({
            type: "GET",
            url: '/api/updateUser',
            success: (data) => {
                $("#pollsCreated").html("<li>Polls: " + data.polls + "</li>")
            },
            error: (err) => {
                console.error('error sending post request');
                console.error(err);
            }
        });
    }

    function updatePollsCreated() {
        $.ajax({
            type: "POST",
            url: '/api/updateUser',
            data: {
                updateStatus: 'createPoll'
            },
            success: (data) => {
                $("#pollsCreated").html("<li>Polls: " + data.polls + "</li>")
            },
            error: (err) => {
                console.error('Error creating poll during POST request.');
                console.error(err);
            }
        });
    }

    function deleteAllPolls() {

        $.ajax({
            type: "POST",
            url: '/api/updateUser',
            data: {
                updateStatus: 'deleteAllPolls'
            },
            success: (data) => {
                $("#pollsCreated").html("<li>Polls: " + data.polls + "<li>");
                $("#pollsCreated").append("<li>Polls deleted.</li>");
            },
            error: (err) => {
                console.error('Error deleting all polls during POST request.')
                console.error(err);
            }
        });
    }

    //ensure footer is always at the 'bottom' of the page even if not enough filler content
    function footerAutoHeight() {
        $("main").css('min-height', 0);
        $("main").css('min-height', (
            $(document).height() -
            $('footer').height()
        ));
    }
    $(window).resize(() => {
        footerAutoHeight();
    });

    //create a new poll on click #createPoll
    $("#createPoll").click(() => {
        updatePollsCreated();
    });

    //delete all user polls on click #deleteAllPolls
    $("#deleteAllPolls").click(() => {
        if (confirm("Are you sure you want to delete all your polls?")) {
            deleteAllPolls();
        }
    });

    //on document load
    footerAutoHeight();
    getPollsCreated();

}); //end of document.ready