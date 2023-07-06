<script lang="ts">
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { doc, getDoc } from 'firebase/firestore';

    import { db } from '$lib/firebase';
    
    const username = $page.params.username;

    var dataLoaded = false;

    var userModel: any;

    onMount(async () => {
        const querySnapshot = await getDoc(doc(db, "users", username.toLowerCase()));
        const queryData = querySnapshot.data();
        userModel = queryData;
        dataLoaded = true;
    });
</script>

<section>
    {#if dataLoaded}
        <div class="card p-2 text-left">
            <span>{userModel.styling}</span>
            <span>Joined: {new Date(userModel.timestamp.seconds * 1000).toLocaleString()}</span>
        </div>

        <div class="d-flex flex-column">
            <span>Friends:</span>
            {#each userModel.friends as friend}
                    <a rel="external" href="/users/{friend.toLowerCase()}">{friend}</a>
                {/each}
            
        </div>
    {/if}
</section>