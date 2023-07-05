<script lang="ts">
    import { goto } from "$app/navigation";
	import { doc, getDoc, setDoc, collection, updateDoc } from "firebase/firestore";

    export var content: any;
    export var timestamp: any;
    export var solved: any;

    export var author: any;
    export var currentUserName: any;
</script>


{#if solved}
    <div class="card p-4 d-flex flex-column">
        <div class="flex flex-column">
            <span class="mb-3">{content}</span>
            <div>
                <a href={`/users/${author}`}>{author}</a>
                <span> - {new Date(timestamp * 1000).toLocaleString()}</span>
            </div>
        </div>
    </div>
{:else}
    <div class="card p-4 d-flex flex-column solved">
        <div class="flex flex-column">
            <span class="mb-3">{content}</span>
            <div>
                <a href={`/users/${author}`}>{author}</a>
                <span> - {new Date(timestamp * 1000).toLocaleString()}</span>
            </div>
        </div>
    </div>
{/if}

<style>
    :root {
        --solved-color: #123123;
    }

    .solved {
		color: var(--solved-color);
	}
</style>
