const mongoose = require("mongoose");


// Schema for cancelled rides by a driver
const CancelledRidesByDriverSchema = new mongoose.Schema({
  driverId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Driver" },
  rides: [{ 
    rideId: { type: mongoose.Schema.Types.ObjectId, ref: "Ride" },
    reasonForCancellation: { type: String },
    cancelledAt: { type: String } // Using string format for consistency with your other timestamp fields
  }]
});

// Schema for completed rides by a driver
const CompletedRidesByDriverSchema = new mongoose.Schema({
  driverId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Driver" },
  rideIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ride" }], // Array of ride IDs
});



// Models
const CancelledRidesByDriver = mongoose.model("CancelledRidesByDriver", CancelledRidesByDriverSchema);
const CompletedRidesByDriver = mongoose.model("CompletedRidesByDriver", CompletedRidesByDriverSchema);


module.exports = {
  CancelledRidesByDriver,
  CompletedRidesByDriver,
};
