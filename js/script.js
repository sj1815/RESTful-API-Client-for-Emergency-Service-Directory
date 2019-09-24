//now what?
	/*if they enter an orgId (we will get it next class through a search), we need to find:
		-What different areas of information the organization has (/Application/Tabs?orgId=x)
		-then, find each area on demand (each will need it's own call)
			General
				Path: ...ESD/{orgId}/General
			Locations
				Path: ...ESD/{orgId}/Locations
			Treatment
				Path: ...ESD/{orgId}/Treatments
			Training
				Path: ...ESD/{orgId}/Training
			Facilities
				Path: ...ESD/{orgId}/Facilities
			Equipment
				Path: ...ESD/{orgId}/Equipment
			Physicians
				Path: ...ESD/{orgId}/Physicians
			People
				Path: ...ESD/{orgId}/People
	*/

	var url = "https://people.rit.edu/dmgics/754/23/proxy.php";

	function getOrgTypes() {
        $.ajax({
            type: "GET", // HTTP method, could also be "POST"
            async: true, // request should be non blocking
            cache: false, // store the response data
            url: url,
            data: {
              path: "/OrgTypes"},
            dataType: "xml", //content type of response
            success: function (data, status) {
                console.log(data);

                var opts = "";

                if ($(data).find("error").length !== 0) {
                    // do something graceful here

                } else {
                    opts += "<option value=''>All Organization Types</option>";
                    $("row", data).each(function () {
                        opts += "<option value='" + $( "type", this ).text() +"'>" + $( "type", this ).text() + "</option>";
                    });

                    $("#orgType").html(opts);
                 
                }
            }

        });
    }
    
     function getStates() {
        $.ajax({
            type: "GET", // HTTP method, could also be "POST"
            async: true, // request should be non blocking
            cache: false, // store the response data
            url: url,
            data: {
              path: "/States"
            },
            dataType: "xml", //content type of response
            success: function (data, status) {
                console.log(data);

                var opts = "";

                if ($(data).find("error").length !== 0) {
                    // do something graceful here

                } else {
                    opts += "<option value=''>Select a State </option>";
                    $("row", data).each(function () {
                        opts += "<option value='" + $( "State", this ).text() +"'>" + $( "State", this ).text() + "</option>";
                    });

                    $("#state").html(opts);
                 
                }
            }

        });
    }
    
    function getCities(state){
       $.ajax({
            type: "GET", // HTTP method, could also be "POST"
            async: true, // request should be non blocking
            cache: false, // store the response data
            url: url,
            data: {
              path: "/Organizations?state="+state
            },
            dataType: "xml", //content type of response
            success: function (data, status) {
//                console.log(data);

                var opts = "";

                if ($(data).find("error").length !== 0) {
                    // do something graceful here

                } else {
                    console.log(data);
                    opts += "<option value=''>Select a City </option>";
                    $("row", data).each(function () {
                        opts += "<option value='" + $( "city", this ).text() +"'>" + $( "city", this ).text() + "</option>";
                    });

                    $("#city").html(opts);
                 
                }
            }

        });
      
    }
    

    function createCity(){
      console.log("In create city");
      state = $( "#state option:selected" ).text();
      console.log(state);
      getCities(state);
    }

    function showResults() {
	    $.ajax({
           url : url,
            data: {
              path:"/Organizations?" + $('#search-form').serialize()
            },
            success: function (data) {
                console.log(data);
                var output = "";
                $("#tableOutput").html(" ");
                
                var selectedOption = $( "#orgType option:selected" ).text();
                console.log(selectedOption);
                // you should test for error first

                if ($(data).find("row").length === 0) {
                    output += "No matches found";
                } else if( selectedOption == "Physician" ){
                      physicianData();     
                } else {
                    // string template literal
                    output += `<table id="results-table" class="display">
                                <thead>
                                    <tr>
                                      <th>Type</th>
                                      <th>Name</th>
                                      <th>Email</th>
                                      <th>City</th>
                                      <th>County</th>
                                      <th>State</th>
                                      <th>Zip</th>
                                    </tr>
                                </thead>`;

                    $("row", data).each(function () {
                       output += `<tr>
                                    <td>` +  $(this).find("type").text() + `</td>
                                    <td id = "ajaxOrg">` +   "<a href='javascript:getTabs(" + $(this).find('OrganizationID').text() + ")'>" + $("Name", this).text() + "</a>" +  `</td>
                                    <td>` + $("Email", this).text() + `</td>
                                    <td>` + $("city", this).text() + `</td>
                                    <td>` + $("CountyName", this).text() + `</td>
                                    <td>` + $("State", this).text() + `</td> 
                                    <td>` +$("zip", this).text() + `</td>
                                  </tr>`;
                    });
                  
                    output += "</table>";
                    $("#tableOutput").html(output);
                    $("#results-table").DataTable({
                       "pagingType": "full_numbers"
                    });
                }
            }
        });
    }
    
    function physicianData(){
//     console.log("Hi");
     $.ajax({
           url : url,
            data: {
              path:"/Organizations?" + $('#search-form').serialize()
            },
            success: function (data) {
                console.log(data);
                var output = "";
                $("#tableOutput").html(" ");
               if ($(data).find("row").length === 0) {
                    output += "No matches found";
                } else {
                  output += `<table id="results-table" class="display">
                                <thead>
                                    <tr>
                                      <th>Type</th>
                                      <th>First Name</th>
                                      <th>Organization Name</th>
                                      <th>City</th>
                                      <th>State</th>
                                      <th>Zip</th>
                                      <th>County Name</th>
                                      <th>Phone</th>
                                    </tr>
                                </thead>`;
                   $("row", data).each(function () {
                       output += `<tr>
                                    <td>` +  $(this).find("type").text() + `</td>
                                    <td id = "ajaxOrg">` +   "<a href='javascript:getTabs(" + $(this).find('OrganizationID').text() + ")'>" +  $(this).find("fName").text() + " " + $("mName", this).text() + " " + $("lName", this).text() + "</a>" +  `</td>
                                    <td>` + $("Name", this).text() + `</td>
                                    <td>` + $("city", this).text() + `</td>
                                    <td>` +$("state", this).text() + `</td>
                                    <td>` +$("zip", this).text() + `</td>
                                    <td>` +$("CountyName", this).text() + `</td>
                                    <td>` +$("phone", this).text() + `</td>
                                  </tr>`;
                    });
                  
                    output += "</table>";
                    $("#tableOutput").html(output);
                    $("#results-table").DataTable({
                       "pagingType": "full_numbers"
                    });
  
                }
              }
        });
   }
     
    function getTabs(orgId){
       
      console.log( "get tabs working");
      var url = "https://people.rit.edu/dmgics/754/23/proxy.php";  
      $.ajax({
        type: "GET",
        async: true,
        cache: false,
        url: url,
        data: {
          path: "/Application/Tabs?orgId=" + orgId
        },
        dataType: "xml",
        success: function( data, status ){
          var output1 = "";
          var output2 = "";
          if ($(data).find("error").length != 0) {
            console.log("Errors");
          } 
          else{
            var output1 = '<div id="tabs">';
            output1 += '<ul>';
            $("Tab", data).each(function (){
              console.log("inside gettabs");
              console.log(data);
              output1 += '<li><a href="#' + $(this).text() + '" onclick="get' + $(this).text() + 'Info' + '(' + orgId + ');">' + $(this).text() + '</a></li>';
              output2 += '<div id="' + $( this ).text() + '"></div>';
            });
            console.log($(this).text());
            $( "#dialogBox" ).html( output1 + '</ul>' + output2 + '</div>');
            console.log(output1);
            //$("#dialog-modal").html("<p>ye aaya</p>");
            //$("#getData").innerHTML = "hi chala";
            console.log("idhar aaya");
            console.log(document.getElementById("getData"));
            $( "#tabs" ).tabs();
            getGeneralInfo(orgId);
            $( "#dialogBox" ).dialog({
              minWidth : 900,
              minHeight: 500,
              buttons: {
               "Close" : function(){
                 $( this ).dialog( "close" );
               } 
              }
            });
          }
        }
      });
    }
    
    function getGeneralInfo(orgId){
      console.log("getGeneral working");
      $.ajax({
        type: "GET",
        async: true,
        cache: false,
        url: url,
        data:{
          path: "/" + orgId +"/General"
        },
        dataType: "xml",
        success: function( data, status){
          var option1 = "";
          if ($(data).find("error").length !== 0) {
            console.log("get General Errors");
          } 
          else {
            option1 += '<p><span id="info">Name:</span> ' + $(data).find( "name" ).text() + ' </p>';
            option1 += '<p><span id="info">Email:</span> ' + $(data).find( "email" ).text() + ' </p>';
            option1 += '<p><span id="info">Website:</span> ' + $(data).find( "website" ).text() + ' </p>';
            option1 += '<p><span id="info">Description:</span> ' + $(data).find( "description" ).text() + ' </p>';
            option1 += '<p><span id="info">Total Number of Members:</span> ' + $(data).find( "nummembers" ).text() + ' </p>';
            option1 += '<p><span id="info">Total Number of Calls:</span> ' + $(data).find( "numcalls" ).text() + ' </p>';
            option1 += '<p><span id="info">Service Area:</span> ' + $(data).find( "serviceArea" ).text() + ' </p>';
            $('#General').html(option1);
          }
        }
      });
    }
    
    function getTrainingInfo(orgId){
      console.log("getTrainingInfo");
      $.ajax({
        type: "GET",
        async: true,
        cache: false,
        url: url,
        data: {
          path: "/" + orgId +"/Training"
        },
        dataType: "xml",
        success: function( data, status ){
          var output = "";
          if ($(data).find("error").length !== 0){
            console.log("get Training Info error");
          }
          else {
            //console.log(data);
            output += `<div>
                        <table id="table_id" class="display">
                            <thead>
                              <tr>
                                <th colspan="3"><h3>Training Information</h3></th>
                              </tr>
                              <tr>
                                <th>Type</th>
                                <th>Abbreviation</th>
                              </tr>             
                            </thead>`;
            $("training",data).each(function (){
              output += `<tr>
                          <td>` + $(this).find("type").text() + `</td>
                          <td>` + $("abbreviation", this).text() + `</td>
                         </tr>`;
            });
            $('#Training').html(output);
            $(document).ready( function () {
              $('table').DataTable();
            });
          }
        }
        
      });
    }
    
    function getPhysiciansInfo(orgId){
      console.log("getPhysiciansInfo");
      $.ajax({
        type: "GET",
        async: true,
        cache: false,
        url: url,
        data: {
          path: "/" + orgId +"/Physicians"
        },
        dataType: "xml",
        success: function( data, status ){
          var output = "";
          if ($(data).find("error").length !== 0){
            console.log("get Physician Info error");
          }
          else {
            console.log(data);
            output += `<div>
                        <table id="table_id" class="display">
                            <thead>
                              <tr>
                                <th colspan="3"><h3>Physicians Information</h3></th>
                              </tr>
                              <tr>
                                <th>Name</th>
                                <th>License</th>
                                <th>Contact</th>
                              </tr>             
                            </thead>`;
            $("physician",data).each(function (){
              output += `<tr>
                          <td>` + $("fName", this).text() + " " + $("mName", this).text() + " " + $("lName", this).text() + `</td>
                          <td>` + $("license", this).text() + `</td>
                          <td>` + $("phone", this).text() + `</td>
                         </tr>`;
            });
            $('#Physicians').html(output);
            $(document).ready( function () {
              $('table').DataTable();
            });
          }
        }
        
      });
    }
    
    function getFacilitiesInfo(orgId){
      console.log("getFacilitiesInfo");
      $.ajax({
        type: "GET",
        async: true,
        cache: false,
        url: url,
        data: {
          path: "/" + orgId +"/Facilities"
        },
        dataType: "xml",
        success: function( data, status ){
          var output = "";
          if ($(data).find("error").length !== 0){
            console.log("get Facilities Info error");
          }
          else {
            //console.log(data);
            output += `<div>
                        <table id="table_id" class="display">
                            <thead>
                              <tr>
                                <th colspan="3"><h3>Facilities Information</h3></th>
                              </tr>
                              <tr>
                                <th>Type</th>
                                <th>Quantity</th>
                                <th>Description</th>
                              </tr>             
                            </thead>`;
            $("facility",data).each(function (){
              output += `<tr>
                          <td>` + $(this).find("type").text() + `</td>
                          <td>` + $("quantity", this).text() + `</td>
                          <td>` + $("description", this).text() + `</td>
                         </tr>`;
            });
            $('#Facilities').html(output);
            $(document).ready( function () {
              $('table').DataTable();
            });
          }
        }
        
      });
    }
    
    function getTreatmentInfo(orgId){
      console.log("getTreatmentInfo");
      $.ajax({
        type: "GET",
        async: true,
        cache: false,
        url: url,
        data: {
          path: "/" + orgId +"/Treatments"
        },
        dataType: "xml",
        success: function( data, status ){
          var output1 = "";
          if ($(data).find("error").length !== 0){
            console.log("get Treatment Info error");
          }
          else {
            console.log(data);
          
            output1 += `<div>
                        <table id="table_id" class="display">
                            <thead>
                              <tr>
                                <th colspan="3"><h3>Treatment Information</h3></th>
                              </tr>
                              <tr>
                                <th>Type</th>
                                <th>Abbreviation</th>
                              </tr>            
                            </thead>`;
            $("treatment",data).each(function (){
              output1 += `<tr>
                          <td>` + $(this).find("type").text() + `</td>
                          <td>` + $("abbreviation", this).text() + `</td>
                         </tr>`;
            });
            $('#Treatment').html(output1);
            $(document).ready( function () {
              $('table').DataTable();
            });
          }
        }
        
      });
    }
    
     function getPeopleInfo(orgId){
    
      console.log("Inside People info");
      
      $("div.tabName").remove();
      $("div.active").remove();
      output = "";
      $.ajax({
        type: "GET", 
        async: true, 
        cache: false, 
        url: url,
        data: {
          path: "/" + orgId + "/People"
        },
        dataType: "xml",
        success: function (data, status){
          console.log(data);
  
          if($(data).find("siteCount").length == 0){
            output += `<div class="tabName">
                        <h3>People</h3>
                        <h4>"No sites found"</h4>`;
          }
          else{
            output += `<div class="tabName">
                        <h3>People</h3>
                        <h4>Please choose a site: <select id="site">`;
  
            console.log($("site", data));
            $("site", data).each(function(){
              var siteId = $(this).attr("siteId");
              var address = $(this).attr("address");
              var siteType = $(this).attr("siteType");
              output += `<option>` + siteId + " - " + address + `</option>`;
            });
  
            output += "</select></h4></div>";
          }
  
          $("#People").append(output);

          var currentSiteId = "";
          currentSiteId = $("#site option:selected").text().split(" - ")[0];
          var currentSite = "";
          currentSite = $("#site option:selected").text().split(" - ")[1];
          console.log(currentSite);
          peopleData(data, currentSiteId, currentSite);

          $("#site").change(function(){
            currentSiteId = $("#site option:selected").text().split(" - ")[0];
            currentSite = $("#site option:selected").text().split(" - ")[1];
            console.log("Inside change method");
            peopleData(data, currentSiteId, currentSite);
          });
        }
      });
  }


  function peopleData(data, currentSiteId, currentSite){
    console.log("Inside People Info");
    output = "";
    $("div.active").remove();

    $("site", data).each(function(index){
      console.log("People data: ", $(this).attr("address"));
      if( currentSiteId === $(this).attr("siteId") && currentSite === $(this).attr("address")){
        if($("personCount", this).text() == "0"){
          output += `<div class="active"><table id="table_id" class="display">
                      <thead>
                        <tr>
                          <th colspan="2">` + currentSite + `</th>
                        </tr>
                      </thead>
                      <tbody>
                      <td colspan="2">"No people found"</td>`;
        }
        else{
          output += `<div class="active"><table id="table_id" class="display">
                      <thead>
                        <tr>
                          <th colspan="2">` + currentSite + `</th>
                        </tr>
                        <tr>
                          <th>Name</th>
                          <th>Role</th>
                        </tr>
                      </thead>
                      <tbody>`;

          $("person", this).each(function(){
            console.log($("fName", this).text());

            var name = "";

            var prefix = $("honorific", this).text();
            var fName = $("fName", this).text();
            var mName = $("mName", this).text();
            var lName = $("lName", this).text();
            var suffix = $("suffix", this).text();

            if(prefix!="null"){
              name += prefix;
            }
            if(fName!="null"){
              name += " " + fName;
            }
            if(mName!="null"){
              name += " " + mName;
            }
            if(lName!="null"){
              name += " " + lName;
            }
            if(suffix!="null"){
              name += " " + suffix;
            }

            output += `<tr>
                        <th>` + name + `</th>
                        <th>` + $("role", this).text() + `</th>
                      </tr>`;
          });
        }
      }
    });

//      output += `</tbody></table></div>`;
      $("#People").append(output);
      $(document).ready( function () {
        $('table').DataTable();
      });
    }
    
    
    function getLocationsInfo(orgId){
      $("div.tabName").remove();
      output1 = "";
      $.ajax({
        type: "GET", 
        async: true, 
        cache: false, 
        url: url,
        data: {
          path: "/" + orgId + "/Locations"
        },
        dataType: "xml",
        success: function (data, status){
          console.log(data);
          
          if($(data).find("error").length !== 0){
            output1 += `<div class="tabName">
                        <h3>Location</h3>
                        <h4>"No sites found"</h4>`;
          }
          else{
            output1 += `<div class="tabName">
                        <h3>Location</h3>
                        <h4>Please choose a site: <select id="location">`;
  
           
            $("location", data).each(function(){
              console.log(data);
              var siteId = $(this).find("siteId").text();
              console.log(siteId);
              var locationType = $(this).find("type").text();
              output1 += `<option>` + siteId + "-Location :" + locationType + `</option>`;
            });
  
            output1 += "</select></h4></div>";
          }
          $("#Locations").append(output1);
          
          var currentSiteId = "";
          currentSiteId = $("#location option:selected").text().split("-Location :")[0];
          var currentType = "";
          currentType = $("#location option:selected").text().split("-Location :")[1];
          console.log("this is original currentID " + currentSiteId);
          console.log("this is original currentType "+ currentType);
          
          locationData(data, currentSiteId, currentType);
          
          $("#location").change(function(){
            currentSiteId = $("#location option:selected").text().split("-Location :")[0];
            currentType = $("#location option:selected").text().split("-Location :")[1];
            console.log($("#location option:selected").text());
            console.log("this is original currentID " + currentSiteId);
            console.log("this is original currentType "+ currentType);
            locationData(data, currentSiteId, currentType);
          });
        }
      });
    }
    
    function locationData(data, currentSiteId, currentType){
      //console.log(data);
      //console.log("Inside Location Data");
      //console.log(currentSiteId);
    
      //console.log(currentType);
      output1 = "";
      output2 = "";
      outputMap1 = "";
      outputMap2 = "";
      
      $("div.activeLocation").remove();
      $("location", data).each(function(index){

      //console.log($(this).find("siteId").text());
      //console.log(currentSiteId);
      //console.log(currentSiteId.includes($(this).find("siteId").text()));  
      //console.log(currentType);
      //console.log($(this).find("type").text());
      if( currentSiteId == ($(this).find("siteId").text()) && currentType ==  $(this).find("type").text() ){
      
        console.log(currentSiteId);
        console.log(currentType);
        if($("count", this).text() == "0"){
          console.log("No data");
        }
        else{
          output1 += `<div class="activeLocation">`;
          console.log($(data).find( "type" ).text());
          console.log($(this).find( "type" ).text());
          output2 += '<p><span id="locInfo">Type:</span> ' + $(this).find( "type" ).text() + ' </p>';
          output2 += '<p><span id="locInfo">Address:</span> ' + $(this).find( "address1" ).text() + $(this).find( "address2" ).text() + ' </p>';
          output2 += '<p><span id="locInfo">City:</span> ' + $(this).find( "city" ).text() + ' </p>';
          output2 += '<p><span id="locInfo">County:</span> ' + $(this).find( "countyName" ).text() + ' </p>';
          output2 += '<p><span id="locInfo">Zip:</span> ' + $(this).find( "phone" ).text() + ' </p>';
          output2 += '<p><span id="locInfo">TTY Phone:</span> ' + $(this).find( "ttyphone" ).text() + ' </p>';
          output2 += '<p><span id="locInfo">Fax:</span> ' + $(this).find( "fax" ).text() + ' </p>';
          output2 += '<p><span id="locInfo">Latitude:</span> ' + $(this).find( "latitude" ).text() + ' </p>';
          output2 += '<p><span id="locInfo">Longitude:</span> ' + $(this).find( "longitude" ).text() + ' </p>';
          outputMap1 += `<div class="activeMap">`
          
          var mapSiteId = $(this).find("siteId").text();
          console.log(mapSiteId);
          var Lat = $(this).find( "latitude" ).text();
          console.log(Lat);
          var Lon = $(this).find( "longitude" ).text();
          console.log(Lat);
          var add = $(this).find( "address1" ).text();
          var county = $(this).find( "countyName" ).text();
          
          console.log(add);
          console.log(county);
          
//          $('.map').width("200px").height("200px").css("float","right").gmap3({
//             address: 
////          });
//          openMap(mapSiteId,Lat,Lon,add,county,data);
        }
      
      }
      });
      $("#Locations").append(output1);
      $("#Locations").append(outputMap1)
      $(".activeLocation").append(output2);  
    }
    
