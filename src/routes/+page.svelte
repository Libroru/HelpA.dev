<script lang="ts">
	import Question from '$lib/components/Question.svelte';

	import 'firebase/auth';
	import { onMount } from "svelte";
	import { getFirestore, collection, getDocs, where, query, Timestamp, limit, addDoc } from 'firebase/firestore';

	import { db } from '$lib/firebase';
	import { userData } from '$lib/stores';

	var posts: any[] = [];
	var postsRef: any;

	var user: any;

	var postTitleInput: any;
	var postContentInput: any;
	var postTagsInput: any;

	userData.subscribe(fetchedUserData => {
		user = fetchedUserData;
	})

	onMount(async () => {
		await getRecentQuestions();
	});

	async function getRecentQuestions() {
		postsRef = collection(db, "posts");
		const sevenDaysAgo = Timestamp.fromMillis(Date.now() - 604800000);
		const querySnapshot = await getDocs(
			query(
				postsRef,
				where("timestamp", ">=", sevenDaysAgo),
				limit(10)
			)
		);

		querySnapshot.forEach(async (doc) => {
			const postData: any = doc.data();
			postData.uid = doc.id;
			posts = [...posts, postData];
		});
	}

	async function createPost() {
		var postTags: any[] = postTagsInput.split(", ");

		const postRef = await addDoc(collection(db, "posts"), {
			author: user.uid,
			comments: [],
			content: postContentInput,
			solved: false,
			tags: postTags,
			timestamp: Timestamp.fromMillis(Date.now()),
			title: postTitleInput
		})
	}
</script>

<svelte:head>
	<title>HelpA.dev</title>
	<meta name="description" content="Everyone needs a little help sometimes" />
</svelte:head>

<section>
	<div class="d-flex flex-column" style="gap: 0.5rem;">
		<div class="card">
			<input type="text" placeholder="How to center a div" bind:value={postTitleInput}/>
			<textarea placeholder="Hey guys! I just wanted to ask how to center a div in CSS?" bind:value={postContentInput}/>
			<input type="text" placeholder="html, css" bind:value={postTagsInput}/>
			<button class="btn btn-primary" on:click={createPost}>Create Post</button>
		</div>
		{#each posts as post}
			<Question postId={post.uid} tags={post.tags} title={post.title}
				description={post.content} author={post.author} creationDate={new Date(post.timestamp.seconds * 1000).toLocaleString()}/>
		{/each}
	</div>
</section>