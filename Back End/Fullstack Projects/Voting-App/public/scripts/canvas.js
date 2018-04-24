$(document).ready(() => {

    let voteData = [];
    let labelData = [];
    let pollForm = document.querySelector('#pollSearchForm');
    let addDatasetForm;
    let currentPoll = '';
    let voteOptions = [];

    function addData(chart, label, data) {
        chart.data.labels.push(label);
        chart.data.datasets.forEach((dataset) => {
            dataset.data.push(data);
        });
        chart.update();
    }

    function appendVoteOptionBtn(datasetName) {
        $("#voteOptionsContainer").append('<div class="d-flex flex-row voteButtonContainer"><button class="voteOption btn btn-success" id="voteOptionsBtn' + voteOptions.length + '">' + datasetName + '</button><button id="removeDatasetBtn' + voteOptions.length + '" class="removeDatasetBtn btn btn-dark">X</button></div>');
    }

    function createChart(voteData, labelData) {
        $(".chart-row").removeClass("d-none").addClass("d-flex");
        let ctx = document.getElementById("pollCanvas").getContext('2d');
        let myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labelData,
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
        $("#addDatasetFormContainer").append('<form id="addDatasetForm" class="d-flex flex-row"><input type="text" id="datasetName" placeholder="Add Dataset" required><button type="submit" class="btn btn-primary formInputSubmitBtn">Submit</button></form>');
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
            appendVoteOptionBtn(datasetName);
            addVoteListener('#voteOptionsBtn' + voteOptions.length, datasetName);
            addRemoveDatasetListener('#removeDatasetBtn' + voteOptions.length);
            voteOptions.push('voteOptionsBtn' + voteOptions.length);
        });
    }

    function addRemoveDatasetListener(el) {
        let removeDatasetButton = document.querySelector(el);
        removeDatasetButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm("Remove this dataset? This is irreversible.")) {
                $.ajax({
                    type: 'POST',
                    url: '/api/pollData/updatePoll',
                    data: {
                        updateStatus: 'removeDataset',
                        element: el,
                        currentPoll: currentPoll
                    },
                    success: (data) => {
                        console.log("Successful post request removing dataset.");
                        console.log(data);
                    },
                    error: (err) => {
                        console.log("Error sending post request to delete dataset.");
                        console.error(err);
                    }
                });
            }
        });
    }

    function addVoteListener(el, datasetName) {
        let voteOptionButton = document.querySelector(el);
        voteOptionButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('something happened');
            $.ajax({
                type: 'POST',
                url: '/api/pollData/updatePoll',
                data: {
                    updateStatus: 'voteDataset',
                    elementID: el,
                    optionName: datasetName,
                    currentPoll: currentPoll
                },
                success: (data) => {
                    console.log('Post vote to database success.');
                    // addData(myChart, data.datasets)
                },
                error: (err) => {
                    console.log('Error posting vote to database.');
                    console.error(err);
                }
            });
        });
    }

    function myListenerTest(el, datasetName){
        console.log('somethingasdf happened');
        $.ajax({
            type: 'POST',
            url: '/api/pollData/updatePoll',
            data: {
                updateStatus: 'voteDataset',
                elementID: el,
                optionName: datasetName,
                currentPoll: currentPoll
            },
            success: (data) => {
                console.log('Post vote to database success.');
                // addData(myChart, data.datasets)
            },
            error: (err) => {
                console.log('Error posting vote to database.');
                console.error(err);
            }
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
                for (let i = 0; i < data.datasets.length; i++) {
                    appendVoteOptionBtn(data.datasets[i].label);
                    // addVoteListener('#voteOptionsBtn' + voteOptions.length, data.datasets[i].label);
                    let voteOptionButton = document.querySelector('#voteOptionsBtn' + voteOptions.length);
                    voteOptionButton.addEventListener('click', myListenerTest.bind('#voteOptionsBtn' + voteOptions.length, data.datasets[i].label));
                    // addRemoveDatasetListener('#removeDatasetBtn' + voteOptions.length);
                    voteData.push(data.datasets[i].count);
                    labelData.push(data.datasets[i].label);
                }
                createChart(voteData, labelData);
                currentPoll = pollName;
            },
            error: (err) => {
                console.error("Error sending post with poll name.");
                console.error(err);
            }
        });
    });

}); //end of document ready