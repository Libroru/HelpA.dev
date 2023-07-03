<script lang="ts">
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { initializeApp } from "firebase/app";
    import { getFirestore, doc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';

    import { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId, measurementId } from '$lib/api_keys.json';
    
    const username = $page.params.username;

    let app;
    export var userData;

    var dataLoaded = false;

    var friends: any[] = [];

    var joinDate: any;

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
        const db = getFirestore(app);
        const usersRef = collection(db, "users");
        const querySnapshot = await getDocs(query(usersRef, where("userName", "==", username)));
        querySnapshot.forEach(async (doc: any) => {
            userData = doc.data();
            joinDate = new Date(userData.joinDate.seconds * 1000).toDateString()
            for (const friendRef of userData.friends) {
                const friendDoc = await getDoc(friendRef);
                const friendData: any = friendDoc.data();
                friends = [...friends, friendData.userName]
            }
        });

        dataLoaded = true;
    });
</script>

<section>
    {#if dataLoaded}
        <div class="card p-2 text-left">
            <span>{username}</span>
            <span>Joined: {joinDate}</span>
        </div>

        <div class="d-flex flex-column">
            <span>Friends:</span>
            {#each friends as friend}
                    <a rel="external" href="/users/{friend}">{friend}</a>
                {/each}
            
        </div>
    {/if}
</section>