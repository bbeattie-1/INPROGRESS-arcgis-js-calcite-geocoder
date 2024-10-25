require(["esri/layers/GraphicsLayer", "esri/Graphic", "esri/geometry/Point"], (GraphicsLayer, Graphic, Point) => { 

    const map = document.getElementById("map")
    const searchButton = document.getElementById("search-button")
    const resetButton = document.getElementById("reset-button")
    const searchInput = document.getElementById("search-input")

    resetButton.addEventListener("click", function () {
        searchInput.value = ""
    })
    
    
    searchButton.addEventListener("click", function () {
        const apiKey = '3NKHt6i2urmWtqOuugvr9bCPjgMFGEIN-pLwILbpge1DQLFBZZ69QIz7KVbYuprHCczm6O9oVomKg_21SLdLgmHMqPSpZXZOE5M_rHjjx8EmuWTHDlIw9aMHmccDgrQu'
        let searchText = searchInput.value
        let searchURL = `https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?address=${searchText}&outFields=*&f=json&token=${apiKey}`
        
        let geocodeLocation;

        async function geocode() {
            try {
                const response = await fetch(searchURL)
                const geocodeJSON = await response.json()
                const geocodedAddressResult = await geocodeJSON.candidates[0]
                const { address, extent, location} = geocodedAddressResult
                geocodeLocation = await location
                await map.goTo({
                    target: [location.x, location.y],
                    zoom: 9}, {
                        duration: 4000
                    })
            } 
            catch (error) {
                console.error(error.message)
            }
        }
    
        geocode().then(function() {
            console.log(geocodeLocation);
            const geocodeGraphic = new Graphic({
                geometry: new Point({
                    latitude: geocodeLocation.y,
                    longitude: geocodeLocation.x
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
                },
            })
    
            const geocodeGraphicsLayer = new GraphicsLayer({
                graphics: [geocodeGraphic]
            })

            map.addLayer(geocodeGraphicsLayer)
        })
    })
 });