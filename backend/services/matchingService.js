// ‼️Attach user requirement(doctor speciality) in the User data with request

const crypto = require('crypto');
const Appointment = require("../models/appointment-model");

let io = null;

const setIO = (_io) => {
    io = _io;
}

const doctors = {
    general: new Set(),
    cardiologist: new Set(),
    gynecologist: new Set()
};

const patientQueue = {
    general: [],
    cardiologist: [],
    gynecologist: []
};

const addDoctor = (doctor) => {
    // SAFETY CHECK: Ensure doctor exists and has a valid string speciality
    if (!doctor?.speciality || typeof doctor.speciality !== 'string') return;

    let speciality = doctor.speciality.toLowerCase();

    if (!doctors[speciality]) {
        doctors[speciality] = new Set();
    }
    doctors[speciality].add(doctor);
    tryMatch();
}

const addPatient = (patient) => {
    // SAFETY CHECK: Ensure patient exists and has a valid string requirement
    if (!patient?.requirement || typeof patient.requirement !== 'string') return;

    let requirement = patient.requirement.toLowerCase();

    if (!patientQueue[requirement]) {
        patientQueue[requirement] = [];
    }
    patientQueue[requirement].push(patient);
    tryMatch();
}

const removePatient = (patient) => {
    // SAFETY CHECK: Exit early if data is malformed
    if (!patient?.requirement || typeof patient.requirement !== 'string') return;

    let requirement = patient.requirement.toLowerCase();

    if (patientQueue[requirement]) {
        patientQueue[requirement] = patientQueue[requirement].filter((p) => p?._id !== patient?._id);
    }
    tryMatch();
}

const removeDoctor = (doctor) => {
    // SAFETY CHECK: Exit early if data is malformed
    if (!doctor?.speciality || typeof doctor.speciality !== 'string') return;

    let speciality = doctor.speciality.toLowerCase();

    if (doctors[speciality]) {
        doctors[speciality] = new Set(
            [...doctors[speciality]].filter(
                (d) => d?._id !== doctor?._id
            )
        );
    }
    tryMatch();
}

// helper function
const popFromSet = (set) => {
    if (!set || set.size === 0) return null; // Added safety check for null sets

    const value = set.values().next().value;
    set.delete(value);
    return value;
}

const tryMatch = () => {
    // Primarily matching the specialists, then we have two types of patients left -> specialist(can't map) + general(if we have enough general doctors then good else try to map them with the specialists which will tell them what type of doctor they need)
    for (let speciality in doctors) {
        if (speciality === "general") continue;

        // Using ?. to ensure patientQueue[speciality] exists before checking length
        while (doctors[speciality]?.size > 0 && patientQueue[speciality]?.length > 0) { 
            let selectedDoctor = popFromSet(doctors[speciality]);
            let selectedPatient = patientQueue[speciality].shift(); // pair the patient who entered the queue early
            
            if (selectedDoctor && selectedPatient) {
                createRoom(selectedDoctor, selectedPatient);
            }
        }
    }

    // Checking if general queue exists before accessing length
    while (doctors.general?.size > 0 && patientQueue.general?.length > 0) {
        let selectedDoctor = popFromSet(doctors.general);
        let selectedPatient = patientQueue.general.shift(); 
        
        if (selectedDoctor && selectedPatient) {
            createRoom(selectedDoctor, selectedPatient);
        }
    }

    for (let speciality in doctors) {
        if (!patientQueue.general || patientQueue.general.length === 0) break;
        if (speciality === "general" || !doctors[speciality] || doctors[speciality].size === 0) continue;

        while (doctors[speciality]?.size > 0 && patientQueue.general?.length > 0) {
            let selectedDoctor = popFromSet(doctors[speciality]);
            let selectedPatient = patientQueue.general.shift();
            
            if (selectedDoctor && selectedPatient) {
                createRoom(selectedDoctor, selectedPatient);
            }
        }
    }
}

const createRoom = async (doctor, patient) => {
    // CRITICAL SAFETY: Check if we have all necessary IDs and the IO instance
    if (!doctor?._id || !patient?._id || !io) return;

    let roomID = crypto.randomUUID();
    let payload = {
        doctorID: doctor._id, 
        patientID: patient._id,
        roomID: roomID
    }

    let date = new Date();
    
    try {
        await Appointment.create({
            roomID,
            startTime: date,
            doctorID: doctor._id,
            patientID: patient._id
        });
        
        // Use ?. to safely emit only if the socket IDs exist
        if (doctor?.socket) io.to(doctor.socket).emit("matched", payload);
        if (patient?.socket) io.to(patient.socket).emit("matched", payload);
        
    } catch (error) {
        console.error("Failed to create appointment room in DB:", error);
        // Optional: emit an error back to the users here if needed
    }
}

module.exports = {
    addDoctor,
    addPatient,
    removeDoctor,
    removePatient,
    setIO
}