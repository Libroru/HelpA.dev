<script lang="ts">
	import { updateDoc } from "firebase/firestore";
	import { onMount } from "svelte";

    export var index: any;
    export var postReference: any;

    export var messageArray: any;

    export var content: any;
    export var timestamp: any;
    export var solved: any;

    export var author: any;
    export var currentUserName: any;
    export var postAuthor: any;

    $: shadow = solved ? "0px 0px 10px yellow" : "";

    async function deletePost() {
        if (author == currentUserName) {
            messageArray.splice(index, 1);
            await updateDoc(postReference.ref, {
                comments: messageArray
            });
        }
    }

    async function markAsSolved() {
        if (postAuthor == currentUserName) {
            let postIsSolved = messageArray.some((item: { solved: boolean; }) => item.solved === true);
            let thisMessageIsSolved = messageArray[index].solved

            if (!postIsSolved && !thisMessageIsSolved) {
                messageArray[index].solved = !messageArray[index].solved;
            } else if (postIsSolved && thisMessageIsSolved) {
                messageArray[index].solved = !messageArray[index].solved;
            }

            await updateDoc(postReference.ref, {
                comments: messageArray
            });
        }
    }
</script>

<div class="card px-4 py-2 d-flex flex-column" style:box-shadow={shadow}>
    <div class="w-100 position-relative" style="height: 1.5rem;">
        {#if author == currentUserName}
            <span class="position-absolute" style="cursor:pointer; right: 0;" on:click={deletePost} on:keydown={deletePost} role="button" tabindex="0">X</span>
        {/if}
    </div>
    <div class="d-flex flex-column" style="gap: 4px;">
        <p class="mb-3" style="white-space: pre-line;">{content}</p>
        <div class="d-flex flex-column">
            <div class="d-inline-flex flex-row">
                {#if postAuthor == currentUserName}
                    <span style="cursor: pointer; color: #ff3e00; text-decoration: underline" on:click={markAsSolved} on:keydown={markAsSolved} role="button" tabindex="0">Mark as solved</span>
                {/if}
                <div style="margin-left: auto;">
                    <a href={`/users/${author}`}>{author}</a>
                    <span> - {new Date(timestamp * 1000).toLocaleString()}</span>
                </div>
            </div>
        </div>
    </div>
</div>