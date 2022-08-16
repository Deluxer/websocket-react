import { Manager, Socket } from 'socket.io-client'

let socket: Socket;

export const connectToServer = (token: string) => {
    
    const manager = new Manager('https://teslo-nestjs-db.herokuapp.com/socket.io/socket.io.js', {
        extraHeaders: {
                hola: 'mundo',
                authentication: token
        }
    });
    
    
    socket?.removeAllListeners();
    socket = manager.socket('/');
    
    addListener();
}

const addListener = () => {
    const serverStatusLabel = document.querySelector('#server-status')!;
    const clientUl = document.querySelector('#clients-ul')!;
    const messageUl = document.querySelector<HTMLUListElement>('#messages-ul')!;
    const messageForm = document.querySelector<HTMLFormElement>('#message-form')!;
    const messageInput = document.querySelector<HTMLInputElement>('#message-input')!;

    socket.on('connect', () => {
        serverStatusLabel.innerHTML = 'connected';
    })

    socket.on('disconnect', () => {
        serverStatusLabel.innerHTML = 'diconnected';
    });

    socket.on('clients-updated', (clients: string[]) => {
        let clientsHtml = '';
        clients.forEach(clientId => {
            clientsHtml +=  `
                <li>${ clientId}</li>
            `
        })

        clientUl.innerHTML = clientsHtml;
    })

    messageForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if(messageInput.value.trim().length <= 0) return;

        socket.emit('message-from-client', {
            id: 'Yo',
            message: messageInput.value
        });

        messageInput.value = '';
    });

    socket.on('message-from-server', (payload: { fullName: string, message: string }) => {
        const newMessage = `
            <li>
                <strong>${ payload.fullName }</strong>
                <strong>${ payload.message }</strong>
            </li>
        `;

        const li = document.createElement('li');
        li.innerHTML = newMessage;;
        messageUl.append(li);

    })
}