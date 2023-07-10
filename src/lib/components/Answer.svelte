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

    $: shadow = solved ? "0px 0px 10px #d16947" : "";

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

<div class="card bg-[#f1f1f1] p-4 w-[52rem]" style:box-shadow={shadow}>
    {#if author == user.uid}
        <button class="text-button w-fit" style="margin-left: auto !important;" on:click={deleteComment}>X</button>
    {/if}
    <div class="flex flex-col" style="gap: 4px;">
        {#if editing}
            <textarea class="textarea textarea-bordered mb-2 whitespace-pre-line" bind:value={content}></textarea>
            <button class="btn btn-primary mr-2 mb-2 w-fit ml-auto" on:click={() => {editing = !editing}}>Finished</button>
        {:else}
            <p class="mb-3 pr-4 whitespace-pre-line max-w-full">{content}</p>
        {/if}
        <div class="flex flex-col">
            <div class="flex flex-row">
                {#if postAuthor == user.uid}
                    <button class="text-button svelte-underlined-text" on:click={markAsSolved}>Mark as solved</button>
                {/if}
                <div class="ml-auto">
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