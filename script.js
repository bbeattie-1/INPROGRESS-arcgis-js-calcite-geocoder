require(["esri/geometry/Geometry"], (Geometry) => { 

    const map = document.getElementById("map")
    const searchButton = document.getElementById("search-button")
    const searchInput = document.getElementById("search-input")
    
    
    searchButton.addEventListener("click", function () {
        const apiKey = '3NKHt6i2urmWtqOuugvr9WfBvPe1YBsbHay93aGXF34W4vRAhlHaV0stg9eGROkyYdkxAXdRIwyEtqQDVjTubtMbMGdnt6D9EURKrmS0LnFYhbqUHN6m1Rz30ZlM8zGN'
        let searchText = searchInput.value
        let searchURL = `https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?address=${searchText}&outFields=*&f=json&token=${apiKey}`
    
        async function geocode() {
            try {
                const response = await fetch(searchURL)
                const geocodeJSON = await response.json()
                const geocodedAddressResult = await geocodeJSON.candidates[0]
                const { address, extent, location} = geocodedAddressResult
                const geometry = new Geometry()
                geometry.extent = extent
                map.goTo(geometry)
            } 
            catch (error) {
                console.error(error.message)
            }
        }
    
        geocode()
    
    })
 });