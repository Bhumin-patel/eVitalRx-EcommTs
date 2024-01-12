interface Config {
    PORT: number,
    JWT_SECRET: string,
    JWT_EXPIRE: string
}

export const config: Config = {
    PORT: 3000,
    JWT_SECRET: 'thisis1secretket', 
    JWT_EXPIRE: '1d'
}