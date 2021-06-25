import ilustrationImg from '../assets/images/ilustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIconImg from '../assets/images/google-icon.svg'
import '../styles/auth.scss'
import '../styles/dark-mode.scss'
import { Button } from '../components/Button'

import {useHistory} from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { FormEvent, useState } from 'react'
import { database } from '../services/firebase'
import { useTheme } from '../hooks/useTheme'

export function Home(){
	const history = useHistory()
	const {user, singInWithGoogle} = useAuth()
	const [roomCode, setRoomCode] = useState('')

	const {theme, toggleTheme } = useTheme()

	async function handleCreateRoom(){
		if(!user){
		 await singInWithGoogle()
		}
		history.push('/rooms/new')
	}

	async function handleJoinRoom(event: FormEvent){
		event.preventDefault()

		if(roomCode.trim() === ''){
			return
		}

		const roomRef = await database.ref(`rooms/${roomCode}`).get()

		if(!roomRef.exists()){
			alert('Room does not exists')
			return
		}

		if(roomRef.val().endedAt) {
			alert('Room already Closed')
			return
		}

		history.push(`/rooms/${roomCode}`);
	}


	return(
		<div id="page-auth" className={theme}>
			<aside>
				<img src={ilustrationImg} alt="ilustração simbolizando perguntas e respostas"/>
				<strong className={theme}>Crie salas de Q&amp;A ao-vivo</strong>
				<p> Tire as dúvidas da sua audiência em tempo-real </p>
			</aside>
			
			<div className="darkMode">
				<label className="switch" htmlFor="checkbox" title="Change color scheme to dark mode">
					<input type="checkbox" onClick={toggleTheme} id="checkbox" />
					<div className="slider round"></div>
					<div className="toggle-moon">🌙</div>
					<div className="toggle-sun">☀️</div>
				</label>
			</div>
			<main>
				<div className="main-content">
					<img src={logoImg} alt="Letmeask"/>
					<button onClick={handleCreateRoom} className="create-room">
						<img src={googleIconImg} alt="Logo do Google"/>
						Crie sua sala com o Google
					</button>
					<div className="separator"> ou entre em uma sala </div>
					<form onSubmit={handleJoinRoom}>
						<input
							type="text"
							placeholder="Digite o código da sala"
							onChange={event => setRoomCode(event.target.value)}
							value={roomCode}
						/>
						<Button type="submit">
							Entrar na sala
						</Button>
					</form>
				</div>
			</main>
		</div>
	)
}