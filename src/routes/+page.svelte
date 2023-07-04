<script lang="ts">
	import Question from '$lib/components/Question.svelte';

	import { initializeApp } from "firebase/app";
	import { goto } from '$app/navigation';
	import { getAnalytics } from "firebase/analytics";
	import 'firebase/auth';
	import { onMount } from "svelte";
	import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from "firebase/auth";
	import { getFirestore, collection, getDoc, getDocs, where, query, Timestamp } from 'firebase/firestore';

	import { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId, measurementId } from '$lib/api_keys.json';

	var app: any;
	var db: any;

	var posts: any[] = [];
	var postsRef: any;

	onMount(async () => {
		const firebaseConfig = {
			apiKey: apiKey,
			authDomain: authDomain,
			projectId: projectId,
			storageBucket: storageBucket,
			messagingSenderId: messagingSenderId,
			appId: appId,
			measurementId: measurementId
    };

		// Initialize Firebase
		app = initializeApp(firebaseConfig);
		const analytics = getAnalytics(app);

		await getRecentQuestions();
	});

	async function getRecentQuestions() {
		db = getFirestore(app);
		postsRef = collection(db, "posts");
		const sevenDaysAgo = Timestamp.fromMillis(Date.now() - 604800000);
		const querySnapshot = await getDocs(query(postsRef, where("creationDate", ">=", sevenDaysAgo)));

		querySnapshot.forEach(async (doc) => {
			const postData: any = doc.data();
			postData.uid = doc.id;
			const authorRef = await getDoc(postData.author);
			const authorData: any = authorRef.data();
			postData.author = authorData.userName
			posts = [...posts, postData];
		});
	}

	async function createPost() {
		
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
				description={post.question} author={post.author} creationDate={new Date(post.creationDate.seconds * 1000).toDateString()}/>
		{/each}
	</div>
</section>