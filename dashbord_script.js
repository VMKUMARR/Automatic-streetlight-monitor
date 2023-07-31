// const lightDataTags = {NAME:"data-name", CONDITION:"data-condition"}
var filterOptions = {ALL:"all", ON:"working-on", OFF:"working-off", NOT_WORKING:"not-working", ASSIGNED_FOR_MAINTAINANCE:"assigned-for-maintainance", UNDER_MAINTAINANCE:"under-maintainance"}

var filters = [filterOptions.ALL, filterOptions.ON, filterOptions.OFF,
             filterOptions.NOT_WORKING, filterOptions.ASSIGNED_FOR_MAINTAINANCE, filterOptions.UNDER_MAINTAINANCE];
var inSelectionMode = false;

var selectedLights = [];
var allLightsSelected = false;

var lightTemplate = null;
var ldrTemplate = null;
var lightGridView = null;
var ldrGridView = null;

var currentNotWorkingLights = [];
var cid = 'C1';

var junctions = {"C1": "Junction 1", "C2":"Junction 2"};

///////////// STREET NAVIGATION //////////
function startIntervals() {
    setInterval(loadLightsData, 1000);
    setInterval(loadLdrsData, 2000);
}

function loadJunctions() {
    var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if(this.readyState == 4 && this.status == 200) {
                onJunctionsLoad(this.response);
            }
        };
        
        xhr.open("GET", "https://light9909.000webhostapp.com/controller.php");
        xhr.send();
}

function onJunctionsLoad(result) {
    var junctions = JSON.parse(result);
    var html = "";
    for(var i = 0; i < junctions.lenghth; i++) {
        var junction = junctions[i];
        html += "<li class='juntion "+junction['id']+"' data-id='"+junction['id']+"'><button onclick='"+changeStreet(this)+"' >"+junction['name']+"</button> </li>";
    }
    document.querySelector('.street-list').innerHTML = html;
}

function selectJunction() {
    document.querySelector('.junction.'+cid).classList.add("selected");
}

function changeStreet(junction) {
    var currentStreet = document.querySelector(".street-list li.selected");
    
    if(currentStreet == junction.parentNode) {
        return;
    }
    
    clearGrids();
    cid = junction.parentNode.getAttribute('data-id');
    
    if(currentStreet != null) {
        currentStreet.classList.remove("selected");
    }
    
    loadLightsData();
    loadLdrsData();
    currentStreet = junction.parentNode;
    currentStreet.classList.add("selected");
}

function clearGrids() {
    document.querySelector(".grid.lights").innerHTML = "";
    document.querySelector(".grid.ldrs").innerHTML = "";
}

///////////// FILTER //////////////////

function onFilterOptionWorkingToggle(checked) {
    document.querySelector(".filter-option.filter-working-on").checked = checked;
    document.querySelector(".filter-option.filter-working-off").checked = checked;

    if(checked) {
        if(!filters.includes("working-on")) {
            filters.push("working-on");
        }

        if(!filters.includes("working-off")) {
            filters.push("working-off");
        }
    } else {
        filters = filters.filter(function (option) {
            return option != "working-on" && option != "working-off";
        })
    }

    filterLightList();
}

function onFilterChange(optionName, added) {
    var givenOption = optionName.replace("filter-", "");
    
    if(givenOption == filterOptions.OFF || givenOption == filterOptions.ON) {
        if(added) {
            document.querySelector(".filter-option.filter-working").checked =
                document.querySelector(".filter-option.filter-working-on")
                .checked &&
                document.querySelector(".filter-option.filter-working-off")
                .checked
        } else {
            document.querySelector(".filter-option.filter-working").checked = false;
        }
    }

    if(added) {
        filters.push(givenOption);
    } else {
        filters = filters.filter(function(option) {
            return givenOption != option;
        });
    }

    var filterOptionAll = document.querySelector(".filter-option.filter-all");
    if(!filterOptionAll.checked && isAllFiltersSelected()) {
        filterOptionAll.checked = true;
    } else if(filterOptionAll.checked && !isAllFiltersSelected()) {
        filterOptionAll.checked = false;
    }

    filterLightList();
}

function isAllFiltersSelected() {
    
    for(const key in filterOptions) {
        if(filterOptions[key] != "all" && !filters.includes(filterOptions[key])) {
            return false;
        }
    }
    return true;
}

