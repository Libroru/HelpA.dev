<script lang="ts">
    import googleLogo from '$lib/images/google_logo.png'
    import { db } from "$lib/firebase";

	import 'firebase/auth';
    import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
	import { goto } from '$app/navigation';
	import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';

    import { userData } from '$lib/stores';
	import { error } from '@sveltejs/kit';

    var passwordValue: any;
    var emailValue: any;
    var errorText: String;

    function loginWithGoogle() {
        const provider = new GoogleAuthProvider();
        const auth = getAuth();

        const userCollection = collection(db, "users");

        signInWithPopup(auth, provider)
            .then(async (result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                if (credential) {
                    const q = query(userCollection, where("email", "==", auth.currentUser?.email));
                    const querySnapshot = await getDocs(q);
                    querySnapshot.forEach((doc) => {
                        userData.set({uid: doc.id})
                    })
                    goto("/");
                }
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                errorText = errorMessage;
                console.log(errorMessage);
            });
    }

    function loginWithPassword() {
        const auth = getAuth();

        const userCollection = collection(db, "users");

        signInWithEmailAndPassword(auth, emailValue, passwordValue)
        .then(async () => {
            const q = query(userCollection, where("email", "==", auth.currentUser?.email));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                userData.set({uid: doc.id})
            })
            goto("/");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            errorText = errorMessage
            console.log(errorMessage);
        });
    }
</script>

<section>
    <div class="flex justify-center items-center">
        <div class="card card-bordered border-[#c7c7c733] bg-[#f1f1f1] px-4 py-5 w-fit">
            <button class="btn border-black w-full mb-4" on:click={loginWithGoogle}>
                <img src={googleLogo} alt="Google Logo" class="mx-1" style="width: 1.5rem;"/>
                Login with Google
            </button>
            <form class="text-center">
                <div class="form-group">
                    <span>Email address</span>
                    <input type="email" class="form-control input input-bordered w-full" bind:value={emailValue} aria-describedby="emailHelp" placeholder="Enter email">
                    <small class="form-text text-gray-400">We'll never share your email with anyone else.</small>
                </div>
                <div class="form-group my-3">
                    <span>Password</span>
                    <input type="password" class="form-control input input-bordered w-full" bind:value={passwordValue} placeholder="Password">
                </div>
                {#if typeof(errorText) !== 'undefined'}
                    <span class="text-red-800 text-center">{errorText.slice(22, -2).replaceAll("-", " ")}</span>
                {/if}
                <button type="submit" class="btn btn-primary w-full mt-3" on:click={loginWithPassword}>Login</button>
            </form>
        </div>
    </div>
</section>

