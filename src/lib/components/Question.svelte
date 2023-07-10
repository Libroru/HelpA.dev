<script lang="ts">
	export let tags: any[] = [];
	export let title: any;
	export let description: any;
	export let author: any;
	export let creationDate: any;

	export let postId: any;
</script>

<a href={`/posts/${postId}`}>
	<div class="card card-bordered border-[#c7c7c733] bg-[#f1f1f1] hover:bg-[#e3e3e3] p-4 w-full flex flex-col gap-2">
    <div class="flex">
		<a class="text-xl font-bold" href={`/posts/${postId}`}>{title}</a>
		<a class="text-accent ml-auto" href={`/users/${author}`}>{author}</a>
	</div>
	<p>{description}</p>
	<div class="flex flex-row gap-2 items-center">
		<div class="flex flex-row flex-wrap gap-1 flex-1">
			{#each tags as tag}
				<a class="card px-2 py-1 bg-accent text-white" href={`/tags/${tag}`}>{tag}</a>
			{/each}
		</div>
		<span class="ml-auto">{creationDate}</span>
	</div>
</div>
</a>