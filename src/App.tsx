import { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://localhost:5000"; // Replace with your server URL

function App() {
	const [socket, setSocket] = useState<any>(null);
	const [users, setUsers] = useState<any>({});
	const [selectedUsers, setSelectedUsers] = useState("");
	const [message, setMessage] = useState("");

	const connectToSocket = () => {
		function generateRandomUserId() {
			return Math.floor(Math.random() * 1000);
		}

		const newSocket = socketIOClient(ENDPOINT, {
			query: { user: `User ${generateRandomUserId()}` },
		});

		newSocket.on("connect", () => {
			console.log("Connected to server");
		});

		newSocket.on("disconnect", () => {
			console.log("Disconnected from server");
		});

		setSocket(newSocket);
	};

	const disconnectSocket = () => {
		if (socket) {
			socket.disconnect();
			setSocket(null);
		}
	};

	const clearUsers = () => {
		if (socket) socket.emit("clear");
	};

	const sendMessage = () => {
		socket.emit("message", { message: message, user: users[selectedUsers] });
	};

	const receiveMessage = (data: any) => {
		console.log("Received message", data);
	};

	const updateUsers = (data: any) => {
		setUsers(data);
		setSelectedUsers(data && Object.keys(data)[0]);
	};

	useEffect(() => {
		if (!socket) return;
		socket.on("message", (data: any) => receiveMessage(data));
		socket.on("users", (data: any) => updateUsers(data));
		return () => disconnectSocket();
	}, [socket]);

	return (
		<div>
			<h3>Socket.io React-Express Example</h3>

			<button onClick={connectToSocket}>Connect to Socket</button>
			<button onClick={disconnectSocket}>Disconnect Socket</button>
			<button onClick={clearUsers}>Clear Socket</button>

			<input value={message} onChange={(e) => setMessage(e.target.value)} type="text" />
			<select onChange={(e) => setSelectedUsers(e.target.value)}>
				{Object.keys(users)?.map((user: any) => {
					return <option key={user}>{user}</option>;
				})}
			</select>

			<button onClick={() => sendMessage()} type="button">
				Send
			</button>
		</div>
	);
}

export default App;
