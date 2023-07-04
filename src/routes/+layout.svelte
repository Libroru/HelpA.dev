<script lang="ts">
	import '../app.scss';
	import './styles.css';

	import Question from '$lib/components/Question.svelte';

	import { initializeApp } from "firebase/app";
	import { getAnalytics } from "firebase/analytics";
	import { onMount } from "svelte";
	import { getAuth, onAuthStateChanged } from "firebase/auth";
	import { goto } from '$app/navigation';
	import { getFirestore, doc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';

	import { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId, measurementId } from '$lib/api_keys.json';

	var userLoggedIn = false;
	var showPopup = false;
	
	var db: any;
	var app: any;

	var currentUsername: any;
	
	//TO DO: - popup at the right place -> fixed positioning 

	onMount(async () => {
		const firebaseConfig = {
			apiKey: apiKey,
			authDomain: authDomain,
			projectId: projectId,
			storageBucket: storageBucket,
			messagingSenderId: messagingSenderId,
			appId: appId,
			measurementId: measurementId
    };

		// Initialize Firebase
		app = initializeApp(firebaseConfig);
		db = getFirestore(app);
		const analytics = getAnalytics(app);

		const auth = getAuth();

		onAuthStateChanged(auth, async (user) => {
			if (user) {
				await getUserName();
				userLoggedIn = true;
			} else {
				userLoggedIn = false;
			}
		});
	});

	async function navigateToProfile() {
		const userDocRef = doc(db, "users", String(getAuth().currentUser?.uid));
		const userDocSnap = await getDoc(userDocRef);

		if (userDocSnap.exists()) {
			goto(`/users/${userDocSnap.data().userName}`);
		}
	}

	async function logout() {
		getAuth().signOut().then(function() {
			showPopup = false;
			goto("/");
		}, function(error) {
			console.log(error);
		})
	}

	async function getUserName() {
		const userDocRef = doc(db, "users", String(getAuth().currentUser?.uid));
		const userDocSnap = await getDoc(userDocRef);

		if (userDocSnap.exists()) {
			currentUsername = userDocSnap.data().userName;
		}
	}

</script>

<div class="app">
	<nav class="navbar navbar-light bg-light p-2">
		<a class="navbar-brand" href="/">HelpA.dev</a>
		<form class="d-inline-flex">
			<input class="form-control mx-2" type="search" placeholder="Search" aria-label="Search" size="50">
			<button class="btn btn-outline-success" type="submit">Search</button>
		</form>

		{#if userLoggedIn}
			<button class="btn btn-primary" on:click={() => {showPopup = !showPopup}}>{currentUsername}</button>
		{:else}
			<div class="d-inline-flex">
				<button class="btn btn-primary mx-2" on:click={() => {goto("/signup")}}>Sign up</button>
				<button class="btn btn-secondary" on:click={() => {goto("/login")}}>Login</button>
			</div>
		{/if}
	</nav>

	<div class="p-2" style="position: absolute; top: 50px; right: 0;">
		{#if showPopup}
			<div class="card py-2" style="display: sticky; right: 0; width: 10rem; text-align: center; gap: 0.5rem;">
				<a class="py-2" on:click={async () => {await navigateToProfile(); showPopup = !showPopup}} href="javascript:void(0)">My Profile</a>
				<a class="py-2" on:click={async () => {await logout(); showPopup = !showPopup}} href="javascript:void(0)">Logout</a>
			</div>
		{/if}
	</div>

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
