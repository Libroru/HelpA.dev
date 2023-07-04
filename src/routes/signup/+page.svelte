<script lang="ts">
    import googleLogo from '$lib/images/google_logo.png'

    import { initializeApp } from "firebase/app";
    import { getFirestore, doc, setDoc, Timestamp } from 'firebase/firestore';
    import { goto } from '$app/navigation';
	import { getAnalytics } from "firebase/analytics";
	import 'firebase/auth';
	import { onMount } from "svelte";
    import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from "firebase/auth";

    import { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId, measurementId } from '$lib/api_keys.json';

    var passwordValue = ""
    var emailValue = ""
    var usernameValue = ""

    let app: any;

    const firebaseConfig = {
			apiKey: apiKey,
			authDomain: authDomain,
			projectId: projectId,
			storageBucket: storageBucket,
			messagingSenderId: messagingSenderId,
			appId: appId,
			measurementId: measurementId
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
                        "userName": getDisplayName(),
                        "joinDate": new Timestamp(Date.now() / 1000, Date.now())
                    });
                    goto("/");
                }
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage);
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
                        "userName": usernameValue,
                        "joinDate": new Timestamp(Date.now()/1000, (Date.now() % 1000) * 1000000)
                    });
                goto("/");
            }
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage);
        });
    }

    function getDisplayName() {
        const auth = getAuth(app);
		
		if (auth.currentUser) {
			if (auth.currentUser.displayName) {
				var displayName = auth.currentUser?.displayName.replace(/ /g,'').toLocaleLowerCase();
				return displayName + Math.floor(Math.random() * 99);
			}
		}
    }
</script>

<section class="d-flex flex-col">
    <div class="card px-4 py-5">
        <form>
            <div class="form-group">
                <label for="usernameInput">Username</label>
                <input type="email" id="usernameInput" class="form-control" bind:value={usernameValue} placeholder="Enter username">
            </div>
            <div class="form-group my-3">
                <label for="emailInput">Email address</label>
                <input type="email" id="emailInput" class="form-control" bind:value={emailValue} aria-describedby="emailHelp" placeholder="Enter email">
                <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
            </div>
            <div class="form-group">
                <label for="passwordInput">Password</label>
                <input type="password" id="passwordInput" class="form-control" bind:value={passwordValue} placeholder="Password">
            </div>
            <button type="submit" class="btn btn-primary w-100 my-3" on:click={loginWithPassword}>Sign up</button>
        </form>
        <span class="text-center">- OR -</span>
        <button class="btn btn-light border-black w-100 mt-4 d-flex-inline flex-row" on:click={loginWithGoogle}>
            <img src={googleLogo} alt="Google Logo" class="mx-1" style="width: 1.5rem;"/>
            Sign up with Google
        </button>
    </div>
</section>
