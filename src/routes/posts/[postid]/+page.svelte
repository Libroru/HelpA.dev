<script lang="ts">
    import { page } from '$app/stores';
    import { onDestroy, onMount } from 'svelte';
    import { initializeApp, type FirebaseApp } from "firebase/app";
    import { getFirestore, doc, getDoc, Timestamp, updateDoc, onSnapshot, Firestore, arrayUnion } from 'firebase/firestore';

    import Answer from '$lib/components/Answer.svelte';

    import { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId, measurementId } from '$lib/api_keys.json';
	import { getAuth } from 'firebase/auth';
    
    class PostModel {
        author: any;
        timestamp: Timestamp;
        title: String;
        content: String;
        solved: Boolean;
        tags: any[];
        comments: any[];
        
        constructor(author: any, timestamp: Timestamp, title: String, content: String, solved: Boolean, tags: any[], comments: any[]) {
            this.author = author;
            this.timestamp = timestamp;
            this.title = title;
            this.content = content;
            this.solved = solved;
            this.tags = tags;
            this.comments = comments;
        }
    }

    const postid = $page.params.postid;

    var app: FirebaseApp;
    var db: Firestore;

    var dataLoaded: Boolean = false;

    var thisPost: PostModel;

    let unsubscribe: any;

    var currentUserName: any;

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
        db = getFirestore(app);
        unsubscribe = onSnapshot(doc(db, "posts", postid), async (docSnapshot) => {
            if (docSnapshot.exists()) {
                const data = docSnapshot.data()
                thisPost = new PostModel(await getAuthor(data.author), data.timestamp, data.title, data.content, data.solved, data.tags, data.comments);
            }
        });
        dataLoaded = true;
    });

    onDestroy(async () => {
        if (typeof unsubscribe === 'function') {
            unsubscribe();
        }
    });

    async function getAuthor(postInfo: any) {
        const authorSnapshot: any = await getDoc(postInfo);
        return authorSnapshot.data().username;
    }

    async function commentOnPost() {
        const postRef = doc(db, "posts", postid);
        await updateDoc(postRef,{
            comments: arrayUnion({
                author: await getCurrentUser(),
                content: commentContent,
                solved: false,
                timestamp: Timestamp.fromMillis(Date.now())
            })
        });

        commentContent = "";
    }

    async function getCurrentUser() {
        const userRef = doc(db, "users", String(getAuth().currentUser?.uid));
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return userSnap.data().username;
        }
    }
</script>

<section>
    {#if thisPost != null}
        <div class="d-flex flex-column" style="gap: 0.5rem;">
            <div class="card py-4 px-4" style="width: 48rem;">
                <h1>{thisPost.title}</h1>
                <p>{thisPost.content}</p>
                {#if dataLoaded}
                    <div>
                        <a href={`/users/${thisPost.author}`}>{thisPost.author}</a>
                        <span> - {new Date(thisPost.timestamp.seconds * 1000).toLocaleString()}</span>
                    </div>
                {/if}
            </div>
            <div class="d-flex flex-column my-2" style="gap: 0.5rem;">
                {#if dataLoaded}
                    {#each thisPost.comments as comment}
                        <Answer currentUserName={currentUserName} author={comment.author}
                            content={comment.content} timestamp={comment.timestamp.seconds} solved={comment.solved}/>
                    {/each}
                {/if}
            </div>
            <div class="card p-4 d-flex flex-column align-items-center">
                <textarea name="Text1" cols="40" rows="5" bind:value={commentContent} style="width: 100%;"></textarea>
                <button class="btn btn-primary m-2" style="width: 8rem;" on:click={commentOnPost}>Comment</button>
            </div>
        </div>
    {/if}
</section>