<script lang="ts">
	import { goto } from "$app/navigation";

    function navigateToTag(event: any) {
		const tag = event.target.innerText;
    	goto(`/tags/${tag}`);
	}
</script>

<div class="card p-4" style="width: 500px;">
    <a href="/">How do I center a div?</a>
	<p>Hey everyone, I am currently developing a website,
		where other developers can ask questions about certain topic and ideas and get help immediately from others...</p>
	<div class="d-inline-flex" style="gap: 5px;">
		<span>tags:</span>
		<span class="card px-1 bg-info text-white" style="width: fit-content;" on:click={navigateToTag} on:keydown={navigateToTag} role="button" tabindex="0">html</span>
		<span class="card px-1 bg-info text-white" style="width: fit-content;" on:click={navigateToTag} on:keydown={navigateToTag} role="button" tabindex="0">css</span>
		<span class="card px-1 bg-info text-white" style="width: fit-content;" on:click={navigateToTag} on:keydown={navigateToTag} role="button" tabindex="0">web</span>
		<span class="card px-1 bg-info text-white" style="width: fit-content;" on:click={navigateToTag} on:keydown={navigateToTag} role="button" tabindex="0">help</span>
	</div>
</div>