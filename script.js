require(["esri/layers/GraphicsLayer", "esri/Graphic", "esri/geometry/Point"], (GraphicsLayer, Graphic, Point) => {

    const map = document.getElementById("map");
    const searchButton = document.getElementById("search-button");
    const resetButton = document.getElementById("reset-button");
    const searchInput = document.getElementById("search-input");
    const locationsList = document.getElementById("locations-list");
    const locationsListLabel = document.getElementById("location-list-label");

    const apiKey = '3NKHt6i2urmWtqOuugvr9XZEWL72h9Wu8zfpFFWCjgz_A1o2-jMTn4o1myyop1OWJjGmzdueCT0FnnsJA0tsXYnWHdLcOr-5QAg12wXKH2-s0EU5M6Itx0VUlQ6R3Rns';

    resetButton.addEventListener("click", resetSearch);
    searchInput.addEventListener("calciteInputTextInput", limitSearch);
    searchButton.addEventListener("click", performSearch);

    function resetSearch() {
        searchInput.value = "";
        searchButton.disabled = true;
    }

    function limitSearch() {
        searchButton.disabled = searchInput.value.length <= 2;
    }

    async function performSearch() {
        const searchText = searchInput.value;
        const searchURL = buildSearchURL(searchText);
        
        try {
            const geocodeResult = await geocodeAddress(searchURL);
            await moveToLocation(geocodeResult.location);
            addGraphicToMap(geocodeResult.location);
            updateLocationList(geocodeResult.address);
        } catch (error) {
            console.error(error.message);
        }
    }

    function buildSearchURL(address) {
        return `https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?address=${address}&outFields=*&f=json&token=${apiKey}`;
    }

    async function geocodeAddress(url) {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        
        const candidate = data.candidates[0];
        return {
            address: candidate.address,
            location: candidate.location
        };
    }

    async function moveToLocation(location) {
        await map.goTo({
            target: [location.x, location.y],
            zoom: 9
        }, {
            duration: 2000
        });
    }

    function addGraphicToMap(location) {
        const graphic = new Graphic({
            geometry: new Point({
                latitude: location.y,
                longitude: location.x
            }),
            symbol: {
                type: "simple-marker",
                color: [0, 0, 255, 1],
                size: 30,
                style: "circle",
                outline: {
                    width: 1,
                    color: [255, 255, 255, 1]
                }
            }
        });

        const graphicsLayer = new GraphicsLayer({
            graphics: [graphic]
        });

        map.addLayer(graphicsLayer);
    }

    function updateLocationList(address) {
        locationsListLabel.hidden = false;
        const listItem = document.createElement("calcite-list-item");
        const listItemIcon = document.createElement("calcite-icon");
        listItemIcon.setAttribute("icon", "pin-tear-f");
        listItemIcon.setAttribute("scale", "s");
        listItemIcon.setAttribute("slot", "content-start");
        listItem.setAttribute("label", address);
        listItem.appendChild(listItemIcon);
        locationsList.appendChild(listItem);
    }
});
