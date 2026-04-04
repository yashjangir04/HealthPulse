const Appointment = require("../models/appointment-model");
const crypto = require('crypto');

const getAppointments = async (req, res) => {
    const userID = req.user.id;
    const appointments = await Appointment.find({
        $or: [
            { patientID: userID },
            { doctorID: userID }
        ]
    }).populate("patientID doctorID").lean();

    return res.status(200).send(appointments);
}

const getAppointmentDetails = async (req, res) => {
    const { meetingID } = req.body;
    try {
        const appointment = await Appointment.findOne({ roomID: meetingID }).populate("patientID doctorID").lean();
        return res.status(200).json(appointment);
    } catch (err) {
        return res.status(500).json({ msg: "Failed to get appointment details" });
    }
}

const endAppointment = async (req, res) => {
    console.log("----------------hello---------------")
    const { meetingID } = req.body;
    
    try {
        await Appointment.updateOne({ roomID: meetingID }, { $set: { status: "completed", endTime: new Date(), notes: req.body.notes, prescribedMedicines: req.body.prescriptions } });
        return res.status(200).json({ msg: "Meeting status updated successfully" });
    } catch (err) {
        return res.status(500).json({ msg: "Failed to update meeting status" });
    }
}

const cancelAppointment = async (req, res) => {
    const { meetingID } = req.body;

    try {
        await Appointment.updateOne({ _id: meetingID }, { $set: { status: "cancelled" } })
        return res.status(200).json({ msg: "Meeting status updated successfully" });
    } catch (err) {
        return res.status(500).json({ msg: "Failed to update meeting status" });
    }
}

const scheduleAppointment = async (req, res) => {
    const { startTime, patientID, doctorID } = req.body;

    try {
        await Appointment.create({
            roomID: crypto.randomUUID(),
            startTime: startTime,
            patientID,
            doctorID,
            status: "upcoming",
            type: "scheduled"
        });
        return res.status(200).json({ msg: "Appointment scheduled successfully" });
    }
    catch (err) {
        return res.status(500).json({ msg: "Failed to schedule appointment" });
    }
}

const rescheduleAppointment = async (req, res) => {
    const { startTime, meetingID } = req.body;

    try {
        await Appointment.updateOne(
            {
                _id: meetingID
            },
            {
                $set: {
                    startTime: startTime,
                    type: "scheduled",
                    status: "upcoming"
                }
            }
        );
        return res.status(200).json({ msg: "Appointment rescheduled successfully" });
    }
    catch (err) {
        return res.status(500).json({ msg: "Failed to reschedule appointment" });
    }
}

const updateAppointmentStatus = async (req, res) => {
    const { status, meetingID, startTime } = req.body;

    try {
        await Appointment.updateOne(
            {
                _id: meetingID
            },
            {
                $set: {
                    status: status,
                    startTime: startTime
                }
            }
        );
        return res.status(200).json({ msg: "Appointment status updated successfully" });
    }
    catch (err) {
        return res.status(500).json({ msg: "Failed to update appointment status" });
    }
}

const getMedicines = async (req, res) => {
    const { meetingID } = req.body;
    try {
        const appointment = await Appointment.findOne({ roomID: meetingID }).lean() ;
        return res.status(200).json(appointment.prescribedMedicines);
    } catch (err) {
        return res.status(500).json({ msg: "Failed to get appointment details" });
    }
}

module.exports = {
    getAppointments,
    endAppointment,
    cancelAppointment,
    scheduleAppointment,
    rescheduleAppointment,
    updateAppointmentStatus,
    getAppointmentDetails,
    getMedicines
}