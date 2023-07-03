<script lang="ts">
	import { goto } from "$app/navigation";

	export let tags: any[] = [];
	export let title: any;
	export let description: any;
	export let author: any;
	export let creationDate: any;

	export let postId: any;

    function navigateToTag(event: any) {
		const tag = event.target.innerText;
    	goto(`/tags/${tag}`);
	}

	function navigateToPost() {
		goto(`/posts/${postId}`)
	}
</script>

<div class="card p-4" style="width: 500px;" >
    <a href="javascript:void(0)" on:click={navigateToPost} on:keydown={navigateToPost} role="button" tabindex="0">{title}</a>
	<p on:click={navigateToPost} on:keydown={navigateToPost} role="button" tabindex="0">{description}</p>
	<div class="d-flex flex-column" style="gap: 5px;">
		<div class="d-inline-flex flex-row" style="gap: 0.25rem;">
			<span>tags:</span>
			{#each tags as tag}
				<span class="card px-1 bg-info text-white" style="width: fit-content;"
					on:click={navigateToTag} on:keydown={navigateToTag} role="button" tabindex="0">{tag}</span>
			{/each}
		</div>
		<div class="d-flex flex-row" style="gap: 0.25rem;">
			<span on:click={navigateToPost} on:keydown={navigateToPost} role="button" tabindex="0">{author} | </span>
			<span>{creationDate}</span>
		</div>
	</div>
</div>