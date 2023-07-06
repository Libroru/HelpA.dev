<script lang="ts">
	import Question from '$lib/components/Question.svelte';

	import 'firebase/auth';
	import { onMount } from "svelte";
	import { getFirestore, collection, getDocs, where, query, Timestamp } from 'firebase/firestore';

	import { db } from '$lib/firebase';

	var posts: any[] = [];
	var postsRef: any;

	onMount(async () => {
		await getRecentQuestions();
	});

	async function getRecentQuestions() {
		postsRef = collection(db, "posts");
		const sevenDaysAgo = Timestamp.fromMillis(Date.now() - 604800000);
		const querySnapshot = await getDocs(query(postsRef, where("timestamp", ">=", sevenDaysAgo)));

		querySnapshot.forEach(async (doc) => {
			const postData: any = doc.data();
			postData.uid = doc.id;
			posts = [...posts, postData];
		});
	}
</script>

<svelte:head>
	<title>HelpA.dev</title>
	<meta name="description" content="Everyone needs a little help sometimes" />
</svelte:head>

<section>
	<div class="d-flex flex-column" style="gap: 0.5rem;">
		<div class="card">
			<input type="text"/>
			<textarea />
			<input type="text"/>
			<button class="btn btn-primary">Create Post</button>
		</div>
		{#each posts as post}
			<Question postId={post.uid} tags={post.tags} title={post.title}
				description={post.content} author={post.author} creationDate={new Date(post.timestamp.seconds * 1000).toLocaleString()}/>
		{/each}
	</div>
</section>