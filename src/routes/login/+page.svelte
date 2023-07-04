<script>
    import googleLogo from '$lib/images/google_logo.png'

    import { initializeApp } from "firebase/app";
	import { getAnalytics } from "firebase/analytics";
	import 'firebase/auth';
	import { onMount } from "svelte";
    import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
	import { goto } from '$app/navigation';

    import { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId, measurementId } from '$lib/api_keys.json';

    var passwordValue = ""
    var emailValue = ""

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
		const app = initializeApp(firebaseConfig);
		const analytics = getAnalytics(app);
	});

    function loginWithGoogle() {
        const provider = new GoogleAuthProvider();
        const auth = getAuth();
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                if (credential) {
                    goto("/")
                }
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage);
            });
        console.log(getAuth().currentUser)
    }

    function loginWithPassword() {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, emailValue, passwordValue)
        .then(() => {
            goto("/")
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage);
        });
    }
</script>

<section class="d-flex flex-col">
    <div class="card px-4 py-5">
        <form>
            <div class="form-group">
                <label for="exampleInputEmail1">Email address</label>
                <input type="email" class="form-control" bind:value={emailValue} aria-describedby="emailHelp" placeholder="Enter email">
                <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
            </div>
            <div class="form-group my-3">
                <label for="exampleInputPassword1">Password</label>
                <input type="password" class="form-control" bind:value={passwordValue} placeholder="Password">
            </div>
            <button type="submit" class="btn btn-primary w-100" on:click={loginWithPassword}>Login</button>
        </form>
        <button class="btn btn-light border-black w-100 mt-4 d-flex-inline flex-row" on:click={loginWithGoogle}>
            <img src={googleLogo} alt="Google Logo" class="mx-1" style="width: 1.5rem;"/>
            Login with Google
        </button>
    </div>
</section>
