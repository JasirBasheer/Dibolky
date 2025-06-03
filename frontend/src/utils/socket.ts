import io from 'socket.io-client'

const createSocketConnection = () => {
    return io('http://backend:5050')
}

export default createSocketConnection