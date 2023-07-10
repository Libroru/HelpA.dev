<script lang="ts">
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { QuerySnapshot, doc, getDoc } from 'firebase/firestore';

    import { db } from '$lib/firebase';
    
    const username = $page.params.username.toLowerCase();

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
        <div class="flex flex-col justify-center items-center">
            <div>
                <div class="card card-bordered p-2 text-left bg-[#f1f1f1]" style="min-width: 36rem;">
                    <div class="card-body">
                        <div class="flex flex-col justify-center gap-2">
                            <div class="bg-black w-24 h-24" style="clip-path: circle();"></div>
                        </div>
                        <div class="flex flex-col ml-2">
                            <span class="text-3xl">{querySnapshot.id}</span>
                            <p class="text-gray-500">This user has no bio</p>
                        </div>
                        <span class="ml-auto mt-2">Joined: {new Date(queryData.timestamp.seconds * 1000).toDateString().slice(4)}</span>
                    </div>
                </div>
                <div class="flex flex-col mx-6 my-6">
                    <span class="text-2xl">Friends ({queryData.friends.length}):</span>
                    {#each queryData.friends as friend}
                        <a class="text-accent hover:underline text-lg" rel="external" href="/users/{friend.toLowerCase()}">{friend}</a>
                    {/each}
                </div>
            </div>
        </div>
    {:else}
        <span class="loading loading-dots w-20"></span>
    {/if}
</section>
