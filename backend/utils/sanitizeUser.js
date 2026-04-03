const sanitizeUser = async (user) => {
    const { id, name, role } = user;

    return {
        id, name, role
    };
}

module.exports = sanitizeUser;