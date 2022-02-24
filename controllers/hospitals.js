const Hospital = require("../models/Hospital");

exports.getHospital = async (req, res, next) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital)
      return res.status(
        (400).json({ success: false, msg: "Hospital not found" })
      );

    res.status(200).json({ success: true, data: hospital });
  } catch (err) {
    res.status(404).json({ success: false, msg: err });
  }
};

exports.getHospitals = async (req, res, next) => {
  try {
    const hospitals = await Hospital.find();
    res
      .status(200)
      .json({ success: true, count: hospitals.length, data: hospitals });
  } catch (err) {
    res.status(404).json({ success: false, msg: err });
  }
};

exports.createHospital = async (req, res, next) => {
  console.log(req.body);
  const hospital = await Hospital.create(req.body);
  res.status(201).json({
    success: true,
    data: hospital,
  });
};

exports.updateHospital = async (req, res, next) => {
  try {
    const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!hospital)
      return res.status(
        (400).json({ success: false, msg: "Hospital not found" })
      );

    res.status(200).json({ success: true, data: hospital });
  } catch (err) {
    res.status(404).json({ success: false, msg: err });
  }
};
exports.deleteHospital = async (req, res, next) => {
  try {
    const hospital = await Hospital.findByIdAndDelete(req.params.id);
    if (!hospital)
      return res.status(
        (400).json({ success: false, msg: "Hospital not found" })
      );

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(404).json({ success: false, msg: err });
  }
};
