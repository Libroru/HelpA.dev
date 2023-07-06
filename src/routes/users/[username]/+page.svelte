<script lang="ts">
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { QuerySnapshot, doc, getDoc } from 'firebase/firestore';

    import { db } from '$lib/firebase';
    
    const username = $page.params.username;

    var dataLoaded = false;

    var queryData: any;
    var querySnapshot: any;

    onMount(async () => {
        querySnapshot = await getDoc(doc(db, "users", username.toLowerCase()));
        queryData = querySnapshot.data();
        dataLoaded = true;
    });
</script>

<section>
    {#if dataLoaded}
        <div class="card p-2 text-left">
            <span>{querySnapshot.id}</span>
            <span>Joined: {new Date(queryData.timestamp.seconds * 1000).toLocaleString()}</span>
        </div>

        <div class="d-flex flex-column">
            <span>Friends:</span>
            {#each queryData.friends as friend}
                    <a rel="external" href="/users/{friend.toLowerCase()}">{friend}</a>
                {/each}
            
        </div>
    {/if}
</section>