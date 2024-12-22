import { useEffect, useState, useRef } from "react"
import { Button, Dimensions, TextInput, View } from "react-native"

const URL = "ws://localhost:8000"

export default function Index() {
    const [inputText, setInputText] = useState<string>("")
    const wsRef = useRef<WebSocket | null>(null)

    useEffect(() => {
        wsRef.current = new WebSocket(URL)
        wsRef.current.onopen = e => {
            console.log(e, "OPENED")
        }

        // Clean up WebSocket connection on unmount
        return () => {
            if (wsRef.current) {
                wsRef.current.close()
            }
        }
    }, [])

    const sendMessage = () => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(
                JSON.stringify({
                    message: {
                        id: Date.now(),
                        date: new Date().toISOString(),
                        message: inputText,
                    },
                })
            )
        } else {
            console.log("WebSocket is not connected")
        }
    }

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                gap: 200,
            }}
        >
            <TextInput
                style={{
                    height: 50,
                    backgroundColor: "lightblue",
                    marginHorizontal: 100,
                    paddingHorizontal: 10,
                    borderRadius: 10,
                    width: Dimensions.get("window").width - 200,
                }}
                onChangeText={text => setInputText(text)}
            />
            <Button title="Tabarnak!" onPress={sendMessage} />
        </View>
    )
}
