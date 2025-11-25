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


.body {
  background-color: rgb(49, 49, 49);

}
.content {
  max-width: 1000px;
  padding: 30px;
}

.chat {
  background-color: rgb(207, 207, 207);
  height: 70vh;
}

.user {
  color: rgb(255, 0, 255);
}
h3 {
  color: rgb(255, 255, 255);
}
.input-msg {
  width: 100%;
  height: 50px;
  background-color: rgb(172, 172, 172);
  border: 1px solid rgb(102, 102, 102);
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