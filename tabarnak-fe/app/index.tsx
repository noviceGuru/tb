import { useEffect } from "react"
import { Button, Text, View } from "react-native"

const URL = "ws://localhost:8000"

export default function Index() {
    let ws: WebSocket
    useEffect(() => {
        ws = new WebSocket(URL)

        ws.onopen = e => {
            console.log(e, "OPENED")
        }
    }, [])

    const sendMessage = () => {
        ws.send(JSON.stringify({ name: "TABARANAAAAK" }))
    }

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Button title="Tabarnak!" onPress={sendMessage}></Button>
        </View>
    )
}
