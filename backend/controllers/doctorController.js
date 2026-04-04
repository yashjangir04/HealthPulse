const Doctor = require("../models/doctor-model");

exports.addDoctor = async (req, res) => {
    try {
        const { name, email, password, dob, gender, phoneNumber, specialization, address, qualification, university } = req.body;

        if (!name || !email || !password || !dob || !gender || !phoneNumber || !specialization || !address || !qualification || !university) {
            return res.status(400).send({ msg: "Please provide all the required fields ❌" });
        }
        const hashedPassword = await hashPassword(password);
        const query = `${address.city} ${address.state} India`;
        const coords = await getCoordinates(query);

        address.location = {
            type: "Point",
            coordinates: coords
        };

        try {
            await new Doctor({
                name, email, password: hashedPassword, dob, gender, phoneNumber, specialization, address, qualification, university
            }).save();
            return res.status(201).send({ msg: "Doctor created successfully ✅" });
        } catch (error) {
            return res.status(500).send({ msg: error.message });
        }
    } catch (err) {
        return res.status(500).send({ msg: err.message });
    }
};

exports.getDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find({ isActive: true });
        return res.status(200).send(doctors);
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
};

exports.deleteDoctor = async (req, res) => {
    try {
        await Doctor.findByIdAndUpdate(req.user.id, { $set: { isActive: false } });
        return res.status(200).send({ msg: "Doctor deleted successfully ✅" });
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
};

exports.getDoctorDetails = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.user.id).populate("address");
        return res.status(200).json(doctor);
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
};      