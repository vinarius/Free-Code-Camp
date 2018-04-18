$(document).ready(() => {

    let voteData = [];
    let pollForm = document.querySelector('#pollSearchForm');
    let addDatasetForm;
    let voteOptions = [];

    function addData(chart, label, data) {
        chart.data.labels.push(label);
        chart.data.datasets.forEach((dataset) => {
            dataset.data.push(data);
        });
        chart.update();
    }

    function createChart(voteData) {
        $(".chart-row").removeClass("d-none").addClass("d-flex");
        let ctx = document.getElementById("pollCanvas").getContext('2d');
        let myChart = new Chart(ctx, {
            type: 'horizontalBar',
            data: {
                labels: [],
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
        $("#addDatasetFormContainer").append('<form id="addDatasetForm" class="d-flex flex-row"><input type="text" id="datasetName" placeholder="Add Dataset" required><button type="submit" class="btn btn-primary">Submit</button></form>');
        addDatasetForm = document.querySelector('#addDatasetForm');
        addDatasetForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let datasetName = $("#datasetName").val().toLowerCase().split(' ');
            for (let i = 0; i < datasetName.length; i++) {
                datasetName[i] = datasetName[i].split('');
                datasetName[i][0] = datasetName[i][0].toUpperCase();
                datasetName[i] = datasetName[i].join('');
            }
            datasetName = datasetName.join(' ');
            addData(myChart, datasetName, 0);
            document.getElementById('addDatasetForm').reset();
            $("#voteOptionsContainer").append('<button class="voteOption btn btn-success" id="voteOptionsBtn' + voteOptions.length + '">' + label + '</button>');
            voteOptions.push(datasetName + 'Btn');
        });
    }

    pollForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let pollName = $("#formInputName").val().toLowerCase().split(' ').join('');
        $.ajax({
            type: 'POST',
            url: '/api/pollData',
            data: {
                pollName: pollName
            },
            success: (data) => {
                console.log(data);
                createChart(voteData);
            },
            error: (err) => {
                console.error("Error sending post with poll name.");
                console.error(err);
            }
        });
    });

}); //end of document ready