//    function openMap(mapSiteId,Lat,Lon,add,county,data){
//      $('location',data).each(function(){
//        $('.activeMap' + mapSiteId ).gmap3({
//          address: add + "," + county,
//          zoom: 10,
//          mapTypeId: google.maps.MapTypeId.HYBRID
//        })
//        .marker([{
//          position: [Lon, Lat] 
//        },{
//          address : add + "," + county
//        }]);
//      });
//    }

    function getEquipmentInfo(orgId){
      console.log("getEquipmentInfo");
      $.ajax({
        type: "GET",
        async: true,
        cache: false,
        url: url,
        data: {
          path: "/" + orgId +"/Equipment"
        },
        dataType: "xml",
        success: function( data, status ){
          var output1 = "";
          if ($(data).find("error").length !== 0){
            console.log("get Equipment Info error");
          }
          else {
            console.log(data);
          
            output1 += `<div>
                          <table id="table_id" class="display">
                            <thead>
                              <tr>
                                <th colspan="3"><h3>Equipment Information</h3></th>
                              </tr>
                              <tr>
                                <th>Type</th>
                                <th>Quantity</th>
                                <th>Description</th>
                              </tr>            
                            </thead>`;
            $("equipment",data).each(function (){
              output1 += `<tr>
                          <td>` + $(this).find("type").text() + `</td>
                          <td>` + $("quantity", this).text() + `</td>
                          <td>` + $("description", this).text() + `</td>
                         </tr>`;
            });
            $('#Equipment').html(output1);
            $(document).ready( function () {
              $('table').DataTable();
            });
          }
        }
        
      });
    }
    
    
//    function getData(){
//      
//    }
// 
//   
    
    $(function () {
       getOrgTypes(); 
       getStates(); 
       $("h1").letterfx({"fx":"smear","letter_end":"rewind"});
//       $('select, option').dropdown();
      $('#tabs').tabs({
        hide: {
        effect: "slide",
        duration: 1000
        }
      });

       //showResults();
    });