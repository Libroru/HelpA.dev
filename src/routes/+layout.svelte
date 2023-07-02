<script>
	import '../app.scss';
	import './styles.css';

	import Question from '$lib/components/Question.svelte';

	import { initializeApp } from "firebase/app";
	import { getAnalytics } from "firebase/analytics";
	import { onMount } from "svelte";
	import { getAuth, onAuthStateChanged } from "firebase/auth";
	import { goto } from '$app/navigation';

	var userLoggedIn = false;

	onMount(async () => {
		const firebaseConfig = {
			apiKey: "AIzaSyChIG9JVOAY-ayR0zylRfARKbycrHCVmkk",
			authDomain: "helpadev.firebaseapp.com",
			projectId: "helpadev",
			storageBucket: "helpadev.appspot.com",
			messagingSenderId: "164373117763",
			appId: "1:164373117763:web:6f3a45d2e2d89304b5cdf6",
			measurementId: "G-RY0CH1Z9SQ"
		};

		// Initialize Firebase
		const app = initializeApp(firebaseConfig);
		const analytics = getAnalytics(app);

		const auth = getAuth();
		onAuthStateChanged(auth, (user) => {
			if (user) {
				userLoggedIn = true;
			} else {
				userLoggedIn = false;
			}
		});
	});

</script>

<div class="app">
	<nav class="navbar navbar-light bg-light p-2">
		<a class="navbar-brand" href="/">HelpA.dev</a>
		<form class="d-inline-flex">
			<input class="form-control mx-2" type="search" placeholder="Search" aria-label="Search" size="50">
			<button class="btn btn-outline-success" type="submit">Search</button>
		</form>

		{#if userLoggedIn}
			<button class="btn btn-primary">My Profile</button>
		{:else}
			<div class="d-inline-flex">
				<button class="btn btn-primary mx-2" on:click={() => {goto("/signup")}}>Sign up</button>
				<button class="btn btn-secondary" on:click={() => {goto("/login")}}>Login</button>
			</div>
		{/if}
	</nav>

	<main class="d-flex flex-col justify-content-center align-items-center">
		<slot />
	</main>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
