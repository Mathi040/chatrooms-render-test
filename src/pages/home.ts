import { Router } from '@vaadin/router';
import { state } from '../state';

class Home extends HTMLElement {
    connectedCallback() {
        this.render();
        this.showRoomIdElement()
        this.sendForm()
    }

    sendForm() {
        const formEl = document.querySelector(".login-form");

        const emailInputEl = document.getElementById("email") as HTMLInputElement
        const nameInputEl = document.getElementById("name") as HTMLInputElement
        const roomSelectEl = document.getElementById("rooms") as HTMLSelectElement
        const roomIdEl = document.getElementById("roomId") as HTMLInputElement

        formEl!.addEventListener("submit", (e) => {
            const emailValue = emailInputEl.value
            const nameValue = nameInputEl.value
            const roomValue = roomSelectEl.value //new-room existing-room
            const roomId = roomIdEl.value;
            e.preventDefault();


            state.authUser(emailInputEl).then(authRes => {
                if (authRes.ok) {
                    authRes.json().then(authData => {
                        let userId = authData.id
                        resolveLogin(userId);
                    })
                } else {
                    resolveSignIn();
                }
            })

            function resolveSignIn() {
                state.signIn(emailValue).then(signInRes => {
                    if (!signInRes.ok) {
                        alert("Mail invalido")
                    } else {
                        signInRes.json().then(signInData => {
                            const userId = signInData.id
                            resolveLogin(userId)
                        })
                    }
                })
            }


            function resolveLogin(id: string) {
                state.setLogin(nameValue, emailValue, id)
                resolveRoomSelection();
            }

            function resolveRoomSelection() {
                if (roomValue == "new-room") {
                    state.createNewRoom().then(roomRes => {
                        roomRes.json().then(roomData => {
                            const privateId = roomData.privateId
                            const publicId = roomData.publicId;
                            state.setRoomIds(publicId, privateId)
                            state.init(privateId)
                            Router.go("/chatroom")
                        })
                    })
                } else if (roomValue == "existing-room") {
                    state.searchRoom(roomId).then(roomRes => {
                        if (roomRes.ok) {
                            roomRes.json().then(roomData => {
                                const privateId = roomData.privateId
                                const publicId = roomData.publicId;
                                state.setRoomIds(publicId, privateId)
                                state.init(privateId)
                                Router.go("/chatroom")
                            })

                        } else {
                            console.log("error");
                        }

                    })
                }
            }
        })


    }

    showRoomIdElement() {
        const roomSelectEl = document.getElementById("rooms") as HTMLOptionElement
        const roomIdEl = document.getElementById("room-id")

        roomSelectEl.addEventListener("change", () => {
            if (roomSelectEl.value === "existing-room") {
                roomIdEl!.style.display = "block"
            } else {
                roomIdEl!.style.display = 'none';
            }
        })
    }

    render() {
        this.innerHTML = `
        <style>
        #room-id {
            display: none;
        }
        .content {
            background-color: rgb(222, 233, 233);
            padding: 30px;
            width: 70vw;
            height: 90vh;
            border-radius: 2%;
            display: flex;
            flex-direction: column;
            gap: 50px;
        }

        h1 {
            margin: 0;
            text-align: center;
            font-size: 4rem;
        }

        .login-form {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        label,
        option {
            font-size: 2rem;
            text-align: center;
        }

        input,
        select {
            height: 3rem;
            max-width: 100%;
            font-size: 2rem;
        }

        .button-container {
            margin-top: 30px;
            text-align: center;
        }

        button {
            height: 3rem;
            width: 10rem;
            font-size: 2rem;
            border: none;
            background-color: rgb(200, 252, 166);
            color: black;
        }

        button:hover {
            cursor: pointer;
            background-color: rgb(91, 143, 57);
            color: white;
        }
        </style>

        
    <div class="content">
        <h1>Chatrooms</h1>
        <form class="login-form">
          <div>
            <label for="email">Email</label>
          </div>
          <input type="text" id="email" />
          <div>
            <label for="name">Nombre</label>
          </div>
          <input type="text" id="name" />
          <div>
            <label for="rooms">Room</label>
          </div>
          <select name="rooms" id="rooms">
            <option value="new-room">Nueva Sala</option>
            <option value="existing-room">Sala Existente</option>
          </select>
          <div id="room-id">
            <div>
              <label for="room-id">Room ID</label>
            </div>
            <input type="text" / id="roomId">
          </div>
          <div class="button-container">
            <button type="submit">Entrar</button>
          </div>
        </form>
    </div>
        `
    }
}

customElements.define("home-page", Home)