function setAllFilterOptions(checked) {
    var options = document.getElementsByClassName("filter-option");
    for(var i = 0; i < options.length; i++) {
        options[i].checked = checked;
    }

    if(checked) { 
        for(const key in filterOptions) {
            filters.push(filterOptions[key]);
        }
    } else {
        filters.splice(0, filters.length);
    }
}

function onFilterOptionAllToggle(checked) {
    setAllFilterOptions(checked);
    filterLightList();
}

function filterLightList() {
    var lights = document.getElementsByClassName("light");
    
    for(var i = 0; i < lights.length; i++) {
        var light = lights[i];
        var lightIsInFilter = false;
        for(var j = 0; j < light.classList.length; j++) {
            if(filters.includes(light.classList[j])) {
                lightIsInFilter = true;
                break;
            }
        }

        if(lightIsInFilter) {
            light.classList.remove("hide");
        } else {
            light.classList.add("hide");
        }
        
    }
}



////////            SELECTION MODE                             ///////


function toggleAllLightsForMaintainance() {
    
    var notWorkingLights = document.querySelectorAll(".light."+faultyLightsClass);
    

    if(!allLightsSelected) {

        for(var i = 0; i < notWorkingLights.length; i++) {
            var lightId = notWorkingLights[i].getAttribute("id");
            var selector = notWorkingLights[i].querySelector(".light-selector");
            
            selectedLights.push(lightId);
            selector.checked = true;
        }
    } else {
        for(var i = 0; i < notWorkingLights.length; i++) {
            var lightId = notWorkingLights[i].getAttribute("id");
            var selector = notWorkingLights[i].querySelector(".light-selector");
            
            const index = selectedLights.indexOf(lightId);
            if(index != -1) {
                selectedLights.splice(index, 1);
            }
            selector.checked = false;
        }
    }

    toggleAllLightsSelection(!allLightsSelected);
}

function onLightSelectorToggle(context, selected) {
    const lightId = context.parentNode.parentNode.id;

    if(selected) {
        selectedLights.push(lightId);
    } else {
        const index = selectedLights.indexOf(lightId);
        if(index != -1) {
            selectedLights.splice(index, 1);
        }
    }

    if(allLightsSelected && document.querySelectorAll(".light.not-working").length > selectedLights.length) {
        toggleAllLightsSelection(false);
    } else if(!allLightsSelected && document.querySelectorAll(".light.not-working").length == selectedLights.length) {
        toggleAllLightsSelection(true);
    }
}

function toggleAllLightsSelection(selected) {
    var selectAlllButton = document.querySelector(".action-button.select-all");
    selectAlllButton.firstElementChild.src = selected ? "svgs/deselect-all-icon.svg" : "svgs/select-all-icon.svg";
    allLightsSelected = selected;
}

function toggleSelectionMode() {
    if(document.querySelectorAll(".light."+faultyLightsClass).length <= 0) {
        alert("No item to select");
        return;
    }
    var actionSelectionModeToggleButtonImage = document.querySelector(".action-button.select").firstElementChild;
    var actionSelectAllButton = document.querySelector(".action-button.select-all");
    var actionAssignWorkButton = document.querySelector(".action-button.assign-selected-work");
    var actionFilterLightsButton = document.querySelector(".action-button.filter");
    inSelectionMode = !inSelectionMode;
    if(inSelectionMode) {
        actionFilterLightsButton.style.display = "none";
        actionSelectionModeToggleButtonImage.src = "svgs/close.svg";
        actionSelectAllButton.classList.add("show");
        actionAssignWorkButton.classList.add("show");
        document.querySelector('.lights.grid').classList.add("selection-mode");
        document.querySelector(".actions").classList.add("selection-mode");
        showFaultyLightsOnly();
    } else {
        actionFilterLightsButton.style.display = "inline";
        actionSelectionModeToggleButtonImage.src = "svgs/select-icon.svg";
        actionSelectAllButton.classList.remove("show");
        actionAssignWorkButton.classList.remove("show");
        document.querySelector('.lights.grid').classList.remove("selection-mode");
        document.querySelector(".actions").classList.remove("selection-mode");

        clearSelectedForMaintainance();
        toggleAllLightsSelection(false);

        filterLightList();
    }
}

function clearSelectedForMaintainance() {
    for(var i = 0; i < selectedLights.length; i++) {
        document.querySelector("#"+selectedLights[i] + " .light-selector").checked = false;
    }

    selectedLights = [];
}

