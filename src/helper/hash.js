import bcryptjs from 'bcryptjs'

const SALT = 10

export const createHash = async(data) => {
    const salt = await bcryptjs.genSalt(SALT)
    const hash = await bcryptjs.hash(data,salt)
    return hash
}

export const hashCompare = async(data,hash) => {
    return await bcryptjs.compare(data,hash)
}

