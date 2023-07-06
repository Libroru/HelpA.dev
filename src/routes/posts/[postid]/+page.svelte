<script lang="ts">
    import { page } from '$app/stores';
    import { onDestroy, onMount } from 'svelte';
    import { doc, getDoc, Timestamp, updateDoc, onSnapshot, Firestore, arrayUnion } from 'firebase/firestore';
    import { db } from '$lib/firebase';

    import { get } from 'svelte/store';
    import { userData } from '$lib/stores';

    import Answer from '$lib/components/Answer.svelte';
    
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

    var postReference: any;

    var dataLoaded: Boolean = false;

    var thisPost: PostModel;

    let unsubscribe: any;

    var commentContent: any;

    var user: any;

	userData.subscribe(fetchedUserData => {
		user = fetchedUserData;
	});

    onMount(async () => {
        unsubscribe = onSnapshot(doc(db, "posts", postid), async (docSnapshot) => {
            if (docSnapshot.exists()) {
                postReference = docSnapshot;
                const data = docSnapshot.data()
                thisPost = new PostModel(data.author, data.timestamp, data.title, data.content, data.solved, data.tags, data.comments);
            }
        });
        dataLoaded = true;
    });

    onDestroy(async () => {
        if (typeof unsubscribe === 'function') {
            unsubscribe();
        }
    });

    async function commentOnPost() {
        const postRef = doc(db, "posts", postid);
        await updateDoc(postRef,{
            comments: arrayUnion({
                author: user.uid,
                content: commentContent,
                solved: false,
                timestamp: Timestamp.fromMillis(Date.now())
            })
        });

        commentContent = "";
    }
</script>

<section>
    {#if thisPost != null}
        <div class="d-flex flex-column" style="gap: 0.5rem;">
            <div class="card py-2 px-4" style="width: 48rem;">
                <h1>{thisPost.title}</h1>
                <p style="white-space: pre-line">{thisPost.content}</p>
                {#if dataLoaded}
                    <div style="margin-left: auto;">
                        <a href={`/users/${thisPost.author}`}>{thisPost.author}</a>
                        <span> - {new Date(thisPost.timestamp.seconds * 1000).toLocaleString()}</span>
                    </div>
                {/if}
            </div>
            <div class="d-flex flex-column my-2" style="gap: 0.5rem;">
                {#if dataLoaded}
                    {#each thisPost.comments as comment, index}
                        <Answer postAuthor={thisPost.author} messageArray={thisPost.comments} postReference={postReference} index={index} author={comment.author}
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