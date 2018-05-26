$(document).ready(() => {

    let voteData = [];
    let labelData = [];
    let pollMenuListings = [];
    let pollForm = document.getElementById('pollSearchForm');
    let addDatasetForm = null;
    let currentPoll = null;
    let voteOptions = [];
    let myChart = null;
    let datasetWarning = false;

    function footerAutoHeightDashboard() {
        let hiddenOverflowHeight = $("#my-Poll-Dashboard-Window")[0].scrollHeight - $("#pollCanvas").height();
        $("main").css('min-height', 0);
        $("main").css('min-height', (
                $(document).height() -
                $('footer').height()) -
            hiddenOverflowHeight);
    }

    function autoHeightMyPollDashboardWindow() {
        $("#my-Poll-Dashboard-Window").css('max-height', $("#pollCanvas").height());
    }

    function addData(chart, label, data) {
        chart.data.labels.push(label);
        chart.data.datasets.forEach((dataset) => {
            dataset.data.push(data);
        });
        chart.update();
    }

    function removeData(chart, index) {
        chart.data.labels.splice(index, 1);
        chart.data.datasets.forEach((dataset) => {
            dataset.data.splice(index, 1);
        });
        chart.update();
    }

    function getElementPosition(input, dataset) {
        let outcome = input[0].datasets;
        for (let i = 0; i < outcome.length; i++) {
            for (let j in outcome[i]) {
                if (outcome[i][j] == dataset) {
                    return i;
                }
            }
        }
        return -1;
    }

    function appendVoteOptionBtn(datasetName) {
        $("#voteOptionsContainer").append('<div class="d-flex flex-row voteButtonContainer"><button class="voteOption btn btn-success" id="voteOptionsBtn' + voteOptions.length + '">' + datasetName + '</button><button id="removeDatasetBtn' + voteOptions.length + '" class="removeDatasetBtn btn btn-dark">X</button></div>');
    }

    function createChart(voteData, labelData) {
        if ($(".chart-row").hasClass("d-none")) {
            $(".chart-row").removeClass("d-none").addClass("d-flex");
        }
        if (myChart != null) {
            myChart = null;
            resetChart();
        }
        let ctx = document.getElementById("pollCanvas").getContext('2d');
        myChart = new Chart(ctx, {
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
        autoHeightMyPollDashboardWindow();
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
            if (!myChart.data.labels.includes(datasetName)) {
                //add dataset to db with count at 0
                addDataset(datasetName);
                addData(myChart, datasetName, 0);
                appendVoteOptionBtn(datasetName);
                addVoteListener('#voteOptionsBtn' + voteOptions.length, datasetName);
                addRemoveDatasetListener('#removeDatasetBtn' + voteOptions.length);
                voteOptions.push('voteOptionsBtn' + voteOptions.length);
            } else {
                if (!datasetWarning) {
                    $("#addDatasetWarningContainer").removeClass("d-none").addClass("d-flex");
                    datasetWarning = true;
                }
            }
            document.getElementById('addDatasetForm').reset();
        });
    }

    function addRemoveDatasetListener(el) {
        let removeDatasetButton = document.querySelector(el);
        removeDatasetButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm("Remove this dataset? This is irreversible.")) {
                let targetElementText = removeDatasetButton.parentElement.firstElementChild.textContent;
                $.ajax({
                    type: 'POST',
                    url: '/api/pollData/updatePoll',
                    data: {
                        updateStatus: 'removeDataset',
                        element: el,
                        currentPoll: currentPoll,
                        optionName: targetElementText
                    },
                    success: (data) => {
                        removeDatasetButton.parentNode.remove();
                        console.log(data);
                        voteOptions = [];
                        labelData = [];
                        for (let i = 0; i < data[0].datasets.length; i++) {
                            voteData.push(data[0].datasets[i].count);
                            labelData.push(data[0].datasets[i].label);
                        }
                        // createChart(voteData, labelData);
                        let targetIndex = getElementPosition(data, targetElementText);
                        removeData(myChart, targetIndex);
                    },
                    error: (err) => {
                        console.log("Error sending post request to remove dataset.");
                        console.error(err);
                    }
                });
            }
        });
    }

    function addDataset(datasetName) {
        $.ajax({
            type: 'POST',
            url: '/api/pollData/updatePoll',
            data: {
                updateStatus: 'addDataset',
                optionName: datasetName,
                currentPoll: currentPoll
            },
            success: (data) => {
                voteData = [];
                labelData = [];
                for (let i = 0; i < data[0].datasets.length; i++) {
                    voteData.push(data[0].datasets[i].count);
                    labelData.push(data[0].datasets[i].label);
                }
                myChart.data.labels = labelData;
                myChart.data.datasets[0].data = voteData;
                myChart.update();
                // addVoteListener('#voteOptionsBtn' + (voteOptions.length - 1), datasetName);
                // addRemoveDatasetListener('#removeDatasetBtn' + (voteOptions.length - 1));
            },
            error: (err) => {
                console.log('Error posting vote to database.');
                console.error(err);
            }
        });
    }

    function addVoteListener(el, datasetName) {
        let voteOptionButton = document.querySelector(el);
        voteOptionButton.addEventListener('click', (e) => {
            e.preventDefault();
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
                    let targetVoteOption = getElementPosition(data, datasetName);
                    myChart.data.datasets[0].data[targetVoteOption]++;
                    myChart.update();
                },
                error: (err) => {
                    console.log('Error posting vote to database.');
                    console.error(err);
                }
            });
        });
    }

    function resetChart() {
        $("#addDatasetFormContainer").empty();
        $("#voteOptionsContainer").empty();
        $(".chart-container").empty();
        $(".chart-container").append('<canvas id="pollCanvas" width="350" height="350"></canvas>');
    }

    //on load
    footerAutoHeightDashboard();
    createPollList();
    createChart(voteData, labelData);
    pollForm.addEventListener('submit', (e) => {
        e.preventDefault();
        resetChart();
        let pollName = $("#formInputName").val().toLowerCase().split(' ').join('');
        $.ajax({
            type: 'POST',
            url: '/api/pollData',
            data: {
                pollName: pollName
            },
            success: (data) => {
                myChart = null;
                voteData = [];
                labelData = [];
                voteOptions = [];
                document.getElementById('pollSearchForm').reset();
                if (datasetWarning) {
                    datasetWarning = false;
                    $("#addDatasetWarningContainer").addClass("d-none").removeClass("d-flex");
                }
                let displayNameMutation = data.name.split('');
                displayNameMutation[0] = displayNameMutation[0].toUpperCase();
                displayNameMutation = displayNameMutation.join('');
                $("#pollDisplayNameContainer").removeClass("d-none").addClass("d-flex").text(displayNameMutation);
                for (let i = 0; i < data.datasets.length; i++) {
                    (function () {
                        let j = i;
                        appendVoteOptionBtn(data.datasets[j].label);
                        let voteOptionButton = document.querySelector('#voteOptionsBtn' + voteOptions.length);
                        addVoteListener('#voteOptionsBtn' + voteOptions.length, data.datasets[j].label);
                        addRemoveDatasetListener('#removeDatasetBtn' + voteOptions.length);
                        voteOptions.push('voteOptionsBtn' + voteOptions.length);
                    }());
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

    $(window).resize(() => {
        autoHeightMyPollDashboardWindow();
        footerAutoHeightDashboard();
    });

    function createPollList() {
        resetPollList();
        $.ajax({
            type: 'GET',
            url: '/api/queryall',
            success: (data) => {
                let pollName = data[0].name.toLowerCase().split(' ').join('');
                $("#pollListLoadingIcon").remove();
                for(let i=0; i<data.length; i++){
                    let mutateString = data[i].name.split('');
                    mutateString[0] = mutateString[0].toUpperCase();
                    mutateString = mutateString.join('');
                    $("#my-Poll-Dashboard-Window").append(`<div class="my-Poll-Listing" id="my-Poll-Listing${pollMenuListings.length}"><a class="my-Poll-Listing-Subelement ml-auto" id="pollMenuListing${pollMenuListings.length}" href="#">${mutateString}</a><a class="btn btn-danger my-Poll-Listing-Subelement-Absolute" id="removeMenuListingBtn${pollMenuListings.length}" href="#">X</a></div>`);
                    let removeMenuListingStr = document.querySelector(`#removeMenuListingBtn${pollMenuListings.length}`);
                    removeMenuListingStr.addEventListener('click', (e)=>{
                        e.preventDefault();
                        if(confirm("Are you sure?")){
                            $.ajax({
                                type: 'GET',
                                url: '/api/deleteUserPoll',
                                data: { queryContent: removeMenuListingStr.parentElement.firstElementChild.textContent },
                                success: (data)=>{
                                    console.log(data);
                                    resetChart();
                                    myChart = null;
                                    voteData = [];
                                    labelData = [];
                                    voteOptions = [];
                                    $("#my-Poll-Listing" + pollMenuListings.length).remove();
                                },
                                error: (err)=>{
                                    console.error('Error removing poll listing.');
                                    console.error(err);
                                }
                            });
                        }
                    });
                    let pollMenuListingStr = document.querySelector("#pollMenuListing" + pollMenuListings.length);
                    pollMenuListingStr.addEventListener('click', (e)=>{
                        e.preventDefault();
                        console.log(pollMenuListingStr.textContent);
                        $.ajax({
                            type: 'GET',
                            url: '/api/getUserPolls',
                            data: { queryContent: pollMenuListingStr.textContent },
                            success: (data)=>{
                                resetChart();
                                myChart = null;
                                voteData = [];
                                labelData = [];
                                voteOptions = [];
                                let displayNameMutation = data[0].name.split('');
                                displayNameMutation[0] = displayNameMutation[0].toUpperCase();
                                displayNameMutation = displayNameMutation.join('');
                                $("#pollDisplayNameContainer").removeClass("d-none").addClass("d-flex").text(displayNameMutation);
                                for (let i = 0; i < data[0].datasets.length; i++) {
                                    (function () {
                                        let j = i;
                                        appendVoteOptionBtn(data[0].datasets[j].label);
                                        let voteOptionButton = document.querySelector('#voteOptionsBtn' + voteOptions.length);
                                        addVoteListener('#voteOptionsBtn' + voteOptions.length, data[0].datasets[j].label);
                                        addRemoveDatasetListener('#removeDatasetBtn' + voteOptions.length);
                                        voteOptions.push('voteOptionsBtn' + voteOptions.length);
                                    }());
                                    voteData.push(data[0].datasets[i].count);
                                    labelData.push(data[0].datasets[i].label);
                                }
                                createChart(voteData, labelData);
                                currentPoll = pollName;
                            },
                            error: (err)=>{
                                console.error(`Error loading ${pollMenuListingStr.textContent} data.`);
                                console.error(err);
                            }
                        });
                    });
                    pollMenuListings.push(pollMenuListings.length);
                }
            },
            error: (err) => {
                console.error('Error getting poll list data on page load.');
                console.error(err);
            }
        });
    }

    function resetPollList(){
        pollMenuListings = [];
        $("#my-Poll-Dashboard-Window").empty();
        $("#my-Poll-Dashboard-Window").append('<i class="fas fa-sync fa-3x fa-spin" id="pollListLoadingIcon"></i>');
    }

}); //end of document ready