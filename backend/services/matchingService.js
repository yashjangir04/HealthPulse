// ‼️Attach user requirement(doctor speciality) in the User data with request

const crypto = require('crypto') ;
const Appointment = require("../models/appointment-model") ;

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
    let speciality = doctor.speciality;

    if (!doctors[speciality]) {
        doctors[speciality] = new Set();
    }
    doctors[speciality].add(doctor);
    tryMatch();
}

const addPatient = (patient) => {
    let requirement = patient.requirement;

    if (!patientQueue[requirement]) {
        patientQueue[requirement] = [];
    }
    patientQueue[requirement].push(patient);
    tryMatch();
}

const removePatient = (patient) => {
    let requirement = patient.requirement;

    if (patientQueue[requirement]) {
        patientQueue[requirement] = patientQueue[requirement].filter((p) => p._id !== patient._id);
    }
    tryMatch();
}

const removeDoctor = (doctor) => {
    let speciality = doctor.speciality;

    if (doctors[speciality]) {
        doctors[speciality] = new Set(
            [...doctors[speciality]].filter(
                (d) => d._id !== doctor._id
            )
        );
    }
    tryMatch();
}

// helper function
const popFromSet = (set) => {
    if (set.size === 0) return null;

    const value = set.values().next().value;
    set.delete(value);
    return value;
}

const tryMatch = () => {
    // Primarily matching the specialists, then we have two types of patients left -> specialist(can't map) + general(if we have enough general doctors then good else try to map them with the specialists which will tell them what type of doctor they need)
    for (let speciality in doctors) {
        if (speciality === "general") continue;

        while (doctors[speciality].size > 0 && patientQueue[speciality]?.length > 0) { // ? return undefined <=> false, otherwise error :)
            let selectedDoctor = popFromSet(doctors[speciality]);
            let selectedPatient = patientQueue[speciality].shift(); // pair the patient who entered the queue early
            createRoom(selectedDoctor, selectedPatient);
        }
    }

    while (doctors.general.size > 0 && patientQueue.general.length > 0) {
        let selectedDoctor = popFromSet(doctors.general);
        let selectedPatient = patientQueue.general.shift(); // pair the patient who entered the queue early
        createRoom(selectedDoctor, selectedPatient);
    }

    for (let speciality in doctors) {
        if (patientQueue.general.length === 0) break;
        if (speciality === "general" || doctors[speciality].size === 0) continue;

        while (doctors[speciality].size > 0 && patientQueue.general.length > 0) {
            let selectedDoctor = popFromSet(doctors[speciality]);
            let selectedPatient = patientQueue.general.shift();
            createRoom(selectedDoctor, selectedPatient);
        }
    }
}

const createRoom = async (doctor, patient) => {
    let roomID = crypto.randomUUID();
    let payload = {
        doctorID: doctor._id , 
        patientID: patient._id ,
        roomID: roomID
    }

    let date = new Date ;
    await Appointment.create({
        roomID ,
        startTime : date ,
        doctorID : doctor._id ,
        patientID : patient._id
    });
}

module.exports = {
    addDoctor,
    addPatient,
    removeDoctor,
    removePatient
}