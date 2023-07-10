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
    var errorText: String;

    function singinWithGoogle() {
        if (usernameValue == null || usernameValue == "") {
            errorText = "Firebase: Error (auth/username-cannot-be-empty).";
            return;
        }

        const provider = new GoogleAuthProvider();
        const auth = getAuth();
        signInWithPopup(auth, provider)
            .then(async (result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                if (credential) {
                    await setDoc(doc(db, 'users', usernameValue.toLowerCase()), {
                        "timestamp": Timestamp.fromMillis(Date.now()),
                        "email": auth.currentUser?.email,
                        "friends": [],
                        "posts": []
                    });
                    userData.set({
                        uid: usernameValue.toLowerCase()
                    })
                    goto("/");
                }
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                errorText = errorMessage;
            });
    }

    async function signinWithPassword() {
        if (usernameValue == null || usernameValue == "") {
            errorText = "Firebase: Error (auth/username-cannot-be-empty).";
            return;
        }

        const auth = getAuth();
        
        const docRef = doc(db, "users", usernameValue.toLowerCase());
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            errorText = "Firebase: Error (auth/user-already-exists).";
            return;
        }

        createUserWithEmailAndPassword(auth, emailValue, passwordValue)
        .then(async (result) => {
            if (result) {
                await setDoc(doc(db, 'users', usernameValue.toLowerCase()), {
                    "timestamp": Timestamp.fromMillis(Date.now()),
                    "email": auth.currentUser?.email,
                    "friends": [],
                    "posts": []
                })
                userData.set({
                    uid: usernameValue.toLowerCase()
                })
                goto("/");
            }
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            errorText = errorMessage
        });
    }
</script>

<section class="flex flex-col">
    <div class="card bg-[#f1f1f1] px-4 py-5 justify-center">
        <button class="btn border-black w-full mb-4 flex" on:click={singinWithGoogle}>
            <img src={googleLogo} alt="Google Logo" class="mx-1" style="width: 1.5rem;"/>
            Sign up with Google
        </button>
        <form>
            <div class="form-group">
                <span>Username<small class="text-red-800">*</small></span>
                <input type="text" class="form-control input input-bordered w-full" bind:value={usernameValue} placeholder="Enter username">
            </div>
            <div class="form-group my-3">
                <span>Email address</span>
                <input type="email" class="form-control input input-bordered w-full" bind:value={emailValue} aria-describedby="emailHelp" placeholder="Enter email">
                <small class="form-text text-muted">We'll never share your email with anyone else.</small>
            </div>
            <div class="form-group">
                <span>Password</span>
                <input type="password" class="form-control input input-bordered w-full mb-3" bind:value={passwordValue} placeholder="Password">
            </div>
            <div class="w-full text-center">
                {#if typeof(errorText) !== 'undefined'}
                    <span class="text-red-800">{errorText.slice(22, -2).replaceAll("-", " ")}</span>
                {/if}
            </div>
            <button type="submit" class="btn btn-primary w-full mt-3" on:click={signinWithPassword}>Sign up</button>
        </form>
        <span class="mt-3 text-center">Fields marked with <small class="text-red-800">*</small> are mandatory for all signup options.</span>
    </div>
</section>
