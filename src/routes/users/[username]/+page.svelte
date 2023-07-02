<script>
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { initializeApp } from "firebase/app";
    import { getFirestore, doc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
    
    const username = $page.params.username;

    let app;
    export var userData;

    var dataLoaded = false;

    var friends = [];

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
        const db = getFirestore(app);
        const usersRef = collection(db, "users");
        const querySnapshot = await getDocs(query(usersRef, where("userName", "==", username)));

        querySnapshot.forEach(async (doc) => {
            userData = doc.data();
            for (const friendRef of userData.friends) {
                const friendDoc = await getDoc(friendRef);
                const friendData = friendDoc.data();
                friends = [...friends, friendData.userName]
                console.log(friendData.userName);
                console.log(friends);
            }
        });

        dataLoaded = true;
    });
</script>

<section>
    <div>
        <span>{username}</span>
    </div>

    {#if dataLoaded}
        {#each friends as friend}
            <span>{friend}</span>
        {/each}
    {/if}
</section>