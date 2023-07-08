<script lang="ts">
	import { doc, updateDoc } from "firebase/firestore";

    import { userData } from "$lib/stores";
	import { db } from "$lib/firebase";

    export var index: any;
    export var postReference: any;

    export var messageArray: any;

    export var content: any;
    export var timestamp: any;
    export var solved: any;

    export var author: any;
    export var postAuthor: any;

    $: shadow = solved ? "0px 0px 10px yellow" : "";

    var editing: Boolean = false;
    var oldText: String;

    var user: any;

	userData.subscribe(fetchedUserData => {
		user = fetchedUserData;
	});

    async function deleteComment() {
        if (author == user.uid) {
            messageArray.splice(index, 1);
            await updateDoc(postReference.ref, {
                comments: messageArray
            });
        }
    }

    async function markAsSolved() {
        if (postAuthor == user.uid) {
            let postIsSolved = messageArray.some((item: { solved: boolean; }) => item.solved === true);
            let thisMessageIsSolved = messageArray[index].solved

            const NO_CORRECT_ANSWER_YET = !postIsSolved && !thisMessageIsSolved;
            const COMMENT_IS_MARKED_AS_SOLVED = postIsSolved && thisMessageIsSolved;

            if (NO_CORRECT_ANSWER_YET) {
                messageArray[index].solved = !messageArray[index].solved;
            } else if (COMMENT_IS_MARKED_AS_SOLVED) {
                messageArray[index].solved = !messageArray[index].solved;
            }

            await updateDoc(postReference.ref, {
                comments: messageArray
            });
        }
    }

    async function editComment() {
        if (user.uid == author) editing = !editing;
        else return;

        oldText = oldText == null ? oldText = content : oldText = oldText;

        if (oldText != content) {
            messageArray[index].content = content;
            await updateDoc(doc(db, 'posts', postReference.ref.id), {
                comments: messageArray
            });
        }

        oldText = content
    }
</script>

<div class="card px-4 py-2 d-flex flex-column" style="width: 48rem;" style:box-shadow={shadow}>
    <div class="w-100 position-relative" style="height: 1.5rem;">
        {#if author == user.uid}
            <button class="position-absolute text-button" style="right: 0;" on:click={deleteComment}>X</button>
        {/if}
    </div>
    <div class="d-flex flex-column" style="gap: 4px;">
        {#if editing}
            <textarea class="mb-2" style="white-space: pre-line; max-height: 300px;" bind:value={content}></textarea>
            <button class="btn btn-primary mr-2 mb-2" style="width: fit-content; margin-left: auto;" on:click={() => {editing = !editing}}>Finished</button>
        {:else}
            <p class="mb-3" style="white-space: pre-line; max-width: 100%; padding-right: 1rem;">{content}</p>
        {/if}
        <div class="d-flex flex-column">
            <div class="d-inline-flex flex-row">
                {#if postAuthor == user.uid}
                    <button class="text-button svelte-underlined-text" on:click={markAsSolved}>Mark as solved</button>
                {/if}
                <div style="margin-left: auto;">
                    {#if user.uid == author}
                    <button class="text-button svelte-underlined-text" on:click={async () => {await editComment()}}>Edit Comment</button>
                     - 
                    {/if}
                    <a href={`/users/${author}`}>{author}</a>
                     - 
                    <span>{new Date(timestamp * 1000).toLocaleString()}</span>
                </div>
            </div>
        </div>
    </div>
</div>

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