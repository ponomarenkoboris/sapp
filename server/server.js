const io = require('socket.io')(5000)

io.on('connection', socket => {
    const id = socket.handshake.query.id
    socket.join(id)

    socket.on('send-message', ({ recipients, text }) => {
        recipients.forEach(rec => {
            const newRec = recipients.filter(r => r !== rec)
            newRec.push(id)
            socket.broadcast.to(rec).emit('receive-message', {
                recipients: newRec, sender: id, text
            })
        })
    })
})