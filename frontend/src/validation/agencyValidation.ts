export const validateFirstName=(Name:string):boolean=>{
    return Name.trim() == ""?false:true;
}

export const validateLastName=(Name:string):boolean=>{
    return Name.trim() == ""?false:true;
}

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

export const validatePassword = (password: string): boolean => {
    return password.trim().length >= 6;
}
