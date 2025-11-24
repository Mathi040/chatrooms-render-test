import { state } from '../state';
type Message = {
  from: string,
  message: string
}

class ChatPage extends HTMLElement {

  connectedCallback() {
    state.subscribe(() => {
      const currentState = state.getState();
      sessionStorage.setItem("state", JSON.stringify(currentState))
      this.messages = currentState.messages
      this.render()
      this.addListeners()

    })
    this.render();
    this.addListeners()
  }
  messages: Message[] = []
  addListeners() {
    const form = this.querySelector(".message-form");
    form.addEventListener("submit", e => {
      e.preventDefault()
      const cs = state.getState()
      const inputEl = this.querySelector(".input-msg") as HTMLInputElement;
      let inputMensaje = inputEl.value
      const mensaje = {
        from: cs.nombre,
        message: inputMensaje
      }
      state.pushMessage(mensaje)
      inputEl.value = ""
    })
  }
  render() {
    const ssState = sessionStorage.getItem("state");
    const cs = JSON.parse(ssState)
    this.innerHTML = `
        <style>

.chat {
  width: 450px;
  height: 550px;
  background-color: rgba(177, 175, 175, 0.514);
}
.user {
  color: purple;
}

.input-msg {
  width: 100%;
  height: 50px;
  background-color: beige;
  border: 1px solid black;
  font-size: 2rem;
}

button {
  width: 150px;
  height: 3rem;
}

.yo {
  background-color: rgb(196, 235, 157);
  text-align: right;
}

        </style>



      <div class="content">
        <h3>User: <span class= "user">${cs.nombre}</span></h3>
        <h3>Codigo de sala: ${cs.publicRoomId}</h3>
        <div class="chat"> ${this.messages.map(m => {
      const className = m.from == `${state.getState().nombre}` ? "yo" : "otro"
      return `<div class="${className}">${m.from}: ${m.message}</div>`
    }).join("")} </div>
        <div class="input-text">
          <form class= "message-form">
            <input type="text" class="input-msg" />
            <div>
              <button type="submit">Enviar</button>
            </div>
          </form>
        </div>
      </div>
        `
  }
}

customElements.define("chat-page", ChatPage)