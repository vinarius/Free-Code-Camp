$(document).ready(function() {

    var streamers = [];
  
    streamers[0] = "towelliee";
    streamers[1] = "freeCodeCamp";
    streamers[2] = "syntag";
    streamers[3] = "mekranil";
    streamers[4] = "handmade_hero";
    streamers[5] = "brunofin";
    streamers[6] = "comster404";
    streamers[7] = "ESL_SC2";
  
    function getStreamInfo(streamerName) {
      $.ajax({
        type: 'GET',
        url: 'https://api.twitch.tv/kraken/streams/' + streamerName,
        headers: {
          'Client-ID': 'pr6pho7jynxa913minbf8hfx7fscwp'
        },
        success: function(data) {
          if (data.stream === null) {
            $("#" + streamerName).removeClass("active");
            $('#' + streamerName).addClass("inactive");
            $('#' + streamerName + 'Info').html('<p class="text-center">Stream is currently offline</p>');
          } else {
            $('#' + streamerName + 'Logo').html('<img src="' + data.stream.channel.logo + '" class="logoFrame"/>');
            $('#' + streamerName + 'Info').html('<p class="text-center">Playing: ' + data.stream.channel.game + ' | ' + data.stream.channel.status + '</p>');
          }
        },
        error: function(data){
      }
      });
    }
    
      function getChannelInfo(streamerName) {
      $.ajax({
        type: 'GET',
        url: 'https://api.twitch.tv/kraken/channels/' + streamerName,
        headers: {
          'Client-ID': 'pr6pho7jynxa913minbf8hfx7fscwp'
        },
        success: function(data) {
            $('#' + streamerName + 'Logo').html('<img src="' + data.logo + '" class="logoFrame"/>');
        },
        error: function(data){
        console.log(data);
          $('#' + streamerName + 'Info').html('<p class="text-center">' + data.responseJSON.message + '</p>');
      }
      });
    }
  
    //-------------------------------
  
    for (var i = 0; i < streamers.length; i++) {
      getChannelInfo(streamers[i]);
      getStreamInfo(streamers[i]);
    }; //end of loop
  
    /* add button filters */
  
    $("#onlineBtn").click(function() {
      $(".inactive").css("display", "none");
      $(".active").css("display", "");
    });
  
    $("#offlineBtn").click(function() {
      $(".active").css("display", "none");
      $(".inactive").css("display", "");
    });
  
    $("#allBtn").click(function() {
      $(".active").css("display", "");
      $(".inactive").css("display", "");
    });
  
  }); // end of doc.ready function