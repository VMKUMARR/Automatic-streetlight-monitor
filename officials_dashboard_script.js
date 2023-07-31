
function sendForMaintainance(id) {
    inSelectionMode = true;
    // selectedLights.push(context.parentNode.parentNode.id);
    selectedLights.push(id);
    prepareAndUpdateLightState();
}

function prepareAndUpdateLightState() {
    var lights = [];
    if(selectedLights.length > 0) {
        for(var i = 0; i < selectedLights.length; i++) {
            lights.push({id:selectedLights[i], condition:"assigned-for-maintainance", state:0})
        }
        var data = {lights:lights, ldrs:"[]"};
        console.log(JSON.stringify(data));
        requestToUpdateData(JSON.stringify(data));
        toggleSelectionMode();
    } else {
        // alert("No light selected");
    }
}

function showFaultyLightsOnly() {
    var lights = document.getElementsByClassName("light");
    
    for(var i = 0; i < lights.length; i++) {
        const light = lights[i];
        const lightIsInFilter = light.classList.contains("not-working");

        if(lightIsInFilter) {
            light.classList.remove("hide");
        } else {
            light.classList.add("hide");
        }
        
    }
}