<script lang="ts">
    import googleLogo from '$lib/images/google_logo.png'

    import { initializeApp } from "firebase/app";
    import { getFirestore, doc, setDoc } from 'firebase/firestore';
    import { goto } from '$app/navigation';
	import { getAnalytics } from "firebase/analytics";
	import 'firebase/auth';
	import { onMount } from "svelte";
    import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from "firebase/auth";

    var passwordValue = ""
    var emailValue = ""

    let app: any;

    const firebaseConfig = {
			apiKey: "AIzaSyChIG9JVOAY-ayR0zylRfARKbycrHCVmkk",
			authDomain: "helpadev.firebaseapp.com",
			projectId: "helpadev",
			storageBucket: "helpadev.appspot.com",
			messagingSenderId: "164373117763",
			appId: "1:164373117763:web:6f3a45d2e2d89304b5cdf6",
			measurementId: "G-RY0CH1Z9SQ"
    };

	onMount(async () => {
		app = initializeApp(firebaseConfig);
		const analytics = getAnalytics(app);
	});

    function loginWithGoogle() {
        const provider = new GoogleAuthProvider();
        const auth = getAuth();
        const db = getFirestore(app);
        signInWithPopup(auth, provider)
            .then(async (result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                if (credential) {
                    await setDoc(doc(db, 'users', String(result.user.uid)), {
                        "userEmail": result.user.email,
                        "userName": "username"
                    });
                    goto("/");
                }
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.customData.email;
                const credential = GoogleAuthProvider.credentialFromError(error);
            });
    }

    function loginWithPassword() {
        const auth = getAuth();
        const db = getFirestore(app);
        createUserWithEmailAndPassword(auth, emailValue, passwordValue)
        .then(async (result) => {
            if (result) {
                await setDoc(doc(db, 'users', String(result.user.uid)), {
                        "userEmail": result.user.email,
                        "userName": "username"
                    });
                goto("/");
            }
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
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
            <button type="submit" class="btn btn-primary w-100" on:click={loginWithPassword}>Sign up</button>
        </form>
        <button class="btn btn-light border-black w-100 mt-4 d-flex-inline flex-row" on:click={loginWithGoogle}>
            <img src={googleLogo} alt="Google Logo" class="mx-1" style="width: 1.5rem;"/>
            Sign up with Google
        </button>
    </div>
</section>
