<script>
	import { initializeApp } from "firebase/app";
	import { getAnalytics } from "firebase/analytics";
	import 'firebase/auth';
	import { onMount } from "svelte";
	// TODO: Add SDKs for Firebase products that you want to use
	// https://firebase.google.com/docs/web/setup#available-libraries

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
	});
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	
</section>