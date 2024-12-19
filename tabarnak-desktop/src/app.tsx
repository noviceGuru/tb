import { component$, useSignal, useVisibleTask$, $, useOnWindow } from "@builder.io/qwik"

const BASE_URL = "ws://localhost:8000"

export const App = component$(() => {
    const messageSignal = useSignal<string>("")
    const socketSignal = useSignal<WebSocket | null>(null)
    const messages = useSignal<string[]>([])

    // Initialize WebSocket connection
    useVisibleTask$(() => {
        const ws = new WebSocket(BASE_URL)
        socketSignal.value = ws

        ws.onopen = () => {
            console.log("Connected to WebSocket")
            messageSignal.value = "Connected to WebSocket server"
        }

        ws.onmessage = event => {
            messages.value = [...messages.value, event.data]
        }

        ws.onerror = error => {
            console.error("WebSocket error:", error)
            messageSignal.value = "Error connecting to WebSocket server"
        }

        ws.onclose = () => {
            console.log("Disconnected from WebSocket")
            messageSignal.value = "Disconnected from WebSocket server"
        }

        // Cleanup when component unmounts
        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close()
            }
        }
    })

    // Handle window beforeunload to close WebSocket connection
    useOnWindow(
        "beforeunload",
        $(() => {
            if (socketSignal.value?.readyState === WebSocket.OPEN) {
                socketSignal.value.close()
            }
        })
    )

    return (
        <div class="p-4">
            <h1>WebSocket Messages</h1>
            <p>{messageSignal.value}</p>

            <div class="mt-4">
                <h2>Received Messages:</h2>
                <ul>
                    {messages.value.map((msg, index) => (
                        <li key={index}>{msg}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
})
