<script lang="ts">
    import googleLogo from '$lib/images/google_logo.png'

    import { doc, setDoc, Timestamp, getDoc } from 'firebase/firestore';
    import { goto } from '$app/navigation';
	import 'firebase/auth';
    import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from "firebase/auth";
    import { db } from '$lib/firebase';

    import { userData } from '$lib/stores';

    var passwordValue: any;
    var emailValue: any;
    var usernameValue: any;

    function singinWithGoogle() {
        const provider = new GoogleAuthProvider();
        const auth = getAuth();
        signInWithPopup(auth, provider)
            .then(async (result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                if (credential) {
                    await setDoc(doc(db, 'users', String(getDisplayName()?.toLowerCase())), {
                        "timestamp": Timestamp.fromMillis(Date.now()),
                        "friends": [],
                        "posts": [],
                        "styling": getDisplayName()
                    });
                    userData.set({
                        uid: String(getDisplayName()).toLowerCase(),
                        username: String(getDisplayName())
                    })
                    goto("/");
                }
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage);
            });
    }

    async function signinWithPassword() {
        const auth = getAuth();
        
        const docRef = doc(db, "users", usernameValue.toLowerCase());
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.warn(`User with username ${usernameValue.toLowerCase()} already exists.`);
            return;
        }

        createUserWithEmailAndPassword(auth, emailValue, passwordValue)
        .then(async (result) => {
            if (result) {
                await setDoc(doc(db, 'users', usernameValue.toLowerCase()), {
                    "timestamp": Timestamp.fromMillis(Date.now()),
                    "friends": [],
                    "posts": [],
                    "styling": usernameValue
                })
                userData.set({
                    uid: usernameValue.toLowerCase(),
                    username: usernameValue
                })
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
        const auth = getAuth();
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
            <button type="submit" class="btn btn-primary w-100 my-3" on:click={signinWithPassword}>Sign up</button>
        </form>
        <span class="text-center">- OR -</span>
        <button class="btn btn-light border-black w-100 mt-4 d-flex-inline flex-row" on:click={singinWithGoogle}>
            <img src={googleLogo} alt="Google Logo" class="mx-1" style="width: 1.5rem;"/>
            Sign up with Google
        </button>
    </div>
</section>
