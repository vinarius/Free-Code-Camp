$(document).ready(function() {
  
    //when search button is clicked run code
    $("#searchBtn").click(function() {
      //gets search term
      var searchTerm = $("#userInput").val();
      //api url with search term
      var url = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + searchTerm + "&format=json&callback=?";
      
      $.ajax({
        type:"GET",
        url:url,
        async:false,
        dataType: "json",
        success: function(data){
          //get heading console.log(data[1][0]);
          //get description console.log(data[2][0]);
          //get link console.log(data[3][0]);
          //clear #output to prevent past searches from showing after a new search
          $("#output").html('');
          //loop through received json data display those results
          for(var i=0; i<data[1].length; i++){
          $("#output").append("<li><a href= "+data[3][i]+' target="blank">'+data[1][i]+"</a><p>"+data[2][i]+"</p></li>");
          };
          $("#userInput").val('');
        },
        error: function(errorMessage){
          alert("error");
        }
        
      });
      
    });
    
  });