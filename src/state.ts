import { rtdb } from "./rtdb"
import map from "lodash/map"

const API_BASE_URL = "https://chatrooms-render-test.onrender.com"
type Message = {
    from: string,
    message: string
}

const state = {
    data: {
        nombre: "",
        email: "",
        userId: "",
        publicRoomId: "",
        privateRoomId: "",
        messages: []
    },
    listeners: [],
    init(roomId: string) {
        const chatroomsRef = rtdb.ref(`/rooms/${roomId}`)
        const currentState = state.getState();
        chatroomsRef.on("value", (snap) => {
            const messagesFromServer = snap.val();
            const messagesList = map(messagesFromServer.messages)
            currentState.messages = messagesList;
            this.setState(currentState)
        })
    },
    getState: () => {
        return state.data
    },

    setLogin(nombre: string, email: string, id: string) {
        const currentState = state.getState();
        currentState.nombre = nombre;
        currentState.email = email;
        currentState.userId = id;
        state.setState(currentState)
    },
    pushMessage(message: Message) {
        const cs = state.getState()
        const roomId = cs.publicRoomId
        const info = { message, roomId }
        fetch(`${API_BASE_URL}/messages`, {
            method: "post",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(info)
        })
    },

    setState(newState: any) {
        this.data = newState
        for (const cb of state.listeners) {
            cb();
        }
    },


    subscribe(callback: Function) {
        state.listeners.push(callback)
    },

    authUser(emailInputEl) {
        return fetch(`${API_BASE_URL}/auth`, {
            method: "post",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                email: emailInputEl.value,
            })
        })
    },

    signIn(emailInputEl: string) {

        return fetch(`${API_BASE_URL}/signup`, {
            method: "post",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                email: emailInputEl.trim()
            })
        })
    },

    setRoomIds(publicId: string, privateId: string) {
        const currentState = state.getState();
        currentState.publicRoomId = publicId;
        currentState.privateRoomId = privateId
        state.setState(currentState)
    },

    createNewRoom() {
        const cs = state.getState()
        return fetch(`${API_BASE_URL}/rooms`, {
            method: "post",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ userId: cs.userId })
        })
    },

    searchRoom(id: string) {
        const cs = state.getState();
        return fetch(`${API_BASE_URL}/rooms/${id}?userId=${cs.userId}`)
    }

}


export { state }