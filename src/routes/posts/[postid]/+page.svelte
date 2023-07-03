<script lang="ts">
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { initializeApp } from "firebase/app";
    import { getFirestore, doc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
	import { goto } from '$app/navigation';
    
    const postid = $page.params.postid;

    var app: any;
    var dataLoaded: any = false;

    var postData: any;
    var authorData: any;
    var messages: any[] = [];

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
</script>

<section>
    {#if dataLoaded}
        <h1>{postData.title}</h1>
        <div>
            <a href="javascript:void(0)" on:click={navigateToAuthor} on:keydown={navigateToAuthor} role="button" tabindex="0">{authorData.userName}</a>
            <span>{new Date(postData.creationDate.seconds * 1000).toLocaleString()}</span>
        </div>
        <p>{postData.question}</p>
        <div>
            {#each messages as msg}
                <span>{msg.messageText}</span>
                <span>{msg.author}</span>
            {/each}
        </div>
    {/if}
</section>