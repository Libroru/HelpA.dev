<script lang="ts">
    import { goto } from "$app/navigation";
	import { doc, getDoc, setDoc, collection, updateDoc } from "firebase/firestore";

    export var messageText: any;
    export var creationDate: any;
    export var solved: any;

    export var messageAuthor: any;
    export var currentUserName: any;

    export var postId: any;
    export var messageId: any;

    export var db: any;

    function navigateToAuthor() {
        goto(`/users/${currentUserName}`);
    }

    async function markAsSolved() {
        const postRef = doc(db, "posts", postId);

        await updateDoc(postRef, {
            solved: doc(db, "messages", messageId),
        });
    }
</script>


<div class="card p-4 d-flex flex-column">
    <div class="flex flex-column">
        <span class="mb-3">{messageText}</span>
        <div>
            <a href="javascript:void(0)" on:click={navigateToAuthor} on:keydown={navigateToAuthor} role="button" tabindex="0">{messageAuthor}</a>
            <span> - {new Date(creationDate.seconds * 1000).toLocaleString()}</span>
        </div>
    </div>
    {#if !solved}
        {#if messageAuthor == currentUserName}
            <span class="mt-4 text-decoration-underline" style="color: blue;t"
                role="button" tabindex="0" on:click={async () => {await markAsSolved()}} on:keydown={async () => {await markAsSolved()}}>Mark as solved</span>
        {/if}
    {/if}
</div>

