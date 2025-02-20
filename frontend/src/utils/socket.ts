import io from 'socket.io-client'

const createSocketConnection = () => {
    return io('http://localhost:5000')
}

export default createSocketConnection