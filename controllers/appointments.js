const Appointment = require("../models/Appointment");
const Hospital = require("../models/Hospital");

exports.getAppointments = async (req, res, next) => {
  let query;
  console.log("get");
  //General users can see only their appointments!
  if (req.user.role !== "admin") {
    console.log("not admin");
    query = Appointment.find({ user: req.user.id }).populate({
      path: "hospital",
      select: "name province tel",
    });
  } else {
    console.log("admin");
    query = Appointment.find().populate({
      path: "hospital",
      select: "name province tel",
    });
    //If you are an admin, you can see all!
    // if (req.params.hospitalId) {
    //   query = Appointment.find({ hospital: req.params.hospitalId }).populate({
    //     path: "hospital",
    //     select: "name province tel",
    //   });
    // } else {
    //   query = Appointment.find().populate({
    //     path: "hospital",
    //     select: "name province tel",
    //   });
    // }
  }
  try {
    const appointments = await query;
    res
      .status(200)
      .json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find Appointment" });
  }
};

exports.getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate({
      path: "hospital",
      select: "name province tel",
    });
    if (!appointment)
      return res
        .status(404)
        .json({ success: false, msg: "Appointment not found" });
    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find Appointment" });
  }
};

exports.addAppointment = async (req, res, next) => {
  try {
    req.body.hospital = req.params.hospitalId;

    const hospital = await Hospital.findById(req.params.hospitalId);

    if (!hospital) {
      return res.status(404).json({
        success: false,
        msg: `Hospital not found with the id of ${req.params.hospitalId}`,
      });
    }

    req.body.user = req.user.id;
    const existedAppointments = await Appointment.find({ user: req.user.id });
    if (existedAppointments.length >= 3 && req.user.role !== "admin") {
      return res.status(400).json({
        success: false,
        msg: `The user with ID ${req.user.id} can only book 3 appointments.`,
      });
    }

    const appointment = await Appointment.create(req.body);

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot add Appointment" });
  }
};

exports.updateAppointment = async (req, res, next) => {
  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(
        (404).json({
          success: false,
          msg: `Appointment not found with the id of ${req.params.id}`,
        })
      );
    }
    //Make sure the user is the appointment owner
    if (
      appointment.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        msg: `User not authorized to update this appointment.`,
      });
    }

    appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: "Cannot update appointment" });
  }
};

exports.deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(
        (404).json({
          success: false,
          msg: `Appointment not found with the id of ${req.params.id}`,
        })
      );
    }

    //Make sure the user is the appointment owner
    if (
      appointment.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        msg: `User not authorized to update this appointment.`,
      });
    }

    appointment.remove();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Cannot delete appointment" });
  }
};
