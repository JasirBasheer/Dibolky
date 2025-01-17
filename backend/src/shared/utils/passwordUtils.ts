import bcrypt from 'bcrypt'

export const hashPassword = async (password: string) => {
    try {
        const HashedPassword = await bcrypt.hash(password, 10)
        return HashedPassword
    } catch (error) {
        console.error(error)
        return null
    }
}

export const createPassword = async (name: string) =>{
    try {
        const base = name.replace(/\s+/g,"");
        const randomNumbers = Math.floor(Math.random() * 10000);
        const symbols = "!@#$%&";
        const randomSymbol = symbols[Math.floor(Math.random()* symbols.length)];
        const password =  `${base}${randomSymbol}${randomSymbol}${randomNumbers}`
        console.log(password)
        return password
    } catch (error) {
        console.error(error)
        return "client@123"
    }
}