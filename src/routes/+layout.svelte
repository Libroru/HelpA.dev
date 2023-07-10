<script lang="ts">
	import '../app.scss';
	import './styles.css';

	import { onDestroy, onMount } from "svelte";
	import { getAuth, onAuthStateChanged } from "firebase/auth";
	import { goto } from '$app/navigation';

	import { userData } from '$lib/stores';

	var userLoggedIn = true;
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
			userData.set({uid: "null"})
			goto("/");
		}, function(error) {
			console.log(error);
		})
	}

</script>

<div class="app">
	<nav class="navbar py-4 px-4">
		<a class="navbar-start md:text-2xl font-bold" href="/">HelpA.dev</a>
		<form class="md:navbar-center hidden md:block">
			<input class="transition input input-bordered focus:input-accent bg-[#f1f1f1] hover:bg-[#e3e3e3] mx-2" type="search" placeholder="Search" aria-label="Search" size="50">
			<button class="btn btn-secondary" type="submit">Search</button>
		</form>

		<div class="navbar-end">
			{#if userLoggedIn}
				<button class="btn btn-accent" on:click={() => {showPopup = !showPopup}}>{user.uid}</button>
			{:else}
				<div>
					<button class="btn btn-primary mx-2" on:click={() => {goto("/signup")}}>Sign up</button>
					<button class="btn btn-secondary" on:click={() => {goto("/login")}}>Login</button>
				</div>
			{/if}
		</div>
	</nav>

	<div class="p-2" style="position: absolute; top: 50px; right: 0; z-index: 50;">
		{#if showPopup}
			<div class="card card-bordered bg-[#f1f1f1] m-2 mt-4 border-[#c7c7c733] sticky right-0 w-40 text-center gap-2 shadow-lg">
				<a on:click={() => {showPopup = !showPopup}} class="py-2" href={`/users/${user.uid}`}>My Profile</a>
				<a class="py-2" on:click={async () => {await logout(); showPopup = !showPopup}} href="/">Logout</a>
			</div>
		{/if}
	</div>

	<main class="flex justify-center items-center">
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
		padding: 2rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
