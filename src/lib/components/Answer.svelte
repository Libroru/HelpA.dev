<script lang="ts">
	import { updateDoc } from "firebase/firestore";

    import { userData } from "$lib/stores";

    export var index: any;
    export var postReference: any;

    export var messageArray: any;

    export var content: any;
    export var timestamp: any;
    export var solved: any;

    export var author: any;
    export var postAuthor: any;

    $: shadow = solved ? "0px 0px 10px yellow" : "";

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
</script>

<div class="card px-4 py-2 d-flex flex-column" style:box-shadow={shadow}>
    <div class="w-100 position-relative" style="height: 1.5rem;">
        {#if author == user.uid}
            <span class="position-absolute" style="cursor:pointer; right: 0;" on:click={deleteComment} on:keydown={deleteComment} role="button" tabindex="0">X</span>
        {/if}
    </div>
    <div class="d-flex flex-column" style="gap: 4px;">
        <p class="mb-3" style="white-space: pre-line;">{content}</p>
        <div class="d-flex flex-column">
            <div class="d-inline-flex flex-row">
                {#if postAuthor == user.uid}
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