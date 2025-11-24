import { firestore, rtdb } from "./db"
import express from "express"
import cors from "cors";
import { nanoid } from "nanoid";
import path from 'path';


const app = express()
const port = 3000;
const usersDatabase = firestore.collection("users")
const roomsDatabase = firestore.collection("rooms")
const roomsRTDB = rtdb.ref("rooms/")

app.use(express.json());
app.use(cors())

//Chat
app.post('/messages', (req, res) => {
    const publicId = req.body.roomId;
    const mensaje = req.body.message;
    if (!publicId || !mensaje) {
        return res.status(400).json("No se leyó el room-id");
    }

    roomsDatabase.where("publicId", "==", publicId).get()
        .then(searchRes => {
            if (searchRes.empty) {
                return res.status(404).json("Ese room-id no se encontró en la base de datos");
            }

            const dataIDS = searchRes.docs[0].data();
            const privateId = dataIDS.privateId;
            const chatroomRef = rtdb.ref("/rooms/" + privateId);

            return chatroomRef.get()
                .then(snap => {
                    if (!snap.hasChild("messages")) {
                        // Crear el campo messages con el primer mensaje
                        return chatroomRef.update({
                            messages: [mensaje]
                        }).then(() => {
                            return res.status(200).json("Mensaje creado y agregado exitosamente");
                        });
                    } else {
                        // Agregar mensaje dentro de messages
                        const messagesRef = chatroomRef.child("messages");
                        return messagesRef.push(mensaje).then(() => {
                            return res.status(200).json("Mensaje agregado exitosamente");
                        });
                    }
                });
        })
        .catch(err => {
            console.error("Error en /messages:", err);
            return res.status(500).json("Error interno del servidor");
        });
});

//Rooooms
app.post('/signup', (req, res) => {
    let { email } = req.body
    if (email.trim() == "") {
        email = false;
    }
    if (email) {
        usersDatabase.where("email", "==", email).get().then(searchRes => {
            if (searchRes.empty) {
                usersDatabase.add({
                    email
                }).then((newUserRef) => {

                    res.status(200).json({
                        id: newUserRef.id,
                    })

                })
            } else {
                res.status(400).json({
                    message: "User already exists"
                })
            }
        })
    } else {
        res.status(400).json("Falta mail")
    }
})

app.post("/auth", (req, res) => {
    const { email } = req.body
    usersDatabase.where("email", "==", email).get().then(searchRes => {
        if (searchRes.empty) {
            res.status(400).json({
                message: "Not found"
            })
        } else {
            res.json({
                id: searchRes.docs[0].id
            })
        }
    })

})

app.post('/rooms', (req, res) => {
    const { userId } = req.body;
    usersDatabase.doc(userId).get().then(doc => {
        if (doc.exists) {
            const roomRef = rtdb.ref("rooms/" + nanoid());
            roomRef.set({
                messages: {},
                owner: userId
            }).then(() => {
                const roomTrueId = roomRef.key;
                const roomId = 1000 + Math.floor(Math.random() * 999)
                roomsDatabase.doc(roomId.toString()).set({
                    privateId: roomTrueId,
                    publicId: roomId,

                }).then(() => {
                    res.status(200).json({
                        publicId: roomId,
                        privateId: roomTrueId
                    })

                })

            })
        } else {
            res.status(401).json("Por favor logeate para entrar al chat")
        }
    })

})

app.get('/rooms/:roomId', (req, res) => {
    const { userId } = req.query;
    const { roomId } = req.params // ID Publica
    if (userId) {
        usersDatabase.doc(userId.toString()).get().then(docRes => {
            if (docRes.exists) {
                roomsDatabase.doc(roomId).get().then(roomRes => {

                    if (roomRes.exists) {

                        const data = roomRes.data();
                        res.status(200).json(data)
                    } else {
                        res.status(401).json({
                            message: "Room no encontrada"
                        })
                    }
                })
            } else {
                res.status(401).json("Usuario no registrado")
            }
        })
    } else {
        res.status(400).json({ message: "UserId incorrecto" })
    }
})

app.use(express.static("dist"))

app.use((req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "dist", "index.html"))
})

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})


