<script lang="ts">
	import { doc, updateDoc } from "firebase/firestore";

    import { userData } from "$lib/stores";
	import { db } from "$lib/firebase";

    export var index: any;
    export var post: any;

    let messageArray: any = post.comments;
    let postAuthor: any = post.author;
    let thisComment: any = messageArray[index];
    let author: any = thisComment.author;
    let solved: any = thisComment.solved;
    let timestamp: any = thisComment.timestamp.seconds;
    let content: any = thisComment.content;
    let postReference: any = post.docSnapshot;

    $: shadow = solved ? "0px 0px 10px #d16947" : "";

    let editing: Boolean = false;
    let oldText: String;

    const SolvedStates = {
        NO_CORRECT_ANSWER_YET: 0,
        POST_ALREADY_HAS_ANSWER: 1,
        THIS_COMMENT_IS_THE_ANSWER: 2,
    }

    let currentSolvedState: any;

    let user: any;

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
            const postSolvedState = checkIfPostIsSolved();
            currentSolvedState = postSolvedState;

            if (postSolvedState == SolvedStates.NO_CORRECT_ANSWER_YET) {
                messageArray[index].solved = !messageArray[index].solved;
            } else if (postSolvedState == SolvedStates.THIS_COMMENT_IS_THE_ANSWER) {
                messageArray[index].solved = !messageArray[index].solved;
            }
            messageArray = messageArray;

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

    function checkIfPostIsSolved() {
        let postIsSolved = messageArray.some((item: { solved: boolean; }) => item.solved === true);
        let thisMessageIsSolved = messageArray[index].solved

        const NO_CORRECT_ANSWER_YET = !postIsSolved && !thisMessageIsSolved;
        const POST_ALREADY_HAS_ANSWER = postIsSolved && !thisMessageIsSolved;

        if (NO_CORRECT_ANSWER_YET) {
            return SolvedStates.NO_CORRECT_ANSWER_YET;
        } else if (POST_ALREADY_HAS_ANSWER) {
            return SolvedStates.POST_ALREADY_HAS_ANSWER;
        } else {
            return SolvedStates.THIS_COMMENT_IS_THE_ANSWER;
        }
        
    }
</script>

<div class="card flex-row bg-[#f1f1f1] p-8 w-[52rem] items-center" style:box-shadow={shadow}>
    {#if postAuthor == user.uid}
        {#if currentSolvedState != SolvedStates.POST_ALREADY_HAS_ANSWER || currentSolvedState == SolvedStates.THIS_COMMENT_IS_THE_ANSWER}
            <button class="w-8 h-8 mr-4" on:click={markAsSolved}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke=""><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M18.2086 9.70558C18.5983 9.31421 18.5969 8.68105 18.2056 8.29137C17.8142 7.90169 17.1811 7.90305 16.7914 8.29442L11.0215 14.0892L7.70214 10.816C7.30888 10.4283 6.67573 10.4327 6.28796 10.8259C5.90018 11.2192 5.90461 11.8524 6.29787 12.2401L10.3258 16.212C10.7177 16.5985 11.3483 16.5956 11.7366 16.2056L18.2086 9.70558Z" fill="#f87272"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M4.5 2C3.11929 2 2 3.11929 2 4.5V19.5C2 20.8807 3.11929 22 4.5 22H19.5C20.8807 22 22 20.8807 22 19.5V4.5C22 3.11929 20.8807 2 19.5 2H4.5ZM4 4.5C4 4.22386 4.22386 4 4.5 4H19.5C19.7761 4 20 4.22386 20 4.5V19.5C20 19.7761 19.7761 20 19.5 20H4.5C4.22386 20 4 19.7761 4 19.5V4.5Z" fill="#f87272"></path> </g></svg>
            </button>
        {/if}
    {/if}
    <div class="flex flex-col gap-8 flex-1">
        {#if editing}
            <textarea class="textarea textarea-bordered mb-2 whitespace-pre-line" bind:value={content}></textarea>
            <button class="btn btn-primary mr-2 mb-2 w-fit ml-auto" on:click={() => {editComment()}}>Finished</button>
        {:else}
            <p class="mb-3 pr-4 whitespace-pre-line max-w-full">{content}</p>
        {/if}
        <div class="flex flex-col">
            <div class="flex flex-row">
                {#if postAuthor == user.uid}
                    <button class="text-button text-accent hover:underline" on:click={markAsSolved}>Mark as solved</button>
                {/if}
                <div class="ml-auto">
                    {#if user.uid == author}
                    <button class="text-button text-accent hover:underline" on:click={async () => {await deleteComment()}}>Delete Comment</button>
                     - 
                    <button class="text-button text-accent hover:underline" on:click={async () => {await editComment()}}>Edit Comment</button>
                     - 
                    {/if}
                    <a class="text-accent hover:underline" href={`/users/${author}`}>{author}</a>
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
        color: #f87272;
        text-decoration: underline
    }
</style>