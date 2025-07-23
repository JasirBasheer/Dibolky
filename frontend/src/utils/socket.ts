import io from 'socket.io-client'

const createSocketConnection = () => {
    return io(import.meta.env.VITE_BACKEND || 'http://localhost:5050',{
        withCredentials: true
    })
}

export default createSocketConnection