function requestToUpdateData(data) {
    var processingView = document.querySelector("#processing-request-view");
    processingView.classList.add("show");

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if(this.readyState == XMLHttpRequest.DONE) {
            if(this.status == 200) {
                processingView.classList.add("success");
                processingView.firstElementChild.innerText = "Success";
            } else {
                processingView.classList.add("failed");
                processingView.firstElementChild.innerText = "Failed!";
            }
            hideProcessingView(processingView);
        }
    };

    xhr.open("POST", "https://light9909.000webhostapp.com/light.php");
    xhr.send(data);
}


function hideProcessingView(view) {
    setTimeout(() => {
        view.classList.remove("show", "success", "failed");
        view.firstElementChild.innerText = "Processing please wait...";
    }, 500);
}



    
    function loadLightsData() {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if(this.readyState == 4 && this.status == 200) {
                onLightsDataLoad(this.response);
            }
        };
        
        xhr.open("GET", "https://light9909.000webhostapp.com/light.php?c="+cid);
        xhr.send();
    }


    function loadLdrsData() {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if(this.readyState == 4 && this.status == 200) {
                onLdrDataLoad(this.response);
            }
        };
        
        xhr.open("GET", "https://light9909.000webhostapp.com/ldr.php?c="+cid);
        xhr.send();
    }

    function onLightsDataLoad(lightJson) {
        removeLightsIfNotInJunction();
        try {
            
        var lights = JSON.parse(lightJson);
        for(var i = 0; i < lights.length; i++) {
            const light = lights[i];
            var lightId = light['id'];
            var lightView = document.getElementById(lightId);
            var lightDetails;
            var condition = light['condition'];
            var state = light['state'];
            
            // if(condition == 'not-working') {
            //     if(!currentNotWorkingLights.includes(light['id'])) {
            //         showNotification(light);
            //         removeNotification();
            //         currentNotWorkingLights.push(light['id']);
            //     }
            // } else if(currentNotWorkingLights.includes(light['id'])) {
            //     var lightIndex = currentNotWorkingLights.indexOf(light['id']);
            //     currentNotWorkingLights.slice(lightIndex, 1);
            // }
            
            if(lightView) {
                
                lightDetails = lightView.querySelector('.light-details');
                
                updateLightClass(lightView, condition, state);
                
            } else {
                const lightNode = lightTemplate.content.cloneNode(true);
                lightView = lightNode.querySelector('.light');
                lightDetails = lightNode.querySelector('.light-details');
                
                lightView.classList.add(condition);
                if(condition == "working") {
                    lightView.classList.add("working-" + state);
                }
                
                lightDetails.querySelector('.light-name').innerText = light['name'];
                
                lightView.setAttribute('id', light['id']);
                
                lightGridView.appendChild(lightNode);
            }
            lightView.querySelector('.light-icon').src = "images/light_" + state +".png";
            
            if(condition == faultyLightsClass) {
                
                if(!currentNotWorkingLights.includes(light['id'])) {
                    showNotification(light);
                    addToFaultyList(light);
                    currentNotWorkingLights.push(light['id']);
                }
            } else if(currentNotWorkingLights.includes(light['id'])) {
                var lightIndex = currentNotWorkingLights.indexOf(light['id']);
                currentNotWorkingLights.splice(lightIndex, 1);
                removeFromFaultyList(light['id']);
            }
            
            state = state.replace("-", " ");
            if(condition == filterOptions.ASSIGNED_FOR_MAINTAINANCE) {
                condition = "Assigned";
            } else if(condition == filterOptions.NOT_WORKING) {
                condition = "Fault";
            } else {
                condition = condition.replaceAll("-", " ");
            }
            
            lightDetails.querySelector('.light-condition').innerText = condition.charAt(0).toUpperCase() + condition.substring(1);
            lightDetails.querySelector('.light-state').innerText = state.charAt(0).toUpperCase() + state.substring(1);;
                
        }
        } catch(e) {
            console.error(e);
        }
        
        
    }
    
    function removeLightsIfNotInJunction() {
        var lightGridView = document.querySelector(".lights.grid");
        var lights = document.querySelectorAll(".lights > .light");

        for(var i = 0; i < lights.length; i++) {
            var light = lights[i];
            if(!light.id.startsWith(cid)) {
                lightGridView.removeChild(light);
                console.log("removed");
            }
        }
    }
    
    function removeLdrsIfNotInJunction() {
        var ldrGridView = document.querySelector(".ldrs.grid");
        var ldrs = document.querySelectorAll(".ldrs > .ldr");

        for(var i = 0; i < ldrs.length; i++) {
            var ldr = ldrs[i];
            if(!ldr.id.startsWith(cid)) {
                ldrGridView.removeChild(ldr);
            }
        }
    }
    function showNotification(light) {
        var notification = document.querySelector("#notification");
        var message = junctions[light['cid']]+" - " + light['name'] + " is not working";
        message += faultyLightsClass == 'not-wroking' ? "." : ", and assigned to you for maintainance.";
        notification.querySelector("#notification-title").innerText = light['name'];
        notification.querySelector("#notification-message").innerText = message;
        
        notification.querySelector("#notification-locate").firstElementChild.href = "https://maps.google.com/maps?q="+light['latitude']+","+light['longitude']+"&z=18";
        // notification.querySelector("#notification-locate").firstElementChild.href="https://www.google.com/maps/@"+light['latitude']+","+light['longitude']+",17z?hl=en&q=&msa=0&msid=1AwTVFPhiaiuuimhXOwmgvKNooJS4JuU&ll&ll="+light['latitude']+","+light['longitude']+"&spn=0.004507,0.010729&z=17&markers=color:red|label:C|"+light['latitude']+","+light['longitude'];
        notification.classList.add("show");
        setTimeout(() => {
            document.querySelector("#notification").classList.remove("show");
            
        }, 5000)
    }

    function addToFaultyList(light) {
        const faultyListItemTemplate = document.getElementById("faulty-light-list-item");
        var faultyLightList = document.querySelector("#notification-container .faulty-light-list")
        var faultyListItem = faultyListItemTemplate.cloneNode(true).content;
        faultyListItem.querySelector(".faulty-light").setAttribute("data-id", light['id']);
        faultyListItem.querySelector(".faulty-light-name").innerText = junctions[light['cid']]+" - " +light['name'];
        faultyListItem.querySelector(".locate-button a").href = "https://maps.google.com/maps?q=" + light['latitude'] +","+ light['longitude'];

        faultyLightList.appendChild(faultyListItem);
    }

    function removeFromFaultyList(lightId) {
        var faultyLightList = document.querySelector("#notification-container .faulty-light-list")
        var faultyListItem = faultyLightList.querySelector(".faulty-light[data-id='"+lightId+"']");
        faultyLightList.removeChild(faultyListItem);
    }

    function onLdrDataLoad(ldrJson) {
        removeLdrsIfNotInJunction();
        try {
            
        var ldrs = JSON.parse(ldrJson);
        for(var i = 0; i < ldrs.length; i++) {
            const ldr = ldrs[i];
            
            var ldrView = document.getElementById(ldr['id']);
            var ldrDetails;
            var condition = ldr['condition'];
    
            if(ldrView) {
                ldrDetails = ldrView.querySelector('.ldr-details');
                
                ldrView.classList.remove("working", "fault");
                ldrView.classList.add(condition);
                
            } else {
                const ldrNode = ldrTemplate.content.cloneNode(true);
                ldrView = ldrNode.querySelector('.ldr');
                ldrDetails = ldrNode.querySelector('.ldr-details');
                
                ldrView.classList.add(condition);
                
                ldrDetails.querySelector('.ldr-name').innerText = ldr['name'];
                
                ldrView.setAttribute('id', ldr['id']);
                
                ldrGridView.appendChild(ldrNode);
            }
            
            
            ldrDetails.querySelector('.ldr-condition').innerText = condition.charAt(0).toUpperCase() + condition.substring(1);
            
        }
        } catch(e) {
            
        }
}
    function updateLightClass(light, condition, state) {
        light.classList.remove("working-on", "working-off", "working", "not-working", "under-maintainance", "assigned-for-maintainance")
        light.classList.add(condition);

        if(condition == "working") {
            if(!light.classList.contains("working-" + state)) {
                light.classList.add("working-" + state);
            }
        } 
    }

window.onload = loadScript;
function loadScript() {
    lightTemplate = document.getElementById("light-template");
    ldrTemplate = document.getElementById("ldr-template");
    lightGridView = document.querySelector(".lights.grid");
    ldrGridView = document.querySelector(".ldrs.grid");
    
    loadLightsData();
    loadLdrsData();

}
