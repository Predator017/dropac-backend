const Driver = require('../../models/driver/Driver');
const axios = require("axios");
const driverLogger = require('../../utils/logger/driverLogger');




exports.getNearbyDrivers = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ message: "Latitude and Longitude are required" });
    }

    // Fetch all online drivers grouped by bodyDetails
    const drivers = await Driver.find({ online: true });

    // Group drivers by vehicle type
    const vehicleGroups = {};
    drivers.forEach(driver => {
      let { bodyDetails, location } = driver;
      if (!bodyDetails || !location || !location.coordinates) return;


      const normalizedBodyDetails = bodyDetails.toLowerCase().trim();

      // Map bodyDetails to specific vehicle types
      if (normalizedBodyDetails.startsWith("7 feet")) {
        bodyDetails = "Tata Ace";
      } else if (normalizedBodyDetails.startsWith("8 feet")) {
        bodyDetails = "8ft Truck";
      } else if (normalizedBodyDetails.startsWith("9 feet")) {
        bodyDetails = "9ft Truck";
      }

      if (!vehicleGroups[bodyDetails]) vehicleGroups[bodyDetails] = [];
      vehicleGroups[bodyDetails].push({
        driverId: driver._id,
        lat: location.coordinates[1], // [longitude, latitude]
        lng: location.coordinates[0]
      });
    });

    //console.log(vehicleGroups);

    const apiKey = process.env.MAPS_API;
    if (!apiKey) {
      return res.status(500).json({ message: "Google Maps API key is missing" });
    }

    const fastestDrivers = [];

    // Fetch travel duration for each vehicle type
    for (const [bodyDetails, drivers] of Object.entries(vehicleGroups)) {
      let shortestDuration = Infinity;
      let bestDriver = null;

      for (const driver of drivers) {
        const { lat: driverLat, lng: driverLng } = driver;
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${lat},${lng}&destination=${driverLat},${driverLng}&mode=driving&sensor=false&key=${apiKey}`;

        try {
          const response = await axios.get(url);
          const data = response.data;

          if (data.routes.length > 0 && data.routes[0].legs.length > 0) {
            const duration = data.routes[0].legs[0].duration.value; 
            // in seconds
            if (duration < shortestDuration) {
              shortestDuration = duration;
              bestDriver = { 
                bodyDetails, 
                duration: `${Math.round(duration / 60)} mins` // Convert seconds to minutes
              };
            }
          }
        } catch (error) {
          driverLogger.error(`Error fetching route for ${bodyDetails}:, error: ${error}`);
        }
      }

      if (bestDriver) {
        fastestDrivers.push(bestDriver);
      }
    }

    res.status(200).json({ message: "Nearby drivers fetched", fastestDrivers });
  } catch (error) {
    driverLogger.error(`Error fetching nearby drivers error:${error}`);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};