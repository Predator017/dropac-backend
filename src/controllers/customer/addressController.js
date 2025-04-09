const Address = require('../../models/customer/CustomerAddress');
const customerLogger = require('../../utils/logger/customerLogger');

// Add New Address
exports.addAddress = async (req, res) => {
  const { addressLine, city, postalCode, type, name, phoneNumber, latitude, longitude } = req.body;
  try {
    const newAddress = new Address({
      userId: req.user.userId,
      addressLine,
      city,
      postalCode,
      type,
      name,
      phoneNumber,
      latitude,
      longitude
    });
    await newAddress.save();
    customerLogger.info(`Address added successfully userid: ${req.user.userId} addressid: ${newAddress._id}`);
    res.status(201).json({ message: 'Address added successfully', addressId: newAddress._id });
  } catch (error) {
    customerLogger.error(`Adding address failed userid: ${req.user.userId} error: ${error}`);
    res.status(500).json({ message: 'Adding address failed', error });
  }
};

// Get Saved Addresses
exports.getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user.userId });
    res.status(200).json(addresses);
  } catch (error) {
    customerLogger.error(`Fetching addresses failed userid: ${req.user.userId} error: ${error}`);
    res.status(500).json({ message: 'Fetching addresses failed', error });
  }
};

// Get Address By Id
exports.getAddressById = async (req, res) => {
  try {
    const address = await Address.findById(req.params.addressId);
    res.status(200).json(address);
  } catch (error) {
    customerLogger.error(`Fetching address failed userid: ${req.user.userId} error: ${error}`);
    res.status(500).json({ message: 'Fetching address failed', error });
  }
};

// Update Address
exports.updateAddress = async (req, res) => {
  const { addressLine, city, postalCode, type, name, phoneNumber, latitude, longitude } = req.body;
  try {
    await Address.findByIdAndUpdate(req.params.addressId, {
      addressLine,
      city,
      postalCode,
      type,
      name,
      phoneNumber,
      latitude,
      longitude
    });
    customerLogger.info(`Address updated successfully userid: ${req.user.userId}, addressid: ${req.params.addressId}`);
    res.status(200).json({ message: 'Address updated successfully' });
  } catch (error) {
    customerLogger.error(`Updating address failed userid: ${req.user.userId}, error: ${error}`);
    res.status(500).json({ message: 'Updating address failed', error });
  }
};

// Delete Address
exports.deleteAddress = async (req, res) => {
  try {
    await Address.findByIdAndDelete(req.params.addressId);
    customerLogger.info(`Address deleted successfully userid: ${req.user.userId}, addressid: ${req.params.addressId}`);
    res.status(200).json({ message: 'Address deleted successfully' });
  } catch (error) {
    customerLogger.error(`Deleting address failed userid: ${req.user.userId}, error: ${error}`);
    res.status(500).json({ message: 'Deleting address failed', error });
  }
};
