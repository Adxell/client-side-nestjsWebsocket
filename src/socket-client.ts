import { Manager } from 'socket.io-client'

import { Socket } from 'socket.io-client'

export const connectToServer = ( token: string ) => {
    const manager = new Manager('http://localhost:3000/socket.io/socket.io.js', {
        extraHeaders: {
            hola: 'mundo',
            authentication: token
        }
    })

    const socket =  manager.socket('/')

    addListeners(socket)
}


const addListeners = ( socket: Socket ) => {
    const serverStatusLabel = document.querySelector<HTMLSpanElement>('#server-status')!;
    const clientUl = document.querySelector('#clients-ul')!;

    const messageForm = document.querySelector<HTMLFormElement>('#message-form')!
    const messageInput = document.querySelector<HTMLInputElement>('#message-input')!
    const messagesUl = document.querySelector<HTMLUListElement>('#messagesUl')!


    socket.on('connect', () => {
        serverStatusLabel.innerHTML = 'connected'
    } )
    socket.on('disconnect', () => {
        serverStatusLabel.innerHTML = 'disconnected'
    })
    socket.on('clients-updated', (clients: string[]) => {
        let clientHTMl = '';
        clients.forEach( clientID => {
            clientHTMl += `
                <li>${ clientID }</li>
            `
        })

        clientUl.innerHTML = clientHTMl;
    })

    messageForm.addEventListener('submit', (event)=> {
        event.preventDefault();
        if ( messageInput.value.trim().length <= 0 ) return

        socket.emit('message-from-client', 
            { id: 'YO!', message: messageInput.value }
        )

        messageInput.value=''
    })

    socket.on('message-from-server', ( payload: { fullName: string, message: string } )=> {
        
        let  newMessage = `
         <li>
          <strong>${ payload.fullName }</strong>
          <span>${ payload.message }</span>
        </li>
        `
        const li = document.createElement('li');
        li.innerHTML = newMessage
        messagesUl.append(li)
    })
}