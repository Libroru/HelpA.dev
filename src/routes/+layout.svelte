<script lang="ts">
	import '../app.scss';
	import './styles.css';

	import { onMount } from "svelte";
	import { getAuth, onAuthStateChanged } from "firebase/auth";
	import { goto } from '$app/navigation';
	import { doc, getDoc } from 'firebase/firestore';

	import { get } from 'svelte/store';
	import { userData } from '$lib/stores';

	import { db } from '$lib/firebase';

	var userLoggedIn = false;
	var showPopup = false;

	var user: any;

	userData.subscribe(fetchedUserData => {
		user = fetchedUserData;
	});



	onMount(async () => {
		onAuthStateChanged(getAuth(), async (user) => {
			userLoggedIn = user ? true : false;
		});
	});

	async function logout() {
		getAuth().signOut().then(function() {
			showPopup = false;
			localStorage.removeItem("userUid");
			localStorage.removeItem("userUsername");
			goto("/");
		}, function(error) {
			console.log(error);
		})
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
			<button class="btn btn-primary" on:click={() => {showPopup = !showPopup}}>{user.username}</button>
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
				<a class="py-2" href={`/users/${user.username}`}>My Profile</a>
				<a class="py-2" on:click={async () => {await logout(); showPopup = !showPopup}} href="/">Logout</a>
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
