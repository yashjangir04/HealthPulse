const Patient = require("../models/patient-model");
const Doctor = require("../models/doctor-model");
const Shopkeeper = require("../models/shopkeeper-model");
const bcrypt = require("bcrypt");

const generateToken = require("../utils/generateToken");
const hashPassword = require("../utils/hashPassword");
const getCoordinates = require("../utils/getCoordinates");
const setTokenCookie = require("../utils/setTokenCookie");

exports.doctorSignUp = async (req, res) => {
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
};

exports.patientSignUp = async (req, res) => {
    const { name, email, password, dob, gender, phoneNumber, bloodGroup, address, primaryContacts } = req.body;

    if (!name || !email || !password || !dob || !gender || !phoneNumber || !bloodGroup || !address || !primaryContacts) {
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
        await new Patient({
            name, email, password: hashedPassword, dob, gender, phoneNumber, bloodGroup, address, primaryContacts
        }).save();
        return res.status(201).send({ msg: "Patient created successfully ✅" });
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
};

exports.shopkeeperSignUp = async (req, res) => {
    const { ownerName, email, password, shopName, phoneNumber, address } = req.body;

    if (!ownerName || !email || !password || !shopName || !phoneNumber || !address) {
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
        await new Shopkeeper({
            ownerName, email, password: hashedPassword, shopName, phoneNumber, address
        }).save();
        return res.status(201).send({ msg: "Shopkeeper created successfully ✅" });
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ msg: "Please provide all the required fields ❌" });
    }

    try {
        const existingDoctor = await Doctor.findOne({ email });
        if (existingDoctor) {
            const isPasswordCorrect = await bcrypt.compare(password, existingDoctor.password);
            if (!isPasswordCorrect) {
                return res.status(401).send({ msg: "Incorrect Credentials ❌" });
            }

            const token = await generateToken(existingDoctor, "doctor");
            setTokenCookie(res, token);

            return res.status(200).send({ msg: "Login successful ✅" });
        }


        const existingPatient = await Patient.findOne({ email });
        if (existingPatient) {
            const isPasswordCorrect = await bcrypt.compare(password, existingPatient.password);
            if (!isPasswordCorrect) {
                return res.status(401).send({ msg: "Incorrect Credentials ❌" });
            }
            const token = await generateToken(existingPatient, "patient");
            setTokenCookie(res, token);
            return res.status(200).send({ msg: "Login successful ✅" });
        }



        const existingShopkeeper = await Shopkeeper.findOne({ email });
        if (existingShopkeeper) {
            const isPasswordCorrect = await bcrypt.compare(password, existingShopkeeper.password);
            if (!isPasswordCorrect) {
                return res.status(401).send({ msg: "Incorrect Credentials ❌" });
            }
            const token = await generateToken(existingShopkeeper, "shopkeeper");
            setTokenCookie(res, token);
            return res.status(200).send({ msg: "Login successful ✅" });
        }
        return res.status(404).send({ msg: "User not found ❌" });
    } catch (err) {
        return res.status(500).send({ msg: err.message });
    }
};

exports.getMe = async (req, res) => {
    try {
        let user = await Doctor.findById(req.user.id)
            .select("-password")
            .lean(); // lean return common JS object as simply doing user.role just does it in memory no in the response

        if (user) {
            user.role = "doctor";
            return res.status(200).json({ user });
        }

        user = await Patient.findById(req.user.id)
            .select("-password")
            .lean();

        if (user) {
            user.role = "patient";
            return res.status(200).json({ user });
        }

        user = await Shopkeeper.findById(req.user.id)
            .select("-password")
            .lean();

        if (user) {
            user.role = "shopkeeper";
            return res.status(200).json({ user });
        }

        return res.status(404).json({ msg: "User not found ❌" });

    } catch (error) {
        console.error("getMe error:", error);
        return res.status(500).json({ msg: "Server error ❌" });
    }
};

exports.logout = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        path: "/",
    });

    res.status(200).json({ message: "Logged out" });
}