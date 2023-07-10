<script lang="ts">
    import { page } from '$app/stores';
    import { onDestroy, onMount } from 'svelte';
    import { doc, getDoc, Timestamp, updateDoc, onSnapshot, Firestore, arrayUnion, deleteDoc } from 'firebase/firestore';
    import { db } from '$lib/firebase';

    import { get } from 'svelte/store';
    import { userData } from '$lib/stores';

    import Answer from '$lib/components/Answer.svelte';
	import { goto } from '$app/navigation';
    
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

    var tags: any;

    var editing: Boolean = false;
    var oldText: String;
    var oldTitle: String;
    var oldTags: String[];

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

                let i = 0;
                tags = ""
                thisPost.tags.forEach((tag) => {
                    if (i == 0) tags = tag;
                    else {
                        tags = tags + `, ${tag}`;
                    }
                    i++;
                });
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

    async function editPost() {
        if (user.uid == thisPost.author) editing = !editing;
        else return;

        oldText = oldText == null ? oldText = thisPost.content : oldText = oldText;
        oldTitle = oldTitle == null ? oldTitle = thisPost.title : oldTitle = oldTitle;
        oldTags = oldTags == null ? oldTags = thisPost.tags : oldTags = oldTags;

        let splitTags = tags.split(", ");
        if (oldText != thisPost.content || oldTitle != thisPost.title || oldTags.length != splitTags.length) {
            await updateDoc(doc(db, 'posts', postid), {
                content: thisPost.content,
                title: thisPost.title,
                tags: splitTags
            });
        }

        oldText = thisPost.content;
        oldTitle = thisPost.title;
        oldTags = thisPost.tags;
    }

    async function deletePost() {
        await deleteDoc(doc(db, 'posts', postid));
        goto('/')
    }
</script>

<section>
    {#if thisPost != null}
        <div class="flex flex-col justify-center items-center gap-2">
            <div class="card bg-[#f1f1f1] py-2 px-4 gap-3 w-[52rem]">
                {#if dataLoaded}
                    {#if user.uid == thisPost.author}
                        <button class="text-button w-fit" style="margin-left: auto !important;" on:click={async () => {await deletePost()}}>X</button>
                    {/if}
                    {#if editing}
                        <input class="input input-bordered text-xl font-bold" bind:value="{thisPost.title}">
                        <textarea class="textarea textarea-bordered" style="max-height: 300px;" bind:value={thisPost.content}></textarea>
                        <input class="input input-bordered" bind:value={tags}>
                        <button class="btn btn-primary mt-2 mr-2 mb-2 w-fit" style="margin-left: auto !important;" on:click={async () => {await editPost()}}>Finished</button>
                    {:else}
                        <h1 class="text-xl font-bold max-w-full">{thisPost.title}</h1>
                        <p class="whitespace-pre-line max-w-full">{thisPost.content}</p>
                        <div class="flex gap-1 flex-wrap">
                            {#each thisPost.tags as tag}
                                <a href={`/tags/${tag}`} class="badge badge-accent text-white w-fit">{tag}</a>
                            {/each}
                        </div>
                    {/if}
                    <div class="ml-auto">
                        {#if user.uid == thisPost.author}
                            <button class="text-button svelte-underlined-text" on:click={async () => {await editPost()}}>Edit Post</button>
                            - 
                        {/if}
                        <a href={`/users/${thisPost.author}`}>{thisPost.author}</a>
                         - 
                        <span>{new Date(thisPost.timestamp.seconds * 1000).toLocaleString()}</span>
                    </div>
                {/if}
            </div>
            <div class="flex flex-col my-2 gap-2">
                {#if dataLoaded}
                    {#each thisPost.comments as comment, index}
                        <Answer postAuthor={thisPost.author} messageArray={thisPost.comments} postReference={postReference} index={index} author={comment.author}
                            content={comment.content} timestamp={comment.timestamp.seconds} solved={comment.solved}/>
                    {/each}
                {/if}
            </div>
            <div class="card bg-[#f1f1f1] p-4 flex flex-col items-center w-[52rem]">
                <textarea class="w-full" name="Text1" cols="40" rows="5" bind:value={commentContent}></textarea>
                <button class="btn btn-primary mt-2 w-fit" style="margin-left: auto !important;" on:click={commentOnPost}>Comment</button>
            </div>
        </div>
    {/if}
</section>

<style>
    .text-button {
        background:none;
        border:none;
        margin:0;
        padding:0;
        cursor: pointer;
    }

    .svelte-underlined-text {
        color: #ff3e00;
        text-decoration: underline
    }
</style>