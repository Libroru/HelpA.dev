<script lang="ts">
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { initializeApp } from "firebase/app";
    import { getFirestore, doc, getDoc, getDocs, collection, query, where, setDoc, addDoc, Timestamp, updateDoc } from 'firebase/firestore';
	import { goto } from '$app/navigation';

    import Answer from '$lib/components/Answer.svelte';

    import { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId, measurementId } from '$lib/api_keys.json';
	import { getAuth, onAuthStateChanged } from 'firebase/auth';
    
    const postid = $page.params.postid;

    var app: any;
    var db: any;
    var dataLoaded: any = false;

    var postData: any;
    var authorData: any;
    var messages: any[] = [];

    var currentUserName: any;

    var postBelongsToUser: any;

    var commentContent: any;

    var solvedMessage: any;

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
        db = getFirestore(app);
        await getPostData();
        dataLoaded = true;
    });

    async function getPostData() {
        const docRef = doc(db, "posts", postid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const docData = docSnap.data();
            postData = docData;
            await getAuthorData(postData.author);
            await getMessages(docData);
            currentUserName = await getCurrentUser();
        } else {
            //TO DO: Add Error Handling
        }
    }

    async function getAuthorData(authorRef: any) {
        const authorTempData = await getDoc(authorRef);
        const authorId = authorTempData.id
        authorData = authorTempData.data();
    }

    async function getMessages(docData: any) {
        docData.answers.forEach(async (doc: any) => {
            const message = await getDoc(doc);
            var messageData: any = message.data();
            if (messageData) {
                const messageAuthorSnap = await getDoc(messageData.author);
                const messageAuthorData: any = messageAuthorSnap.data();
                messageData.author = messageAuthorData.userName;
                messageData.uid = message.id;
                messageData.solved = message.id == postData.solved.uid ? true : false; //Doesn't work -> fix.
                messages = [...messages, messageData];
            }
        });
    }

    function navigateToAuthor() {
        goto(`/users/${authorData.userName}`);
    }

    async function commentOnPost() {
        const docRef = await addDoc(collection(db, "messages"), {
            creationDate: Timestamp.fromMillis(Date.now()),
            messageText: commentContent,
            author: doc(db, "users", String(getAuth().currentUser?.uid))
        });

        const postRef = doc(db, "posts", postid);
        const postSnap = await getDoc(postRef);

        console.log(doc(db, "users", String(getAuth().currentUser?.uid)));

        if (postSnap.exists()) {
            var earlierMessages = postSnap.data().answers;
            earlierMessages = [...earlierMessages, docRef];

            await updateDoc(doc(db, "posts", postid), {
                answers: earlierMessages,
            });


        }
    }

    async function getCurrentUser() {
        const userRef = doc(db, "users", String(getAuth().currentUser?.uid));
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return userSnap.data().userName;
        }
    }

    async function solvedPressed() {
        
    }
</script>

<section>
    {#if dataLoaded}
        <div class="d-flex flex-column" style="gap: 0.5rem;">
            <div class="card py-4 px-4" style="width: 48rem;">
                <h1>{postData.title}</h1>
                <p>{postData.question}</p>
                <div>
                    <a href="javascript:void(0)" on:click={navigateToAuthor} on:keydown={navigateToAuthor} role="button" tabindex="0">{authorData.userName}</a>
                    <span> - {new Date(postData.creationDate.seconds * 1000).toLocaleString()}</span>
                </div>
            </div>
            <div class="d-flex flex-column my-2" style="gap: 0.5rem;">
                {#each messages as msg}
                    <Answer db={db} messageId={msg.uid} postId={postid} solved={msg.solved} currentUserName={currentUserName} messageAuthor={msg.author} messageText={msg.messageText}
                        creationDate={msg.creationDate} on:click={solvedPressed} on:keydown={solvedPressed}/>  
                {/each}
            </div>
            <div class="card p-4 d-flex flex-column align-items-center">
                <textarea name="Text1" cols="40" rows="5" bind:value={commentContent} style="width: 100%;"></textarea>
                <button class="btn btn-primary m-2" style="width: 8rem;" on:click={commentOnPost}>Comment</button>
            </div>
        </div>
    {/if}
</section>