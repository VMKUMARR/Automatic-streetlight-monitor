var inSelectionMode = false;


function setUnderMaintainance(id) {
    inSelectionMode = true;
    selectedLights.push(id);
    prepareAndUpdateLightState();
}

function prepareAndUpdateLightState() {
    var lights = [];
    if(selectedLights.length > 0) {
        for(var i = 0; i < selectedLights.length; i++) {
            lights.push({id:selectedLights[i], condition:"under-maintainance", state:0})
        }
        var data = {lights:lights, ldrs:"[]"};
        console.log(JSON.stringify(data));
        requestToUpdateData(JSON.stringify(data));
        toggleSelectionMode();
        
    } else {
        alert("No light selected");
    }
}

function showFaultyLightsOnly() {
    var lights = document.getElementsByClassName("light");
    
    for(var i = 0; i < lights.length; i++) {
        const light = lights[i];
        const lightIsInFilter = light.classList.contains("assigned-for-maintainance");

        if(lightIsInFilter) {
            light.classList.remove("hide");
        } else {
            light.classList.add("hide");
        }
        
    }
}

// function loadAssignedWork() {
    
//     var xhr = new XMLHttpRequest();
//     xhr.onreadystatechange = function () {
//         if(this.readyState == XMLHttpRequest.DONE && this.status == 200) {

//             var result = this.response;
//             var noWorkAssignedView = document.querySelector(".no-assigned-work");
//             var assignedWorkList = document.querySelector(".complaint-list");

//             try {
//                 noWorkAssignedView.classList.remove("hide");
//                 assignedWorkList.classList.remove("show");
                
//                 var assignedWorks = JSON.parse(result);
//                 var html = "";
//                 for(var i = 0; i < assignedWorks.length; i++) {
                    
//                     var assignedWork = assignedWorks[i];
                    
//                     html += "<li><a href='#' data-id='"+assignedWork['id']+"'>" + assignedWork['name'] +"</a></li>";
//                 }
//                 assignedWorkList.innerHTML = html;
//             } catch(error) {
//                 noWorkAssignedView.classList.add("show");
//                 assignedWorkList.classList.add("hide");
//             }
//         }
//     };

//     xhr.open("GET", "https://light9909.000webhostapp.com/light.php?q=assigned-work");
//     xhr.send();
// }