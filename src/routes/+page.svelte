<script lang="ts">
	import Question from '$lib/components/Question.svelte';

	import 'firebase/auth';
	import { onMount } from "svelte";
	import { getFirestore, collection, getDocs, where, query, Timestamp, limit, addDoc, onSnapshot, doc } from 'firebase/firestore';

	import { db } from '$lib/firebase';
	import { userData } from '$lib/stores';
	import { getAuth } from 'firebase/auth';

	var posts: any[] = [];
	var postsRef: any;

	var user: any;

	var postTitleInput: any;
	var postContentInput: any;
	var postTagsInput: any;

	let dataLoaded: boolean = false;

	let unsubscribe: any;

	userData.subscribe(fetchedUserData => {
		user = fetchedUserData;
	})

	onMount(async () => {
		unsubscribe = onSnapshot(query(collection(db, "posts"), where("timestamp", ">=", Timestamp.fromMillis(Date.now() - 604800000)), limit(10)), async (doc) => {
			posts = [];
            doc.forEach((doc) => {
				const postData: any = doc.data();
				postData.uid = doc.id;
				posts = [...posts, postData];
			});
			posts.sort((a, b) => b.timestamp - a.timestamp);
        });
		dataLoaded = true;
	});

	async function createPost() {
		if(getAuth().currentUser == null) return;
		var postTags: any[] = postTagsInput.split(", ");

		let postData = {
			author: user.uid,
			comments: [],
			content: postContentInput,
			solved: false,
			tags: postTags,
			timestamp: Timestamp.fromMillis(Date.now()),
			title: postTitleInput
		}

		postTitleInput = null;
		postContentInput = null;
		postTagsInput = null;

		const postRef = await addDoc(collection(db, "posts"), postData);
	}
</script>

<svelte:head>
	<title>HelpA.dev</title>
	<meta name="description" content="Everyone needs a little help sometimes" />
</svelte:head>

<section>
	{#if dataLoaded}
		<div class="flex flex-col gap-2 md:gap-5 w-[64rem]">
			<div class="md:card md:card-bordered md:border-[#c7c7c733] bg-[#f1f1f1]">
				<div class="md:card-body flex flex-col gap-2 md:gap-4">
					<h1 class="text-2xl card-title">Create a post</h1>
					<input class="transition input input-bordered focus:input-accent bg-[#f1f1f1] hover:bg-[#e3e3e3]" type="text" placeholder="How to center a div" bind:value={postTitleInput}/>
					<textarea class="transition textarea textarea-bordered focus:input-accent bg-[#f1f1f1] hover:bg-[#e3e3e3]" placeholder="Hey guys! I just wanted to ask how to center a div in CSS?" bind:value={postContentInput}/>
					<input class="transition input input-bordered focus:input-accent bg-[#f1f1f1] hover:bg-[#e3e3e3]" type="text" placeholder="html, css" bind:value={postTagsInput}/>
					<div class="card-actions w-full flex justify-end md:mt-2 mb-4 md:mb-0">
						<button class="btn btn-secondary w-full md:w-fit" on:click={createPost}>Create Post</button>
					</div>
				</div>
			</div>
			{#each posts as post}
				<Question postId={post.uid} tags={post.tags} title={post.title}
					description={post.content} author={post.author} creationDate={new Date(post.timestamp.seconds * 1000).toDateString().slice(4)}/>
			{/each}
		</div>
	{:else}
		<span class="loading loading-dots w-20"></span>
	{/if}
</section>