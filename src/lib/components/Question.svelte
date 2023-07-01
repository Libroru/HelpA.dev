<script>
    import googleLogo from '$lib/images/google_logo.png'

    import { initializeApp } from "firebase/app";
    import { goto } from '$app/navigation';
	import { getAnalytics } from "firebase/analytics";
	import 'firebase/auth';
	import { onMount } from "svelte";
    import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from "firebase/auth";
    
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

<div>
    
</div>