<script lang="ts">
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { initializeApp } from "firebase/app";
    import { getFirestore, doc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
	import { goto } from '$app/navigation';

    import { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId, measurementId } from '$lib/api_keys.json';
    
    const postid = $page.params.postid;

    var app: any;
    var dataLoaded: any = false;

    var postData: any;
    var authorData: any;
    var messages: any[] = [];

    var commentContent: any;

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
        await getPostData(db);
        dataLoaded = true;
    });

    async function getPostData(db: any) {
        const docRef = doc(db, "posts", postid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const docData = docSnap.data();
            postData = docData;
            await getAuthorData(postData.author);
            await getMessages(db, docData);
        } else {
            //TO DO: Add Error Handling
        }
    }

    async function getAuthorData(authorRef: any) {
        const authorTempData = await getDoc(authorRef);
        const authorId = authorTempData.id
        authorData = authorTempData.data();
    }

    async function getMessages(db: any, docData: any) {
        docData.answers.forEach(async (doc: any) => {
            const message = await getDoc(doc);
            var messageData: any = message.data();
            const messageAuthorSnap = await getDoc(messageData.author);
            const messageAuthorData: any = messageAuthorSnap.data();
            messageData.author = messageAuthorData.userName;
            messages = [...messages, messageData];
        });
    }

    function navigateToAuthor() {
        goto(`/users/${authorData.userName}`);
    }

    function commentOnPost() {

    }
</script>

<section>
    {#if dataLoaded}
        <div class="card py-2 px-4" style="width: 48rem;">
            <h1>{postData.title}</h1>
            <p>{postData.question}</p>
            <div>
                <a href="javascript:void(0)" on:click={navigateToAuthor} on:keydown={navigateToAuthor} role="button" tabindex="0">{authorData.userName}</a>
                <span> - {new Date(postData.creationDate.seconds * 1000).toLocaleString()}</span>
            </div>
        </div>
        <div class="card p-4">
            {#each messages as msg}
                <span>{msg.messageText}</span>
                <div>
                    <a href="javascript:void(0)" on:click={navigateToAuthor} on:keydown={navigateToAuthor} role="button" tabindex="0">{msg.author}</a>
                    <span> - {new Date(msg.creationDate.seconds * 1000).toLocaleString()}</span>
                </div>
            {/each}
        </div>
        <div class="card p-4 d-flex flex-column">
            <textarea name="Text1" cols="40" rows="5" bind:value={commentContent}></textarea>
            <button class="btn btn-primary m-2" style="width: 8rem;" on:click={commentOnPost}>Comment</button>
        </div>
    {/if}
</section>