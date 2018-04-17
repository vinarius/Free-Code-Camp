$(document).ready(() => {

    let chartArr = [];
    let voteData = [12, 19, 3, 15, 25, 33];
    let pollForm = document.querySelector('form');

    function createChart(voteData) {
        let ctx = document.getElementById("pollCanvas").getContext('2d');
        chartArr.push(chartArr.length);
        let myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [{
                    label: ' # of Votes',
                    data: voteData,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                responsiveAnimationDuration: 1000,
                layout: {
                    padding: 50
                }
            }
        });
    }

    pollForm.addEventListener('submit', (e)=>{
        e.preventDefault();
        let pollName = $("#formInputName").val().toLowerCase().split(' ').join('');
        $.ajax({
            type: 'POST',
            url: '/api/pollData',
            data: {
                pollName: pollName
            },
            success: (data)=>{
                console.log(data);
            },
            error: (err)=>{
                console.error("Error sending post with poll name.");
                console.error(err);
            }
        });
    });

    //on document load
    createChart(voteData);

}); //end of document ready