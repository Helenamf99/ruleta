function validatePassword(password) {
    const regexPassword = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    return regexPassword.test(password);
}

function passwordsMatch(pass1, pass2) {
    return pass1 === pass2;
}

function validarUsuario(nombreUsuario) {
    return nombreUsuario.length >= 3;
}

function validarEmail(email) {
    return email.includes("@") && email.includes(".");
}

function obtenerTop3(ranking) {
    return ranking.slice(0, 3);
}


test('valid password should return true', () => {
    expect(validatePassword("Password123!")).toBe(true);
});

test('invalid password should return false', () => {
    expect(validatePassword("password")).toBe(false);
});

test('matching passwords should return true', () => {
    expect(passwordsMatch("1234", "1234")).toBe(true);
});

test('different passwords should return false', () => {
    expect(passwordsMatch("1234", "abcd")).toBe(false);
});

test('valid username should return true', () => {
    expect(validarUsuario("Dani")).toBe(true);
});

test('short username should return false', () => {
    expect(validarUsuario("ab")).toBe(false);
});

test('valid email should return true', () => {
    expect(validarEmail("test@gmail.com")).toBe(true);
});

test('invalid email should return false', () => {
    expect(validarEmail("testgmailcom")).toBe(false);
});

test('ranking should only return top 3 players', () => {
    const ranking = [
        { nombre: "Jugador1" },
        { nombre: "Jugador2" },
        { nombre: "Jugador3" },
        { nombre: "Jugador4" }
    ];

    expect(obtenerTop3(ranking).length).toBe(3);
});

